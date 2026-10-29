import { supabaseAdmin } from '@/libs/supabase/server';
import { DeliveryPricingRule, DeliveryQuote, DeliverySettings } from '@/types/delivery';
import {
  DEFAULT_DELIVERY_PRICING_RULES,
  DEFAULT_DELIVERY_SETTINGS,
} from '@/constants/delivery';
import { geocodeAddress, calculateDrivingDistance } from './geocoding';

// In-memory cache for pricing rules to avoid querying Supabase on every single address keystroke
let cachedRules: DeliveryPricingRule[] | null = null;
let cachedSettings: DeliverySettings | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

/**
 * Loads delivery pricing rules from Supabase or defaults
 */
export async function getActiveDeliveryPricingRules(): Promise<DeliveryPricingRule[]> {
  const now = Date.now();
  if (cachedRules && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedRules;
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data, error } = await supabaseAdmin
        .from('delivery_pricing_rules')
        .select('*')
        .eq('is_active', true)
        .order('min_distance_miles', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        cachedRules = data.map((r) => ({
          id: r.id,
          rule_name: r.rule_name || r.name,
          min_distance_miles: Number(r.min_distance_miles || 0),
          max_distance_miles: Number(r.max_distance_miles || 0),
          fee_gbp: Number(r.fee_gbp || r.fee || 0),
          per_mile_fee_gbp: Number(r.per_mile_fee_gbp || 0),
          pricing_type: r.pricing_type || 'band',
          zone_code: r.zone_code,
          postcode_prefixes:
            typeof r.postcode_prefixes === 'string'
              ? r.postcode_prefixes
                  .split(',')
                  .map((s: string) => s.trim().toUpperCase())
                  .filter(Boolean)
              : Array.isArray(r.postcode_prefixes)
              ? r.postcode_prefixes
              : [],
          coverage_areas: r.coverage_areas,
          is_active: r.is_active !== false,
          sort_order: r.sort_order ?? 0,
          description: r.description,
        }));
        lastCacheTime = now;
        return cachedRules;
      }
    } catch (err) {
      console.warn('⚠️ Supabase pricing rules lookup notice:', err);
    }
  }

  // Fallback to configured defaults
  return DEFAULT_DELIVERY_PRICING_RULES;
}

/**
 * Loads delivery settings (origin & max radius) from Supabase or defaults
 */
export async function getDeliverySettings(): Promise<DeliverySettings> {
  const now = Date.now();
  if (cachedSettings && now - lastCacheTime < CACHE_TTL_MS) {
    return cachedSettings;
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const { data, error } = await supabaseAdmin
        .from('delivery_settings')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        cachedSettings = {
          id: data.id,
          restaurant_name: data.restaurant_name || DEFAULT_DELIVERY_SETTINGS.restaurant_name,
          restaurant_address: data.restaurant_address || DEFAULT_DELIVERY_SETTINGS.restaurant_address,
          restaurant_postcode: data.restaurant_postcode || DEFAULT_DELIVERY_SETTINGS.restaurant_postcode,
          restaurant_lat: Number(data.restaurant_lat ?? DEFAULT_DELIVERY_SETTINGS.restaurant_lat),
          restaurant_lng: Number(data.restaurant_lng ?? DEFAULT_DELIVERY_SETTINGS.restaurant_lng),
          max_delivery_distance_miles: Number(
            data.max_delivery_distance_miles ?? DEFAULT_DELIVERY_SETTINGS.max_delivery_distance_miles
          ),
          distance_unit: data.distance_unit || DEFAULT_DELIVERY_SETTINGS.distance_unit,
          is_active: data.is_active !== false,
          currency: data.currency || 'GBP',
        };
        lastCacheTime = now;
        return cachedSettings;
      }
    } catch (err) {
      console.warn('⚠️ Supabase delivery settings lookup notice:', err);
    }
  }

  return DEFAULT_DELIVERY_SETTINGS;
}

import { extractOutcode } from '@/constants/delivery';

/**
 * Calculates delivery fee given postcode and distance
 */
export function matchDeliveryRule(
  distanceMiles: number,
  rules: DeliveryPricingRule[],
  maxDistanceMiles: number,
  postcode?: string
): { matchedRule: DeliveryPricingRule | null; calculatedFeeGBP: number; isEligible: boolean } {
  // 1. Primary Check: Match by Location-Grouped UK Outward Postcode
  if (postcode) {
    const outcode = extractOutcode(postcode);
    if (outcode) {
      for (const rule of rules) {
        if (!rule.is_active) continue;
        const prefixes = rule.postcode_prefixes || [];
        if (prefixes.some((p) => p.toUpperCase() === outcode)) {
          return {
            matchedRule: rule,
            calculatedFeeGBP: Number(rule.fee_gbp.toFixed(2)),
            isEligible: true,
          };
        }
      }
    }
  }

  // 2. Secondary Check: Distance-Band match
  if (distanceMiles > maxDistanceMiles) {
    return {
      matchedRule: null,
      calculatedFeeGBP: 0,
      isEligible: false,
    };
  }

  // Sort rules by min_distance ascending
  const sorted = [...rules].sort((a, b) => a.min_distance_miles - b.min_distance_miles);

  for (let i = 0; i < sorted.length; i++) {
    const rule = sorted[i];

    const matches =
      i === 0
        ? distanceMiles >= rule.min_distance_miles && distanceMiles <= rule.max_distance_miles
        : distanceMiles > rule.min_distance_miles && distanceMiles <= rule.max_distance_miles;

    if (matches) {
      let fee = rule.fee_gbp;

      if (rule.per_mile_fee_gbp && rule.per_mile_fee_gbp > 0) {
        const excessMiles = Math.max(0, distanceMiles - rule.min_distance_miles);
        fee += excessMiles * rule.per_mile_fee_gbp;
      }

      return {
        matchedRule: rule,
        calculatedFeeGBP: Number(fee.toFixed(2)),
        isEligible: true,
      };
    }
  }

  // If within initial radius but not explicit band
  if (sorted.length > 0 && distanceMiles <= sorted[0].max_distance_miles) {
    return {
      matchedRule: sorted[0],
      calculatedFeeGBP: Number(sorted[0].fee_gbp.toFixed(2)),
      isEligible: true,
    };
  }

  return {
    matchedRule: null,
    calculatedFeeGBP: 0,
    isEligible: false,
  };
}

/**
 * Complete server-side delivery quote resolution:
 * Geocodes destination -> computes route distance -> applies pricing rules
 */
export async function calculateDeliveryQuoteForAddress(
  address: string,
  explicitPostcode?: string
): Promise<DeliveryQuote> {
  const trimmed = (address || '').trim();
  const trimmedPostcode = (explicitPostcode || '').trim();

  const settings = await getDeliverySettings();
  const rules = await getActiveDeliveryPricingRules();

  if (!trimmed && !trimmedPostcode) {
    throw new Error('Please enter a delivery address or UK postcode.');
  }

  // 1. Geocode Destination
  const geocode = await geocodeAddress(trimmed, trimmedPostcode);
  if (!geocode) {
    throw new Error(
      `Unable to locate "${trimmed || trimmedPostcode}". Please verify the street name and UK postcode.`
    );
  }

  // 2. Compute Driving Distance from Restaurant
  const origin = {
    lat: settings.restaurant_lat,
    lng: settings.restaurant_lng,
  };

  const route = await calculateDrivingDistance(geocode.coordinates, origin);

  const targetPostcode = geocode.postcode || trimmedPostcode;

  // 3. Match Delivery Pricing Rule (by Postcode Group or Distance Band)
  const { matchedRule, calculatedFeeGBP, isEligible } = matchDeliveryRule(
    route.distanceMiles,
    rules,
    settings.max_delivery_distance_miles,
    targetPostcode
  );

  const feeMinorUnits = Math.round(calculatedFeeGBP * 100);

  const durationMinutes = route.durationSeconds
    ? Math.max(10, Math.round(route.durationSeconds / 60))
    : undefined;

  if (!isEligible) {
    return {
      isEligible: false,
      distanceMiles: route.distanceMiles,
      distanceKm: route.distanceKm,
      unit: settings.distance_unit,
      feeGBP: 0,
      feeMinorUnits: 0,
      ruleName: 'Outside Delivery Zones',
      pricingType: 'zone',
      originAddress: settings.restaurant_address,
      destinationAddress: geocode.formattedAddress,
      destinationPostcode: targetPostcode,
      destinationCoordinates: geocode.coordinates,
      durationMinutes,
      message: `We currently deliver across Gravesend, Kent, London and Essex (Zones 1 to 6). Your location is outside our standard delivery zones. Please choose Free Collection or contact us for bespoke catering delivery.`,
      maxDistanceMiles: settings.max_delivery_distance_miles,
      provider: route.provider,
    };
  }

  return {
    isEligible: true,
    distanceMiles: route.distanceMiles,
    distanceKm: route.distanceKm,
    unit: settings.distance_unit,
    feeGBP: calculatedFeeGBP,
    feeMinorUnits,
    ruleName: matchedRule?.rule_name || 'Standard Delivery',
    pricingType: matchedRule?.pricing_type || 'zone',
    originAddress: settings.restaurant_address,
    destinationAddress: geocode.formattedAddress,
    destinationPostcode: targetPostcode,
    destinationCoordinates: geocode.coordinates,
    durationMinutes,
    message: `${matchedRule?.rule_name || 'Delivery'} (${route.distanceMiles} miles from Gravesend)`,
    maxDistanceMiles: settings.max_delivery_distance_miles,
    provider: route.provider,
  };
}
