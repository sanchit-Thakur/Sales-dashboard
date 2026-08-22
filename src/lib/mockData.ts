import {
  Brand,
  Product,
  TimeSeriesPoint,
  KPIOverview,
  ExecutiveInsights,
  ForecastResult,
  SimulationResult,
  CustomerSegment,
  MarketBasketItem,
  AnomalyItem
} from '@/types/sales';

export const MOCK_BRANDS: Brand[] = [
  {
    id: "AuraTech",
    name: "AuraTech",
    category: "Consumer Electronics & Smart Devices",
    description: "Premium smart home hubs, AI laptops, spatial earbuds, and IoT hardware ecosystem.",
    color: "#06b6d4",
    logoIcon: "Cpu",
    established: 2019,
    grossRevenue: 8420000,
    netRevenue: 8150000,
    grossProfit: 4320000,
    profitMargin: 53.01,
    unitsSold: 28400,
    orderCount: 22100,
    avgOrderValue: 368.78,
    marketShare: 33.51,
    yoyGrowth: 24.8,
    cac: 42.50,
    ltv: 495.00,
    csat: 4.72,
    productCount: 8
  },
  {
    id: "NovaStyle",
    name: "NovaStyle",
    category: "Modern Apparel & Activewear",
    description: "Performance athleisure, smart tech fabrics, all-weather jackets, and eco-luxury wear.",
    color: "#8b5cf6",
    logoIcon: "Shirt",
    established: 2020,
    grossRevenue: 4980000,
    netRevenue: 4790000,
    grossProfit: 3120000,
    profitMargin: 65.14,
    unitsSold: 41200,
    orderCount: 26500,
    avgOrderValue: 180.75,
    marketShare: 19.69,
    yoyGrowth: 31.4,
    cac: 28.20,
    ltv: 310.00,
    csat: 4.65,
    productCount: 8
  },
  {
    id: "ApexLiving",
    name: "ApexLiving",
    category: "Home & Ergonomic Living",
    description: "Dual-motor standing desks, contour ergonomic chairs, robotic cleanbots, and smart appliances.",
    color: "#10b981",
    logoIcon: "Home",
    established: 2021,
    grossRevenue: 5210000,
    netRevenue: 5040000,
    grossProfit: 2680000,
    profitMargin: 53.17,
    unitsSold: 16800,
    orderCount: 13900,
    avgOrderValue: 362.59,
    marketShare: 20.72,
    yoyGrowth: 19.5,
    cac: 54.00,
    ltv: 580.00,
    csat: 4.81,
    productCount: 8
  },
  {
    id: "VitalisHealth",
    name: "VitalisHealth",
    category: "Wellness & Bio-Nutrition",
    description: "Organic nootropics, adaptogen superfoods, cold plunge recovery, and percussive therapy.",
    color: "#f59e0b",
    logoIcon: "Activity",
    established: 2022,
    grossRevenue: 3480000,
    netRevenue: 3390000,
    grossProfit: 2460000,
    profitMargin: 72.57,
    unitsSold: 48900,
    orderCount: 29800,
    avgOrderValue: 113.76,
    marketShare: 13.94,
    yoyGrowth: 46.2,
    cac: 19.80,
    ltv: 245.00,
    csat: 4.88,
    productCount: 8
  },
  {
    id: "PulseAudio",
    name: "PulseAudio",
    category: "Acoustic & Studio Gear",
    description: "Master reference studio monitors, planar magnetic headphones, and wireless surround bars.",
    color: "#ec4899",
    logoIcon: "Headphones",
    established: 2020,
    grossRevenue: 3122781,
    netRevenue: 2950748,
    grossProfit: 1417530,
    profitMargin: 48.04,
    unitsSold: 12380,
    orderCount: 9780,
    avgOrderValue: 301.71,
    marketShare: 12.14,
    yoyGrowth: 15.6,
    cac: 48.00,
    ltv: 420.00,
    csat: 4.79,
    productCount: 8
  }
];

export const MOCK_PRODUCTS: Product[] = [
  // AuraTech
  {
    id: "AT-101",
    brand: "AuraTech",
    name: "Aura UltraBook Pro 15",
    category: "Laptops",
    basePrice: 1499.00,
    unitCost: 920.00,
    grossRevenue: 3125000,
    netRevenue: 3020000,
    grossProfit: 1165000,
    profitMargin: 38.58,
    unitsSold: 2085,
    avgOrderValue: 1448.44,
    priceElasticity: -1.35,
    rating: 4.85,
    returnRate: 2.1,
    inventoryTurnover: 8.4,
    sparkline: [210, 240, 260, 255, 290, 310, 340, 360, 390, 420, 480, 520],
    regionalDistribution: [
      { region: "North America", units: 1040, revenue: 1508000 },
      { region: "Europe", units: 580, revenue: 841000 },
      { region: "Asia-Pacific", units: 340, revenue: 493000 },
      { region: "Latin America", units: 85, revenue: 123250 },
      { region: "Middle East & Africa", units: 40, revenue: 54750 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 980, revenue: 1421000 },
      { channel: "Amazon Enterprise", units: 625, revenue: 906250 },
      { channel: "Retail Flagship Stores", units: 310, revenue: 449500 },
      { channel: "B2B Wholesale", units: 170, revenue: 243250 }
    ]
  },
  {
    id: "AT-102",
    brand: "AuraTech",
    name: "Aura Hub Max Smart Display",
    category: "Smart Home",
    basePrice: 229.00,
    unitCost: 110.00,
    grossRevenue: 1380000,
    netRevenue: 1335000,
    grossProfit: 692000,
    profitMargin: 51.84,
    unitsSold: 6020,
    avgOrderValue: 221.76,
    priceElasticity: -1.15,
    rating: 4.70,
    returnRate: 2.8,
    inventoryTurnover: 12.1,
    sparkline: [420, 450, 480, 510, 490, 530, 580, 610, 640, 670, 720, 780],
    regionalDistribution: [
      { region: "North America", units: 2890, revenue: 641580 },
      { region: "Europe", units: 1680, revenue: 372960 },
      { region: "Asia-Pacific", units: 960, revenue: 213120 },
      { region: "Latin America", units: 310, revenue: 68820 },
      { region: "Middle East & Africa", units: 180, revenue: 38520 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 2710, revenue: 601620 },
      { channel: "Amazon Enterprise", units: 2100, revenue: 466200 },
      { channel: "Retail Flagship Stores", units: 850, revenue: 188700 },
      { channel: "B2B Wholesale", units: 360, revenue: 78480 }
    ]
  },
  {
    id: "AT-103",
    brand: "AuraTech",
    name: "Aura ANC Spatial Earbuds",
    category: "Audio",
    basePrice: 199.00,
    unitCost: 75.00,
    grossRevenue: 1720000,
    netRevenue: 1665000,
    grossProfit: 1035000,
    profitMargin: 62.16,
    unitsSold: 8640,
    avgOrderValue: 192.71,
    priceElasticity: -1.45,
    rating: 4.78,
    returnRate: 3.4,
    inventoryTurnover: 14.5,
    sparkline: [560, 620, 680, 710, 740, 790, 830, 890, 940, 990, 1120, 1250],
    regionalDistribution: [
      { region: "North America", units: 4100, revenue: 791300 },
      { region: "Europe", units: 2420, revenue: 467060 },
      { region: "Asia-Pacific", units: 1410, revenue: 272130 },
      { region: "Latin America", units: 450, revenue: 86850 },
      { region: "Middle East & Africa", units: 260, revenue: 47660 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 3950, revenue: 762350 },
      { channel: "Amazon Enterprise", units: 3100, revenue: 598300 },
      { channel: "Retail Flagship Stores", units: 1190, revenue: 229670 },
      { channel: "B2B Wholesale", units: 400, revenue: 74680 }
    ]
  },
  {
    id: "AT-104",
    brand: "AuraTech",
    name: "Aura Watch Series X",
    category: "Wearables",
    basePrice: 349.00,
    unitCost: 160.00,
    grossRevenue: 1240000,
    netRevenue: 1205000,
    grossProfit: 651000,
    profitMargin: 54.02,
    unitsSold: 3550,
    avgOrderValue: 339.44,
    priceElasticity: -1.25,
    rating: 4.82,
    returnRate: 2.3,
    inventoryTurnover: 9.8,
    sparkline: [240, 270, 290, 310, 320, 340, 360, 390, 420, 450, 510, 560],
    regionalDistribution: [
      { region: "North America", units: 1680, revenue: 571200 },
      { region: "Europe", units: 1010, revenue: 343400 },
      { region: "Asia-Pacific", units: 580, revenue: 197200 },
      { region: "Latin America", units: 170, revenue: 57800 },
      { region: "Middle East & Africa", units: 110, revenue: 35400 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 1720, revenue: 584800 },
      { channel: "Amazon Enterprise", units: 1180, revenue: 401200 },
      { channel: "Retail Flagship Stores", units: 480, revenue: 163200 },
      { channel: "B2B Wholesale", units: 170, revenue: 55800 }
    ]
  },
  {
    id: "AT-105",
    brand: "AuraTech",
    name: "Aura Pad Pro 12.9 Tablet",
    category: "Tablets",
    basePrice: 899.00,
    unitCost: 490.00,
    grossRevenue: 955000,
    netRevenue: 925000,
    grossProfit: 421000,
    profitMargin: 45.51,
    unitsSold: 1060,
    avgOrderValue: 872.64,
    priceElasticity: -1.30,
    rating: 4.69,
    returnRate: 2.7,
    inventoryTurnover: 6.9,
    sparkline: [75, 80, 85, 90, 92, 98, 105, 112, 118, 125, 140, 155],
    regionalDistribution: [
      { region: "North America", units: 510, revenue: 445230 },
      { region: "Europe", units: 290, revenue: 253170 },
      { region: "Asia-Pacific", units: 170, revenue: 148410 },
      { region: "Latin America", units: 55, revenue: 48015 },
      { region: "Middle East & Africa", units: 35, revenue: 30175 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 520, revenue: 454480 },
      { channel: "Amazon Enterprise", units: 340, revenue: 296820 },
      { channel: "Retail Flagship Stores", units: 140, revenue: 122220 },
      { channel: "B2B Wholesale", units: 60, revenue: 51480 }
    ]
  },

  // NovaStyle
  {
    id: "NS-201",
    brand: "NovaStyle",
    name: "Nova Tech-Fleece Bomber",
    category: "Jackets",
    basePrice: 189.00,
    unitCost: 55.00,
    grossRevenue: 1320000,
    netRevenue: 1265000,
    grossProfit: 897000,
    profitMargin: 70.91,
    unitsSold: 6980,
    avgOrderValue: 181.23,
    priceElasticity: -1.40,
    rating: 4.75,
    returnRate: 4.8,
    inventoryTurnover: 15.2,
    sparkline: [480, 520, 560, 590, 610, 640, 690, 740, 810, 890, 1020, 1180],
    regionalDistribution: [
      { region: "North America", units: 3350, revenue: 607350 },
      { region: "Europe", units: 2150, revenue: 389750 },
      { region: "Asia-Pacific", units: 980, revenue: 177380 },
      { region: "Latin America", units: 320, revenue: 57920 },
      { region: "Middle East & Africa", units: 180, revenue: 32600 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 3850, revenue: 698050 },
      { channel: "Amazon Enterprise", units: 1890, revenue: 342690 },
      { channel: "Retail Flagship Stores", units: 940, revenue: 170440 },
      { channel: "B2B Wholesale", units: 300, revenue: 53820 }
    ]
  },
  {
    id: "NS-202",
    brand: "NovaStyle",
    name: "Nova AeroStretch Joggers",
    category: "Pants",
    basePrice: 88.00,
    unitCost: 24.00,
    grossRevenue: 1180000,
    netRevenue: 1140000,
    grossProfit: 829000,
    profitMargin: 72.72,
    unitsSold: 13410,
    avgOrderValue: 85.01,
    priceElasticity: -1.60,
    rating: 4.62,
    returnRate: 5.2,
    inventoryTurnover: 18.6,
    sparkline: [920, 990, 1060, 1110, 1150, 1220, 1310, 1420, 1530, 1680, 1890, 2100],
    regionalDistribution: [
      { region: "North America", units: 6420, revenue: 545700 },
      { region: "Europe", units: 4160, revenue: 353600 },
      { region: "Asia-Pacific", units: 1910, revenue: 162350 },
      { region: "Latin America", units: 620, revenue: 52700 },
      { region: "Middle East & Africa", units: 300, revenue: 25650 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 7520, revenue: 639200 },
      { channel: "Amazon Enterprise", units: 3920, revenue: 333200 },
      { channel: "Retail Flagship Stores", units: 1480, revenue: 125800 },
      { channel: "B2B Wholesale", units: 490, revenue: 41800 }
    ]
  },
  {
    id: "NS-204",
    brand: "NovaStyle",
    name: "Nova Seamless Training Tee",
    category: "Tops",
    basePrice: 48.00,
    unitCost: 12.00,
    grossRevenue: 980000,
    netRevenue: 945000,
    grossProfit: 709000,
    profitMargin: 75.03,
    unitsSold: 20410,
    avgOrderValue: 46.30,
    priceElasticity: -1.75,
    rating: 4.70,
    returnRate: 3.9,
    inventoryTurnover: 22.4,
    sparkline: [1420, 1510, 1600, 1680, 1750, 1850, 1960, 2110, 2280, 2460, 2740, 3020],
    regionalDistribution: [
      { region: "North America", units: 9800, revenue: 453740 },
      { region: "Europe", units: 6320, revenue: 292616 },
      { region: "Asia-Pacific", units: 2910, revenue: 134733 },
      { region: "Latin America", units: 940, revenue: 43522 },
      { region: "Middle East & Africa", units: 440, revenue: 20389 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 11450, revenue: 530135 },
      { channel: "Amazon Enterprise", units: 6120, revenue: 283356 },
      { channel: "Retail Flagship Stores", units: 2160, revenue: 100008 },
      { channel: "B2B Wholesale", units: 680, revenue: 31501 }
    ]
  },

  // ApexLiving
  {
    id: "AL-301",
    brand: "ApexLiving",
    name: "Apex Motion Ergo Desk V2",
    category: "Furniture",
    basePrice: 699.00,
    unitCost: 330.00,
    grossRevenue: 2180000,
    netRevenue: 2110000,
    grossProfit: 1113000,
    profitMargin: 52.75,
    unitsSold: 3120,
    avgOrderValue: 676.28,
    priceElasticity: -1.10,
    rating: 4.88,
    returnRate: 1.8,
    inventoryTurnover: 7.2,
    sparkline: [210, 225, 240, 250, 265, 280, 295, 315, 340, 370, 410, 460],
    regionalDistribution: [
      { region: "North America", units: 1620, revenue: 1095600 },
      { region: "Europe", units: 890, revenue: 601640 },
      { region: "Asia-Pacific", units: 420, revenue: 283920 },
      { region: "Latin America", units: 120, revenue: 81120 },
      { region: "Middle East & Africa", units: 70, revenue: 47720 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 1590, revenue: 1075300 },
      { channel: "Amazon Enterprise", units: 880, revenue: 595100 },
      { channel: "Retail Flagship Stores", units: 410, revenue: 277200 },
      { channel: "B2B Wholesale", units: 240, revenue: 162400 }
    ]
  },
  {
    id: "AL-302",
    brand: "ApexLiving",
    name: "Apex Contour Ergonomic Chair",
    category: "Furniture",
    basePrice: 489.00,
    unitCost: 210.00,
    grossRevenue: 1750000,
    netRevenue: 1690000,
    grossProfit: 964000,
    profitMargin: 57.04,
    unitsSold: 3580,
    avgOrderValue: 472.07,
    priceElasticity: -1.20,
    rating: 4.84,
    returnRate: 2.1,
    inventoryTurnover: 8.5,
    sparkline: [240, 260, 280, 290, 305, 320, 340, 365, 395, 430, 480, 530],
    regionalDistribution: [
      { region: "North America", units: 1860, revenue: 878000 },
      { region: "Europe", units: 1020, revenue: 481440 },
      { region: "Asia-Pacific", units: 480, revenue: 226560 },
      { region: "Latin America", units: 140, revenue: 66080 },
      { region: "Middle East & Africa", units: 80, revenue: 37920 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 1820, revenue: 859100 },
      { channel: "Amazon Enterprise", units: 1010, revenue: 476800 },
      { channel: "Retail Flagship Stores", units: 490, revenue: 231300 },
      { channel: "B2B Wholesale", units: 260, revenue: 122800 }
    ]
  },

  // VitalisHealth
  {
    id: "VH-401",
    brand: "VitalisHealth",
    name: "Vitalis Peak Focus Nootropic",
    category: "Supplements",
    basePrice: 54.00,
    unitCost: 11.00,
    grossRevenue: 1120000,
    netRevenue: 1095000,
    grossProfit: 867000,
    profitMargin: 79.18,
    unitsSold: 20740,
    avgOrderValue: 52.79,
    priceElasticity: -0.85,
    rating: 4.91,
    returnRate: 1.1,
    inventoryTurnover: 28.5,
    sparkline: [1350, 1440, 1530, 1610, 1700, 1810, 1940, 2090, 2260, 2450, 2710, 3010],
    regionalDistribution: [
      { region: "North America", units: 10990, revenue: 580150 },
      { region: "Europe", units: 5810, revenue: 306710 },
      { region: "Asia-Pacific", units: 2690, revenue: 141990 },
      { region: "Latin America", units: 810, revenue: 42760 },
      { region: "Middle East & Africa", units: 440, revenue: 23390 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 12450, revenue: 657110 },
      { channel: "Amazon Enterprise", units: 5810, revenue: 306710 },
      { channel: "Retail Flagship Stores", units: 1820, revenue: 96070 },
      { channel: "B2B Wholesale", units: 660, revenue: 35110 }
    ]
  },
  {
    id: "VH-402",
    brand: "VitalisHealth",
    name: "Vitalis Organic Greens & Adaptogens",
    category: "Nutrition",
    basePrice: 68.00,
    unitCost: 15.00,
    grossRevenue: 1250000,
    netRevenue: 1215000,
    grossProfit: 947000,
    profitMargin: 77.94,
    unitsSold: 18380,
    avgOrderValue: 66.10,
    priceElasticity: -0.90,
    rating: 4.87,
    returnRate: 1.3,
    inventoryTurnover: 25.4,
    sparkline: [1180, 1260, 1340, 1420, 1510, 1600, 1720, 1850, 1990, 2150, 2380, 2640],
    regionalDistribution: [
      { region: "North America", units: 9740, revenue: 644020 },
      { region: "Europe", units: 5150, revenue: 340410 },
      { region: "Asia-Pacific", units: 2390, revenue: 157970 },
      { region: "Latin America", units: 720, revenue: 47580 },
      { region: "Middle East & Africa", units: 380, revenue: 25020 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 11020, revenue: 728420 },
      { channel: "Amazon Enterprise", units: 5150, revenue: 340410 },
      { channel: "Retail Flagship Stores", units: 1610, revenue: 106420 },
      { channel: "B2B Wholesale", units: 600, revenue: 39750 }
    ]
  },

  // PulseAudio
  {
    id: "PA-501",
    brand: "PulseAudio",
    name: "Pulse Master Reference Studio Monitors",
    category: "Studio Monitors",
    basePrice: 599.00,
    unitCost: 240.00,
    grossRevenue: 1480000,
    netRevenue: 1395000,
    grossProfit: 801000,
    profitMargin: 57.42,
    unitsSold: 2470,
    avgOrderValue: 564.78,
    priceElasticity: -1.15,
    rating: 4.92,
    returnRate: 1.9,
    inventoryTurnover: 6.8,
    sparkline: [160, 175, 185, 195, 205, 215, 230, 245, 265, 290, 320, 355],
    regionalDistribution: [
      { region: "North America", units: 1280, revenue: 722920 },
      { region: "Europe", units: 690, revenue: 389700 },
      { region: "Asia-Pacific", units: 320, revenue: 180730 },
      { region: "Latin America", units: 110, revenue: 62125 },
      { region: "Middle East & Africa", units: 70, revenue: 39525 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 1260, revenue: 711620 },
      { channel: "Amazon Enterprise", units: 690, revenue: 389700 },
      { channel: "Retail Flagship Stores", units: 370, revenue: 208970 },
      { channel: "B2B Wholesale", units: 150, revenue: 84710 }
    ]
  },
  {
    id: "PA-502",
    brand: "PulseAudio",
    name: "Pulse Planar Magnetic Open-Back",
    category: "Headphones",
    basePrice: 449.00,
    unitCost: 170.00,
    grossRevenue: 980000,
    netRevenue: 925000,
    grossProfit: 575000,
    profitMargin: 62.16,
    unitsSold: 2180,
    avgOrderValue: 424.31,
    priceElasticity: -1.25,
    rating: 4.86,
    returnRate: 2.2,
    inventoryTurnover: 8.1,
    sparkline: [140, 150, 160, 170, 180, 190, 205, 220, 235, 255, 280, 310],
    regionalDistribution: [
      { region: "North America", units: 1130, revenue: 479475 },
      { region: "Europe", units: 610, revenue: 258830 },
      { region: "Asia-Pacific", units: 280, revenue: 118805 },
      { region: "Latin America", units: 100, revenue: 42430 },
      { region: "Middle East & Africa", units: 60, revenue: 25460 }
    ],
    channelDistribution: [
      { channel: "Direct D2C Website", units: 1110, revenue: 470980 },
      { channel: "Amazon Enterprise", units: 610, revenue: 258830 },
      { channel: "Retail Flagship Stores", units: 330, revenue: 140020 },
      { channel: "B2B Wholesale", units: 130, revenue: 55170 }
    ]
  }
];

export const MOCK_MONTHLY_TIME_SERIES: TimeSeriesPoint[] = [
  { date: "2023-01", netRevenue: 480000, grossRevenue: 495000, grossProfit: 268000, unitsSold: 2850, orders: 2200, marginPct: 55.83, auratechRevenue: 160000, novastyleRevenue: 95000, apexlivingRevenue: 102000, vitalishealthRevenue: 68000, pulseaudioRevenue: 55000 },
  { date: "2023-02", netRevenue: 510000, grossRevenue: 528000, grossProfit: 285000, unitsSold: 3020, orders: 2340, marginPct: 55.88, auratechRevenue: 172000, novastyleRevenue: 101000, apexlivingRevenue: 108000, vitalishealthRevenue: 71000, pulseaudioRevenue: 58000 },
  { date: "2023-03", netRevenue: 545000, grossRevenue: 562000, grossProfit: 305000, unitsSold: 3240, orders: 2510, marginPct: 55.96, auratechRevenue: 183000, novastyleRevenue: 107000, apexlivingRevenue: 114000, vitalishealthRevenue: 77000, pulseaudioRevenue: 64000 },
  { date: "2023-04", netRevenue: 530000, grossRevenue: 549000, grossProfit: 296000, unitsSold: 3150, orders: 2430, marginPct: 55.85, auratechRevenue: 178000, novastyleRevenue: 104000, apexlivingRevenue: 110000, vitalishealthRevenue: 76000, pulseaudioRevenue: 62000 },
  { date: "2023-05", netRevenue: 565000, grossRevenue: 584000, grossProfit: 316000, unitsSold: 3380, orders: 2600, marginPct: 55.93, auratechRevenue: 189000, novastyleRevenue: 111000, apexlivingRevenue: 118000, vitalishealthRevenue: 81000, pulseaudioRevenue: 66000 },
  { date: "2023-06", netRevenue: 620000, grossRevenue: 642000, grossProfit: 347000, unitsSold: 3710, orders: 2850, marginPct: 55.97, auratechRevenue: 208000, novastyleRevenue: 122000, apexlivingRevenue: 129000, vitalishealthRevenue: 88000, pulseaudioRevenue: 73000 },
  { date: "2023-07", netRevenue: 635000, grossRevenue: 658000, grossProfit: 356000, unitsSold: 3800, orders: 2920, marginPct: 56.06, auratechRevenue: 213000, novastyleRevenue: 125000, apexlivingRevenue: 132000, vitalishealthRevenue: 90000, pulseaudioRevenue: 75000 },
  { date: "2023-08", netRevenue: 590000, grossRevenue: 611000, grossProfit: 330000, unitsSold: 3530, orders: 2710, marginPct: 55.93, auratechRevenue: 198000, novastyleRevenue: 116000, apexlivingRevenue: 123000, vitalishealthRevenue: 84000, pulseaudioRevenue: 69000 },
  { date: "2023-09", netRevenue: 615000, grossRevenue: 637000, grossProfit: 344000, unitsSold: 3680, orders: 2830, marginPct: 55.93, auratechRevenue: 206000, novastyleRevenue: 121000, apexlivingRevenue: 128000, vitalishealthRevenue: 88000, pulseaudioRevenue: 72000 },
  { date: "2023-10", netRevenue: 650000, grossRevenue: 673000, grossProfit: 364000, unitsSold: 3890, orders: 2990, marginPct: 56.00, auratechRevenue: 218000, novastyleRevenue: 128000, apexlivingRevenue: 135000, vitalishealthRevenue: 93000, pulseaudioRevenue: 76000 },
  { date: "2023-11", netRevenue: 880000, grossRevenue: 924000, grossProfit: 491000, unitsSold: 5410, orders: 4050, marginPct: 55.80, auratechRevenue: 295000, novastyleRevenue: 173000, apexlivingRevenue: 182000, vitalishealthRevenue: 125000, pulseaudioRevenue: 105000 },
  { date: "2023-12", netRevenue: 995000, grossRevenue: 1045000, grossProfit: 554000, unitsSold: 6120, orders: 4580, marginPct: 55.68, auratechRevenue: 334000, novastyleRevenue: 196000, apexlivingRevenue: 206000, vitalishealthRevenue: 141000, pulseaudioRevenue: 118000 },

  // 2024
  { date: "2024-01", netRevenue: 610000, grossRevenue: 630000, grossProfit: 341000, unitsSold: 3620, orders: 2800, marginPct: 55.90, auratechRevenue: 204000, novastyleRevenue: 120000, apexlivingRevenue: 126000, vitalishealthRevenue: 87000, pulseaudioRevenue: 73000 },
  { date: "2024-02", netRevenue: 645000, grossRevenue: 668000, grossProfit: 361000, unitsSold: 3840, orders: 2970, marginPct: 55.97, auratechRevenue: 216000, novastyleRevenue: 127000, apexlivingRevenue: 134000, vitalishealthRevenue: 92000, pulseaudioRevenue: 76000 },
  { date: "2024-03", netRevenue: 690000, grossRevenue: 712000, grossProfit: 386000, unitsSold: 4110, orders: 3170, marginPct: 55.94, auratechRevenue: 231000, novastyleRevenue: 136000, apexlivingRevenue: 143000, vitalishealthRevenue: 98000, pulseaudioRevenue: 82000 },
  { date: "2024-04", netRevenue: 675000, grossRevenue: 698000, grossProfit: 377000, unitsSold: 4020, orders: 3100, marginPct: 55.85, auratechRevenue: 226000, novastyleRevenue: 133000, apexlivingRevenue: 140000, vitalishealthRevenue: 96000, pulseaudioRevenue: 80000 },
  { date: "2024-05", netRevenue: 720000, grossRevenue: 745000, grossProfit: 403000, unitsSold: 4300, orders: 3310, marginPct: 55.97, auratechRevenue: 241000, novastyleRevenue: 142000, apexlivingRevenue: 149000, vitalishealthRevenue: 103000, pulseaudioRevenue: 85000 },
  { date: "2024-06", netRevenue: 790000, grossRevenue: 818000, grossProfit: 442000, unitsSold: 4720, orders: 3630, marginPct: 55.95, auratechRevenue: 265000, novastyleRevenue: 156000, apexlivingRevenue: 164000, vitalishealthRevenue: 112000, pulseaudioRevenue: 93000 },
  { date: "2024-07", netRevenue: 810000, grossRevenue: 839000, grossProfit: 454000, unitsSold: 4850, orders: 3730, marginPct: 56.05, auratechRevenue: 271000, novastyleRevenue: 160000, apexlivingRevenue: 168000, vitalishealthRevenue: 115000, pulseaudioRevenue: 96000 },
  { date: "2024-08", netRevenue: 755000, grossRevenue: 782000, grossProfit: 422000, unitsSold: 4520, orders: 3470, marginPct: 55.89, auratechRevenue: 253000, novastyleRevenue: 149000, apexlivingRevenue: 156000, vitalishealthRevenue: 107000, pulseaudioRevenue: 90000 },
  { date: "2024-09", netRevenue: 785000, grossRevenue: 813000, grossProfit: 439000, unitsSold: 4700, orders: 3610, marginPct: 55.92, auratechRevenue: 263000, novastyleRevenue: 155000, apexlivingRevenue: 163000, vitalishealthRevenue: 112000, pulseaudioRevenue: 92000 },
  { date: "2024-10", netRevenue: 830000, grossRevenue: 860000, grossProfit: 465000, unitsSold: 4970, orders: 3820, marginPct: 56.02, auratechRevenue: 278000, novastyleRevenue: 164000, apexlivingRevenue: 172000, vitalishealthRevenue: 118000, pulseaudioRevenue: 98000 },
  { date: "2024-11", netRevenue: 1120000, grossRevenue: 1176000, grossProfit: 625000, unitsSold: 6890, orders: 5150, marginPct: 55.80, auratechRevenue: 375000, novastyleRevenue: 221000, apexlivingRevenue: 232000, vitalishealthRevenue: 159000, pulseaudioRevenue: 133000 },
  { date: "2024-12", netRevenue: 1270000, grossRevenue: 1335000, grossProfit: 708000, unitsSold: 7810, orders: 5840, marginPct: 55.75, auratechRevenue: 426000, novastyleRevenue: 250000, apexlivingRevenue: 263000, vitalishealthRevenue: 181000, pulseaudioRevenue: 150000 },

  // 2025
  { date: "2025-01", netRevenue: 780000, grossRevenue: 806000, grossProfit: 436000, unitsSold: 4640, orders: 3590, marginPct: 55.90, auratechRevenue: 261000, novastyleRevenue: 154000, apexlivingRevenue: 162000, vitalishealthRevenue: 111000, pulseaudioRevenue: 92000 },
  { date: "2025-02", netRevenue: 825000, grossRevenue: 854000, grossProfit: 462000, unitsSold: 4910, orders: 3790, marginPct: 56.00, auratechRevenue: 276000, novastyleRevenue: 163000, apexlivingRevenue: 171000, vitalishealthRevenue: 117000, pulseaudioRevenue: 98000 },
  { date: "2025-03", netRevenue: 885000, grossRevenue: 914000, grossProfit: 496000, unitsSold: 5270, orders: 4070, marginPct: 56.05, auratechRevenue: 297000, novastyleRevenue: 174000, apexlivingRevenue: 183000, vitalishealthRevenue: 126000, pulseaudioRevenue: 105000 },
  { date: "2025-04", netRevenue: 865000, grossRevenue: 895000, grossProfit: 483000, unitsSold: 5150, orders: 3980, marginPct: 55.84, auratechRevenue: 290000, novastyleRevenue: 170000, apexlivingRevenue: 179000, vitalishealthRevenue: 123000, pulseaudioRevenue: 103000 },
  { date: "2025-05", netRevenue: 925000, grossRevenue: 957000, grossProfit: 518000, unitsSold: 5520, orders: 4250, marginPct: 56.00, auratechRevenue: 310000, novastyleRevenue: 182000, apexlivingRevenue: 192000, vitalishealthRevenue: 132000, pulseaudioRevenue: 109000 },
  { date: "2025-06", netRevenue: 1015000, grossRevenue: 1051000, grossProfit: 569000, unitsSold: 6060, orders: 4670, marginPct: 56.06, auratechRevenue: 340000, novastyleRevenue: 200000, apexlivingRevenue: 210000, vitalishealthRevenue: 144000, pulseaudioRevenue: 121000 },
  { date: "2025-07", netRevenue: 1040000, grossRevenue: 1077000, grossProfit: 583000, unitsSold: 6220, orders: 4780, marginPct: 56.06, auratechRevenue: 349000, novastyleRevenue: 205000, apexlivingRevenue: 215000, vitalishealthRevenue: 148000, pulseaudioRevenue: 123000 },
  { date: "2025-08", netRevenue: 970000, grossRevenue: 1005000, grossProfit: 542000, unitsSold: 5800, orders: 4460, marginPct: 55.88, auratechRevenue: 325000, novastyleRevenue: 191000, apexlivingRevenue: 201000, vitalishealthRevenue: 138000, pulseaudioRevenue: 115000 },
  { date: "2025-09", netRevenue: 1010000, grossRevenue: 1046000, grossProfit: 565000, unitsSold: 6040, orders: 4650, marginPct: 55.94, auratechRevenue: 339000, novastyleRevenue: 199000, apexlivingRevenue: 209000, vitalishealthRevenue: 144000, pulseaudioRevenue: 119000 },
  { date: "2025-10", netRevenue: 1065000, grossRevenue: 1104000, grossProfit: 597000, unitsSold: 6380, orders: 4900, marginPct: 56.06, auratechRevenue: 357000, novastyleRevenue: 210000, apexlivingRevenue: 221000, vitalishealthRevenue: 151000, pulseaudioRevenue: 126000 },
  { date: "2025-11", netRevenue: 1440000, grossRevenue: 1512000, grossProfit: 804000, unitsSold: 8850, orders: 6620, marginPct: 55.83, auratechRevenue: 483000, novastyleRevenue: 284000, apexlivingRevenue: 298000, vitalishealthRevenue: 205000, pulseaudioRevenue: 170000 },
  { date: "2025-12", netRevenue: 1635000, grossRevenue: 1718000, grossProfit: 911000, unitsSold: 10050, orders: 7520, marginPct: 55.72, auratechRevenue: 548000, novastyleRevenue: 322000, apexlivingRevenue: 339000, vitalishealthRevenue: 233000, pulseaudioRevenue: 193000 }
];

export const MOCK_CUSTOMER_SEGMENTS: CustomerSegment[] = [
  {
    name: "Champions",
    count: 14200,
    percentage: 22.3,
    avgMonetary: 685.40,
    avgRecencyDays: 14,
    avgFrequency: 4.8,
    revenueContribution: 9732680,
    revenueSharePct: 40.02,
    color: "#10b981",
    description: "High-frequency buyers with top basket size and recent transactions. Primary brand advocates."
  },
  {
    name: "Loyal Customers",
    count: 19800,
    percentage: 31.1,
    avgMonetary: 395.20,
    avgRecencyDays: 32,
    avgFrequency: 3.2,
    revenueContribution: 7824960,
    revenueSharePct: 32.17,
    color: "#06b6d4",
    description: "Consistent multi-category purchasers with high brand affinity and low churn propensity."
  },
  {
    name: "Potential Loyalists",
    count: 15900,
    percentage: 25.0,
    avgMonetary: 220.50,
    avgRecencyDays: 45,
    avgFrequency: 1.9,
    revenueContribution: 3505950,
    revenueSharePct: 14.41,
    color: "#8b5cf6",
    description: "Recent buyers with moderate spend. Prime candidates for cross-brand loyalty bundling."
  },
  {
    name: "At-Risk Customers",
    count: 8900,
    percentage: 14.0,
    avgMonetary: 275.80,
    avgRecencyDays: 110,
    avgFrequency: 2.1,
    revenueContribution: 2454620,
    revenueSharePct: 10.09,
    color: "#f59e0b",
    description: "Previously active repeat purchasers whose engagement has declined in the past 90+ days."
  },
  {
    name: "Hibernating",
    count: 4880,
    percentage: 7.6,
    avgMonetary: 165.00,
    avgRecencyDays: 215,
    avgFrequency: 1.2,
    revenueContribution: 802538,
    revenueSharePct: 3.31,
    color: "#ef4444",
    description: "Low-frequency historical buyers needing high-discount win-back campaigns."
  }
];

export const MOCK_MARKET_BASKET: MarketBasketItem[] = [
  {
    itemA: "Aura UltraBook Pro 15",
    brandA: "AuraTech",
    itemB: "Aura ANC Spatial Earbuds",
    brandB: "AuraTech",
    support: 0.185,
    confidence: 0.68,
    lift: 2.45,
    recommendedBundleDiscount: "10% Bundle Discount"
  },
  {
    itemA: "Apex Motion Ergo Desk V2",
    brandA: "ApexLiving",
    itemB: "Apex Contour Ergonomic Chair",
    brandB: "ApexLiving",
    support: 0.224,
    confidence: 0.74,
    lift: 3.12,
    recommendedBundleDiscount: "Free Ergo Mat on Duo Desk Setup"
  },
  {
    itemA: "Nova Tech-Fleece Bomber",
    brandA: "NovaStyle",
    itemB: "Nova AeroStretch Joggers",
    brandB: "NovaStyle",
    support: 0.280,
    confidence: 0.62,
    lift: 2.15,
    recommendedBundleDiscount: "15% Full Tracksuit Pack"
  },
  {
    itemA: "Vitalis Peak Focus Nootropic",
    brandA: "VitalisHealth",
    itemB: "Vitalis Organic Greens",
    brandB: "VitalisHealth",
    support: 0.315,
    confidence: 0.79,
    lift: 2.88,
    recommendedBundleDiscount: "Monthly Morning Ritual Subscription"
  },
  {
    itemA: "Pulse Master Reference Studio Monitors",
    brandA: "PulseAudio",
    itemB: "Pulse Planar Magnetic Open-Back",
    brandB: "PulseAudio",
    support: 0.142,
    confidence: 0.58,
    lift: 2.95,
    recommendedBundleDiscount: "Pro Producer Audio Bundle ($100 off)"
  },
  {
    itemA: "Aura Watch Series X",
    brandA: "AuraTech",
    itemB: "Vitalis HydroSmart Smart Bottle",
    brandB: "VitalisHealth",
    support: 0.118,
    confidence: 0.44,
    lift: 2.10,
    recommendedBundleDiscount: "Cross-Brand BioSync Wellness Pack"
  }
];

export const MOCK_ANOMALIES: AnomalyItem[] = [
  {
    id: "ANOM-2025-11",
    date: "2025-11-28",
    brand: "AuraTech",
    product: "Aura ANC Spatial Earbuds",
    type: "Surge Spike",
    severity: "High",
    metric: "Gross Revenue",
    observedValue: 245000,
    expectedValue: 78000,
    zScore: 3.42,
    rootCause: "Black Friday Flash Viral Promo on Tech TikTok (+214% unit velocity surge)."
  },
  {
    id: "ANOM-2025-08",
    date: "2025-08-14",
    brand: "ApexLiving",
    product: "Apex Motion Ergo Desk V2",
    type: "Supply Dip",
    severity: "Medium",
    metric: "Units Sold",
    observedValue: 12,
    expectedValue: 85,
    zScore: -2.85,
    rootCause: "Component supply chain delay in German motor actuators caused 3-day stockout."
  },
  {
    id: "ANOM-2025-05",
    date: "2025-05-18",
    brand: "VitalisHealth",
    product: "Vitalis Peak Focus Nootropic",
    type: "Influencer Spike",
    severity: "High",
    metric: "Orders",
    observedValue: 890,
    expectedValue: 240,
    zScore: 3.65,
    rootCause: "Podcast endorsement on Joe Rogan / Huberman Lab biohacking segment."
  },
  {
    id: "ANOM-2025-03",
    date: "2025-03-09",
    brand: "NovaStyle",
    product: "Nova All-Weather Rain Parka",
    type: "Weather Surge",
    severity: "Low",
    metric: "Gross Revenue",
    observedValue: 84000,
    expectedValue: 31000,
    zScore: 2.35,
    rootCause: "Late spring atmospheric river storms in Western US driving outerwear demand."
  }
];
