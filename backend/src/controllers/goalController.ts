import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { prisma } from '../config/db.js';
import { BadRequestError } from '../utils/errors.js';
import { GoalStatus, Category } from '@prisma/client';

export const getGoals = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const enrichedGoals = goals.map((g) => {
      const current = Number(g.currentAmount);
      const target = Number(g.targetAmount);
      const percentage = target > 0 ? (current / target) * 100 : 0;

      return {
        ...g,
        currentAmount: current,
        targetAmount: target,
        progressPercentage: Number(Math.min(percentage, 100).toFixed(1)),
        isCompleted: current >= target || g.status === GoalStatus.COMPLETED,
      };
    });

    return res.json({ success: true, count: enrichedGoals.length, goals: enrichedGoals });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { name, targetAmount, currentAmount = 0, deadline, category = Category.SAVINGS } = req.body;

    if (!name || typeof targetAmount !== 'number' || targetAmount <= 0) {
      throw new BadRequestError('Name and a positive targetAmount are required');
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        name,
        targetAmount,
        currentAmount,
        category: category as Category,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    return res.status(201).json({ success: true, goal });
  } catch (error) {
    next(error);
  }
};

export const updateGoalProgress = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { goalId } = req.params;
    const { amountToAdd } = req.body;

    if (typeof amountToAdd !== 'number') {
      throw new BadRequestError('amountToAdd must be a number');
    }

    const existingGoal = await prisma.goal.findUnique({ where: { id: goalId } });
    if (!existingGoal) {
      throw new BadRequestError('Goal not found');
    }

    const currentNum = Number(existingGoal.currentAmount);
    const targetNum = Number(existingGoal.targetAmount);
    const newCurrentAmount = Math.max(currentNum + amountToAdd, 0);
    const isCompleted = newCurrentAmount >= targetNum;

    const updated = await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentAmount: newCurrentAmount,
        status: isCompleted ? GoalStatus.COMPLETED : GoalStatus.IN_PROGRESS,
      },
    });

    return res.json({ success: true, message: 'Goal progress updated', goal: updated });
  } catch (error) {
    next(error);
  }
};
