-- ====================================================================
-- TYLICIOUS GRILLZ: DYNAMIC LOCATION-GROUPED DELIVERY PRICING
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ====================================================================

-- 1. Create delivery_settings table
CREATE TABLE IF NOT EXISTS public.delivery_settings (
    id SERIAL PRIMARY KEY,
    restaurant_name TEXT NOT NULL DEFAULT 'Tylicious Grillz',
    restaurant_address TEXT NOT NULL DEFAULT 'Meadow Road, DA11 7LR, Gravesend',
    restaurant_postcode TEXT NOT NULL DEFAULT 'DA11 7LR',
    restaurant_lat NUMERIC(9,6) NOT NULL DEFAULT 51.4414,
    restaurant_lng NUMERIC(9,6) NOT NULL DEFAULT 0.3708,
    max_delivery_distance_miles NUMERIC(6,2) NOT NULL DEFAULT 25.0,
    distance_unit TEXT NOT NULL DEFAULT 'miles',
    currency TEXT NOT NULL DEFAULT 'GBP',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create delivery_pricing_rules table
CREATE TABLE IF NOT EXISTS public.delivery_pricing_rules (
    id SERIAL PRIMARY KEY,
    rule_name TEXT NOT NULL,
    zone_code TEXT,
    min_distance_miles NUMERIC(6,2) NOT NULL DEFAULT 0,
    max_distance_miles NUMERIC(6,2) NOT NULL DEFAULT 25.0,
    fee_gbp NUMERIC(10,2) NOT NULL,
    per_mile_fee_gbp NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    pricing_type TEXT NOT NULL DEFAULT 'zone' CHECK (pricing_type IN ('band', 'per_mile', 'zone')),
    postcode_prefixes TEXT, -- Comma-separated UK outward codes, e.g. 'DA11, DA12'
    coverage_areas TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add columns if table already existed without them
ALTER TABLE public.delivery_pricing_rules ADD COLUMN IF NOT EXISTS postcode_prefixes TEXT;
ALTER TABLE public.delivery_pricing_rules ADD COLUMN IF NOT EXISTS coverage_areas TEXT;

-- 3. Safely add delivery tracking columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_distance_miles NUMERIC(6,2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_distance_unit TEXT DEFAULT 'miles';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_rule_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_latitude NUMERIC(9,6);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_longitude NUMERIC(9,6);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_postcode TEXT;

-- 4. Enable Row Level Security (RLS) on newly created tables
ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_pricing_rules ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Allow public customers (anon and authenticated) to read active settings and pricing rules
DROP POLICY IF EXISTS "Public read active delivery settings" ON public.delivery_settings;
CREATE POLICY "Public read active delivery settings"
    ON public.delivery_settings
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Public read active delivery pricing rules" ON public.delivery_pricing_rules;
CREATE POLICY "Public read active delivery pricing rules"
    ON public.delivery_pricing_rules
    FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Only service_role can INSERT, UPDATE, or DELETE pricing rules and settings
-- (service_role automatically bypasses RLS, so no public write policies are granted)

-- 6. Insert default restaurant settings (if none exists)
INSERT INTO public.delivery_settings (
    restaurant_name,
    restaurant_address,
    restaurant_postcode,
    restaurant_lat,
    restaurant_lng,
    max_delivery_distance_miles,
    distance_unit,
    currency,
    is_active
)
SELECT
    'Tylicious Grillz',
    'Meadow Road, DA11 7LR, Gravesend',
    'DA11 7LR',
    51.4414,
    0.3708,
    25.0,
    'miles',
    'GBP',
    true
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_settings);

-- 7. Seed Location-Grouped UK Postcode Delivery Zones (GBP £)
-- NOTE: Client can update fee_gbp or covered postcodes anytime via Supabase Dashboard

-- Zone 1: Local Gravesend & Northfleet (DA11, DA12)
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
SELECT 
    'Zone 1: Local Gravesend & Northfleet', 'ZONE_1_LOCAL', 0, 3, 3.50, 0.00, 'zone', 'DA11, DA12', 'Gravesend, Northfleet, Chalk, Shorne, Singlewell', 'Local delivery across Gravesend & Northfleet', true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_pricing_rules WHERE zone_code = 'ZONE_1_LOCAL');

-- Zone 2: Ebbsfleet, Swanscombe & Greenhithe (DA9, DA10)
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
SELECT 
    'Zone 2: Ebbsfleet, Swanscombe & Greenhithe', 'ZONE_2_EBBSFLEET', 3, 6, 5.00, 0.00, 'zone', 'DA9, DA10', 'Ebbsfleet Valley, Swanscombe, Greenhithe, Bluewater', 'Ebbsfleet, Swanscombe & Greenhithe', true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_pricing_rules WHERE zone_code = 'ZONE_2_EBBSFLEET');

-- Zone 3: Dartford, Bexley & Medway West (DA1, DA2, DA4, DA5, ME1, ME2, ME3)
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
SELECT 
    'Zone 3: Dartford, Bexley & Medway West', 'ZONE_3_DARTFORD_MEDWAY_WEST', 6, 10, 7.50, 0.00, 'zone', 'DA1, DA2, DA4, DA5, ME1, ME2, ME3', 'Dartford, Crayford, Wilmington, Bexley, Rochester, Strood, Hoo Peninsula', 'Dartford, Bexley village, Rochester & Strood', true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_pricing_rules WHERE zone_code = 'ZONE_3_DARTFORD_MEDWAY_WEST');

-- Zone 4: Medway Towns, Outer Kent & SE London
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
SELECT 
    'Zone 4: Medway Towns, Outer Kent & SE London', 'ZONE_4_MEDWAY_SE_LONDON', 10, 15, 10.00, 0.00, 'zone', 'DA6, DA7, DA8, DA14, DA15, DA16, DA17, ME4, ME5, ME7, ME8, BR1, BR2, BR5, BR6, BR7, BR8, SE2, SE9, SE18, SE28', 'Chatham, Gillingham, Rainham, Bexleyheath, Sidcup, Welling, Erith, Bromley, Abbey Wood, Thamesmead, Woolwich, Eltham', 'Medway Towns, Bromley, Bexleyheath & South-East London', true, 4
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_pricing_rules WHERE zone_code = 'ZONE_4_MEDWAY_SE_LONDON');

-- Zone 5: Extended London, Kent & Essex (Thurrock / Grays)
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
SELECT 
    'Zone 5: Extended London, Kent & Essex (Thurrock)', 'ZONE_5_EXTENDED', 15, 25, 15.00, 0.00, 'zone', 'ME14, ME15, ME16, ME19, ME20, TN13, TN14, TN15, RM16, RM17, RM18, RM19, RM20, SE3, SE10, SE12, SE13, E6, E16, IG11', 'Maidstone, Aylesford, West Malling, Sevenoaks, Grays, Thurrock, Tilbury, Greenwich, Lewisham, Beckton, Barking', 'Maidstone, Sevenoaks, Thurrock/Grays & Greater East/SE London', true, 5
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_pricing_rules WHERE zone_code = 'ZONE_5_EXTENDED');
