-- ====================================================================
-- TYLICIOUS GRILLZ: DYNAMIC LOCATION-GROUPED DELIVERY PRICING
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- Covers all of London, Kent, and Essex (Zones 1 to 7)
-- ====================================================================

-- 1. Create delivery_settings table
CREATE TABLE IF NOT EXISTS public.delivery_settings (
    id SERIAL PRIMARY KEY,
    restaurant_name TEXT NOT NULL DEFAULT 'Tylicious Grillz',
    restaurant_address TEXT NOT NULL DEFAULT 'Meadow Road, DA11 7LR, Gravesend',
    restaurant_postcode TEXT NOT NULL DEFAULT 'DA11 7LR',
    restaurant_lat NUMERIC(9,6) NOT NULL DEFAULT 51.4414,
    restaurant_lng NUMERIC(9,6) NOT NULL DEFAULT 0.3708,
    max_delivery_distance_miles NUMERIC(6,2) NOT NULL DEFAULT 75.0,
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
    max_distance_miles NUMERIC(6,2) NOT NULL DEFAULT 75.0,
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

ALTER TABLE public.delivery_pricing_rules ADD COLUMN IF NOT EXISTS postcode_prefixes TEXT;
ALTER TABLE public.delivery_pricing_rules ADD COLUMN IF NOT EXISTS coverage_areas TEXT;
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

-- 5. Create Public Read Policies
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

-- 6. Insert / Update default restaurant settings
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
    75.0,
    'miles',
    'GBP',
    true
WHERE NOT EXISTS (SELECT 1 FROM public.delivery_settings);

UPDATE public.delivery_settings 
SET max_delivery_distance_miles = 75.0 
WHERE max_delivery_distance_miles < 75.0;

-- 7. Seed / Upsert Location-Grouped UK Postcode Delivery Zones (GBP £)

-- Zone 1: Local Gravesend & Northfleet (DA11, DA12)
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
VALUES (
    'Zone 1: Local Gravesend & Northfleet', 'ZONE_1_LOCAL', 0, 3, 3.50, 0.00, 'zone', 
    'DA11, DA12', 
    'Gravesend, Northfleet, Chalk, Shorne, Singlewell', 
    'Local delivery across Gravesend & Northfleet', 
    true, 1
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
    'Zone 2: Ebbsfleet, Swanscombe & Greenhithe', 'ZONE_2_EBBSFLEET', 3, 6, 5.00, 0.00, 'zone', 
    'DA9, DA10', 
    'Ebbsfleet Valley, Swanscombe, Greenhithe, Bluewater', 
    'Ebbsfleet, Swanscombe & Greenhithe', 
    true, 2
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
    'Zone 3: Dartford, Bexley & Medway West', 'ZONE_3_DARTFORD_MEDWAY_WEST', 6, 10, 7.50, 0.00, 'zone', 
    'DA1, DA2, DA4, DA5, ME1, ME2, ME3', 
    'Dartford, Crayford, Wilmington, Bexley, Rochester, Strood, Hoo Peninsula', 
    'Dartford, Bexley village, Rochester & Strood', 
    true, 3
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
    'Zone 4: Medway Towns, Outer Kent & SE London Borders', 'ZONE_4_MEDWAY_SE_LONDON', 10, 15, 10.00, 0.00, 'zone', 
    'DA6, DA7, DA8, DA14, DA15, DA16, DA17, DA18, ME4, ME5, ME7, ME8, BR1, BR2, BR5, BR6, BR7, BR8, SE2, SE9, SE18, SE28', 
    'Chatham, Gillingham, Rainham (Kent), Bexleyheath, Sidcup, Welling, Erith, Bromley, Abbey Wood, Thamesmead, Woolwich, Eltham', 
    'Medway Towns, Bromley, Bexleyheath & South-East London borders', 
    true, 4
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

-- Delete legacy zone codes if present
DELETE FROM public.delivery_pricing_rules WHERE zone_code IN ('ZONE_5_EXTENDED', 'ZONE_6_WIDER_LONDON_ESSEX');

-- Zone 6: Greater London & Mid Essex / Mid Kent
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
VALUES (
    'Zone 6: Greater London & Mid Essex / Mid Kent', 
    'ZONE_6_GREATER_LONDON_MID_ESSEX_KENT', 
    25, 40, 20.00, 0.00, 'zone', 
    'EC1, EC2, EC3, EC4, WC1, WC2, W1, SW1, SE1, E1, E2, E3, E4, E5, E7, E8, E9, E10, E11, E12, E15, E17, E18, E20, E1W, N1, N2, N3, N4, N5, N6, N7, N8, N9, N10, N11, N12, N13, N14, N15, N16, N17, N18, N19, N20, N21, N22, NW1, NW2, NW3, NW4, NW5, NW6, NW7, NW8, NW9, NW10, NW11, SE4, SE5, SE11, SE15, SE16, SE17, SE19, SE20, SE21, SE22, SE23, SE24, SE25, SE26, SE27, SW2, SW3, SW4, SW5, SW6, SW7, SW8, SW9, SW10, SW11, SW12, SW13, SW14, SW15, SW16, SW17, SW18, SW19, SW20, CR0, CR2, CR4, CR7, CR8, SM1, SM2, SM3, SM4, SM5, SM6, SM7, W2, W3, W4, W5, W6, W7, W8, W9, W10, W11, W12, W13, W14, TW1, TW2, TW3, TW7, TW8, TW9, TW10, UB1, UB2, UB3, UB4, UB5, UB6, HA0, HA1, HA9, RM1, RM2, RM3, RM4, RM5, RM6, RM7, RM8, RM9, RM10, RM11, RM12, IG1, IG2, IG3, IG4, IG5, IG6, IG7, IG8, IG9, IG10, CM16, CM11, CM12, CM13, CM14, CM15, SS0, SS1, SS2, SS3, SS4, SS5, SS6, SS7, SS8, SS9, SS11, SS12, SS13, SS14, SS15, SS16, ME9, ME10, ME11, ME12, ME13, TN9, TN10, TN11, TN12, TN1, TN2, TN3, TN4', 
    'Central London, North London, East London, South London, West London, Romford, Dagenham, Ilford, Brentwood, Billericay, Basildon, Wickford, Southend-on-Sea, Rayleigh, Rochford, Epping, Loughton, Sittingbourne, Faversham, Tonbridge, Tunbridge Wells', 
    'Greater London and mid Essex/Kent areas', 
    true, 6
)
ON CONFLICT (zone_code) DO UPDATE SET
    rule_name = EXCLUDED.rule_name,
    fee_gbp = EXCLUDED.fee_gbp,
    postcode_prefixes = EXCLUDED.postcode_prefixes,
    coverage_areas = EXCLUDED.coverage_areas,
    min_distance_miles = EXCLUDED.min_distance_miles,
    max_distance_miles = EXCLUDED.max_distance_miles;

-- Zone 7: Regional Kent & Essex Event / Catering Delivery
INSERT INTO public.delivery_pricing_rules (
    rule_name, zone_code, min_distance_miles, max_distance_miles, fee_gbp, per_mile_fee_gbp, pricing_type, postcode_prefixes, coverage_areas, description, is_active, sort_order
)
VALUES (
    'Zone 7: Regional Kent & Essex Event / Catering Delivery', 
    'ZONE_7_REGIONAL_KENT_ESSEX', 
    40, 75, 25.00, 0.00, 'zone', 
    'CT1, CT2, CT3, CT4, CT5, CT6, CT7, CT8, CT9, CT10, CT11, CT12, CT13, CT14, CT15, CT16, CT17, CT18, CT19, CT20, CT21, TN23, TN24, TN25, TN26, TN27, TN17, TN18, TN28, TN29, CM1, CM2, CM3, CM6, CM7, CM77, CM8, CM9, CM17, CM18, CM19, CM20, CO1, CO2, CO3, CO4, CO5, CO6, CO7, CO11, CO12, CO13, CO14, CO15, CO16, UB7, UB8, UB9, UB10, TW4, TW5, TW6, TW11, TW12, TW13, TW14, TW15, TW18, TW19, TW20, HA2, HA3, HA4, HA5, HA6, HA7, HA8, EN1, EN2, EN3, EN4, EN5, EN7, EN8, EN9, EN10, EN11', 
    'Canterbury, Ashford, Thanet, Margate, Ramsgate, Folkestone, Dover, Deal, Chelmsford, Harlow, Braintree, Colchester, Maldon, Outer West/North London', 
    'Regional Kent, Essex and extended London catering & event delivery', 
    true, 7
)
ON CONFLICT (zone_code) DO UPDATE SET
    rule_name = EXCLUDED.rule_name,
    fee_gbp = EXCLUDED.fee_gbp,
    postcode_prefixes = EXCLUDED.postcode_prefixes,
    coverage_areas = EXCLUDED.coverage_areas,
    min_distance_miles = EXCLUDED.min_distance_miles,
    max_distance_miles = EXCLUDED.max_distance_miles;
