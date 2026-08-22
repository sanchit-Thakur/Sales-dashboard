import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { env } from '../../config/env.js';

export interface MonthlyReportInput {
  userName: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categoryBreakdown: Record<string, number>;
  overbudgetCategories: Array<{ category: string; spent: number; limit: number }>;
}

export class MonthlyReportAgent {
  static async generateReport(data: MonthlyReportInput): Promise<{
    summary: string;
    keyHighlights: string[];
    anomalies: string[];
    actionItems: string[];
    healthScore: number;
  }> {
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY !== 'mock-openai-key') {
      try {
        const model = new ChatOpenAI({
          modelName: 'gpt-4o',
          temperature: 0.3,
          openAIApiKey: env.OPENAI_API_KEY,
        });

        const prompt = PromptTemplate.fromTemplate(
          `You are an elite AI Financial Advisor analyzing a monthly spending report.
User: {userName}
Total Monthly Income: ${data.totalIncome}
Total Monthly Expenses: ${data.totalExpenses}
Net Monthly Savings: ${data.netSavings}

Category Spending Breakdown:
{categoryBreakdown}

Over-budget Categories:
{overbudgetCategories}

Generate a structured financial performance report in JSON format with keys:
"summary": string (a comprehensive 2-3 paragraph summary of monthly performance)
"keyHighlights": string[] (3 bullet points of positive achievements or key observations)
"anomalies": string[] (unexpected spikes or overspending areas)
"actionItems": string[] (3 concrete actionable steps for next month)
"healthScore": number (0 to 100 overall financial health score)`
        );

        const chain = prompt.pipe(model);
        const response = await chain.invoke({
          userName: data.userName,
          categoryBreakdown: JSON.stringify(data.categoryBreakdown, null, 2),
          overbudgetCategories: JSON.stringify(data.overbudgetCategories, null, 2),
        });

        return JSON.parse(response.content as string);
      } catch (err) {
        console.warn('⚠️ Monthly Report LLM fallback triggered:', (err as Error).message);
      }
    }

    // Heuristic Fallback Engine for offline / sandbox mode
    const savingsRate = data.totalIncome > 0 ? ((data.netSavings / data.totalIncome) * 100).toFixed(1) : '0';
    const hasOverbudget = data.overbudgetCategories.length > 0;

    const highlights = [
      `Maintained a net monthly savings rate of ${savingsRate}%, generating $${data.netSavings.toFixed(2)} in surplus cash.`,
      `Housing remains your largest fixed commitment at $${(data.categoryBreakdown['Housing'] || 0).toFixed(2)}.`,
      `Successfully set aside funding towards active emergency and vacation goals.`,
    ];

    const anomalies = hasOverbudget
      ? data.overbudgetCategories.map(
          (c) => `Overbudget in ${c.category}: spent $${c.spent.toFixed(2)} vs limit of $${c.limit.toFixed(2)}.`
        )
      : ['No critical budget overruns detected this month.'];

    const actionItems = [
      hasOverbudget
        ? `Reallocate surplus cash from lower-priority spending to cover overbudget categories.`
        : `Cap discretionary dining and entertainment spending to increase emergency fund contributions.`,
      `Automate a recurring $500 monthly transfer into your high-yield savings account on payday.`,
      `Review recurring subscriptions to cancel underutilized digital services.`,
    ];

    const healthScore = Math.min(Math.max(Math.round(Number(savingsRate) * 2.5 + (hasOverbudget ? 30 : 50)), 40), 98);

    return {
      summary: `In the past 30 days, ${data.userName} generated a total income of $${data.totalIncome.toFixed(
        2
      )} against total expenses of $${data.totalExpenses.toFixed(
        2
      )}. This resulted in a net surplus of $${data.netSavings.toFixed(
        2
      )} (a ${savingsRate}% savings rate). ${
        hasOverbudget
          ? `Attention is recommended for ${data.overbudgetCategories.length} categories that exceeded target limits.`
          : 'All tracked categories remained within target parameters.'
      }`,
      keyHighlights: highlights,
      anomalies,
      actionItems,
      healthScore,
    };
  }
}
