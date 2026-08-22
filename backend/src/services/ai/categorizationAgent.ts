import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { env } from '../../config/env.js';

export interface CategorizationResult {
  category: string;
  confidenceScore: number;
  isRecurring: boolean;
  reasoning: string;
}

export class CategorizationAgent {
  private static categories = [
    'Housing',
    'Utilities & Bills',
    'Groceries',
    'Dining & Restaurants',
    'Transportation',
    'Entertainment & Leisure',
    'Shopping',
    'Subscriptions',
    'Health & Fitness',
    'Income',
    'Uncategorized',
  ];

  static async categorizeTransaction(
    merchantName: string,
    rawDescription: string,
    amount: number
  ): Promise<CategorizationResult> {
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY !== 'mock-openai-key') {
      try {
        const model = new ChatOpenAI({
          modelName: 'gpt-4o',
          temperature: 0.1,
          openAIApiKey: env.OPENAI_API_KEY,
        });

        const prompt = PromptTemplate.fromTemplate(
          `You are an expert AI financial transaction classifier.
Categorize the following bank transaction into exactly one of these allowed categories:
{categories}

Transaction Details:
Merchant: {merchantName}
Raw Description: {rawDescription}
Amount: ${amount}

Respond strictly in JSON format with the keys:
"category": string (must match one of the allowed categories)
"confidenceScore": number (between 0.0 and 1.0)
"isRecurring": boolean
"reasoning": string`
        );

        const chain = prompt.pipe(model);
        const response = await chain.invoke({
          categories: this.categories.join(', '),
          merchantName,
          rawDescription: rawDescription || merchantName,
        });

        const parsed = JSON.parse(response.content as string);
        return {
          category: parsed.category || 'Uncategorized',
          confidenceScore: parsed.confidenceScore || 0.9,
          isRecurring: Boolean(parsed.isRecurring),
          reasoning: parsed.reasoning || 'Categorized via GPT-4o LLM',
        };
      } catch (err) {
        console.warn('⚠️ Categorization LLM fallback triggered:', (err as Error).message);
      }
    }

    // Heuristic & Rule-based NLP fallback engine
    const text = `${merchantName} ${rawDescription}`.toLowerCase();

    if (text.includes('rent') || text.includes('mortgage') || text.includes('apartment')) {
      return { category: 'Housing', confidenceScore: 0.98, isRecurring: true, reasoning: 'Matched housing patterns' };
    }
    if (text.includes('payroll') || text.includes('deposit') || amount < 0) {
      return { category: 'Income', confidenceScore: 0.99, isRecurring: true, reasoning: 'Income or credit entry' };
    }
    if (text.includes('market') || text.includes('grocery') || text.includes('trader joe') || text.includes('whole foods')) {
      return { category: 'Groceries', confidenceScore: 0.95, isRecurring: false, reasoning: 'Grocery store keyword match' };
    }
    if (text.includes('netflix') || text.includes('spotify') || text.includes('hulu') || text.includes('sub')) {
      return { category: 'Subscriptions', confidenceScore: 0.96, isRecurring: true, reasoning: 'Subscription service match' };
    }
    if (text.includes('uber eats') || text.includes('starbucks') || text.includes('chipotle') || text.includes('restaurant')) {
      return { category: 'Dining & Restaurants', confidenceScore: 0.94, isRecurring: false, reasoning: 'Dining pattern match' };
    }
    if (text.includes('uber') || text.includes('lyft') || text.includes('shell') || text.includes('gas') || text.includes('transit')) {
      return { category: 'Transportation', confidenceScore: 0.92, isRecurring: false, reasoning: 'Transit/Fuel match' };
    }
    if (text.includes('coned') || text.includes('electric') || text.includes('water') || text.includes('utility')) {
      return { category: 'Utilities & Bills', confidenceScore: 0.95, isRecurring: true, reasoning: 'Utility bill match' };
    }
    if (text.includes('apple') || text.includes('target') || text.includes('amazon')) {
      return { category: 'Shopping', confidenceScore: 0.90, isRecurring: false, reasoning: 'Retail shopping match' };
    }

    return { category: 'Uncategorized', confidenceScore: 0.70, isRecurring: false, reasoning: 'Default categorization' };
  }
}
