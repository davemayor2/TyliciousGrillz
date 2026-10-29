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
    max_delivery_distance_miles NUMERIC(6,2) NOT NULL DEFAULT 35.0,
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
    max_distance_miles NUMERIC(6,2) NOT NULL DEFAULT 35.0,
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

-- Create unique index on zone_code for safe upserts
CREATE UNIQUE INDEX IF NOT EXISTS delivery_pricing_rules_zone_code_idx ON public.delivery_pricing_rules (zone_code);

-- 3. Safely add delivery tracking columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_distance_miles NUMERIC(6,2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_distance_unit TEXT DEFAULT 'miles';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_rule_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_latitude NUMERIC(9,6);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_longitude NUMERIC(9,6);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_postcode TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_duration_minutes INT;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_pricing_rules ENABLE ROW LEVEL SECURITY;

-- 5. Create Public Read Policies (Allow checkout / cart to fetch delivery rules)
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

-- 6. Insert default restaurant settings (if none exists, or update radius to 35 miles)
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
    35.0,
    'miles',
    'GBP',
    true
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_settings);

UPDATE public.delivery_settings 
SET max_delivery_distance_miles = 35.0 
WHERE max_delivery_distance_miles < 35.0;

-- 7. Seed / Upsert Location-Grouped UK Postcode Delivery Zones (GBP £)

-- Zone 1: Local Gravesend & Northfleet (DA11, DA12)
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
VALUES (
    'Zone 1: Local Gravesend & Northfleet', 'ZONE_1_LOCAL', 0, 3, 3.50, 0.00, 'zone', 'DA11, DA12', 'Gravesend, Northfleet, Chalk, Shorne, Singlewell', 'Local delivery across Gravesend & Northfleet', true, 1
)
ON CONFLICT (zone_code) DO UPDATE SET
    rule_name = EXCLUDED.rule_name,
    fee_gbp = EXCLUDED.fee_gbp,
    postcode_prefixes = EXCLUDED.postcode_prefixes,
    coverage_areas = EXCLUDED.coverage_areas,
    min_distance_miles = EXCLUDED.min_distance_miles,
    max_distance_miles = EXCLUDED.max_distance_miles;

-- Zone 2: Ebbsfleet, Swanscombe & Greenhithe (DA9, DA10)
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
VALUES (
    'Zone 2: Ebbsfleet, Swanscombe & Greenhithe', 'ZONE_2_EBBSFLEET', 3, 6, 5.00, 0.00, 'zone', 'DA9, DA10', 'Ebbsfleet Valley, Swanscombe, Greenhithe, Bluewater', 'Ebbsfleet, Swanscombe & Greenhithe', true, 2
)
ON CONFLICT (zone_code) DO UPDATE SET
    rule_name = EXCLUDED.rule_name,
    fee_gbp = EXCLUDED.fee_gbp,
    postcode_prefixes = EXCLUDED.postcode_prefixes,
    coverage_areas = EXCLUDED.coverage_areas,
    min_distance_miles = EXCLUDED.min_distance_miles,
    max_distance_miles = EXCLUDED.max_distance_miles;

-- Zone 3: Dartford, Bexley & Medway West (DA1, DA2, DA4, DA5, ME1, ME2, ME3)
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
VALUES (
    'Zone 3: Dartford, Bexley & Medway West', 'ZONE_3_DARTFORD_MEDWAY_WEST', 6, 10, 7.50, 0.00, 'zone', 'DA1, DA2, DA4, DA5, ME1, ME2, ME3', 'Dartford, Crayford, Wilmington, Bexley, Rochester, Strood, Hoo Peninsula', 'Dartford, Bexley village, Rochester & Strood', true, 3
)
ON CONFLICT (zone_code) DO UPDATE SET
    rule_name = EXCLUDED.rule_name,
    fee_gbp = EXCLUDED.fee_gbp,
    postcode_prefixes = EXCLUDED.postcode_prefixes,
    coverage_areas = EXCLUDED.coverage_areas,
    min_distance_miles = EXCLUDED.min_distance_miles,
    max_distance_miles = EXCLUDED.max_distance_miles;

-- Zone 4: Medway Towns, Outer Kent & SE London Borders
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
VALUES (
    'Zone 4: Medway Towns, Outer Kent & SE London Borders', 'ZONE_4_MEDWAY_SE_LONDON', 10, 15, 10.00, 0.00, 'zone', 'DA6, DA7, DA8, DA14, DA15, DA16, DA17, ME4, ME5, ME7, ME8, BR1, BR2, BR5, BR6, BR7, BR8, SE2, SE9, SE18, SE28', 'Chatham, Gillingham, Rainham (Kent), Bexleyheath, Sidcup, Welling, Erith, Bromley, Abbey Wood, Thamesmead, Woolwich, Eltham', 'Medway Towns, Bromley, Bexleyheath & South-East London borders', true, 4
)
ON CONFLICT (zone_code) DO UPDATE SET
    rule_name = EXCLUDED.rule_name,
    fee_gbp = EXCLUDED.fee_gbp,
    postcode_prefixes = EXCLUDED.postcode_prefixes,
    coverage_areas = EXCLUDED.coverage_areas,
    min_distance_miles = EXCLUDED.min_distance_miles,
    max_distance_miles = EXCLUDED.max_distance_miles;

-- Zone 5: Inner London Borders, South Essex & Mid Kent
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
VALUES (
    'Zone 5: Inner London Borders, South Essex & Mid Kent', 
    'ZONE_5_INNER_LONDON_ESSEX_MID_KENT', 
    15, 25, 15.00, 0.00, 'zone', 
    'ME14, ME15, ME16, ME19, ME20, TN13, TN14, TN15, BR3, BR4, RM13, RM14, RM15, RM16, RM17, RM18, RM19, RM20, SS17, SE3, SE6, SE7, SE8, SE10, SE12, SE13, SE14, E6, E13, E14, E16, IG11', 
    'Maidstone, Sevenoaks, Grays, Tilbury, Purfleet, South Ockendon, Rainham (Essex), Aveley, Stanford-le-Hope, Greenwich, Lewisham, Blackheath, Charlton, Deptford, Catford, New Cross, Canary Wharf, Canning Town, Plaistow, Beckton, Barking', 
    'Maidstone, Sevenoaks, Thurrock/Grays, Canary Wharf, Greenwich, Barking & South Essex', 
    true, 5
)
ON CONFLICT (zone_code) DO UPDATE SET
    rule_name = EXCLUDED.rule_name,
    fee_gbp = EXCLUDED.fee_gbp,
    postcode_prefixes = EXCLUDED.postcode_prefixes,
    coverage_areas = EXCLUDED.coverage_areas,
    min_distance_miles = EXCLUDED.min_distance_miles,
    max_distance_miles = EXCLUDED.max_distance_miles;

-- Clean up deprecated ZONE_5_EXTENDED if present
DELETE FROM public.delivery_pricing_rules WHERE zone_code = 'ZONE_5_EXTENDED';

-- Zone 6: Wider London & Essex County
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
VALUES (
    'Zone 6: Wider London & Essex County', 
    'ZONE_6_WIDER_LONDON_ESSEX', 
    25, 35, 20.00, 0.00, 'zone', 
    'E1, E2, E3, E7, E8, E9, E10, E11, E12, E15, E17, E18, E20, SE1, SE4, SE5, SE11, SE15, SE16, SE17, SE19, SE20, SE21, SE22, SE23, SE24, SE25, SE26, SE27, CR0, CR2, CR7, CR8, RM1, RM2, RM3, RM4, RM5, RM6, RM7, RM8, RM9, RM10, RM11, RM12, IG1, IG2, IG3, IG4, IG5, IG6, IG7, IG8, CM11, CM12, CM13, CM14, CM15, SS0, SS1, SS2, SS3, SS7, SS8, SS9, SS11, SS12, SS13, SS14, SS15, SS16', 
    'Romford, Dagenham, Hornchurch, Ilford, Brentwood, Billericay, Basildon, Wickford, Benfleet, Canvey Island, Southend-on-Sea, Stratford, Hackney, Bow, Walthamstow, Central/Southwark, Peckham, Brixton, Croydon', 
    'Extended delivery across Greater London and Essex county', 
    true, 6
)
ON CONFLICT (zone_code) DO UPDATE SET
    rule_name = EXCLUDED.rule_name,
    fee_gbp = EXCLUDED.fee_gbp,
    postcode_prefixes = EXCLUDED.postcode_prefixes,
    coverage_areas = EXCLUDED.coverage_areas,
    min_distance_miles = EXCLUDED.min_distance_miles,
    max_distance_miles = EXCLUDED.max_distance_miles;
