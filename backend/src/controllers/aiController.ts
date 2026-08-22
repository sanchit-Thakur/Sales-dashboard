import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { prisma } from '../config/db.js';
import { MonthlyReportAgent } from '../services/ai/monthlyReportAgent.js';
import { SpendingPredictionAgent, CategoryHistory } from '../services/ai/spendingPredictionAgent.js';
import { FinancialAdvisorAgent } from '../services/ai/financialAdvisorAgent.js';
import { BadRequestError } from '../utils/errors.js';
import { Category } from '@prisma/client';

export const generateMonthlyReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await prisma.transaction.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
    });

    const budgets = await prisma.budget.findMany({ where: { userId } });

    const totalIncome = transactions
      .filter((t) => t.category === Category.INCOME || Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const totalExpenses = transactions
      .filter((t) => t.category !== Category.INCOME && Number(t.amount) > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netSavings = totalIncome - totalExpenses;

    const categoryBreakdown: Record<string, number> = {};
    transactions
      .filter((t) => t.category !== Category.INCOME && Number(t.amount) > 0)
      .forEach((t) => {
        const catStr = String(t.category);
        categoryBreakdown[catStr] = (categoryBreakdown[catStr] || 0) + Number(t.amount);
      });

    const overbudgetCategories = budgets
      .map((b) => {
        const spent = categoryBreakdown[String(b.category)] || 0;
        return { category: String(b.category), spent, limit: Number(b.monthlyLimit) };
      })
      .filter((b) => b.spent > b.limit);

    const report = await MonthlyReportAgent.generateReport({
      userName: user?.name || 'Valued Client',
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpenses: Number(totalExpenses.toFixed(2)),
      netSavings: Number(netSavings.toFixed(2)),
      categoryBreakdown,
      overbudgetCategories,
    });

    return res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

export const predictSpendingTrends = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const categories: Category[] = [
      Category.HOUSING,
      Category.DINING,
      Category.GROCERIES,
      Category.TRANSPORTATION,
      Category.ENTERTAINMENT,
      Category.UTILITIES,
      Category.SHOPPING,
      Category.SUBSCRIPTIONS,
    ];

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: sixMonthsAgo },
        amount: { gt: 0 },
        category: { not: Category.INCOME },
      },
    });

    // Group transactions by category and month index
    const categoryHistories: CategoryHistory[] = categories.map((cat) => {
      const monthlyAmounts = [0, 0, 0, 0, 0, 0];

      transactions
        .filter((t) => t.category === cat)
        .forEach((t) => {
          const mDiff = (now.getFullYear() - t.date.getFullYear()) * 12 + (now.getMonth() - t.date.getMonth());
          if (mDiff >= 0 && mDiff < 6) {
            monthlyAmounts[5 - mDiff] += Number(t.amount);
          }
        });

      return {
        category: String(cat),
        monthlyAmounts: monthlyAmounts.map((amt) => Number(amt.toFixed(2))),
      };
    });

    const forecast = await SpendingPredictionAgent.predictNextMonth(categoryHistories);

    return res.json({ success: true, forecast });
  } catch (error) {
    next(error);
  }
};

export const askFinancialAdvisor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      throw new BadRequestError('User query message is required');
    }

    const response = await FinancialAdvisorAgent.askAdvisor(userId, message, sessionId);

    return res.json({ success: true, response });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const sessions = await prisma.advisorChatSession.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return res.json({ success: true, count: sessions.length, sessions });
  } catch (error) {
    next(error);
  }
};
