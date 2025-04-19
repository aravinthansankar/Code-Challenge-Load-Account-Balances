# Mable Banking Service Challenge

A TypeScript-based implementation of a banking service that processes account balances and transactions from CSV files, ensuring accounts cannot go below $0.

## Challenge Overview

This project implements a banking service that:
- Loads initial account balances from a CSV file
- Processes daily transfers from another CSV file
- Ensures accounts cannot go below $0
- Handles 16-digit account numbers
- Processes transfers between accounts

## Example Data

### Account Balances (mable_account_balances.csv)
| Account Number      | Balance  |
|---------------------|----------|
| 1111234522226789    | 5000.00  |
| 1111234522221234    | 10000.00 |
| 2222123433331212    | 550.00   |
| 1212343433335665    | 1200.00  |
| 3212343433335755    | 50000.00 |

### Transactions (mable_transactions.csv)
| From Account        | To Account          | Amount  |
|---------------------|---------------------|---------|
| 1111234522226789    | 1212343433335665    | 500.00  |
| 3212343433335755    | 2222123433331212    | 1000.00 |
| 3212343433335755    | 1111234522226789    | 320.50  |
| 1111234522221234    | 1212343433335665    | 25.60   |

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/aravinthansankar/Code-Challenge-Load-Account-Balances.git
cd MABLE_CODE_TEST
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

To process the account balances and transactions:
```bash
npm start
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

## Test Coverage

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

## Features

1. Account Management
   - 16-digit account number validation
   - Balance tracking
   - Zero balance protection

2. Transaction Processing
   - CSV file reading
   - Transfer validation
   - Balance updates

3. Error Handling
   - Invalid account numbers
   - Insufficient funds
   - Invalid CSV format

For a detailed explanation of the implementation and design decisions, please see [CODE_EXPLANATION.txt](./CODE_EXPLANATION.txt).