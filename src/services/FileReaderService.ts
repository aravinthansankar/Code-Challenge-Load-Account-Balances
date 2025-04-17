import { parse } from 'csv-parse/sync';
import fs from 'fs';
import { AccountEntity } from '../domain/models/Account';
import { TransactionEntity } from '../domain/models/Transaction';
import { InvalidCsvFormatError, FileSystemError } from '../domain/errors/BankingError';

/**
 * Service for reading and parsing CSV files containing account and transaction data
 * Handles file operations and data validation
 */
export class FileReaderService {
  /**
   * Reads and parses account balances from a CSV file
   * @param {string} filePath - Path to the CSV file
   * @param {string} companyId - Company identifier to associate with accounts
   * @returns {AccountEntity[]} Array of parsed account entities
   * @throws {FileSystemError} If file cannot be read
   * @throws {InvalidCsvFormatError} If CSV format is invalid
   */
  public readAccountBalances(filePath: string, companyId: string): AccountEntity[] {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const records = parse(fileContent, {
        columns: false,
        skip_empty_lines: true
      });

      return records.map((record: string[], index: number) => {
        if (record.length !== 2) {
          throw new InvalidCsvFormatError(
            filePath,
            `Line ${index + 1}: Expected 2 columns (account number, balance), got ${record.length}`
          );
        }

        const accountNumber = record[0];
        const balance = parseFloat(record[1]);

        if (isNaN(balance)) {
          throw new InvalidCsvFormatError(
            filePath,
            `Line ${index + 1}: Invalid balance format: ${record[1]}`
          );
        }

        return new AccountEntity({
          accountNumber,
          balance,
          companyId
        });
      });
    } catch (error) {
      if (error instanceof InvalidCsvFormatError) {
        throw error;
      }
      throw new FileSystemError(filePath, 'read', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Reads and parses transactions from a CSV file
   * @param {string} filePath - Path to the CSV file
   * @param {string} companyId - Company identifier to associate with transactions
   * @returns {TransactionEntity[]} Array of parsed transaction entities
   * @throws {FileSystemError} If file cannot be read
   * @throws {InvalidCsvFormatError} If CSV format is invalid
   */
  public readTransactions(filePath: string, companyId: string): TransactionEntity[] {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const records = parse(fileContent, {
        columns: false,
        skip_empty_lines: true
      });

      return records.map((record: string[], index: number) => {
        if (record.length !== 3) {
          throw new InvalidCsvFormatError(
            filePath,
            `Line ${index + 1}: Expected 3 columns (from, to, amount), got ${record.length}`
          );
        }

        const fromAccount = record[0];
        const toAccount = record[1];
        const amount = parseFloat(record[2]);

        if (isNaN(amount)) {
          throw new InvalidCsvFormatError(
            filePath,
            `Line ${index + 1}: Invalid amount format: ${record[2]}`
          );
        }

        return new TransactionEntity({
          fromAccount,
          toAccount,
          amount,
          companyId
        });
      });
    } catch (error) {
      if (error instanceof InvalidCsvFormatError) {
        throw error;
      }
      throw new FileSystemError(filePath, 'read', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}