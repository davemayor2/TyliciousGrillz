import { DeliveryPricingRule, DeliverySettings } from '@/types/delivery';

/**
 * Tylicious Grillz Fixed Restaurant Origin
 * Meadow Road, DA11 7LR, Gravesend, Kent, UK
 */
export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  restaurant_name: 'Tylicious Grillz',
  restaurant_address: 'Meadow Road, DA11 7LR, Gravesend',
  restaurant_postcode: 'DA11 7LR',
  restaurant_lat: 51.4414,
  restaurant_lng: 0.3708,
  max_delivery_distance_miles: 35.0,
  distance_unit: 'miles',
  is_active: true,
  currency: 'GBP',
};

/**
 * Configurable Location-Grouped Delivery Pricing Rules (GBP £)
 * Organized by UK Outward Postcodes across Gravesend, Kent, London & Essex.
 * Can be customized in Supabase 'delivery_pricing_rules' or edited here.
 */
export const DEFAULT_DELIVERY_PRICING_RULES: DeliveryPricingRule[] = [
  {
    id: 1,
    rule_name: 'Zone 1: Local Gravesend & Northfleet',
    zone_code: 'ZONE_1_LOCAL',
    min_distance_miles: 0,
    max_distance_miles: 3,
    fee_gbp: 3.50,
    per_mile_fee_gbp: 0,
    pricing_type: 'zone',
    postcode_prefixes: ['DA11', 'DA12'],
    coverage_areas: 'Gravesend, Northfleet, Chalk, Shorne, Singlewell',
    is_active: true,
    sort_order: 1,
    description: 'Local delivery across Gravesend & Northfleet',
  },
  {
    id: 2,
    rule_name: 'Zone 2: Ebbsfleet, Swanscombe & Greenhithe',
    zone_code: 'ZONE_2_EBBSFLEET',
    min_distance_miles: 3,
    max_distance_miles: 6,
    fee_gbp: 5.00,
    per_mile_fee_gbp: 0,
    pricing_type: 'zone',
    postcode_prefixes: ['DA9', 'DA10'],
    coverage_areas: 'Ebbsfleet Valley, Swanscombe, Greenhithe, Bluewater',
    is_active: true,
    sort_order: 2,
    description: 'Ebbsfleet, Swanscombe & Greenhithe',
  },
  {
    id: 3,
    rule_name: 'Zone 3: Dartford, Bexley & Medway West',
    zone_code: 'ZONE_3_DARTFORD_MEDWAY_WEST',
    min_distance_miles: 6,
    max_distance_miles: 10,
    fee_gbp: 7.50,
    per_mile_fee_gbp: 0,
    pricing_type: 'zone',
    postcode_prefixes: ['DA1', 'DA2', 'DA4', 'DA5', 'ME1', 'ME2', 'ME3'],
    coverage_areas: 'Dartford, Crayford, Wilmington, Bexley, Rochester, Strood, Hoo Peninsula',
    is_active: true,
    sort_order: 3,
    description: 'Dartford, Bexley village, Rochester & Strood',
  },
  {
    id: 4,
    rule_name: 'Zone 4: Medway Towns, Outer Kent & SE London Borders',
    zone_code: 'ZONE_4_MEDWAY_SE_LONDON',
    min_distance_miles: 10,
    max_distance_miles: 15,
    fee_gbp: 10.00,
    per_mile_fee_gbp: 0,
    pricing_type: 'zone',
    postcode_prefixes: [
      'DA6', 'DA7', 'DA8', 'DA14', 'DA15', 'DA16', 'DA17',
      'ME4', 'ME5', 'ME7', 'ME8',
      'BR1', 'BR2', 'BR5', 'BR6', 'BR7', 'BR8',
      'SE2', 'SE9', 'SE18', 'SE28',
    ],
    coverage_areas: 'Chatham, Gillingham, Rainham (Kent), Bexleyheath, Sidcup, Welling, Erith, Bromley, Abbey Wood, Thamesmead, Woolwich, Eltham',
    is_active: true,
    sort_order: 4,
    description: 'Medway Towns, Bromley, Bexleyheath & South-East London borders',
  },
  {
    id: 5,
    rule_name: 'Zone 5: Inner London Borders, South Essex & Mid Kent',
    zone_code: 'ZONE_5_INNER_LONDON_ESSEX_MID_KENT',
    min_distance_miles: 15,
    max_distance_miles: 25,
    fee_gbp: 15.00,
    per_mile_fee_gbp: 0,
    pricing_type: 'zone',
    postcode_prefixes: [
      // Kent & Surrey borders
      'ME14', 'ME15', 'ME16', 'ME19', 'ME20',
      'TN13', 'TN14', 'TN15',
      'BR3', 'BR4',
      // South Essex (Thurrock & Lower Havering)
      'RM13', 'RM14', 'RM15', 'RM16', 'RM17', 'RM18', 'RM19', 'RM20',
      'SS17',
      // East & South-East London
      'SE3', 'SE6', 'SE7', 'SE8', 'SE10', 'SE12', 'SE13', 'SE14',
      'E6', 'E13', 'E14', 'E16',
      'IG11',
    ],
    coverage_areas: 'Maidstone, Sevenoaks, Grays, Tilbury, Purfleet, South Ockendon, Rainham (Essex), Aveley, Stanford-le-Hope, Greenwich, Lewisham, Blackheath, Charlton, Deptford, Catford, New Cross, Canary Wharf, Canning Town, Plaistow, Beckton, Barking',
    is_active: true,
    sort_order: 5,
    description: 'Maidstone, Sevenoaks, Thurrock/Grays, Canary Wharf, Greenwich, Barking & South Essex',
  },
  {
    id: 6,
    rule_name: 'Zone 6: Wider London & Essex County',
    zone_code: 'ZONE_6_WIDER_LONDON_ESSEX',
    min_distance_miles: 25,
    max_distance_miles: 35,
    fee_gbp: 20.00,
    per_mile_fee_gbp: 0,
    pricing_type: 'zone',
    postcode_prefixes: [
      // Greater London (Central, South & East)
      'E1', 'E2', 'E3', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E15', 'E17', 'E18', 'E20',
      'SE1', 'SE4', 'SE5', 'SE11', 'SE15', 'SE16', 'SE17', 'SE19', 'SE20', 'SE21', 'SE22', 'SE23', 'SE24', 'SE25', 'SE26', 'SE27',
      'CR0', 'CR2', 'CR7', 'CR8',
      // Essex (Romford, Dagenham, Ilford, Brentwood, Basildon, Southend)
      'RM1', 'RM2', 'RM3', 'RM4', 'RM5', 'RM6', 'RM7', 'RM8', 'RM9', 'RM10', 'RM11', 'RM12',
      'IG1', 'IG2', 'IG3', 'IG4', 'IG5', 'IG6', 'IG7', 'IG8',
      'CM11', 'CM12', 'CM13', 'CM14', 'CM15',
      'SS0', 'SS1', 'SS2', 'SS3', 'SS7', 'SS8', 'SS9', 'SS11', 'SS12', 'SS13', 'SS14', 'SS15', 'SS16',
    ],
    coverage_areas: 'Romford, Dagenham, Hornchurch, Ilford, Brentwood, Billericay, Basildon, Wickford, Benfleet, Canvey Island, Southend-on-Sea, Stratford, Hackney, Bow, Walthamstow, Central/Southwark, Peckham, Brixton, Croydon',
    is_active: true,
    sort_order: 6,
    description: 'Extended delivery across Greater London and Essex county',
  },
];

/**
 * Normalizes a UK postcode to extract its outward district code (e.g. "DA11" from "DA11 7LR", "DA9" from "DA9 9GQ")
 */
export function extractOutcode(postcode: string): string {
  if (!postcode) return '';
  const trimmed = postcode.toUpperCase().trim();

  // If space-separated, the first part is the outward code (e.g. "DA9 9GQ" -> "DA9")
  const spaceParts = trimmed.split(/\s+/);
  if (spaceParts.length >= 2) {
    return spaceParts[0].replace(/[^A-Z0-9]/g, '');
  }

  // If unspaced (e.g. "DA99GQ", "DA117LR"), UK inward code is always last 3 chars (1 digit + 2 letters)
  const clean = trimmed.replace(/[^A-Z0-9]/g, '');
  if (clean.length >= 5 && /[0-9][A-Z]{2}$/.test(clean)) {
    return clean.slice(0, -3);
  }

  // Otherwise, user entered an outward code directly (e.g. "DA1", "DA11", "ME1", "SE18")
  return clean;
}

/**
 * Finds matching delivery zone by UK outward postcode
 */
export function findDeliveryZoneByOutcode(
  outcode: string,
  rules: DeliveryPricingRule[] = DEFAULT_DELIVERY_PRICING_RULES
): DeliveryPricingRule | null {
  const normalizedOutcode = outcode.toUpperCase().trim();
  if (!normalizedOutcode) return null;

  for (const rule of rules) {
    if (!rule.is_active) continue;
    const prefixes = rule.postcode_prefixes || [];
    if (prefixes.some((p) => p.toUpperCase() === normalizedOutcode)) {
      return rule;
    }
  }

  return null;
}

export const METERS_PER_MILE = 1609.344;
export const METERS_PER_KM = 1000.0;
