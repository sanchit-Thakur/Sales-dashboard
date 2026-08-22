'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/dashboard/Navbar';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { ExecutiveKPIs } from '@/components/dashboard/ExecutiveKPIs';
import { ExecutiveInsightsCard } from '@/components/dashboard/ExecutiveInsightsCard';
import { BrandComparisonCharts } from '@/components/dashboard/BrandComparisonCharts';
import { ProductPerformanceStudio } from '@/components/dashboard/ProductPerformanceStudio';
import { MLForecastStudio } from '@/components/dashboard/MLForecastStudio';
import { WhatIfSimulator } from '@/components/dashboard/WhatIfSimulator';
import { CustomerRFMStudio } from '@/components/dashboard/CustomerRFMStudio';
import { MarketBasketStudio } from '@/components/dashboard/MarketBasketStudio';
import { AnomalyDetectionStudio } from '@/components/dashboard/AnomalyDetectionStudio';
import { DataScienceNotebookView } from '@/components/dashboard/DataScienceNotebookView';
import { ProductDetailModal } from '@/components/dashboard/ProductDetailModal';

import {
  Brand,
  Product,
  TimeSeriesPoint,
  KPIOverview,
  ExecutiveInsights
} from '@/types/sales';
import { fetchOverview, fetchBrands, fetchProducts } from '@/lib/api';

export default function SalesDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedChannel, setSelectedChannel] = useState<string>('All Channels');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [kpis, setKpis] = useState<KPIOverview | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [insights, setInsights] = useState<ExecutiveInsights | null>(null);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [brandData, overviewData, productList] = await Promise.all([
        fetchBrands(),
        fetchOverview(selectedBrand),
        fetchProducts({ brand: selectedBrand, category: selectedCategory, search: searchQuery })
      ]);

      setBrands(brandData);
      setKpis(overviewData.kpis);
      setTimeSeries(overviewData.timeSeries);
      setInsights(overviewData.insights);
      setProducts(productList);
      setLoading(false);
    }

    loadData();
  }, [selectedBrand, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedRegion('All Regions');
    setSelectedChannel('All Channels');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        brands={brands}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Global Filter Bar */}
        <FilterBar
          brands={brands}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          selectedChannel={selectedChannel}
          onSelectChannel={setSelectedChannel}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onReset={handleResetFilters}
        />

        {/* Executive KPI Ribbon (Always visible at top) */}
        {kpis && (
          <ExecutiveKPIs kpis={kpis} selectedBrand={selectedBrand} />
        )}

        {/* Tab 1: Executive Portfolio Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* AI Executive Intelligence Card */}
            {insights && (
              <ExecutiveInsightsCard insights={insights} selectedBrand={selectedBrand} />
            )}

            {/* Brand Comparison Charts */}
            <BrandComparisonCharts
              brands={brands}
              timeSeries={timeSeries}
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
            />

            {/* Top Products Quick Preview & Graph Studio */}
            <ProductPerformanceStudio
              products={products}
              selectedBrand={selectedBrand}
              onSelectProduct={setSelectedProductModal}
            />

            {/* Outlier & Anomaly Detection */}
            <AnomalyDetectionStudio />
          </div>
        )}

        {/* Tab 2: Product Sales Studio (Visualizing sales of every product per brand) */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ProductPerformanceStudio
              products={products}
              selectedBrand={selectedBrand}
              onSelectProduct={setSelectedProductModal}
            />
            <DataScienceNotebookView />
          </div>
        )}

        {/* Tab 3: Machine Learning Time-Series Forecasting */}
        {activeTab === 'forecast' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <MLForecastStudio selectedBrand={selectedBrand} />
            <AnomalyDetectionStudio />
          </div>
        )}

        {/* Tab 4: What-If Price Elasticity & Scenario Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <WhatIfSimulator products={products} selectedBrand={selectedBrand} />
          </div>
        )}

        {/* Tab 5: Customer RFM Cohorts & Market Basket Affinities */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <CustomerRFMStudio />
            <MarketBasketStudio />
          </div>
        )}

      </main>

      {/* Product Detail Deep-Dive Modal */}
      <ProductDetailModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 OmniSales DS-Studio — Enterprise Multi-Brand & Product Data Science Analytics</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>5 Brands Portfolio</span>
            <span>•</span>
            <span>40+ Products (SKUs)</span>
            <span>•</span>
            <span>63,680 Transactions</span>
            <span>•</span>
            <span>Holt-Winters ML Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
