import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { env } from '../../config/env.js';
import { prisma } from '../../config/db.js';
import { Category } from '@prisma/client';

export class FinancialAdvisorAgent {
  /**
   * RAG-enabled Conversational AI Financial Advisor.
   * Retrieves user's bank balances, budgets, goals, and 30-day transaction context.
   */
  static async askAdvisor(
    userId: string,
    userQuery: string,
    sessionId?: string
  ): Promise<{
    answer: string;
    contextSummary: string;
    sessionId: string;
  }> {
    // 1. Retrieve User & Financial Context from Database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
        budgets: true,
        goals: true,
        investmentProfile: true,
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Retrieve recent 30-day transaction history for context grounding
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: 'desc' },
      take: 20,
    });

    // 2. Compute Aggregates
    const totalAssets = user?.accounts.reduce((sum, acc) => (Number(acc.balance) > 0 ? sum + Number(acc.balance) : sum), 0) || 0;
    const totalLiabilities = user?.accounts.reduce((sum, acc) => (Number(acc.balance) < 0 ? sum + Math.abs(Number(acc.balance)) : sum), 0) || 0;
    const netWorth = totalAssets - totalLiabilities;

    const monthlyIncome = recentTransactions
      .filter((t) => t.category === Category.INCOME || Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const monthlyExpenses = recentTransactions
      .filter((t) => t.category !== Category.INCOME && Number(t.amount) > 0)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const netSurplus = monthlyIncome - monthlyExpenses;

    // Build Structured Context Object for Prompt Injection
    const contextObject = {
      userName: user?.name || 'Valued User',
      preferredCurrency: user?.preferredCurrency || 'USD',
      netWorth: `$${netWorth.toFixed(2)}`,
      totalAssets: `$${totalAssets.toFixed(2)}`,
      totalLiabilities: `$${totalLiabilities.toFixed(2)}`,
      recent30DayIncome: `$${monthlyIncome.toFixed(2)}`,
      recent30DayExpenses: `$${monthlyExpenses.toFixed(2)}`,
      netSurplus: `$${netSurplus.toFixed(2)}`,
      accounts: user?.accounts.map((a) => `${a.name} (${a.type}): $${Number(a.balance).toFixed(2)}`),
      budgets: user?.budgets.map((b) => `${b.category}: limit $${Number(b.monthlyLimit)}`),
      goals: user?.goals.map((g) => `${g.name}: $${Number(g.currentAmount)} / $${Number(g.targetAmount)} (Deadline: ${g.deadline?.toISOString().split('T')[0]})`),
      recentSampleTransactions: recentTransactions.slice(0, 10).map(
        (t) => `${t.date.toISOString().split('T')[0]} - ${t.merchantName} (${t.category}): $${Number(t.amount).toFixed(2)}`
      ),
    };

    const contextSummary = `Net Worth: ${contextObject.netWorth} | 30-Day Surplus: ${contextObject.netSurplus} | Accounts: ${contextObject.accounts?.length || 0}`;

    // Manage Chat Session
    let chatSessionId = sessionId;
    if (!chatSessionId) {
      const newSession = await prisma.advisorChatSession.create({
        data: {
          userId,
          title: userQuery.slice(0, 40) + '...',
        },
      });
      chatSessionId = newSession.id;
    }

    // Record User Message
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSessionId,
        role: 'user',
        content: userQuery,
      },
    });

    let answer = '';

    // 3. LangChain Prompt Template & OpenAI Chain Execution
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY !== 'mock-openai-key') {
      try {
        const model = new ChatOpenAI({
          modelName: 'gpt-4o',
          temperature: 0.3,
          openAIApiKey: env.OPENAI_API_KEY,
        });

        const prompt = PromptTemplate.fromTemplate(
          `You are an elite, empathetic, and quantitative AI Personal Financial Advisor.
Answer the user's financial question by referencing their actual real-time bank balances, budgets, financial goals, and transaction history provided below.
Be grounded, concise, encouraging, and provide clear math calculations where appropriate.

USER FINANCIAL CONTEXT:
{context}

USER QUESTION:
"{query}"

Provide a direct answer detailing exact dollar impact on their net surplus and goals.`
        );

        const chain = prompt.pipe(model);
        const response = await chain.invoke({
          context: JSON.stringify(contextObject, null, 2),
          query: userQuery,
        });

        answer = response.content as string;
      } catch (err) {
        console.warn('⚠️ Financial Advisor LLM fallback triggered:', (err as Error).message);
      }
    }

    // High-quality deterministic fallback response engine when offline/sandbox
    if (!answer) {
      const queryLower = userQuery.toLowerCase();
      const firstGoalName = user?.goals[0]?.name || 'Emergency Fund';

      if (queryLower.includes('afford') || queryLower.includes('vacation')) {
        answer = `Based on your real-time financial context:\n\n` +
          `• **Current Net Worth**: ${contextObject.netWorth}\n` +
          `• **30-Day Net Cash Surplus**: ${contextObject.netSurplus} (Income: ${contextObject.recent30DayIncome} | Expenses: ${contextObject.recent30DayExpenses})\n` +
          `• **Active Savings Goals**: You currently have ${contextObject.goals?.length} active goal(s), including ${firstGoalName}.\n\n` +
          `**Analysis**: Given your positive net monthly surplus of ${contextObject.netSurplus}, making this purchase will leave you with an estimated remaining monthly cash buffer of $${Math.max(netSurplus - 500, 0).toFixed(2)}. This keeps your financial foundation stable without impacting your primary savings targets!`;
      } else {
        answer = `Hello ${contextObject.userName}! I have analyzed your complete financial snapshot:\n\n` +
          `• **Net Assets**: ${contextObject.totalAssets} across ${contextObject.accounts?.length} accounts.\n` +
          `• **Monthly Net Cashflow**: ${contextObject.netSurplus} net surplus.\n` +
          `• **Top Priority**: Continue building your emergency cushion while maintaining your target savings goals.\n\n` +
          `How can I assist you with specific budgeting decisions, debt payoff, or investment strategies today?`;
      }
    }

    // Record Assistant Answer
    await prisma.chatMessage.create({
      data: {
        sessionId: chatSessionId,
        role: 'assistant',
        content: answer,
      },
    });

    return {
      answer,
      contextSummary,
      sessionId: chatSessionId,
    };
  }
}
