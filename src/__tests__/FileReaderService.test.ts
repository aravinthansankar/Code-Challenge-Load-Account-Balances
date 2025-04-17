import { FileReaderService } from '../services/FileReaderService';
import fs from 'fs';
import { AccountEntity } from '../domain/models/Account';
import { TransactionEntity } from '../domain/models/Transaction';
import { InvalidCsvFormatError, FileSystemError } from '../domain/errors/BankingError';

jest.mock('fs');
jest.mock('fs/promises', () => ({
  writeFile: jest.fn(),
  unlink: jest.fn()
}));

describe('FileReaderService', () => {
  let fileReaderService: FileReaderService;
  const companyId = 'alpha-sales';

  beforeEach(() => {
    fileReaderService = new FileReaderService();
    jest.resetAllMocks();
  });

  describe('readAccountBalances', () => {
    it('should read and parse account balances correctly', () => {
      const mockCsvContent = '1111234522226789,5000.00\n1111234522221234,10000.00';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvContent);

      const accounts = fileReaderService.readAccountBalances('test.csv', companyId);

      expect(accounts).toHaveLength(2);
      expect(accounts[0]).toBeInstanceOf(AccountEntity);
      expect(accounts[0].getAccountNumber()).toBe('1111234522226789');
      expect(accounts[0].getBalance()).toBe(5000.00);
      expect(accounts[0].getCompanyId()).toBe(companyId);
    });

    it('should handle empty CSV file', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('');

      const accounts = fileReaderService.readAccountBalances('test.csv', companyId);

      expect(accounts).toHaveLength(0);
    });

    it('should throw InvalidCsvFormatError for wrong number of columns', () => {
      const mockCsvContent = '1111234522226789,5000.00,extra-column';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvContent);

      expect(() => {
        fileReaderService.readAccountBalances('test.csv', companyId);
      }).toThrow(InvalidCsvFormatError);
    });

    it('should throw InvalidCsvFormatError for invalid account number format', () => {
      const mockCsvContent = 'invalid-account,5000.00';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvContent);

      expect(() => {
        fileReaderService.readAccountBalances('test.csv', companyId);
      }).toThrow();
    });

    it('should throw InvalidCsvFormatError for invalid balance format', () => {
      const mockCsvContent = '1111234522226789,invalid-amount';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvContent);

      expect(() => {
        fileReaderService.readAccountBalances('test.csv', companyId);
      }).toThrow(InvalidCsvFormatError);
    });

    it('should throw FileSystemError for file read error', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => {
        fileReaderService.readAccountBalances('test.csv', companyId);
      }).toThrow(FileSystemError);
    });

    it('should handle whitespace in CSV values', () => {
      const csvContent = `1234567890123456,1000.00
2345678901234567,2000.00
3456789012345678,3000.00`;

      // Mock the file system operations
      (fs.readFileSync as jest.Mock).mockReturnValue(csvContent);

      const result = fileReaderService.readAccountBalances('test.csv', companyId);
      expect(result).toHaveLength(3);
      expect(result[0]).toBeInstanceOf(AccountEntity);
      expect(result[0].getAccountNumber()).toBe('1234567890123456');
      expect(result[0].getBalance()).toBe(1000.00);
      expect(result[0].getCompanyId()).toBe(companyId);
    });

    it('should throw FileSystemError with unknown error message', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new TypeError('Some unexpected error');
      });

      expect(() => {
        fileReaderService.readAccountBalances('test.csv', companyId);
      }).toThrow(FileSystemError);
    });

    it('should throw FileSystemError with custom error message', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw { name: 'CustomError' }; // Not an Error instance
      });

      expect(() => {
        fileReaderService.readAccountBalances('test.csv', companyId);
      }).toThrow(FileSystemError);
    });
  });

  describe('readTransactions', () => {
    it('should read and parse transactions correctly', () => {
      const mockCsvContent = '1111234522226789,1212343433335665,500.00';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvContent);

      const transactions = fileReaderService.readTransactions('test.csv', companyId);

      expect(transactions).toHaveLength(1);
      expect(transactions[0]).toBeInstanceOf(TransactionEntity);
      expect(transactions[0].getFromAccount()).toBe('1111234522226789');
      expect(transactions[0].getToAccount()).toBe('1212343433335665');
      expect(transactions[0].getAmount()).toBe(500.00);
      expect(transactions[0].getCompanyId()).toBe(companyId);
    });

    it('should handle empty CSV file', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('');

      const transactions = fileReaderService.readTransactions('test.csv', companyId);

      expect(transactions).toHaveLength(0);
    });

    it('should throw InvalidCsvFormatError for wrong number of columns', () => {
      const mockCsvContent = '1111234522226789,1212343433335665';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvContent);

      expect(() => {
        fileReaderService.readTransactions('test.csv', companyId);
      }).toThrow(InvalidCsvFormatError);
    });

    it('should throw InvalidCsvFormatError for invalid account number format', () => {
      const mockCsvContent = 'invalid-account,1212343433335665,500.00';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvContent);

      expect(() => {
        fileReaderService.readTransactions('test.csv', companyId);
      }).toThrow();
    });

    it('should throw InvalidCsvFormatError for invalid amount format', () => {
      const mockCsvContent = '1111234522226789,1212343433335665,invalid-amount';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvContent);

      expect(() => {
        fileReaderService.readTransactions('test.csv', companyId);
      }).toThrow(InvalidCsvFormatError);
    });

    it('should throw FileSystemError for file read error', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      expect(() => {
        fileReaderService.readTransactions('test.csv', companyId);
      }).toThrow(FileSystemError);
    });

    it('should handle whitespace in CSV values', () => {
      const csvContent = `1234567890123456,2345678901234567,100.00
2345678901234567,3456789012345678,200.00
3456789012345678,4567890123456789,300.00`;

      // Mock the file system operations
      (fs.readFileSync as jest.Mock).mockReturnValue(csvContent);

      const result = fileReaderService.readTransactions('test.csv', companyId);
      expect(result).toHaveLength(3);
      expect(result[0]).toBeInstanceOf(TransactionEntity);
      expect(result[0].getFromAccount()).toBe('1234567890123456');
      expect(result[0].getToAccount()).toBe('2345678901234567');
      expect(result[0].getAmount()).toBe(100.00);
      expect(result[0].getCompanyId()).toBe(companyId);
    });

    it('should handle multiple transactions', () => {
      const mockCsvContent = '1111234522226789,1212343433335665,500.00\n1111234522221234,1212343433335665,1000.00';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvContent);

      const transactions = fileReaderService.readTransactions('test.csv', companyId);

      expect(transactions).toHaveLength(2);
      expect(transactions[0].getAmount()).toBe(500.00);
      expect(transactions[1].getAmount()).toBe(1000.00);
    });

    it('should throw FileSystemError with unknown error message for transactions', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new TypeError('Some unexpected error');
      });

      expect(() => {
        fileReaderService.readTransactions('test.csv', companyId);
      }).toThrow(FileSystemError);
    });

    it('should throw FileSystemError with custom error message for transactions', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw { name: 'CustomError' }; // Not an Error instance
      });

      expect(() => {
        fileReaderService.readTransactions('test.csv', companyId);
      }).toThrow(FileSystemError);
    });
  });
});