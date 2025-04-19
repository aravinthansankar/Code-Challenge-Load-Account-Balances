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

### Final Output
When you run `npm start`, you'll see the following output showing the initial balances, processed transactions, and final balances:

```
Initial Account Balances:
Account 1111234522226789: $5000.00
Account 1111234522221234: $10000.00
Account 2222123433331212: $550.00
Account 1212343433335665: $1200.00
Account 3212343433335755: $50000.00

Processing Transactions...
Processed: $500.00 from 1111234522226789 to 1212343433335665
Processed: $1000.00 from 3212343433335755 to 2222123433331212
Processed: $320.50 from 3212343433335755 to 1111234522226789
Processed: $25.60 from 1111234522221234 to 1212343433335665

Final Account Balances (After All Transactions):
Account 1111234522226789: $4820.50
Account 1111234522221234: $9974.40
Account 2222123433331212: $1550.00
Account 1212343433335665: $1725.60
Account 3212343433335755: $48679.50
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