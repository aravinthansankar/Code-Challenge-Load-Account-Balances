import { AccountEntity } from '../domain/models/Account';
import { TransactionEntity } from '../domain/models/Transaction';
import { AccountNotFoundError, InsufficientFundsError } from '../domain/errors/BankingError';

/**
 * Banking Service class that handles the core business logic for account operations
 * Implements transaction processing and account management
 */
export class BankingService {
  /**
   * Map of account numbers to AccountEntity instances
   * @private
   */
  private accounts: Map<string, AccountEntity> = new Map();

  /**
   * Creates a new BankingService instance
   * @param {AccountEntity[]} initialAccounts - Array of initial accounts to manage
   */
  constructor(initialAccounts: AccountEntity[]) {
    initialAccounts.forEach(account => {
      this.accounts.set(account.getAccountNumber(), account);
    });
  }

  /**
   * Processes a transaction between accounts
   * @param {TransactionEntity} transaction - Transaction to process
   * @throws {AccountNotFoundError} If accounts not found
   * @throws {InsufficientFundsError} If insufficient funds
   */
  public processTransaction(transaction: TransactionEntity): void {
    const fromAccount = this.accounts.get(transaction.getFromAccount());
    const toAccount = this.accounts.get(transaction.getToAccount());

    if (!fromAccount || !toAccount) {
      throw new AccountNotFoundError(!fromAccount ? transaction.getFromAccount() : transaction.getToAccount());
    }

    if (!fromAccount.canWithdraw(transaction.getAmount())) {
      throw new InsufficientFundsError(
        fromAccount.getAccountNumber(),
        transaction.getAmount(),
        fromAccount.getBalance()
      );
    }

    fromAccount.withdraw(transaction.getAmount());
    toAccount.deposit(transaction.getAmount());
  }

  /**
   * Gets the current balance of an account
   * @param {string} accountNumber - Account number to query
   * @returns {number} Current account balance
   * @throws {AccountNotFoundError} If account not found
   */
  getAccountBalance(accountNumber: string): number {
    const account = this.accounts.get(accountNumber);
    if (!account) {
      throw new AccountNotFoundError(accountNumber);
    }
    return account.getBalance();
  }

  /**
   * Gets all managed accounts
   * @returns {AccountEntity[]} Array of all accounts
   */
  public getAllAccounts(): AccountEntity[] {
    return Array.from(this.accounts.values());
  }

  /**
   * Transfers funds between accounts
   * @param {string} fromAccountNumber - Source account number
   * @param {string} toAccountNumber - Destination account number
   * @param {number} amount - Amount to transfer
   * @throws {AccountNotFoundError} If one or both accounts not found
   * @throws {Error} If amount is not greater than 0
   */
  transfer(fromAccountNumber: string, toAccountNumber: string, amount: number): void {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const fromAccount = this.accounts.get(fromAccountNumber);
    const toAccount = this.accounts.get(toAccountNumber);

    if (!fromAccount || !toAccount) {
      throw new AccountNotFoundError(!fromAccount ? fromAccountNumber : toAccountNumber);
    }

    if (fromAccount.getBalance() < amount) {
      throw new InsufficientFundsError(
        fromAccount.getAccountNumber(),
        amount,
        fromAccount.getBalance()
      );
    }

    fromAccount.withdraw(amount);
    toAccount.deposit(amount);
  }
}