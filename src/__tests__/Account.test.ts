import { AccountEntity } from '../domain/models/Account';
import { ZodError } from 'zod';

describe('AccountEntity', () => {
  const validAccountData = {
    accountNumber: '1234567890123456',
    balance: 1000.00,
    companyId: 'test-company'
  };

  describe('constructor', () => {
    it('should create account with valid data', () => {
      const account = new AccountEntity(validAccountData);
      expect(account.getAccountNumber()).toBe(validAccountData.accountNumber);
      expect(account.getBalance()).toBe(validAccountData.balance);
      expect(account.getCompanyId()).toBe(validAccountData.companyId);
    });

    it('should throw error for invalid account number format', () => {
      expect(() => new AccountEntity({
        ...validAccountData,
        accountNumber: '123abc4567890123' // contains letters
      })).toThrow(ZodError);

      expect(() => new AccountEntity({
        ...validAccountData,
        accountNumber: '12345' // too short
      })).toThrow(ZodError);
    });

    it('should throw error for negative balance', () => {
      expect(() => new AccountEntity({
        ...validAccountData,
        balance: -100
      })).toThrow(ZodError);
    });

    it('should throw error for missing company ID', () => {
      expect(() => new AccountEntity({
        ...validAccountData,
        companyId: undefined as any
      })).toThrow(ZodError);
    });
  });

  describe('withdraw', () => {
    it('should withdraw amount successfully', () => {
      const account = new AccountEntity(validAccountData);
      account.withdraw(500);
      expect(account.getBalance()).toBe(500);
    });

    it('should throw error for insufficient funds', () => {
      const account = new AccountEntity(validAccountData);
      expect(() => account.withdraw(2000)).toThrow('Insufficient funds');
    });

    it('should handle exact balance withdrawal', () => {
      const account = new AccountEntity(validAccountData);
      account.withdraw(1000);
      expect(account.getBalance()).toBe(0);
    });
  });

  describe('deposit', () => {
    it('should deposit amount successfully', () => {
      const account = new AccountEntity(validAccountData);
      account.deposit(500);
      expect(account.getBalance()).toBe(1500);
    });

    it('should handle multiple deposits', () => {
      const account = new AccountEntity(validAccountData);
      account.deposit(500);
      account.deposit(300);
      expect(account.getBalance()).toBe(1800);
    });
  });

  describe('canWithdraw', () => {
    it('should return true for valid withdrawal amount', () => {
      const account = new AccountEntity(validAccountData);
      expect(account.canWithdraw(500)).toBe(true);
    });

    it('should return false for amount greater than balance', () => {
      const account = new AccountEntity(validAccountData);
      expect(account.canWithdraw(2000)).toBe(false);
    });

    it('should return true for exact balance amount', () => {
      const account = new AccountEntity(validAccountData);
      expect(account.canWithdraw(1000)).toBe(true);
    });
  });
});