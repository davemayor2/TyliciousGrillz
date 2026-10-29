import { Coordinates, GeocodeResult, RouteDistanceResult, AddressSuggestion } from '@/types/delivery';
import { DEFAULT_DELIVERY_SETTINGS, METERS_PER_MILE, METERS_PER_KM } from '@/constants/delivery';

// Regular expression to match standard UK postcodes (e.g., DA11 7LR, SE1 9SG, SW1A 1AA)
const UK_POSTCODE_REGEX = /\b([Gg][Ii][Rr]\s*0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s*[0-9][A-Za-z]{2})\b/i;
const UK_OUTWARD_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]?$/i;

/**
 * Extracts UK Postcode from any address string
 */
export function extractUKPostcode(text: string): string | null {
  if (!text) return null;
  const match = text.match(UK_POSTCODE_REGEX);
  return match ? match[0].trim().toUpperCase() : null;
}

/**
 * Haversine formula to compute great-circle distance between two coordinates in meters
 */
export function calculateHaversineMeters(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const lat1 = (coord1.lat * Math.PI) / 180;
  const lat2 = (coord2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Geocodes an address or UK postcode into latitude and longitude
 */
export async function geocodeAddress(address: string, explicitPostcode?: string): Promise<GeocodeResult | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  const searchAddress = `${address} ${explicitPostcode || ''}`.trim();
  const detectedPostcode = explicitPostcode || extractUKPostcode(searchAddress);

  // 1. Try Google Geocoding API if key is configured
  if (apiKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        searchAddress
      )}&components=country:GB&key=${apiKey}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const first = data.results[0];
          const lat = first.geometry?.location?.lat;
          const lng = first.geometry?.location?.lng;

          let googlePostcode = detectedPostcode;
          if (first.address_components) {
            for (const c of first.address_components) {
              if (c.types.includes('postal_code')) {
                googlePostcode = c.long_name;
                break;
              }
            }
          }

          if (typeof lat === 'number' && typeof lng === 'number') {
            return {
              formattedAddress: first.formatted_address || searchAddress,
              postcode: googlePostcode || undefined,
              coordinates: { lat, lng },
              provider: 'google',
            };
          }
        }
      }
    } catch (googleErr) {
      console.warn('⚠️ Google Geocoding request notice:', googleErr);
    }
  }

  // 2. High-precision UK Postcode Geocoding via postcodes.io (Official UK OS data, zero key needed)
  if (detectedPostcode) {
    try {
      const cleanPostcode = detectedPostcode.replace(/\s+/g, '');
      const postcodeRes = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(cleanPostcode)}`,
        { signal: AbortSignal.timeout(5000) }
      );

      if (postcodeRes.ok) {
        const data = await postcodeRes.json();
        if (data.status === 200 && data.result) {
          const res = data.result;
          const lat = res.latitude;
          const lng = res.longitude;

          if (typeof lat === 'number' && typeof lng === 'number') {
            const formatted = address.toLowerCase().includes(res.postcode.toLowerCase())
              ? address
              : `${address ? `${address}, ` : ''}${res.admin_district || ''}, ${res.postcode}`;

            return {
              formattedAddress: formatted.trim(),
              postcode: res.postcode,
              coordinates: { lat, lng },
              provider: 'postcodes_io',
            };
          }
        }
      } else if (UK_OUTWARD_REGEX.test(cleanPostcode)) {
        // Fallback for outward district code (e.g. DA11, ME1)
        const outcodeRes = await fetch(
          `https://api.postcodes.io/outcodes/${encodeURIComponent(cleanPostcode)}`,
          { signal: AbortSignal.timeout(5000) }
        );
        if (outcodeRes.ok) {
          const data = await outcodeRes.json();
          if (data.status === 200 && data.result) {
            return {
              formattedAddress: `${address || cleanPostcode}, Kent/UK`,
              postcode: cleanPostcode,
              coordinates: { lat: data.result.latitude, lng: data.result.longitude },
              provider: 'postcodes_io',
            };
          }
        }
      }
    } catch (postcodeErr) {
      console.warn('⚠️ postcodes.io lookup notice:', postcodeErr);
    }
  }

  return null;
}

/**
 * Calculates true driving distance between origin and destination
 */
export async function calculateDrivingDistance(
  destination: Coordinates,
  origin: Coordinates = {
    lat: DEFAULT_DELIVERY_SETTINGS.restaurant_lat,
    lng: DEFAULT_DELIVERY_SETTINGS.restaurant_lng,
  }
): Promise<RouteDistanceResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();

  // 1. Try Google Distance Matrix API if key is present
  if (apiKey) {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&mode=driving&units=imperial&key=${apiKey}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = await res.json();
        const element = data?.rows?.[0]?.elements?.[0];

        if (element && element.status === 'OK' && element.distance?.value) {
          const distanceMeters = element.distance.value;
          const durationSeconds = element.duration?.value;
          const distanceMiles = Number((distanceMeters / METERS_PER_MILE).toFixed(2));
          const distanceKm = Number((distanceMeters / METERS_PER_KM).toFixed(2));

          return {
            distanceMeters,
            distanceMiles,
            distanceKm,
            durationSeconds,
            origin,
            destination,
            provider: 'google_distance_matrix',
          };
        }
      }
    } catch (err) {
      console.warn('⚠️ Google Distance Matrix notice:', err);
    }
  }

  // 2. High-precision OSRM Routing Machine (Driving road network)
  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=false`;
    const osrmRes = await fetch(osrmUrl, { signal: AbortSignal.timeout(5000) });

    if (osrmRes.ok) {
      const data = await osrmRes.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceMeters = route.distance;
        const durationSeconds = route.duration;
        const distanceMiles = Number((distanceMeters / METERS_PER_MILE).toFixed(2));
        const distanceKm = Number((distanceMeters / METERS_PER_KM).toFixed(2));

        return {
          distanceMeters,
          distanceMiles,
          distanceKm,
          durationSeconds,
          origin,
          destination,
          provider: 'osrm',
        };
      }
    }
  } catch (osrmErr) {
    console.warn('⚠️ OSRM routing notice:', osrmErr);
  }

  // 3. Fallback: Haversine with UK road network factor (1.35x crow-flies distance)
  const haversineMeters = calculateHaversineMeters(origin, destination);
  const roadNetworkMeters = Math.round(haversineMeters * 1.35);
  const distanceMiles = Number((roadNetworkMeters / METERS_PER_MILE).toFixed(2));
  const distanceKm = Number((roadNetworkMeters / METERS_PER_KM).toFixed(2));

  return {
    distanceMeters: roadNetworkMeters,
    distanceMiles,
    distanceKm,
    origin,
    destination,
    provider: 'haversine_road',
  };
}

/**
 * Autocomplete suggestions for UK addresses / postcodes
 */
export async function getAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
  const clean = (query || '').trim();
  if (clean.length < 2) return [];

  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();

  // 1. Google Places Autocomplete if key configured
  if (apiKey) {
    // Try modern Places API (New)
    try {
      const newPlacesRes = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
        },
        body: JSON.stringify({
          input: clean,
          includedRegionCodes: ['gb'],
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (newPlacesRes.ok) {
        const newData = await newPlacesRes.json();
        if (Array.isArray(newData.suggestions) && newData.suggestions.length > 0) {
          return newData.suggestions.slice(0, 5).map((s: {
            placePrediction?: {
              placeId?: string;
              text?: { text?: string };
              structuredFormat?: {
                mainText?: { text?: string };
                secondaryText?: { text?: string };
              };
            };
          }) => {
            const pred = s.placePrediction;
            const fullText = pred?.text?.text || '';
            return {
              id: pred?.placeId || fullText,
              description: fullText,
              mainText: pred?.structuredFormat?.mainText?.text || fullText,
              secondaryText: pred?.structuredFormat?.secondaryText?.text || '',
              postcode: extractUKPostcode(fullText) || undefined,
            };
          });
        }
      }
    } catch (newPlacesErr) {
      console.warn('⚠️ Google Places (New) notice:', newPlacesErr);
    }

    // Fallback to legacy Places API if enabled
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        clean
      )}&components=country:gb&key=${apiKey}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'OK' && Array.isArray(data.predictions)) {
          return data.predictions.slice(0, 5).map((p: {
            place_id: string;
            description: string;
            structured_formatting?: { main_text?: string; secondary_text?: string };
          }) => ({
            id: p.place_id,
            description: p.description,
            mainText: p.structured_formatting?.main_text || p.description,
            secondaryText: p.structured_formatting?.secondary_text || '',
            postcode: extractUKPostcode(p.description) || undefined,
          }));
        }
      }
    } catch (gErr) {
      console.warn('⚠️ Google Autocomplete notice:', gErr);
    }
  }

  // 2. UK Postcodes.io Autocomplete fallback
  try {
    const pcUrl = `https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}/autocomplete`;
    const res = await fetch(pcUrl, { signal: AbortSignal.timeout(4000) });
    if (res.ok) {
      const data = await res.json();
      if (data.status === 200 && Array.isArray(data.result)) {
        return data.result.slice(0, 5).map((pc: string) => ({
          id: pc,
          description: `${pc}, Kent/UK`,
          mainText: pc,
          secondaryText: 'United Kingdom',
          postcode: pc,
        }));
      }
    }
  } catch (pErr) {
    console.warn('⚠️ postcodes.io autocomplete notice:', pErr);
  }

  return [];
}
