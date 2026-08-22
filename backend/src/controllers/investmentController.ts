import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { prisma } from '../config/db.js';
import { InvestmentAgent } from '../services/ai/investmentAgent.js';
import { RiskTolerance, Category } from '@prisma/client';

export const getInvestmentSuggestions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { investmentProfile: true },
    });

    const targetRiskProfile = (req.query.riskProfile as RiskTolerance) || user?.riskTolerance || RiskTolerance.MODERATE;

    // Calculate latest 30-day surplus
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await prisma.transaction.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
    });

    const income = transactions
      .filter((t) => t.category === Category.INCOME || Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const expenses = transactions
      .filter((t) => t.category !== Category.INCOME && Number(t.amount) > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const calculatedSurplus = Math.max(income - expenses, 500);

    const suggestions = await InvestmentAgent.generateSuggestions(calculatedSurplus, targetRiskProfile);

    // Save or update investment profile in DB
    await prisma.investmentProfile.upsert({
      where: { userId },
      update: {
        monthlySurplus: calculatedSurplus,
        riskProfile: targetRiskProfile,
        stocksPct: suggestions.allocation.stocksPct,
        bondsPct: suggestions.allocation.bondsPct,
        cashPct: suggestions.allocation.cashPct,
        cryptoPct: suggestions.allocation.cryptoPct,
        recommendedStrategy: suggestions.reasoning,
      },
      create: {
        userId,
        monthlySurplus: calculatedSurplus,
        riskProfile: targetRiskProfile,
        stocksPct: suggestions.allocation.stocksPct,
        bondsPct: suggestions.allocation.bondsPct,
        cashPct: suggestions.allocation.cashPct,
        cryptoPct: suggestions.allocation.cryptoPct,
        recommendedStrategy: suggestions.reasoning,
      },
    });

    return res.json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
};
