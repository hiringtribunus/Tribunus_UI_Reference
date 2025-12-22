/**
 * Mock geocoding service
 * Simulates address geocoding with deterministic results
 * In production, replace with real Mapbox Geocoding API
 */

export interface GeocodeResult {
  lat: number;
  lng: number;
  geocodeConfidence: "high" | "medium" | "low" | "manual" | "unknown";
  geocodeProvider: "mapbox";
  lastGeocodedAt: string;
}

/**
 * Mock geocode an address
 * Returns coordinates near Coquitlam with slight offset based on address
 * Simulates API delay for realistic feel
 */
export async function geocodeAddress(
  address: string,
  city: string,
  province: string
): Promise<GeocodeResult | null> {
  // Simulate API delay (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Basic validation
  if (!address || address.trim().length < 5) {
    return null;
  }

  // Mock: Use Coquitlam center with deterministic offset based on address hash
  const hash = simpleHash(address);
  const offsetLat = ((hash % 200) - 100) * 0.0001; // ±0.01 degrees (~1km)
  const offsetLng = ((hash % 300) - 150) * 0.0001;

  // Base coordinates (Coquitlam, BC)
  const baseLat = 49.283764;
  const baseLng = -122.793205;

  // Determine confidence based on address format
  // If address has a number, assume high confidence
  const hasNumber = /\d+/.test(address);
  const confidence = hasNumber ? "high" : "medium";

  return {
    lat: baseLat + offsetLat,
    lng: baseLng + offsetLng,
    geocodeConfidence: confidence,
    geocodeProvider: "mapbox",
    lastGeocodedAt: new Date().toISOString(),
  };
}

/**
 * Simple hash function for deterministic offset
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
