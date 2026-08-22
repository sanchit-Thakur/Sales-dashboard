#!/usr/bin/env python3
"""
OmniSales Enterprise Sales Data Generator
Generates realistic multi-year sales transactions across 5 flagship company brands
with authentic seasonality, pricing elasticity, regional variances, and customer cohorts.
"""

import os
import random
import csv
from datetime import datetime, timedelta

# Output directories
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
os.makedirs(DATA_DIR, exist_ok=True)

BRANDS = [
    {
        "id": "brand-auratech",
        "name": "AuraTech",
        "category": "Consumer Electronics & Smart Devices",
        "description": "Premium smart home hubs, laptops, noise-canceling headphones, and IoT hardware.",
        "color": "#06b6d4"
    },
    {
        "id": "brand-novastyle",
        "name": "NovaStyle",
        "category": "Modern Apparel & Activewear",
        "description": "Performance athleisure, eco-friendly luxury jackets, and smart textile wearables.",
        "color": "#8b5cf6"
    },
    {
        "id": "brand-apexliving",
        "name": "ApexLiving",
        "category": "Home & Ergonomic Living",
        "description": "Ergonomic standing desks, smart air purifiers, robotic cleaners, and designer furniture.",
        "color": "#10b981"
    },
    {
        "id": "brand-vitalishealth",
        "name": "VitalisHealth",
        "category": "Wellness & Bio-Nutrition",
        "description": "Organic superfood blends, smart hydration monitors, nootropics, and recovery gear.",
        "color": "#f59e0b"
    },
    {
        "id": "brand-pulseaudio",
        "name": "PulseAudio",
        "category": "Acoustic & Studio Gear",
        "description": "High-fidelity studio monitors, planar magnetic headphones, and wireless surround sound.",
        "color": "#ec4899"
    }
]

PRODUCTS = [
    # AuraTech
    {"id": "AT-101", "brand": "AuraTech", "name": "Aura UltraBook Pro 15", "category": "Laptops", "base_price": 1499.00, "cost": 920.00, "base_volume": 45, "elasticity": -1.35},
    {"id": "AT-102", "brand": "AuraTech", "name": "Aura Hub Max Smart Display", "category": "Smart Home", "base_price": 229.00, "cost": 110.00, "base_volume": 120, "elasticity": -1.15},
    {"id": "AT-103", "brand": "AuraTech", "name": "Aura ANC Spatial Earbuds", "category": "Audio", "base_price": 199.00, "cost": 75.00, "base_volume": 180, "elasticity": -1.45},
    {"id": "AT-104", "brand": "AuraTech", "name": "Aura Watch Series X", "category": "Wearables", "base_price": 349.00, "cost": 160.00, "base_volume": 110, "elasticity": -1.25},
    {"id": "AT-105", "brand": "AuraTech", "name": "Aura Pad Pro 12.9 Tablet", "category": "Tablets", "base_price": 899.00, "cost": 490.00, "base_volume": 60, "elasticity": -1.30},
    {"id": "AT-106", "brand": "AuraTech", "name": "Aura Smart Thermostat AI", "category": "Smart Home", "base_price": 179.00, "cost": 70.00, "base_volume": 90, "elasticity": -0.95},
    {"id": "AT-107", "brand": "AuraTech", "name": "Aura 4K Webcam HDR", "category": "Accessories", "base_price": 129.00, "cost": 45.00, "base_volume": 140, "elasticity": -1.10},
    {"id": "AT-108", "brand": "AuraTech", "name": "Aura Fast Wireless Dock 65W", "category": "Accessories", "base_price": 79.00, "cost": 22.00, "base_volume": 210, "elasticity": -0.85},

    # NovaStyle
    {"id": "NS-201", "brand": "NovaStyle", "name": "Nova Tech-Fleece Bomber", "category": "Jackets", "base_price": 189.00, "cost": 55.00, "base_volume": 130, "elasticity": -1.40},
    {"id": "NS-202", "brand": "NovaStyle", "name": "Nova AeroStretch Joggers", "category": "Pants", "base_price": 88.00, "cost": 24.00, "base_volume": 240, "elasticity": -1.60},
    {"id": "NS-203", "brand": "NovaStyle", "name": "Nova All-Weather Rain Parka", "category": "Jackets", "base_price": 245.00, "cost": 75.00, "base_volume": 85, "elasticity": -1.20},
    {"id": "NS-204", "brand": "NovaStyle", "name": "Nova Seamless Training Tee", "category": "Tops", "base_price": 48.00, "cost": 12.00, "base_volume": 380, "elasticity": -1.75},
    {"id": "NS-205", "brand": "NovaStyle", "name": "Nova Merino Wool Crewneck", "category": "Knitwear", "base_price": 135.00, "cost": 42.00, "base_volume": 115, "elasticity": -1.15},
    {"id": "NS-206", "brand": "NovaStyle", "name": "Nova Urban Commuter Pack 28L", "category": "Bags", "base_price": 160.00, "cost": 48.00, "base_volume": 95, "elasticity": -1.05},
    {"id": "NS-207", "brand": "NovaStyle", "name": "Nova Compression Tights Pro", "category": "Activewear", "base_price": 72.00, "cost": 18.00, "base_volume": 190, "elasticity": -1.50},
    {"id": "NS-208", "brand": "NovaStyle", "name": "Nova Thermal Reversible Gilet", "category": "Outerwear", "base_price": 140.00, "cost": 39.00, "base_volume": 105, "elasticity": -1.25},

    # ApexLiving
    {"id": "AL-301", "brand": "ApexLiving", "name": "Apex Motion Ergo Desk V2", "category": "Furniture", "base_price": 699.00, "cost": 330.00, "base_volume": 55, "elasticity": -1.10},
    {"id": "AL-302", "brand": "ApexLiving", "name": "Apex Contour Ergonomic Chair", "category": "Furniture", "base_price": 489.00, "cost": 210.00, "base_volume": 75, "elasticity": -1.20},
    {"id": "AL-303", "brand": "ApexLiving", "name": "Apex PureFlow HEPA Air Scrubber", "category": "Appliances", "base_price": 279.00, "cost": 115.00, "base_volume": 110, "elasticity": -1.05},
    {"id": "AL-304", "brand": "ApexLiving", "name": "Apex CleanBot Robotic Mop & Vac", "category": "Appliances", "base_price": 549.00, "cost": 260.00, "base_volume": 65, "elasticity": -1.35},
    {"id": "AL-305", "brand": "ApexLiving", "name": "Apex Lumina Smart Ambient Bar", "category": "Lighting", "base_price": 119.00, "cost": 38.00, "base_volume": 170, "elasticity": -1.45},
    {"id": "AL-306", "brand": "ApexLiving", "name": "Apex HydroSonic Humidifier 5L", "category": "Appliances", "base_price": 139.00, "cost": 46.00, "base_volume": 130, "elasticity": -1.15},
    {"id": "AL-307", "brand": "ApexLiving", "name": "Apex Anti-Fatigue Balance Mat", "category": "Accessories", "base_price": 69.00, "cost": 19.00, "base_volume": 220, "elasticity": -1.00},
    {"id": "AL-308", "brand": "ApexLiving", "name": "Apex Monitor Arm Dual Gas-Spring", "category": "Accessories", "base_price": 149.00, "cost": 52.00, "base_volume": 125, "elasticity": -1.10},

    # VitalisHealth
    {"id": "VH-401", "brand": "VitalisHealth", "name": "Vitalis Peak Focus Nootropic (60ct)", "category": "Supplements", "base_price": 54.00, "cost": 11.00, "base_volume": 320, "elasticity": -0.85},
    {"id": "VH-402", "brand": "VitalisHealth", "name": "Vitalis Organic Greens & Adaptogens", "category": "Nutrition", "base_price": 68.00, "cost": 15.00, "base_volume": 290, "elasticity": -0.90},
    {"id": "VH-403", "brand": "VitalisHealth", "name": "Vitalis HydroSmart Smart Bottle", "category": "Gear", "base_price": 95.00, "cost": 29.00, "base_volume": 160, "elasticity": -1.30},
    {"id": "VH-404", "brand": "VitalisHealth", "name": "Vitalis Deep Recovery Tart Cherry Sleep", "category": "Supplements", "base_price": 46.00, "cost": 9.50, "base_volume": 350, "elasticity": -0.80},
    {"id": "VH-405", "brand": "VitalisHealth", "name": "Vitalis Percussive Massage Gun V4", "category": "Recovery", "base_price": 199.00, "cost": 65.00, "base_volume": 95, "elasticity": -1.40},
    {"id": "VH-406", "brand": "VitalisHealth", "name": "Vitalis Electrolyte Hydration Stix 30pk", "category": "Nutrition", "base_price": 38.00, "cost": 7.00, "base_volume": 440, "elasticity": -0.95},
    {"id": "VH-407", "brand": "VitalisHealth", "name": "Vitalis Infrared Heat Therapy Wrap", "category": "Recovery", "base_price": 149.00, "cost": 48.00, "base_volume": 80, "elasticity": -1.15},
    {"id": "VH-408", "brand": "VitalisHealth", "name": "Vitalis Cold Plunge Tub Inflatable", "category": "Recovery", "base_price": 399.00, "cost": 160.00, "base_volume": 40, "elasticity": -1.25},

    # PulseAudio
    {"id": "PA-501", "brand": "PulseAudio", "name": "Pulse Master Reference Studio Monitors", "category": "Studio Monitors", "base_price": 599.00, "cost": 240.00, "base_volume": 50, "elasticity": -1.15},
    {"id": "PA-502", "brand": "PulseAudio", "name": "Pulse Planar Magnetic Open-Back", "category": "Headphones", "base_price": 449.00, "cost": 170.00, "base_volume": 70, "elasticity": -1.25},
    {"id": "PA-503", "brand": "PulseAudio", "name": "Pulse SoundSphere 360 Spatial Bar", "category": "Home Theater", "base_price": 379.00, "cost": 145.00, "base_volume": 85, "elasticity": -1.35},
    {"id": "PA-504", "brand": "PulseAudio", "name": "Pulse Portable Boom DAC Amp", "category": "Accessories", "base_price": 159.00, "cost": 49.00, "base_volume": 130, "elasticity": -1.10},
    {"id": "PA-505", "brand": "PulseAudio", "name": "Pulse SubBass Subwoofer 10-inch", "category": "Home Theater", "base_price": 329.00, "cost": 120.00, "base_volume": 60, "elasticity": -1.20},
    {"id": "PA-506", "brand": "PulseAudio", "name": "Pulse Broadcast Cardioid Mic", "category": "Microphones", "base_price": 189.00, "cost": 58.00, "base_volume": 115, "elasticity": -1.10},
    {"id": "PA-507", "brand": "PulseAudio", "name": "Pulse Acoustic Wall Absorption Panels 8pk", "category": "Acoustics", "base_price": 99.00, "cost": 28.00, "base_volume": 150, "elasticity": -0.90},
    {"id": "PA-508", "brand": "PulseAudio", "name": "Pulse Wireless DJ Low-Latency Cans", "category": "Headphones", "base_price": 249.00, "cost": 88.00, "base_volume": 90, "elasticity": -1.30}
]

REGIONS = ["North America", "Europe", "Asia-Pacific", "Latin America", "Middle East & Africa"]
REGION_WEIGHTS = [0.44, 0.28, 0.18, 0.06, 0.04]

CHANNELS = ["Direct D2C Website", "Amazon Enterprise", "Retail Flagship Stores", "B2B Wholesale"]
CHANNEL_WEIGHTS = [0.45, 0.32, 0.15, 0.08]

CUSTOMER_SEGMENTS = ["Champions", "Loyal Customers", "Potential Loyalists", "At-Risk", "Hibernating"]
CUSTOMER_WEIGHTS = [0.22, 0.31, 0.25, 0.14, 0.08]


def generate_data():
    random.seed(42)
    start_date = datetime(2023, 1, 1)
    end_date = datetime(2025, 12, 31)
    days_total = (end_date - start_date).days

    # 1. Export Brands and Products Catalog
    catalog_path = os.path.join(DATA_DIR, "brands_and_products.csv")
    with open(catalog_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["product_id", "brand_name", "product_name", "category", "base_price", "unit_cost", "target_margin_pct", "price_elasticity"])
        for p in PRODUCTS:
            margin = round(((p["base_price"] - p["cost"]) / p["base_price"]) * 100, 2)
            writer.writerow([p["id"], p["brand"], p["name"], p["category"], p["base_price"], p["cost"], margin, p["elasticity"]])
    print(f"Product catalog exported to {catalog_path}")

    # 2. Generate Transactions
    transactions_path = os.path.join(DATA_DIR, "sales_transactions.csv")
    print("Generating 50,000 enterprise transaction records...")
    
    with open(transactions_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "order_id", "date", "brand", "product_id", "product_name", "category",
            "unit_price", "unit_cost", "quantity", "gross_revenue", "discount_pct",
            "net_revenue", "gross_profit", "profit_margin_pct", "region", "channel",
            "customer_id", "customer_segment", "rating", "returned"
        ])

        order_counter = 100001
        
        for day_offset in range(days_total):
            curr_date = start_date + timedelta(days=day_offset)
            month = curr_date.month
            day_of_week = curr_date.weekday()

            # Seasonal Multiplier (Q4 peak, Summer bump)
            seasonal_mult = 1.0
            if month in [11, 12]:
                seasonal_mult = 1.65
            elif month in [6, 7]:
                seasonal_mult = 1.15
            elif month in [1, 2]:
                seasonal_mult = 0.85

            weekend_mult = 1.25 if day_of_week in [5, 6] else 1.0
            trend_mult = 1.0 + (day_offset / days_total) * 0.45

            daily_orders_count = int(random.gauss(50, 8) * seasonal_mult * weekend_mult * (trend_mult * 0.8))
            daily_orders_count = max(20, min(daily_orders_count, 130))

            for _ in range(daily_orders_count):
                product = random.choice(PRODUCTS)
                
                qty_rand = random.random()
                if qty_rand < 0.70:
                    qty = 1
                elif qty_rand < 0.90:
                    qty = 2
                elif qty_rand < 0.97:
                    qty = 3
                else:
                    qty = random.randint(4, 8)

                disc_rand = random.random()
                if month in [11, 12] and disc_rand < 0.45:
                    discount_pct = random.choice([10, 15, 20, 25])
                elif disc_rand < 0.20:
                    discount_pct = random.choice([5, 10, 15])
                else:
                    discount_pct = 0.0

                unit_price = product["base_price"]
                unit_cost = product["cost"]
                gross_revenue = round(unit_price * qty, 2)
                net_revenue = round(gross_revenue * (1.0 - (discount_pct / 100.0)), 2)
                total_cost = round(unit_cost * qty, 2)
                gross_profit = round(net_revenue - total_cost, 2)
                profit_margin = round((gross_profit / net_revenue) * 100, 2) if net_revenue > 0 else 0.0

                region = random.choices(REGIONS, weights=REGION_WEIGHTS, k=1)[0]
                channel = random.choices(CHANNELS, weights=CHANNEL_WEIGHTS, k=1)[0]
                customer_segment = random.choices(CUSTOMER_SEGMENTS, weights=CUSTOMER_WEIGHTS, k=1)[0]
                customer_id = f"CUST-{random.randint(1000, 9999)}"

                rating = random.choices([5, 4, 3, 2, 1], weights=[0.60, 0.25, 0.09, 0.04, 0.02], k=1)[0]
                returned = random.random() < (0.08 if rating <= 2 else 0.02)

                order_id = f"ORD-{order_counter}"
                order_counter += 1

                writer.writerow([
                    order_id,
                    curr_date.strftime("%Y-%m-%d"),
                    product["brand"],
                    product["id"],
                    product["name"],
                    product["category"],
                    unit_price,
                    unit_cost,
                    qty,
                    gross_revenue,
                    discount_pct,
                    net_revenue,
                    gross_profit,
                    profit_margin,
                    region,
                    channel,
                    customer_id,
                    customer_segment,
                    rating,
                    "Yes" if returned else "No"
                ])

    print(f"Generated {order_counter - 100001} records in {transactions_path}")


if __name__ == "__main__":
    generate_data()
