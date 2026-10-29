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
  max_delivery_distance_miles: 75.0,
  distance_unit: 'miles',
  is_active: true,
  currency: 'GBP',
};

/**
 * Configurable Location-Grouped Delivery Pricing Rules (GBP £)
 * Covers all of London, Kent, and Essex across 7 structured zones.
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
      'DA6', 'DA7', 'DA8', 'DA14', 'DA15', 'DA16', 'DA17', 'DA18',
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
    rule_name: 'Zone 6: Greater London & Mid Essex / Mid Kent',
    zone_code: 'ZONE_6_GREATER_LONDON_MID_ESSEX_KENT',
    min_distance_miles: 25,
    max_distance_miles: 40,
    fee_gbp: 20.00,
    per_mile_fee_gbp: 0,
    pricing_type: 'zone',
    postcode_prefixes: [
      // Central London
      'EC1', 'EC2', 'EC3', 'EC4', 'WC1', 'WC2', 'W1', 'SW1', 'SE1',
      // East London
      'E1', 'E2', 'E3', 'E4', 'E5', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E15', 'E17', 'E18', 'E20', 'E1W',
      // North London
      'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10', 'N11', 'N12', 'N13', 'N14', 'N15', 'N16', 'N17', 'N18', 'N19', 'N20', 'N21', 'N22',
      'NW1', 'NW2', 'NW3', 'NW4', 'NW5', 'NW6', 'NW7', 'NW8', 'NW9', 'NW10', 'NW11',
      // South London
      'SE4', 'SE5', 'SE11', 'SE15', 'SE16', 'SE17', 'SE19', 'SE20', 'SE21', 'SE22', 'SE23', 'SE24', 'SE25', 'SE26', 'SE27',
      'SW2', 'SW3', 'SW4', 'SW5', 'SW6', 'SW7', 'SW8', 'SW9', 'SW10', 'SW11', 'SW12', 'SW13', 'SW14', 'SW15', 'SW16', 'SW17', 'SW18', 'SW19', 'SW20',
      'CR0', 'CR2', 'CR4', 'CR7', 'CR8', 'SM1', 'SM2', 'SM3', 'SM4', 'SM5', 'SM6', 'SM7',
      // West London (Inner/Mid)
      'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12', 'W13', 'W14',
      'TW1', 'TW2', 'TW3', 'TW7', 'TW8', 'TW9', 'TW10',
      'UB1', 'UB2', 'UB3', 'UB4', 'UB5', 'UB6',
      'HA0', 'HA1', 'HA9',
      // Mid Essex (Romford, Dagenham, Ilford, Brentwood, Basildon, Southend)
      'RM1', 'RM2', 'RM3', 'RM4', 'RM5', 'RM6', 'RM7', 'RM8', 'RM9', 'RM10', 'RM11', 'RM12',
      'IG1', 'IG2', 'IG3', 'IG4', 'IG5', 'IG6', 'IG7', 'IG8', 'IG9', 'IG10', 'CM16',
      'CM11', 'CM12', 'CM13', 'CM14', 'CM15',
      'SS0', 'SS1', 'SS2', 'SS3', 'SS4', 'SS5', 'SS6', 'SS7', 'SS8', 'SS9', 'SS11', 'SS12', 'SS13', 'SS14', 'SS15', 'SS16',
      // Mid Kent
      'ME9', 'ME10', 'ME11', 'ME12', 'ME13',
      'TN9', 'TN10', 'TN11', 'TN12', 'TN1', 'TN2', 'TN3', 'TN4',
    ],
    coverage_areas: 'Central London, North London, East London, South London, West London, Romford, Dagenham, Ilford, Brentwood, Billericay, Basildon, Wickford, Southend-on-Sea, Rayleigh, Rochford, Epping, Loughton, Sittingbourne, Faversham, Tonbridge, Tunbridge Wells',
    is_active: true,
    sort_order: 6,
    description: 'Greater London and mid Essex/Kent areas',
  },
  {
    id: 7,
    rule_name: 'Zone 7: Regional Kent & Essex Event / Catering Delivery',
    zone_code: 'ZONE_7_REGIONAL_KENT_ESSEX',
    min_distance_miles: 40,
    max_distance_miles: 75,
    fee_gbp: 25.00,
    per_mile_fee_gbp: 0,
    pricing_type: 'zone',
    postcode_prefixes: [
      // East & South Kent (Canterbury, Ashford, Thanet, Dover, Folkestone)
      'CT1', 'CT2', 'CT3', 'CT4', 'CT5', 'CT6',
      'CT7', 'CT8', 'CT9', 'CT10', 'CT11', 'CT12',
      'CT13', 'CT14', 'CT15', 'CT16', 'CT17',
      'CT18', 'CT19', 'CT20', 'CT21',
      'TN23', 'TN24', 'TN25', 'TN26', 'TN27',
      'TN17', 'TN18', 'TN28', 'TN29',
      // North & East Essex (Chelmsford, Harlow, Braintree, Colchester, Maldon)
      'CM1', 'CM2', 'CM3', 'CM6', 'CM7', 'CM77', 'CM8', 'CM9',
      'CM17', 'CM18', 'CM19', 'CM20',
      'CO1', 'CO2', 'CO3', 'CO4', 'CO5', 'CO6', 'CO7',
      'CO11', 'CO12', 'CO13', 'CO14', 'CO15', 'CO16',
      // Outer West & North London borders
      'UB7', 'UB8', 'UB9', 'UB10',
      'TW4', 'TW5', 'TW6', 'TW11', 'TW12', 'TW13', 'TW14', 'TW15', 'TW18', 'TW19', 'TW20',
      'HA2', 'HA3', 'HA4', 'HA5', 'HA6', 'HA7', 'HA8',
      'EN1', 'EN2', 'EN3', 'EN4', 'EN5', 'EN7', 'EN8', 'EN9', 'EN10', 'EN11',
    ],
    coverage_areas: 'Canterbury, Ashford, Thanet, Margate, Ramsgate, Folkestone, Dover, Deal, Chelmsford, Harlow, Braintree, Colchester, Maldon, Outer West/North London',
    is_active: true,
    sort_order: 7,
    description: 'Regional Kent, Essex and extended London catering & event delivery',
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
 * Finds matching delivery zone by UK outward postcode, with support for:
 * 1. Exact outward code match (e.g. "DA11", "SW1A", "ME1", "CT9")
 * 2. Sub-district prefix match (e.g. "SW1A" matches "SW1", "EC2M" matches "EC2")
 * 3. Area code prefix match (e.g. "CT", "CO", "CM" if configured)
 */
export function findDeliveryZoneByOutcode(
  outcode: string,
  rules: DeliveryPricingRule[] = DEFAULT_DELIVERY_PRICING_RULES
): DeliveryPricingRule | null {
  const normalizedOutcode = outcode.toUpperCase().trim();
  if (!normalizedOutcode) return null;

  // 1. Exact match
  for (const rule of rules) {
    if (!rule.is_active) continue;
    const prefixes = rule.postcode_prefixes || [];
    if (prefixes.some((p) => p.toUpperCase() === normalizedOutcode)) {
      return rule;
    }
  }

  // 2. Sub-district match: strip trailing letters from outward code (e.g. "SW1A" -> "SW1", "EC1M" -> "EC1")
  const baseOutcode = normalizedOutcode.replace(/([0-9])[A-Z]+$/, '$1');
  if (baseOutcode !== normalizedOutcode) {
    for (const rule of rules) {
      if (!rule.is_active) continue;
      const prefixes = rule.postcode_prefixes || [];
      if (prefixes.some((p) => p.toUpperCase() === baseOutcode)) {
        return rule;
      }
    }
  }

  // 3. Area prefix match: match 2-letter area code (e.g. "CT" for Kent coast, "CO" for Colchester)
  const areaLetters = normalizedOutcode.replace(/[0-9].*$/, '');
  if (areaLetters && areaLetters.length <= 2) {
    for (const rule of rules) {
      if (!rule.is_active) continue;
      const prefixes = rule.postcode_prefixes || [];
      if (prefixes.some((p) => p.toUpperCase() === areaLetters)) {
        return rule;
      }
    }
  }

  return null;
}

export const METERS_PER_MILE = 1609.344;
export const METERS_PER_KM = 1000.0;
