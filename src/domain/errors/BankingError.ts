/**
 * Base error class for banking-related errors
 */
export class BankingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BankingError';
  }
}

/**
 * Error thrown when an account is not found
 */
export class AccountNotFoundError extends BankingError {
  constructor(accountNumber: string) {
    super(`Account not found: ${accountNumber}`);
    this.name = 'AccountNotFoundError';
  }
}

/**
 * Error thrown when there are insufficient funds
 */
export class InsufficientFundsError extends BankingError {
  constructor(accountNumber: string, amount: number, balance: number) {
    super(`Insufficient funds in account ${accountNumber}. Required: ${amount}, Available: ${balance}`);
    this.name = 'InsufficientFundsError';
  }
}

/**
 * Error thrown when CSV file format is invalid
 */
export class InvalidCsvFormatError extends BankingError {
  constructor(filePath: string, reason: string) {
    super(`Invalid CSV format in ${filePath}: ${reason}`);
    this.name = 'InvalidCsvFormatError';
  }
}

/**
 * Error thrown when file system operations fail
 */
export class FileSystemError extends BankingError {
  constructor(filePath: string, operation: string, reason: string) {
    super(`File system error in ${filePath} during ${operation}: ${reason}`);
    this.name = 'FileSystemError';
  }
}