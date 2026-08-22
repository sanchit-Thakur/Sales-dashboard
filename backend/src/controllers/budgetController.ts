import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { prisma } from '../config/db.js';
import { BadRequestError } from '../utils/errors.js';
import { Category } from '@prisma/client';

export const getBudgets = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const budgets = await prisma.budget.findMany({ where: { userId } });

    // Calculate actual spending in current month for each budget
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const currentMonthTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startOfMonth },
        amount: { gt: 0 },
        category: { not: Category.INCOME },
      },
    });

    const spendingByCategory: Record<string, number> = {};
    currentMonthTransactions.forEach((t) => {
      const catKey = String(t.category);
      spendingByCategory[catKey] = (spendingByCategory[catKey] || 0) + Number(t.amount);
    });

    const budgetStatusList = budgets.map((b) => {
      const limitNum = Number(b.monthlyLimit);
      const spent = spendingByCategory[String(b.category)] || 0;
      const percentage = limitNum > 0 ? (spent / limitNum) * 100 : 0;
      const isOverBudget = spent > limitNum;
      const isWarning = percentage >= b.alertThreshold * 100 && !isOverBudget;

      return {
        id: b.id,
        categoryName: String(b.category),
        category: b.category,
        monthlyLimit: limitNum,
        spent: Number(spent.toFixed(2)),
        remaining: Number(Math.max(limitNum - spent, 0).toFixed(2)),
        percentage: Number(percentage.toFixed(1)),
        isOverBudget,
        isWarning,
        alertThresholdPct: b.alertThreshold * 100,
      };
    });

    return res.json({ success: true, count: budgetStatusList.length, budgets: budgetStatusList });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateBudget = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { category, categoryName, monthlyLimit, alertThreshold = 0.8 } = req.body;

    const targetCategory = (category || categoryName) as Category;

    if (!targetCategory || typeof monthlyLimit !== 'number' || monthlyLimit <= 0) {
      throw new BadRequestError('Valid category and positive monthlyLimit are required');
    }

    const budget = await prisma.budget.upsert({
      where: {
        userId_category: {
          userId,
          category: targetCategory,
        },
      },
      update: {
        monthlyLimit,
        alertThreshold,
      },
      create: {
        userId,
        category: targetCategory,
        monthlyLimit,
        alertThreshold,
      },
    });

    return res.json({ success: true, message: 'Budget target saved', budget });
  } catch (error) {
    next(error);
  }
};
