import { z } from 'zod';

/**
 * Schema for validating account data
 * @property {string} accountNumber - 16-digit account number
 * @property {number} balance - Account balance (must be non-negative)
 * @property {string} companyId - Company identifier
 */
export const AccountSchema = z.object({
  accountNumber: z.string().length(16).regex(/^\d+$/),
  balance: z.number().min(0),
  companyId: z.string()
});

/**
 * Type definition for Account data
 */
export type Account = z.infer<typeof AccountSchema>;

/**
 * Account Entity class representing a bank account
 * Implements business logic for account operations
 */
export class AccountEntity {
  private readonly account: Account;

  /**
   * Creates a new AccountEntity instance
   * @param {Account} account - Account data to be validated and stored
   * @throws {Error} If account data is invalid
   */
  constructor(account: Account) {
    this.account = AccountSchema.parse(account);
  }

  /**
   * Gets the account number
   * @returns {string} 16-digit account number
   */
  getAccountNumber(): string {
    return this.account.accountNumber;
  }

  /**
   * Gets the current account balance
   * @returns {number} Current balance
   */
  getBalance(): number {
    return this.account.balance;
  }

  /**
   * Gets the company ID associated with the account
   * @returns {string} Company identifier
   */
  getCompanyId(): string {
    return this.account.companyId;
  }

  /**
   * Checks if the account has sufficient funds for a withdrawal
   * @param {number} amount - Amount to withdraw
   * @returns {boolean} True if sufficient funds, false otherwise
   */
  canWithdraw(amount: number): boolean {
    return this.account.balance >= amount;
  }

  /**
   * Withdraws money from the account
   * @param {number} amount - Amount to withdraw
   * @throws {Error} If insufficient funds
   */
  withdraw(amount: number): void {
    if (!this.canWithdraw(amount)) {
      throw new Error('Insufficient funds');
    }
    this.account.balance -= amount;
  }

  /**
   * Deposits money into the account
   * @param {number} amount - Amount to deposit
   */
  deposit(amount: number): void {
    this.account.balance += amount;
  }
}