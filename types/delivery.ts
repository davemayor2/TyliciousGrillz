export type DistanceUnit = 'miles' | 'km';

export type PricingType = 'band' | 'per_mile' | 'zone';

export interface DeliveryPricingRule {
  id?: string | number;
  rule_name: string;
  min_distance_miles: number;
  max_distance_miles: number;
  fee_gbp: number;
  per_mile_fee_gbp?: number;
  pricing_type?: PricingType;
  zone_code?: string;
  postcode_prefixes?: string[]; // e.g. ['DA11', 'DA12']
  coverage_areas?: string;
  is_active: boolean;
  sort_order?: number;
  description?: string;
  created_at?: string;
}

export interface DeliverySettings {
  id?: number;
  restaurant_name: string;
  restaurant_address: string;
  restaurant_postcode: string;
  restaurant_lat: number;
  restaurant_lng: number;
  max_delivery_distance_miles: number;
  distance_unit: DistanceUnit;
  is_active: boolean;
  currency: string; // 'GBP'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodeResult {
  formattedAddress: string;
  postcode?: string;
  coordinates: Coordinates;
  provider: 'google' | 'postcodes_io' | 'fallback';
}

export interface RouteDistanceResult {
  distanceMeters: number;
  distanceMiles: number;
  distanceKm: number;
  durationSeconds?: number;
  origin: Coordinates;
  destination: Coordinates;
  provider: 'google_distance_matrix' | 'osrm' | 'haversine_road';
}

export interface DeliveryQuote {
  isEligible: boolean;
  distanceMiles: number;
  distanceKm: number;
  unit: DistanceUnit;
  feeGBP: number;
  feeMinorUnits: number; // in pence for Stripe (e.g. £5.50 -> 550)
  ruleName: string;
  pricingType: PricingType;
  originAddress: string;
  destinationAddress: string;
  destinationPostcode?: string;
  destinationCoordinates?: Coordinates;
  durationMinutes?: number;
  message?: string;
  maxDistanceMiles: number;
  provider: string;
}

export interface AddressSuggestion {
  id: string;
  description: string;
  mainText: string;
  secondaryText?: string;
  postcode?: string;
}
