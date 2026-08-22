import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OmniSales DS-Studio | Enterprise Multi-Brand Sales & ML Dashboard',
  description: 'Professional Data Science platform analyzing and forecasting sales across every company brand and product SKU with time-series ML, RFM customer cohorts, and price elasticity simulation.',
  keywords: ['Sales Dashboard', 'Data Science', 'Machine Learning', 'Time Series Forecasting', 'Price Elasticity', 'RFM Segmentation', 'Next.js', 'Recharts'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080c14] text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
