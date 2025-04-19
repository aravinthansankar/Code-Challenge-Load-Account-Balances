/**
 * Test suite for BankingService class
 * Tests banking operations, transaction processing, and error handling
 */
import { AccountEntity } from '../domain/models/Account';
import { TransactionEntity } from '../domain/models/Transaction';
import { BankingService } from '../services/BankingService';
import { AccountNotFoundError, InsufficientFundsError } from '../domain/errors/BankingError';

describe('BankingService', () => {
  let bankingService: BankingService;

  beforeEach(() => {
    const initialAccounts = [
      new AccountEntity({
        accountNumber: '1111234522226789',
        balance: 5000.00
      }),
      new AccountEntity({
        accountNumber: '1111234522221234',
        balance: 10000.00
      }),
      new AccountEntity({
        accountNumber: '2222123433331212',
        balance: 550.00
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
        amount: 500.00
      });

      bankingService.processTransaction(transaction);

      expect(bankingService.getAccountBalance('1111234522226789')).toBe(4500.00);
      expect(bankingService.getAccountBalance('2222123433331212')).toBe(1050.00);
    });

    it('should throw AccountNotFoundError for non-existent source account', () => {
      const transaction = new TransactionEntity({
        fromAccount: '0000000000000000',
        toAccount: '1111234522226789',
        amount: 100.00
      });

      expect(() => bankingService.processTransaction(transaction))
        .toThrow(new AccountNotFoundError('0000000000000000'));
    });

    it('should throw AccountNotFoundError for non-existent destination account', () => {
      const transaction = new TransactionEntity({
        fromAccount: '1111234522226789',
        toAccount: '0000000000000000',
        amount: 100.00
      });

      expect(() => bankingService.processTransaction(transaction))
        .toThrow(new AccountNotFoundError('0000000000000000'));
    });

    it('should throw InsufficientFundsError for overdraft', () => {
      const transaction = new TransactionEntity({
        fromAccount: '2222123433331212',
        toAccount: '1111234522226789',
        amount: 1000.00
      });

      expect(() => bankingService.processTransaction(transaction))
        .toThrow(InsufficientFundsError);
    });

    it('should maintain correct balances after multiple transactions', () => {
      const transactions = [
        new TransactionEntity({
          fromAccount: '1111234522226789',
          toAccount: '2222123433331212',
          amount: 500.00
        }),
        new TransactionEntity({
          fromAccount: '1111234522221234',
          toAccount: '2222123433331212',
          amount: 1000.00
        })
      ];

      transactions.forEach(transaction => bankingService.processTransaction(transaction));

      expect(bankingService.getAccountBalance('1111234522226789')).toBe(4500.00);
      expect(bankingService.getAccountBalance('1111234522221234')).toBe(9000.00);
      expect(bankingService.getAccountBalance('2222123433331212')).toBe(2050.00);
    });

    it('should handle zero amount transactions', () => {
      expect(() => {
        new TransactionEntity({
          fromAccount: '1111234522226789',
          toAccount: '1111234522221234',
          amount: 0
        });
      }).toThrow('Number must be greater than 0');
    });

    it('should handle very small amount transactions', () => {
      const transaction = new TransactionEntity({
        fromAccount: '1111234522226789',
        toAccount: '2222123433331212',
        amount: 0.01
      });

      bankingService.processTransaction(transaction);

      expect(bankingService.getAccountBalance('1111234522226789')).toBe(4999.99);
      expect(bankingService.getAccountBalance('2222123433331212')).toBe(550.01);
    });
  });

  /**
   * Tests for account balance retrieval
   * Validates balance checking and error cases
   */
  describe('getAccountBalance', () => {
    it('should return correct balance for existing account', () => {
      expect(bankingService.getAccountBalance('1111234522226789')).toBe(5000.00);
    });

    it('should throw AccountNotFoundError for non-existent account', () => {
      const accountNumber = '0000000000000000';
      expect(() => bankingService.getAccountBalance(accountNumber))
        .toThrow(AccountNotFoundError);
    });

    it('should throw AccountNotFoundError when account does not exist', () => {
      const accountNumber = '0000000000000000';
      expect(() => bankingService.getAccountBalance(accountNumber))
        .toThrow(AccountNotFoundError);
    });
  });

  /**
   * Tests for transfer operation
   * Validates direct transfer functionality
   */
  describe('transfer', () => {
    it('should transfer funds between accounts', () => {
      const fromAccount = '1111234522226789';
      const toAccount = '2222123433331212';
      const amount = 500.00;

      bankingService.transfer(fromAccount, toAccount, amount);

      expect(bankingService.getAccountBalance(fromAccount)).toBe(4500.00);
      expect(bankingService.getAccountBalance(toAccount)).toBe(1050.00);
    });

    it('should throw error for zero amount transfer', () => {
      expect(() => {
        bankingService.transfer('1111234522226789', '2222123433331212', 0);
      }).toThrow('Amount must be greater than 0');
    });

    it('should throw error for negative amount transfer', () => {
      expect(() => {
        bankingService.transfer('1111234522226789', '2222123433331212', -100);
      }).toThrow('Amount must be greater than 0');
    });

    it('should throw AccountNotFoundError for non-existent source account', () => {
      expect(() => {
        bankingService.transfer('0000000000000000', '2222123433331212', 100);
      }).toThrow(AccountNotFoundError);
    });

    it('should throw AccountNotFoundError for non-existent destination account', () => {
      expect(() => {
        bankingService.transfer('1111234522226789', '0000000000000000', 100);
      }).toThrow(AccountNotFoundError);
    });

    it('should throw InsufficientFundsError for overdraft', () => {
      expect(() => {
        bankingService.transfer('2222123433331212', '1111234522226789', 1000);
      }).toThrow(InsufficientFundsError);
    });

    it('should handle very small amount transfers', () => {
      const fromAccount = '1111234522226789';
      const toAccount = '2222123433331212';
      const amount = 0.01;

      bankingService.transfer(fromAccount, toAccount, amount);

      expect(bankingService.getAccountBalance(fromAccount)).toBe(4999.99);
      expect(bankingService.getAccountBalance(toAccount)).toBe(550.01);
    });
  });

  /**
   * Tests for account listing
   * Validates retrieval of all managed accounts
   */
  describe('getAllAccounts', () => {
    it('should return all accounts', () => {
      const accounts = bankingService.getAllAccounts();
      expect(accounts).toHaveLength(3);
      expect(accounts[0]).toBeInstanceOf(AccountEntity);
      expect(accounts[1]).toBeInstanceOf(AccountEntity);
      expect(accounts[2]).toBeInstanceOf(AccountEntity);
    });
  });
});