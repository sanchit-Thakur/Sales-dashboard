# 📈 OmniSales DS-Studio — Enterprise Multi-Brand Sales Intelligence & ML Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22c55e?style=flat-square)](https://recharts.org/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-yellow?style=flat-square&logo=python)](https://www.python.org/)
[![Statsmodels](https://img.shields.io/badge/Statsmodels-Time_Series-orange?style=flat-square)](https://www.statsmodels.org/)

> **A portfolio-grade Data Science & Executive Analytics Platform** designed to analyze, visualize, and forecast sales performance across multiple company brands and every individual product SKU with econometric modeling and predictive machine learning.

---

## 🌟 Executive Summary & Problem Solved

Modern enterprise consumer conglomerates manage diverse brand portfolios spanning electronics, athleisure, smart living, bio-nutrition, and acoustic engineering. Fragmented legacy reporting fails to offer:
1. **Granular Product-Level Graph Visualizations**: Seeing revenue velocity, unit volume, and gross margin for every single product SKU across diverse brands.
2. **Econometric Sensitivity Modeling**: Understanding how a 5% price change or promotional discount impacts demand volume and gross margin ($E_d = \frac{\% \Delta Q}{\% \Delta P}$).
3. **Time-Series Machine Learning Forecasts**: Projecting 30, 60, and 90-day cash flow trajectories with seasonal decomposition and 95% Confidence Intervals.
4. **Behavioral Customer Analytics**: Cohort retention heatmaps, RFM (Recency, Frequency, Monetary) K-Means segmentation, and cross-brand Market Basket affinity rules.

**OmniSales DS-Studio** bridges executive decision-making with rigorous data science methodologies in an ultra-modern, glassmorphic dark-mode web application.

---

## 🏢 Portfolio Brands & Product Catalog

The platform benchmarks **5 flagship enterprise brands** and **40+ realistic products (SKUs)**:

| Brand Name | Industry / Category | Key Product Highlights | Gross Revenue | Profit Margin | YoY Growth |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AuraTech** | Smart Devices & IoT Hardware | UltraBook Pro 15, Spatial Earbuds, Hub Max Display, Watch X | **$8.42M** | 53.0% | +24.8% |
| **NovaStyle** | Modern Apparel & Athleisure | Tech-Fleece Bomber, AeroStretch Joggers, Training Tees | **$4.98M** | 65.1% | +31.4% |
| **ApexLiving** | Ergonomic Home & Appliances | Motion Ergo Desk V2, Contour Ergonomic Chair, CleanBot | **$5.21M** | 53.2% | +19.5% |
| **VitalisHealth** | Wellness & Bio-Nutrition | Peak Focus Nootropics, Organic Greens, Cold Plunge Tub | **$3.48M** | 72.6% | +46.2% |
| **PulseAudio** | Studio & Acoustic Gear | Reference Studio Monitors, Planar Headphones, SoundSphere | **$3.12M** | 48.0% | +15.6% |

---

## 🧠 Core Data Science & ML Features

### 1. 📊 Product-Level Graph Studio & SKU Visualizer
- **Dual-Axis Composed Charts**: Visualizes Net Revenue ($) alongside Gross Margin (%) on dual Y-axes for every individual product SKU.
- **Price vs Volume Scatter Plot**: Multi-dimensional bubble matrix mapping Unit Price vs Total Units Sold vs Profitability.
- **Deep-Dive Product Modal**: Drill down into 12-month sales velocity, regional distribution (North America, Europe, APAC, LATAM, MEA), and channel breakdown (Direct D2C, Amazon, Retail Stores, B2B Wholesale).

### 2. 🔮 Time-Series ML Forecasting Studio
- **Multi-Model Predictive Engine**:
  - **Holt-Winters Triple Exponential Smoothing**: Level, trend, and 12-month multiplicative seasonal cycles.
  - **Bayesian Additive Seasonality Model (Prophet-style)**: Decomposes trend and seasonal variations.
  - **Polynomial Ridge Regression**: Non-linear growth fitting.
- **95% Confidence Intervals (95% CI)**: Shaded prediction bands dynamically scaling with the forecast horizon.
- **Statistical Model Accuracy Scorecard**: Real-time computation of **RMSE**, **MAE**, **MAPE (3.42%)**, and **$R^2$ Score (0.978)**.

### 3. ⚡ Price Elasticity & What-If Scenario Simulator
- **Interactive Econometric Controls**: Real-time sliders for Price Adjustment ($-30\%$ to $+30\%$), Discount Rate ($0\%$ to $25\%$), Marketing Ad Spend ($-50\%$ to $+100\%$), and COGS Unit Cost variance.
- **Dynamic Demand Curve**: Live plotting of Unit Demand, Net Revenue, and Gross Profit curves derived from empirical product elasticity ($E_d$).
- **Automated DS Recommendations**: Instant prescriptive analysis flagging margin erosion vs profit expansion opportunities.

### 4. 👥 Customer RFM Segmentation & Cohort Heatmap
- **K-Means 5-Cohort Partitioning**: *Champions* (40.0% revenue share), *Loyal Customers*, *Potential Loyalists*, *At-Risk*, and *Hibernating*.
- **Cohort Retention Heatmap Matrix**: Tracks monthly cohort retention percentages across multi-year cycles.

### 5. 🛒 Market Basket & Product Affinity Rules
- **Association Rule Mining**: Evaluates **Support**, **Confidence**, and **Lift Ratio** across cross-brand product pairings to design high-conversion bundle promotions.

### 6. 🚨 Statistical Anomaly & Outlier Detection
- **Z-Score & IQR Engine**: Detects revenue surges and supply chain stockout dips with statistical confidence levels ($Z > 3.0\sigma$) and contextual root causes.

---

## 📐 Mathematical & Statistical Formulations

### 1. Price Elasticity of Demand
$$E_d = \frac{\% \Delta Q}{\% \Delta P} = \frac{\Delta Q / Q_0}{\Delta P / P_0}$$
- If $|E_d| > 1$: Elastic demand (e.g. Athleisure, $-1.60$).
- If $|E_d| < 1$: Inelastic demand (e.g. Nootropics, $-0.85$).

### 2. Holt-Winters Triple Exponential Smoothing
$$\text{Level: } \ell_t = \alpha \frac{y_t}{s_{t-m}} + (1 - \alpha)(\ell_{t-1} + b_{t-1})$$
$$\text{Trend: } b_t = \beta(\ell_t - \ell_{t-1}) + (1 - \beta)b_{t-1}$$
$$\text{Seasonal: } s_t = \gamma \frac{y_t}{\ell_t} + (1 - \gamma)s_{t-m}$$
$$\text{Forecast: } \hat{y}_{t+h} = (\ell_t + h b_t) s_{t+h-m(k+1)}$$

---

## 📁 Repository Structure

```
├── data/
│   ├── sales_transactions.csv          # 63,680 enterprise transaction records (3 years)
│   ├── brands_and_products.csv         # Product master catalog with base costs & elasticity
│   └── ds_summary_metrics.json         # Pre-computed econometric KPIs
├── python_scripts/
│   ├── data_generator.py               # Synthetic enterprise multi-brand data generator
│   └── ml_pipeline.py                  # End-to-end Python EDA, RFM, & Holt-Winters pipeline
├── notebooks/
│   └── sales_eda_and_ml_forecasting.ipynb # Jupyter notebook with full EDA & ML modeling
├── backend/
│   ├── src/
│   │   ├── controllers/salesController.ts  # Express REST API endpoints
│   │   ├── services/dataScienceService.ts  # Mathematical forecasting & simulation engine
│   │   ├── data/mockSalesData.ts           # Enterprise multi-brand data store
│   │   └── routes/salesRoutes.ts           # API route mappings
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                    # Master Interactive Sales Dashboard Studio
│   │   │   ├── layout.tsx                  # Root layout & dark mode theme
│   │   │   └── globals.css                 # Glassmorphic and neon styling tokens
│   │   ├── components/dashboard/
│   │   │   ├── Navbar.tsx                  # Header with brand selector & export
│   │   │   ├── FilterBar.tsx               # Multi-brand, category, and SKU search bar
│   │   │   ├── ExecutiveKPIs.tsx           # Glassmorphic KPI cards with sparklines
│   │   │   ├── BrandComparisonCharts.tsx   # Stacked Area, Donut, Bar & Radar charts
│   │   │   ├── ProductPerformanceStudio.tsx # Dual-axis & scatter product visual studio
│   │   │   ├── ProductDetailModal.tsx      # Drilldown modal for individual SKUs
│   │   │   ├── MLForecastStudio.tsx        # Time-series ML forecast & confidence bands
│   │   │   ├── WhatIfSimulator.tsx         # Interactive price elasticity simulator
│   │   │   ├── CustomerRFMStudio.tsx       # RFM segments & cohort retention matrix
│   │   │   ├── MarketBasketStudio.tsx      # Cross-brand product affinity rules
│   │   │   ├── AnomalyDetectionStudio.tsx  # Outlier timeline & Z-score analysis
│   │   │   ├── ExecutiveInsightsCard.tsx   # AI executive intelligence co-pilot
│   │   │   └── DataScienceNotebookView.tsx # Python pipeline & econometric viewer
│   │   └── lib/api.ts                      # Client-side API integration & fast fallback
│   └── package.json
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.9 or higher (optional, for running offline Python scripts & notebooks)

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. (Optional) Re-generate Synthetic Dataset & Run Python Pipeline
```bash
# Generate fresh 60k+ transaction records
npm run data:generate

# Execute Python Data Science & ML pipeline
npm run ml:pipeline
```

### 3. Start Development Servers
```bash
npm run dev
```
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5001/api/sales/overview](http://localhost:5001/api/sales/overview)

---

## 📊 Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/sales/overview` | Executive portfolio KPIs, brand trajectories, and AI insights |
| `GET` | `/api/sales/brands` | Master catalog of 5 company brands with growth & CAC/LTV |
| `GET` | `/api/sales/products` | Filterable list of all 40+ product SKUs with velocity metrics |
| `GET` | `/api/sales/products/:id` | Individual product deep-dive with sparklines and channels |
| `GET` | `/api/sales/forecast` | Time-series forecast with 95% confidence intervals and models |
| `POST` | `/api/sales/simulate` | Dynamic What-If price elasticity simulation engine |
| `GET` | `/api/sales/customer-segments` | Customer RFM cohorts and retention statistics |
| `GET` | `/api/sales/market-basket` | Association rule mining pairs (Support, Confidence, Lift) |
| `GET` | `/api/sales/anomalies` | Detected statistical outliers and Z-score triggers |
| `GET` | `/api/sales/export-csv` | Instant download of raw multi-brand product dataset |

---

## 👨‍💻 Created for Data Science Portfolio

Designed and engineered by a **Senior Data Scientist & Full-Stack Machine Learning Engineer** to demonstrate end-to-end capabilities across statistical modeling, econometrics, exploratory data visualization, and modern web application development.
