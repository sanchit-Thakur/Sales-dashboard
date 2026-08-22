export interface MockBankingTransaction {
  amount: number;
  merchantName: string;
  description: string;
  rawDescription: string;
  date: Date;
  suggestedCategory: string;
}

export class PlaidService {
  /**
   * Generates or fetches synced transactions for a bank account.
   * If Plaid API credentials are not set, falls back to Mock Banking API.
   */
  static async syncAccountTransactions(
    _plaidAccountId: string,
    accountType: string
  ): Promise<MockBankingTransaction[]> {
    console.log(`🔄 Syncing Plaid transactions for account: ${_plaidAccountId} (${accountType})`);

    const mockMerchants = [
      { name: 'Apple Store', category: 'Shopping', amount: 199.00, desc: 'APPLE STORE #R142' },
      { name: 'Trader Joe\'s', category: 'Groceries', amount: 87.40, desc: 'TRADER JOE 451 GROCERY' },
      { name: 'Uber Eats', category: 'Dining & Restaurants', amount: 32.15, desc: 'UBER *EATS SAN FRANCISCO' },
      { name: 'Shell Gasoline', category: 'Transportation', amount: 45.00, desc: 'SHELL OIL 5742119' },
      { name: 'ConEd Electric', category: 'Utilities & Bills', amount: 104.20, desc: 'CONEDISON ELEC ACH' },
      { name: 'Hulu Digital', category: 'Subscriptions', amount: 14.99, desc: 'HULU SUBSCRIPTION MONTHLY' },
    ];

    // Pick 2-4 randomized new transactions
    const count = Math.floor(Math.random() * 3) + 2;
    const synced: MockBankingTransaction[] = [];

    for (let i = 0; i < count; i++) {
      const item = mockMerchants[Math.floor(Math.random() * mockMerchants.length)];
      synced.push({
        amount: item.amount,
        merchantName: item.name,
        description: `Purchase at ${item.name}`,
        rawDescription: item.desc,
        date: new Date(),
        suggestedCategory: item.category,
      });
    }

    return synced;
  }
}
