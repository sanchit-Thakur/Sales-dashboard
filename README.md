# 🚀 FinAI | AI Personal Finance Advisor

An AI-powered personal finance platform designed to help users track expenses, analyze spending patterns, set dynamic monthly budgets, predict future trends, and receive context-aware personalized financial advice.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui, Recharts.
- **Backend**: Node.js, Express.js (TypeScript).
- **Database & ORM**: PostgreSQL 16, Prisma ORM.
- **Infrastructure & Caching**: Docker Compose (PostgreSQL 16 & Redis 7), Redis (IORedis caching & rate-limiting).
- **AI Integrations**: OpenAI GPT-4o / GPT-5.5, LangChain (Categorization Agent, Monthly Report Generator, Spending Prediction Engine, RAG Advisor Chatbot, Investment Allocator).
- **Third-Party APIs**: Plaid API (or Mock Banking Engine), Exchange Rate API (multi-currency).

---

## 🏗️ Architecture & Folder Structure

```
.
├── docker-compose.yml          # Docker composition for PostgreSQL & Redis
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma DB Models (User, Account, Transaction, Budget, Goal, Chat)
│   │   └── seed.ts             # Seed script for 6-month historical financial data
│   └── src/
│       ├── index.ts            # Express server initialization
│       ├── config/             # Environment, Database, Redis setup
│       ├── middleware/         # Auth, Rate-limiting, Error handling
│       ├── services/           # Plaid, ExchangeRate, Redis, and LangChain AI Agents
│       ├── controllers/        # Auth, Transaction, Budget, Goal, AI, Investment controllers
│       └── routes/             # Express API routes
└── frontend/
    └── src/
        ├── app/                # Next.js App Router (dashboard, transactions, budgets, goals, advisor, investments)
        ├── components/         # Layout (Sidebar, Navbar), Recharts visuals, UI elements
        └── lib/                # API Client & helpers
```

---

## ⚡ Quick Start & Execution

### 1. Spin up PostgreSQL & Redis via Docker
```bash
docker-compose up -d
```

### 2. Setup Backend & Seed Database
```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 3. Setup & Run Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🌟 Features Implemented

1. **Centralized Dashboard**: Net worth aggregation, cash flow area charts (Recharts), category outlays, and milestone trackers.
2. **Automatic Expense Categorization**: Plaid sync pipeline connected to AI classifier with confidence scores.
3. **Smart Budget Planner**: Visual category meters with alert thresholds (>80% warning, >100% overbudget).
4. **Spending Predictions**: 6-month weighted historical trend forecasting.
5. **AI Financial Advisor Chatbot**: LangChain RAG pipeline retrieving user's exact balance, budget, and transaction context.
6. **Monthly AI Reports**: Structured natural-language performance summary, key achievements, and action steps.
7. **Investment Allocations**: Risk-adjusted portfolio asset distribution (Stocks, Bonds, Cash, Crypto).
