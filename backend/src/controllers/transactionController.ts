import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { prisma } from '../config/db.js';
import { CategorizationAgent } from '../services/ai/categorizationAgent.js';
import { PlaidService } from '../services/plaidService.js';
import { RedisService } from '../services/redisService.js';
import { BadRequestError } from '../utils/errors.js';
import { Category, AccountType } from '@prisma/client';

export class TransactionController {
  /**
   * Fetch user's connected bank accounts with calculated monthly spending.
   */
  static async getAccounts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const accounts = await prisma.account.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const accountSummaries = await Promise.all(
        accounts.map(async (acc) => {
          const recentExpenses = await prisma.transaction.aggregate({
            where: {
              accountId: acc.id,
              date: { gte: thirtyDaysAgo },
              amount: { gt: 0 },
              category: { not: Category.INCOME },
            },
            _sum: { amount: true },
            _count: { id: true },
          });

          return {
            ...acc,
            balance: Number(acc.balance),
            monthlySpending: Number(recentExpenses._sum.amount || 0),
            transactionCount: recentExpenses._count.id,
          };
        })
      );

      return res.json({ success: true, count: accountSummaries.length, accounts: accountSummaries });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Link / Add a new Bank Account (Plaid or Manual Institution setup).
   */
  static async createAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { name, type, balance = 0, currency = 'USD', plaidAccountId } = req.body;

      if (!name || !type) {
        throw new BadRequestError('Account name and type (CHECKING, SAVINGS, CREDIT_CARD, INVESTMENT) are required');
      }

      const account = await prisma.account.create({
        data: {
          userId,
          name,
          type: type as AccountType,
          balance,
          currency,
          plaidAccountId: plaidAccountId || `plaid_${Date.now()}`,
        },
      });

      // Optionally generate initial sample transactions for immediate visualization
      const sampleMerchants = [
        { name: `${name} Initial Deposit`, category: Category.INCOME, amount: -balance },
        { name: 'Local Grocery', category: Category.GROCERIES, amount: 85.50 },
        { name: 'Coffee Shop', category: Category.DINING, amount: 14.20 },
      ];

      for (const m of sampleMerchants) {
        if (m.amount !== 0) {
          await prisma.transaction.create({
            data: {
              userId,
              accountId: account.id,
              amount: m.amount,
              merchantName: m.name,
              description: `Transaction on ${name}`,
              rawDescription: `POS DEBIT ${m.name.toUpperCase()}`,
              date: new Date(),
              category: m.category,
              aiCategorized: true,
              confidenceScore: 0.95,
            },
          });
        }
      }

      // Invalidate Redis dashboard cache
      await RedisService.del(`dashboard_summary_${userId}`);

      return res.status(201).json({
        success: true,
        message: 'Bank account connected successfully',
        account: {
          ...account,
          balance: Number(account.balance),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch paginated transactions with category, date range, account, and merchant search filters.
   */
  static async getTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { category, accountId, search, startDate, endDate, page = '1', limit = '20' } = req.query;

      const pageNum = Math.max(parseInt(page as string, 10), 1);
      const limitNum = Math.min(parseInt(limit as string, 10), 100);
      const skip = (pageNum - 1) * limitNum;

      const whereClause: any = { userId };

      if (accountId && typeof accountId === 'string' && accountId !== 'ALL') {
        whereClause.accountId = accountId;
      }

      if (category && typeof category === 'string' && category !== 'ALL') {
        whereClause.category = category as Category;
      }

      if (search && typeof search === 'string') {
        whereClause.OR = [
          { merchantName: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (startDate || endDate) {
        whereClause.date = {};
        if (startDate) whereClause.date.gte = new Date(startDate as string);
        if (endDate) whereClause.date.lte = new Date(endDate as string);
      }

      const [totalCount, rawTransactions] = await Promise.all([
        prisma.transaction.count({ where: whereClause }),
        prisma.transaction.findMany({
          where: whereClause,
          orderBy: { date: 'desc' },
          skip,
          take: limitNum,
          include: {
            account: {
              select: { name: true, type: true, currency: true },
            },
          },
        }),
      ]);

      const transactions = rawTransactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
      }));

      return res.json({
        success: true,
        pagination: {
          totalCount,
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          limit: limitNum,
        },
        transactions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save a manual or custom transaction, triggering the AI Categorization pipeline.
   */
  static async createTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { accountId, amount, merchantName, description, rawDescription, date, userCategory } = req.body;

      if (!accountId || typeof amount !== 'number' || !merchantName) {
        throw new BadRequestError('accountId, positive/negative numeric amount, and merchantName are required');
      }

      const account = await prisma.account.findFirst({
        where: { id: accountId, userId },
      });

      if (!account) {
        throw new BadRequestError('Target account not found or access denied');
      }

      let category = userCategory;
      let aiCategorized = false;
      let confidenceScore = 1.0;

      if (!category) {
        const aiResult = await CategorizationAgent.categorizeTransaction(
          merchantName,
          rawDescription || description || merchantName,
          amount
        );
        category = aiResult.category;
        aiCategorized = true;
        confidenceScore = aiResult.confidenceScore;
      }

      const transaction = await prisma.transaction.create({
        data: {
          userId,
          accountId,
          amount,
          currency: account.currency,
          merchantName,
          description: description || `Transaction at ${merchantName}`,
          rawDescription: rawDescription || merchantName,
          date: date ? new Date(date) : new Date(),
          category: category as Category,
          aiCategorized,
          confidenceScore,
        },
      });

      // Update account balance
      await prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      });

      await RedisService.del(`dashboard_summary_${userId}`);

      return res.status(201).json({
        success: true,
        message: 'Transaction recorded successfully',
        transaction: {
          ...transaction,
          amount: Number(transaction.amount),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sync transactions from Plaid API / Mock Banking API with AI classification.
   */
  static async syncPlaidTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const accounts = await prisma.account.findMany({ where: { userId } });

      if (accounts.length === 0) {
        throw new BadRequestError('No connected bank accounts found to sync');
      }

      const primaryAccount = accounts[0];
      const syncedItems = await PlaidService.syncAccountTransactions(
        primaryAccount.plaidAccountId || 'plaid_acc_demo',
        primaryAccount.type
      );

      const savedTransactions = [];
      for (const item of syncedItems) {
        const aiResult = await CategorizationAgent.categorizeTransaction(
          item.merchantName,
          item.rawDescription,
          item.amount
        );

        const tx = await prisma.transaction.create({
          data: {
            userId,
            accountId: primaryAccount.id,
            amount: item.amount,
            currency: primaryAccount.currency,
            merchantName: item.merchantName,
            description: item.description,
            rawDescription: item.rawDescription,
            date: item.date,
            category: (aiResult.category.toUpperCase() as Category) || Category.UNCATEGORIZED,
            aiCategorized: true,
            confidenceScore: aiResult.confidenceScore,
          },
        });

        savedTransactions.push({
          ...tx,
          amount: Number(tx.amount),
        });
      }

      await RedisService.del(`dashboard_summary_${userId}`);

      return res.json({
        success: true,
        message: `Successfully synchronized ${savedTransactions.length} transactions via Plaid AI Pipeline`,
        transactions: savedTransactions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Aggregated Dashboard Summary endpoint.
   */
  static async getDashboardSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const cacheKey = `dashboard_summary_${userId}`;

      const cached = await RedisService.get(cacheKey);
      if (cached) {
        return res.json({ success: true, data: cached, fromCache: true });
      }

      const accounts = await prisma.account.findMany({ where: { userId } });
      const totalAssets = accounts.reduce((sum, acc) => (Number(acc.balance) > 0 ? sum + Number(acc.balance) : sum), 0);
      const totalLiabilities = accounts.reduce((sum, acc) => (Number(acc.balance) < 0 ? sum + Math.abs(Number(acc.balance)) : sum), 0);
      const netWorth = totalAssets - totalLiabilities;

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          date: { gte: thirtyDaysAgo },
        },
        orderBy: { date: 'desc' },
      });

      const income = transactions
        .filter((t) => t.category === Category.INCOME || Number(t.amount) < 0)
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

      const expenses = transactions
        .filter((t) => t.category !== Category.INCOME && Number(t.amount) > 0)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const netCashFlow = income - expenses;

      const categoryMap: Record<string, number> = {};
      transactions
        .filter((t) => t.category !== Category.INCOME && Number(t.amount) > 0)
        .forEach((t) => {
          const catName = String(t.category);
          categoryMap[catName] = (categoryMap[catName] || 0) + Number(t.amount);
        });

      const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount: Number(amount.toFixed(2)),
      }));

      const result = {
        netWorth: Number(netWorth.toFixed(2)),
        totalAssets: Number(totalAssets.toFixed(2)),
        totalLiabilities: Number(totalLiabilities.toFixed(2)),
        monthlyIncome: Number(income.toFixed(2)),
        monthlyExpenses: Number(expenses.toFixed(2)),
        netCashFlow: Number(netCashFlow.toFixed(2)),
        accountCount: accounts.length,
        categoryBreakdown,
        recentTransactions: transactions.slice(0, 10).map((t) => ({
          ...t,
          amount: Number(t.amount),
        })),
      };

      await RedisService.set(cacheKey, result, 60);

      return res.json({ success: true, data: result, fromCache: false });
    } catch (error) {
      next(error);
    }
  }
}
