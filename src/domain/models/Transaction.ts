import { z } from 'zod';

/**
 * Schema for validating transaction data
 * @property {string} fromAccount - Source account number (16 digits)
 * @property {string} toAccount - Destination account number (16 digits)
 * @property {number} amount - Transaction amount (must be positive)
 */
export const TransactionSchema = z.object({
  fromAccount: z.string().length(16).regex(/^\d+$/),
  toAccount: z.string().length(16).regex(/^\d+$/),
  amount: z.number().positive()
});

/**
 * Type definition for Transaction data
 */
export type Transaction = z.infer<typeof TransactionSchema>;

/**
 * Transaction Entity class representing a money transfer
 * Implements business logic for transaction validation
 */
export class TransactionEntity {
  private readonly transaction: Transaction;

  /**
   * Creates a new TransactionEntity instance
   * @param {Transaction} transaction - Transaction data to be validated and stored
   * @throws {Error} If transaction data is invalid
   */
  constructor(transaction: Transaction) {
    this.transaction = TransactionSchema.parse(transaction);
  }

  /**
   * Gets the source account number
   * @returns {string} 16-digit source account number
   */
  getFromAccount(): string {
    return this.transaction.fromAccount;
  }

  /**
   * Gets the destination account number
   * @returns {string} 16-digit destination account number
   */
  getToAccount(): string {
    return this.transaction.toAccount;
  }

  /**
   * Gets the transaction amount
   * @returns {number} Transaction amount
   */
  getAmount(): number {
    return this.transaction.amount;
  }
}