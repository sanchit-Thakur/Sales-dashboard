import { PrismaClient, AccountType, RiskTolerance, GoalStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.chatMessage.deleteMany();
  await prisma.advisorChatSession.deleteMany();
  await prisma.investmentProfile.deleteMany();
  await prisma.financialGoal.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.user.deleteMany();

  // Create Demo User
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@financeadvisor.ai',
      passwordHash,
      name: 'Alex Morgan',
      preferredCurrency: 'USD',
      riskTolerance: RiskTolerance.MODERATE,
    },
  });

  console.log(`👤 Created user: ${user.name} (${user.email})`);

  // Create Bank Accounts
  const checkingAccount = await prisma.bankAccount.create({
    data: {
      userId: user.id,
      name: 'Chase Total Checking',
      type: AccountType.CHECKING,
      balance: 5420.50,
      currency: 'USD',
      plaidAccountId: 'acc_chk_12345',
    },
  });

  const savingsAccount = await prisma.bankAccount.create({
    data: {
      userId: user.id,
      name: 'Marcus High-Yield Savings',
      type: AccountType.SAVINGS,
      balance: 18500.00,
      currency: 'USD',
      plaidAccountId: 'acc_sav_67890',
    },
  });

  const creditCard = await prisma.bankAccount.create({
    data: {
      userId: user.id,
      name: 'Amex Sapphire Preferred',
      type: AccountType.CREDIT_CARD,
      balance: -1250.75,
      currency: 'USD',
      plaidAccountId: 'acc_cc_11223',
    },
  });

  const investmentAccount = await prisma.bankAccount.create({
    data: {
      userId: user.id,
      name: 'Vanguard Brokerage',
      type: AccountType.INVESTMENT,
      balance: 42000.00,
      currency: 'USD',
      plaidAccountId: 'acc_inv_44556',
    },
  });

  console.log('🏦 Created bank accounts (Checking, Savings, Credit Card, Investment)');

  // Seed Budgets
  const budgetLimits = [
    { categoryName: 'Housing', monthlyLimit: 2200 },
    { categoryName: 'Dining & Restaurants', monthlyLimit: 600 },
    { categoryName: 'Groceries', monthlyLimit: 500 },
    { categoryName: 'Transportation', monthlyLimit: 300 },
    { categoryName: 'Entertainment & Leisure', monthlyLimit: 250 },
    { categoryName: 'Utilities & Bills', monthlyLimit: 350 },
    { categoryName: 'Shopping', monthlyLimit: 400 },
    { categoryName: 'Subscriptions', monthlyLimit: 100 },
  ];

  for (const b of budgetLimits) {
    await prisma.budget.create({
      data: {
        userId: user.id,
        categoryName: b.categoryName,
        monthlyLimit: b.monthlyLimit,
        alertThreshold: 0.8,
      },
    });
  }

  console.log('📊 Seeded monthly budgets');

  // Seed Financial Goals
  await prisma.financialGoal.createMany({
    data: [
      {
        userId: user.id,
        name: 'Emergency Fund (6 Months)',
        targetAmount: 25000,
        currentAmount: 18500,
        category: 'Savings',
        deadline: new Date('2026-12-31'),
        status: GoalStatus.IN_PROGRESS,
      },
      {
        userId: user.id,
        name: 'Japan Summer Vacation',
        targetAmount: 4500,
        currentAmount: 3200,
        category: 'Travel',
        deadline: new Date('2027-06-15'),
        status: GoalStatus.IN_PROGRESS,
      },
      {
        userId: user.id,
        name: 'New EV Car Downpayment',
        targetAmount: 10000,
        currentAmount: 4000,
        category: 'Purchase',
        deadline: new Date('2027-03-01'),
        status: GoalStatus.IN_PROGRESS,
      },
    ],
  });

  console.log('🎯 Seeded financial goals');

  // Seed Investment Profile
  await prisma.investmentProfile.create({
    data: {
      userId: user.id,
      monthlySurplus: 1450.00,
      riskProfile: RiskTolerance.MODERATE,
      stocksPct: 65.0,
      bondsPct: 20.0,
      cashPct: 10.0,
      cryptoPct: 5.0,
      recommendedStrategy: 'Growth & Balanced Income Portfolio with 65% low-cost S&P 500 index funds, 20% aggregate bonds, 10% cash yield, and 5% innovation assets.',
    },
  });

  console.log('📈 Seeded investment profile');

  // Seed Historical Transactions (across last 6 months)
  const now = new Date();
  const sampleMerchants = [
    { name: 'Whole Foods Market', category: 'Groceries', amount: 142.50, account: checkingAccount.id },
    { name: 'Uber Ride', category: 'Transportation', amount: 24.80, account: creditCard.id },
    { name: 'Netflix Subscription', category: 'Subscriptions', amount: 19.99, account: creditCard.id },
    { name: 'Starbucks Coffee', category: 'Dining & Restaurants', amount: 6.75, account: creditCard.id },
    { name: 'Equinox Gym', category: 'Health & Fitness', amount: 180.00, account: creditCard.id },
    { name: 'Target', category: 'Shopping', amount: 89.20, account: checkingAccount.id },
    { name: 'Chipotle Mexican Grill', category: 'Dining & Restaurants', amount: 16.50, account: creditCard.id },
    { name: 'ConEd Power Bill', category: 'Utilities & Bills', amount: 115.40, account: checkingAccount.id },
    { name: 'Apartment Rent Payment', category: 'Housing', amount: 2100.00, account: checkingAccount.id },
    { name: 'Trader Joe\'s', category: 'Groceries', amount: 94.30, account: checkingAccount.id },
    { name: 'Amazon Prime', category: 'Shopping', amount: 135.00, account: creditCard.id },
    { name: 'Spotify Music', category: 'Subscriptions', amount: 10.99, account: creditCard.id },
    { name: 'Payroll Direct Deposit - Tech Corp', category: 'Income', amount: -4250.00, account: checkingAccount.id },
  ];

  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    for (const m of sampleMerchants) {
      const txDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, Math.floor(Math.random() * 25) + 1);
      await prisma.transaction.create({
        data: {
          userId: user.id,
          accountId: m.account,
          amount: m.amount,
          merchantName: m.name,
          description: `Purchase at ${m.name}`,
          rawDescription: `POS DEBIT ${m.name.toUpperCase()} REF_${Math.floor(Math.random() * 899999 + 100000)}`,
          date: txDate,
          categoryName: m.category,
          isRecurring: ['Subscriptions', 'Housing'].includes(m.category),
          aiCategorized: true,
          confidenceScore: 0.96,
        },
      });
    }
  }

  console.log('💳 Seeded 6 months of historical transactions');

  // Seed AI Chat Session
  const session = await prisma.advisorChatSession.create({
    data: {
      userId: user.id,
      title: 'Monthly Budget & Savings Strategy',
    },
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        sessionId: session.id,
        role: 'user',
        content: 'Hi! Can I afford a $500 vacation next month based on my current monthly cash flow?',
      },
      {
        sessionId: session.id,
        role: 'assistant',
        content: 'Based on your current monthly average net surplus of $1,450.00 after housing, groceries, and regular expenses, yes, you can afford a $500 vacation next month! Doing so will leave you with approximately $950 in remaining surplus, allowing you to stay on track with your Emergency Fund goal ($18,500 / $25,000).',
      },
    ],
  });

  console.log('💬 Seeded advisor chat history');
  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
