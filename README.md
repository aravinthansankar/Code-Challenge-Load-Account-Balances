# Banking Service

A TypeScript-based banking service that handles account management and transactions with robust error handling and validation.

## Overview

This project implements a banking service that provides functionality for:
- Account management
- Transaction processing
- Balance inquiries
- Fund transfers
- Error handling for various banking scenarios

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Mable_Final
```

2. Install dependencies:
```bash
npm install
```

## Running the Tests

To run the test suite:
```bash
npm test
```

To run tests with coverage report:
```bash
npm test -- --coverage
```

## Test Coverage Report

The project has achieved 100% test coverage across all files:

```
-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|-------------------
All files              |     100 |      100 |     100 |     100 |
 domain/errors         |     100 |      100 |     100 |     100 |
  BankingError.ts      |     100 |      100 |     100 |     100 |
 domain/models         |     100 |      100 |     100 |     100 |
  Account.ts           |     100 |      100 |     100 |     100 |
  Transaction.ts       |     100 |      100 |     100 |     100 |
 services              |     100 |      100 |     100 |     100 |
  BankingService.ts    |     100 |      100 |     100 |     100 |
  FileReaderService.ts |     100 |      100 |     100 |     100 |
-----------------------|---------|----------|---------|---------|-------------------
```

## Test Cases

The test suite includes comprehensive coverage of the following scenarios:

### Account Management
- Account creation and validation
- Balance inquiries
- Company ID validation

### Transaction Processing
- Valid transaction processing
- Invalid transaction handling
- Zero amount transaction validation
- Small amount transaction handling

### Error Handling
- Account not found errors
- Company mismatch errors
- Insufficient funds errors
- Invalid transaction amount errors

### Specific Test Cases
1. **Account Not Found**
   - Tests handling of non-existent accounts
   - Verifies proper error throwing for invalid account numbers

2. **Company Mismatch**
   - Validates transactions between accounts of different companies
   - Ensures proper error handling for company ID mismatches

3. **Transaction Validation**
   - Zero amount transactions
   - Negative amount transactions
   - Very small amount transactions (0.01)

4. **Balance Management**
   - Multiple transaction processing
   - Balance updates after transactions
   - Insufficient funds handling

## Project Structure

```
src/
├── domain/
│   ├── errors/
│   │   └── BankingError.ts
│   └── models/
│       ├── Account.ts
│       └── Transaction.ts
├── services/
│   ├── BankingService.ts
│   └── FileReaderService.ts
└── __tests__/
    ├── Account.test.ts
    ├── BankingService.test.ts
    └── FileReaderService.test.ts
```

## Error Types

The service implements the following custom error types:
- `AccountNotFoundError`
- `InsufficientFundsError`
- `CompanyMismatchError`