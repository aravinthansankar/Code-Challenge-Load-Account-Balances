import { FileReaderService } from './services/FileReaderService';
import { BankingService } from './services/BankingService';

/**
 * Main application entry point
 * Reads account balances and transactions from CSV files,
 * processes transactions, and displays results
 */
const main = async () => {
  const fileReaderService = new FileReaderService();

  try {
    // Read initial account balances from CSV
    const accounts = fileReaderService.readAccountBalances('./data/mable_account_balances.csv');
    const bankingService = new BankingService(accounts);

    // Read and process transactions from CSV
    const transactions = fileReaderService.readTransactions('./data/mable_transactions.csv');

    // Display initial account balances
    console.log('Initial Account Balances:');
    accounts.forEach(account => {
      console.log(`Account ${account.getAccountNumber()}: $${account.getBalance().toFixed(2)}`);
    });

    // Process each transaction and display results
    console.log('\nProcessing Transactions...');
    transactions.forEach(transaction => {
      try {
        bankingService.processTransaction(transaction);
        console.log(`Processed: $${transaction.getAmount().toFixed(2)} from ${transaction.getFromAccount()} to ${transaction.getToAccount()}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Failed to process transaction: ${error.message}`);
        } else {
          console.error('Failed to process transaction: Unknown error');
        }
      }
    });

    // Display final account balances
    console.log('\nFinal Account Balances:');
    bankingService.getAllAccounts().forEach(account => {
      console.log(`Account ${account.getAccountNumber()}: $${account.getBalance().toFixed(2)}`);
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error processing files:', error.message);
    } else {
      console.error('Error processing files: Unknown error');
    }
  }
};

// Start the application
main();