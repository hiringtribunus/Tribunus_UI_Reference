/**
 * Dummy zoning data generator for map placeholder
 * Generates realistic-looking zoning polygons around a center point
 */

export interface ZoneProperties {
  zoneCode: string;
  zoneLabel: string;
  zoneCategory: "residential" | "commercial" | "industrial" | "parks" | "mixed";
}

export interface ZoneFeature {
  type: "Feature";
  properties: ZoneProperties;
  geometry: {
    type: "Polygon";
    coordinates: number[][][]; // [[[lng, lat], ...]]
  };
}

export interface ZoningCollection {
  type: "FeatureCollection";
  features: ZoneFeature[];
}

// Zone type definitions with realistic BC zoning codes
const ZONE_TYPES = [
  { code: "RS-1", label: "Single Family Residential", category: "residential" as const },
  { code: "RS-2", label: "Single Family Residential", category: "residential" as const },
  { code: "RM-2", label: "Low-Rise Multi-Family", category: "residential" as const },
  { code: "RM-3", label: "Medium-Rise Multi-Family", category: "residential" as const },
  { code: "RT-1", label: "Townhouse Residential", category: "residential" as const },
  { code: "C-2", label: "Neighbourhood Commercial", category: "commercial" as const },
  { code: "C-3", label: "Community Commercial", category: "commercial" as const },
  { code: "M-1", label: "Light Industrial", category: "industrial" as const },
  { code: "P-1", label: "Parks and Recreation", category: "parks" as const },
  { code: "MU-1", label: "Mixed Use", category: "mixed" as const },
];

/**
 * Default center point (Coquitlam, BC)
 */
export const COQUITLAM_CENTER = {
  lat: 49.283764,
  lng: -122.793205,
};

/**
 * Generates a grid of dummy zoning polygons around a center point
 * Creates 8-12 rectangular zones in a 3x3 grid pattern
 */
export function generateDummyZoning(
  centerLat: number,
  centerLng: number
): ZoningCollection {
  const features: ZoneFeature[] = [];

  // Grid configuration
  const gridSize = 3; // 3x3 grid = 9 cells (8 after skipping center)
  const cellWidth = 0.008; // ~800m in longitude degrees
  const cellHeight = 0.006; // ~600m in latitude degrees

  let zoneIndex = 0;

  // Generate grid cells
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Skip center cell (where project pin will be)
      if (row === 1 && col === 1) continue;

      const zone = ZONE_TYPES[zoneIndex % ZONE_TYPES.length];

      // Calculate cell bounds
      const west = centerLng - cellWidth * 1.5 + col * cellWidth;
      const east = west + cellWidth;
      const north = centerLat + cellHeight * 1.5 - row * cellHeight;
      const south = north - cellHeight;

      // Create rectangular polygon (GeoJSON format: [lng, lat])
      features.push({
        type: "Feature",
        properties: {
          zoneCode: zone.code,
          zoneLabel: zone.label,
          zoneCategory: zone.category,
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [west, north], // Top-left
              [east, north], // Top-right
              [east, south], // Bottom-right
              [west, south], // Bottom-left
              [west, north], // Close polygon
            ],
          ],
        },
      });

      zoneIndex++;
    }
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

/**
 * Get color for a zone category
 */
export function getZoneColor(category: ZoneProperties["zoneCategory"]): string {
  const colors = {
    residential: "#FFD700", // Gold
    commercial: "#FF6B6B", // Red
    industrial: "#9B59B6", // Purple
    parks: "#27AE60", // Green
    mixed: "#3498DB", // Blue
  };
  return colors[category];
}

/**
 * Get all unique zone categories from a zoning collection
 */
export function getZoneCategories(
  zones: ZoningCollection
): ZoneProperties["zoneCategory"][] {
  const categories = new Set(zones.features.map((f) => f.properties.zoneCategory));
  return Array.from(categories);
}
