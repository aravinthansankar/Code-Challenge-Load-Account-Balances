/**
 * Test suite for BankingService class
 * Tests banking operations, transaction processing, and error handling
 */
import { AccountEntity } from '../domain/models/Account';
import { TransactionEntity } from '../domain/models/Transaction';
import { BankingService } from '../services/BankingService';
import { AccountNotFoundError, InsufficientFundsError, CompanyMismatchError } from '../domain/errors/BankingError';

describe('BankingService', () => {
  let bankingService: BankingService;
  const companyId = 'alpha-sales';
  const otherCompanyId = 'beta-sales';

  beforeEach(() => {
    const initialAccounts = [
      new AccountEntity({
        accountNumber: '1111234522226789',
        balance: 5000.00,
        companyId
      }),
      new AccountEntity({
        accountNumber: '1111234522221234',
        balance: 10000.00,
        companyId
      }),
      new AccountEntity({
        accountNumber: '2222123433331212',
        balance: 550.00,
        companyId
      }),
      new AccountEntity({
        accountNumber: '9999999999999999',
        balance: 1000.00,
        companyId: otherCompanyId
      })
    ];

    bankingService = new BankingService(initialAccounts);
  });

  /**
   * Tests for transaction processing
   * Validates transaction execution and error cases
   */
  describe('processTransaction', () => {
    it('should process valid transaction correctly', () => {
      const transaction = new TransactionEntity({
        fromAccount: '1111234522226789',
        toAccount: '2222123433331212',
        amount: 500.00,
        companyId
      });

      bankingService.processTransaction(transaction);

      expect(bankingService.getAccountBalance('1111234522226789', companyId)).toBe(4500.00);
      expect(bankingService.getAccountBalance('2222123433331212', companyId)).toBe(1050.00);
    });

    it('should throw AccountNotFoundError for non-existent source account', () => {
      const transaction = new TransactionEntity({
        fromAccount: '0000000000000000',
        toAccount: '1111234522226789',
        amount: 100.00,
        companyId
      });

      expect(() => bankingService.processTransaction(transaction))
        .toThrow(new AccountNotFoundError('0000000000000000'));
    });

    it('should throw AccountNotFoundError for non-existent destination account', () => {
      const transaction = new TransactionEntity({
        fromAccount: '1111234522226789',
        toAccount: '0000000000000000',
        amount: 100.00,
        companyId
      });

      expect(() => bankingService.processTransaction(transaction))
        .toThrow(new AccountNotFoundError('0000000000000000'));
    });

    it('should throw CompanyMismatchError when source account has wrong company', () => {
      const transaction = new TransactionEntity({
        fromAccount: '9999999999999999',
        toAccount: '1111234522226789',
        amount: 100.00,
        companyId
      });

      expect(() => bankingService.processTransaction(transaction))
        .toThrow(new CompanyMismatchError(companyId, otherCompanyId));
    });

    it('should throw CompanyMismatchError when destination account has wrong company', () => {
      const transaction = new TransactionEntity({
        fromAccount: '1111234522226789',
        toAccount: '9999999999999999',
        amount: 100.00,
        companyId
      });

      expect(() => bankingService.processTransaction(transaction))
        .toThrow(new CompanyMismatchError(companyId, otherCompanyId));
    });

    it('should throw InsufficientFundsError for overdraft', () => {
      const transaction = new TransactionEntity({
        fromAccount: '2222123433331212',
        toAccount: '1111234522226789',
        amount: 1000.00,
        companyId
      });

      expect(() => bankingService.processTransaction(transaction))
        .toThrow(InsufficientFundsError);
    });

    it('should maintain correct balances after multiple transactions', () => {
      const transactions = [
        new TransactionEntity({
          fromAccount: '1111234522226789',
          toAccount: '2222123433331212',
          amount: 500.00,
          companyId
        }),
        new TransactionEntity({
          fromAccount: '1111234522221234',
          toAccount: '2222123433331212',
          amount: 1000.00,
          companyId
        })
      ];

      transactions.forEach(transaction => bankingService.processTransaction(transaction));

      expect(bankingService.getAccountBalance('1111234522226789', companyId)).toBe(4500.00);
      expect(bankingService.getAccountBalance('1111234522221234', companyId)).toBe(9000.00);
      expect(bankingService.getAccountBalance('2222123433331212', companyId)).toBe(2050.00);
    });

    it('should handle zero amount transactions', () => {
      expect(() => {
        new TransactionEntity({
          fromAccount: '1111234522226789',
          toAccount: '1111234522221234',
          amount: 0,
          companyId
        });
      }).toThrow('Number must be greater than 0');
    });

    it('should handle very small amount transactions', () => {
      const transaction = new TransactionEntity({
        fromAccount: '1111234522226789',
        toAccount: '2222123433331212',
        amount: 0.01,
        companyId
      });

      bankingService.processTransaction(transaction);

      expect(bankingService.getAccountBalance('1111234522226789', companyId)).toBe(4999.99);
      expect(bankingService.getAccountBalance('2222123433331212', companyId)).toBe(550.01);
    });
  });

  /**
   * Tests for account balance retrieval
   * Validates balance checking and error cases
   */
  describe('getAccountBalance', () => {
    it('should return correct balance for existing account', () => {
      expect(bankingService.getAccountBalance('1111234522226789', companyId)).toBe(5000.00);
    });

    it('should throw AccountNotFoundError for non-existent account', () => {
      const accountNumber = '0000000000000000';
      expect(() => bankingService.getAccountBalance(accountNumber, companyId))
        .toThrow(AccountNotFoundError);
    });

    it('should throw AccountNotFoundError when account does not exist', () => {
      const accountNumber = '0000000000000000';
      expect(() => bankingService.getAccountBalance(accountNumber, companyId))
        .toThrow(AccountNotFoundError);
    });

    it('should throw CompanyMismatchError when company IDs do not match', () => {
      const accountNumber = '1111234522226789';
      const wrongCompanyId = 'beta-sales';

      expect(() => bankingService.getAccountBalance(accountNumber, wrongCompanyId))
        .toThrow(CompanyMismatchError);
    });

    it('should throw error for invalid transaction amount', () => {
      expect(() => {
        new TransactionEntity({
          fromAccount: '1111234522226789',
          toAccount: '1111234522221234',
          amount: 0,
          companyId
        });
      }).toThrow('Number must be greater than 0');
    });
  });

  /**
   * Tests for account listing
   * Validates retrieval of all managed accounts
   */
  describe('getAllAccounts', () => {
    it('should return all accounts', () => {
      const accounts = bankingService.getAllAccounts();
      expect(accounts).toHaveLength(4);
      expect(accounts[0]).toBeInstanceOf(AccountEntity);
    });
  });

  /**
   * Tests for fund transfer operation
   * Validates transfer functionality and error cases
   */
  describe('transfer', () => {
    it('should transfer funds between accounts successfully', () => {
      const fromAccount = '1111234522226789';
      const toAccount = '2222123433331212';
      const amount = 500.00;

      bankingService.transfer(fromAccount, toAccount, amount, companyId);

      expect(bankingService.getAccountBalance(fromAccount, companyId)).toBe(4500.00);
      expect(bankingService.getAccountBalance(toAccount, companyId)).toBe(1050.00);
    });

    it('should throw error for zero or negative amount', () => {
      const fromAccount = '1111234522226789';
      const toAccount = '2222123433331212';

      expect(() => bankingService.transfer(fromAccount, toAccount, 0, companyId))
        .toThrow('Amount must be greater than 0');

      expect(() => bankingService.transfer(fromAccount, toAccount, -100, companyId))
        .toThrow('Amount must be greater than 0');
    });

    it('should throw AccountNotFoundError for non-existent source account', () => {
      const fromAccount = '0000000000000000';
      const toAccount = '1111234522226789';

      expect(() => bankingService.transfer(fromAccount, toAccount, 100, companyId))
        .toThrow(new AccountNotFoundError(fromAccount));
    });

    it('should throw AccountNotFoundError for non-existent destination account', () => {
      const fromAccount = '1111234522226789';
      const toAccount = '0000000000000000';

      expect(() => bankingService.transfer(fromAccount, toAccount, 100, companyId))
        .toThrow(new AccountNotFoundError(toAccount));
    });

    it('should throw CompanyMismatchError when source account has wrong company', () => {
      const fromAccount = '9999999999999999';
      const toAccount = '1111234522226789';

      expect(() => bankingService.transfer(fromAccount, toAccount, 100, companyId))
        .toThrow(new CompanyMismatchError(companyId, otherCompanyId));
    });

    it('should throw CompanyMismatchError when destination account has wrong company', () => {
      const fromAccount = '1111234522226789';
      const toAccount = '9999999999999999';

      expect(() => bankingService.transfer(fromAccount, toAccount, 100, companyId))
        .toThrow(new CompanyMismatchError(companyId, otherCompanyId));
    });

    it('should throw error for insufficient funds', () => {
      const fromAccount = '2222123433331212';
      const toAccount = '1111234522226789';
      const amount = 1000.00;

      expect(() => bankingService.transfer(fromAccount, toAccount, amount, companyId))
        .toThrow('Insufficient funds');
    });

    it('should handle very small amount transfers', () => {
      const fromAccount = '1111234522226789';
      const toAccount = '2222123433331212';
      const amount = 0.01;

      bankingService.transfer(fromAccount, toAccount, amount, companyId);

      expect(bankingService.getAccountBalance(fromAccount, companyId)).toBe(4999.99);
      expect(bankingService.getAccountBalance(toAccount, companyId)).toBe(550.01);
    });
  });
});