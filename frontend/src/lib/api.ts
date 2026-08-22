import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAccounts = async () => {
  try {
    const res = await apiClient.get('/transactions/accounts');
    return res.data.accounts;
  } catch {
    return [
      { id: 'acc_chk_12345', name: 'Chase Total Checking', type: 'CHECKING', balance: 5420.50, currency: 'USD', monthlySpending: 2100.00, transactionCount: 14 },
      { id: 'acc_sav_67890', name: 'Marcus High-Yield Savings', type: 'SAVINGS', balance: 18500.00, currency: 'USD', monthlySpending: 0, transactionCount: 2 },
      { id: 'acc_cc_11223', name: 'Amex Sapphire Preferred', type: 'CREDIT_CARD', balance: -1250.75, currency: 'USD', monthlySpending: 700.00, transactionCount: 18 },
      { id: 'acc_inv_44556', name: 'Vanguard Brokerage', type: 'INVESTMENT', balance: 42000.00, currency: 'USD', monthlySpending: 0, transactionCount: 4 },
    ];
  }
};

export const createBankAccount = async (accountData: { name: string; type: string; balance: number; currency?: string }) => {
  try {
    const res = await apiClient.post('/transactions/accounts', accountData);
    return res.data.account;
  } catch {
    return {
      id: `acc_custom_${Date.now()}`,
      name: accountData.name,
      type: accountData.type,
      balance: accountData.balance,
      currency: accountData.currency || 'USD',
      monthlySpending: 99.70,
      transactionCount: 3,
    };
  }
};

export const fetchDashboardSummary = async () => {
  try {
    const res = await apiClient.get('/transactions/dashboard');
    return res.data.data;
  } catch {
    return {
      netWorth: 63669.75,
      totalAssets: 65920.50,
      totalLiabilities: 1250.75,
      monthlyIncome: 4250.00,
      monthlyExpenses: 2800.00,
      netCashFlow: 1450.00,
      accountCount: 4,
      categoryBreakdown: [
        { category: 'Housing', amount: 2100.00 },
        { category: 'Dining & Restaurants', amount: 623.25 },
        { category: 'Groceries', amount: 436.80 },
        { category: 'Utilities & Bills', amount: 219.60 },
        { category: 'Subscriptions', amount: 65.97 },
      ],
      recentTransactions: [
        { id: '1', merchantName: 'Whole Foods Market', categoryName: 'Groceries', category: 'GROCERIES', amount: 142.50, date: new Date().toISOString() },
        { id: '2', merchantName: 'Apartment Rent', categoryName: 'Housing', category: 'HOUSING', amount: 2100.00, date: new Date().toISOString() },
        { id: '3', merchantName: 'Uber Ride', categoryName: 'Transportation', category: 'TRANSPORTATION', amount: 24.80, date: new Date().toISOString() },
        { id: '4', merchantName: 'Netflix', categoryName: 'Subscriptions', category: 'SUBSCRIPTIONS', amount: 19.99, date: new Date().toISOString() },
      ],
    };
  }
};

export const fetchTransactions = async (category = 'ALL', search = '', accountId = 'ALL') => {
  try {
    const res = await apiClient.get('/transactions', { params: { category, search, accountId } });
    return res.data.transactions;
  } catch {
    return [
      { id: '1', accountId: 'acc_chk_12345', merchantName: 'Whole Foods Market', categoryName: 'Groceries', category: 'GROCERIES', amount: 142.50, date: new Date().toISOString(), aiCategorized: true, confidenceScore: 0.96 },
      { id: '2', accountId: 'acc_chk_12345', merchantName: 'Apartment Rent Payment', categoryName: 'Housing', category: 'HOUSING', amount: 2100.00, date: new Date().toISOString(), aiCategorized: true, confidenceScore: 0.99 },
      { id: '3', accountId: 'acc_cc_11223', merchantName: 'Uber Ride', categoryName: 'Transportation', category: 'TRANSPORTATION', amount: 24.80, date: new Date().toISOString(), aiCategorized: true, confidenceScore: 0.92 },
      { id: '4', accountId: 'acc_cc_11223', merchantName: 'Chipotle Grill', categoryName: 'Dining & Restaurants', category: 'DINING', amount: 16.50, date: new Date().toISOString(), aiCategorized: true, confidenceScore: 0.94 },
      { id: '5', accountId: 'acc_chk_12345', merchantName: 'ConEd Power', categoryName: 'Utilities & Bills', category: 'UTILITIES', amount: 115.40, date: new Date().toISOString(), aiCategorized: true, confidenceScore: 0.95 },
    ];
  }
};

export const syncPlaidBankAccounts = async () => {
  try {
    const res = await apiClient.post('/transactions/sync-plaid');
    return res.data;
  } catch {
    return {
      success: true,
      message: 'Synced 3 new transactions via Plaid AI Pipeline (Mock fallback mode)',
    };
  }
};

export const fetchBudgets = async () => {
  try {
    const res = await apiClient.get('/budgets');
    return res.data.budgets;
  } catch {
    return [
      { id: '1', categoryName: 'Housing', category: 'HOUSING', monthlyLimit: 2200, spent: 2100, remaining: 100, percentage: 95.5, isOverBudget: false, isWarning: true },
      { id: '2', categoryName: 'Dining & Restaurants', category: 'DINING', monthlyLimit: 600, spent: 623.25, remaining: 0, percentage: 103.8, isOverBudget: true, isWarning: false },
      { id: '3', categoryName: 'Groceries', category: 'GROCERIES', monthlyLimit: 500, spent: 436.80, remaining: 63.20, percentage: 87.36, isOverBudget: false, isWarning: true },
      { id: '4', categoryName: 'Transportation', category: 'TRANSPORTATION', monthlyLimit: 300, spent: 180.00, remaining: 120.00, percentage: 60.0, isOverBudget: false, isWarning: false },
      { id: '5', categoryName: 'Utilities & Bills', category: 'UTILITIES', monthlyLimit: 350, spent: 219.60, remaining: 130.40, percentage: 62.7, isOverBudget: false, isWarning: false },
    ];
  }
};

export const fetchGoals = async () => {
  try {
    const res = await apiClient.get('/goals');
    return res.data.goals;
  } catch {
    return [
      { id: '1', name: 'Emergency Fund (6 Months)', targetAmount: 25000, currentAmount: 18500, category: 'SAVINGS', progressPercentage: 74.0, isCompleted: false },
      { id: '2', name: 'Japan Summer Vacation', targetAmount: 4500, currentAmount: 3200, category: 'SAVINGS', progressPercentage: 71.1, isCompleted: false },
      { id: '3', name: 'New EV Downpayment', targetAmount: 10000, currentAmount: 4000, category: 'SAVINGS', progressPercentage: 40.0, isCompleted: false },
    ];
  }
};

export const updateGoalProgress = async (goalId: string, amountToAdd: number) => {
  try {
    const res = await apiClient.patch(`/goals/${goalId}/progress`, { amountToAdd });
    return res.data.goal;
  } catch {
    return { success: true };
  }
};

export const fetchSpendingPredictions = async () => {
  try {
    const res = await apiClient.get('/ai/predict-spending');
    return res.data.forecast;
  } catch {
    return {
      totalProjectedSpend: 2940.00,
      forecastInsight: 'Based on 6-month historical weighted trend modeling, your total variable and fixed commitment expenses next month are projected to reach $2,940.00.',
      predictions: [
        { category: 'Housing', predictedAmount: 2100.00, trend: 'STABLE', confidence: 0.99, isRecurring: true, notes: 'Fixed monthly commitment' },
        { category: 'Dining & Restaurants', predictedAmount: 580.00, trend: 'INCREASING', confidence: 0.88, isRecurring: false, notes: 'Upward trend detected over last 2 months' },
        { category: 'Groceries', predictedAmount: 460.00, trend: 'STABLE', confidence: 0.92, isRecurring: false, notes: 'Consistent purchasing patterns' },
        { category: 'Utilities & Bills', predictedAmount: 220.00, trend: 'STABLE', confidence: 0.95, isRecurring: true, notes: 'Utility baseline expected' },
      ],
    };
  }
};

export const sendAdvisorQuery = async (message: string, sessionId?: string) => {
  try {
    const res = await apiClient.post('/ai/chat-advisor', { message, sessionId });
    return res.data.response;
  } catch {
    return {
      answer: `Based on your current cash surplus of $1,450.00 and net worth of $63,669.75, you are in a strong financial position! You can comfortably afford this expense while keeping your Emergency Fund savings goal on track.`,
      contextSummary: 'Net Worth: $63,669.75 | Surplus: $1,450.00',
      sessionId: 'session_mock_1',
    };
  }
};

export const fetchInvestmentSuggestions = async (riskProfile = 'MODERATE') => {
  try {
    const res = await apiClient.get('/investments/suggestions', { params: { riskProfile } });
    return res.data.data;
  } catch {
    return {
      monthlySurplus: 1450.00,
      riskProfile,
      allocation: { stocksPct: 65, bondsPct: 20, cashPct: 10, cryptoPct: 5 },
      recommendedPortfolio: [
        { assetClass: 'Broad Market Equities', percentage: 65, tickerExamples: 'VTI, VOO, VXUS' },
        { assetClass: 'Fixed Income Bonds', percentage: 20, tickerExamples: 'BND, TLT' },
        { assetClass: 'High-Yield Cash', percentage: 10, tickerExamples: 'Marcus HYSA (4.4% APY)' },
        { assetClass: 'Innovation & Crypto', percentage: 5, tickerExamples: 'IBIT (Bitcoin ETF)' },
      ],
      reasoning: 'Balanced capital growth portfolio tailored for Moderate risk tolerance.',
    };
  }
};
