import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { env } from '../../config/env.js';
import { RiskTolerance } from '@prisma/client';

export interface InvestmentStrategyResult {
  monthlySurplus: number;
  riskProfile: RiskTolerance;
  allocation: {
    stocksPct: number;
    bondsPct: number;
    cashPct: number;
    cryptoPct: number;
  };
  recommendedPortfolio: Array<{ assetClass: string; percentage: number; tickerExamples: string }>;
  reasoning: string;
}

export class InvestmentAgent {
  static async generateSuggestions(
    monthlySurplus: number,
    riskProfile: RiskTolerance
  ): Promise<InvestmentStrategyResult> {
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY !== 'mock-openai-key') {
      try {
        const model = new ChatOpenAI({
          modelName: 'gpt-4o',
          temperature: 0.2,
          openAIApiKey: env.OPENAI_API_KEY,
        });

        const prompt = PromptTemplate.fromTemplate(
          `You are a quantitative wealth management advisor.
Generate an optimal monthly investment allocation strategy for a user with:
Monthly Surplus Cash: $${monthlySurplus}
Risk Tolerance Profile: {riskProfile}

Return JSON with:
"allocation": object with ("stocksPct", "bondsPct", "cashPct", "cryptoPct") summing to 100
"recommendedPortfolio": array of objects ("assetClass", "percentage", "tickerExamples")
"reasoning": string (explanation of asset allocation math and risk management)`
        );

        const chain = prompt.pipe(model);
        const response = await chain.invoke({
          riskProfile,
        });

        const parsed = JSON.parse(response.content as string);
        return {
          monthlySurplus,
          riskProfile,
          allocation: parsed.allocation,
          recommendedPortfolio: parsed.recommendedPortfolio,
          reasoning: parsed.reasoning,
        };
      } catch (err) {
        console.warn('⚠️ Investment Agent LLM fallback triggered:', (err as Error).message);
      }
    }

    // Modern Portfolio Theory (MPT) Rule Engine Allocation
    let allocation = { stocksPct: 60, bondsPct: 25, cashPct: 10, cryptoPct: 5 };

    if (riskProfile === RiskTolerance.CONSERVATIVE) {
      allocation = { stocksPct: 35, bondsPct: 45, cashPct: 20, cryptoPct: 0 };
    } else if (riskProfile === RiskTolerance.AGGRESSIVE) {
      allocation = { stocksPct: 75, bondsPct: 10, cashPct: 5, cryptoPct: 10 };
    }

    const portfolio = [
      {
        assetClass: 'Broad Market Equity Index Funds',
        percentage: allocation.stocksPct,
        tickerExamples: 'VTI (Vanguard Total Stock), VOO (S&P 500 ETF), VXUS (International)',
      },
      {
        assetClass: 'Fixed Income & Government Bonds',
        percentage: allocation.bondsPct,
        tickerExamples: 'BND (Vanguard Total Bond), TLT (20+ Yr Treasury)',
      },
      {
        assetClass: 'High-Yield Liquidity & Cash Reserves',
        percentage: allocation.cashPct,
        tickerExamples: 'Marcus HYSA (4.4% APY), SPAXX Money Market',
      },
    ];

    if (allocation.cryptoPct > 0) {
      portfolio.push({
        assetClass: 'Alternative Innovation Assets',
        percentage: allocation.cryptoPct,
        tickerExamples: 'IBIT (iShares Bitcoin Trust), ETH',
      });
    }

    return {
      monthlySurplus,
      riskProfile,
      allocation,
      recommendedPortfolio: portfolio,
      reasoning: `Based on your ${riskProfile} risk tolerance and monthly surplus of $${monthlySurplus.toFixed(
        2
      )}, this portfolio balances steady capital appreciation with yield preservation using low-expense ratio index funds and high-yield cash reserves.`,
    };
  }
}
