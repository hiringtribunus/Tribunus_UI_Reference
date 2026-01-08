/**
 * Esri ArcGIS layer configuration for Coquitlam, BC
 * Contains development applications, zoning, and transportation layers
 *
 * Configuration matches map_with_layers.html reference implementation
 */

export interface EsriLayerConfig {
  id: string;
  name: string;
  url: string;
  type: 'featureLayer' | 'clusterLayer';
  geometryType?: 'point' | 'line' | 'polygon';
  style?: {
    color?: string;
    weight?: number;
    opacity?: number;
    fillOpacity?: number;
    radius?: number; // For point features
  };
  clustering?: {
    maxClusterRadius?: number;
    disableClusteringAtZoom?: number;
    showCoverageOnHover?: boolean;
    spiderfyOnMaxZoom?: boolean;
    animateAddingMarkers?: boolean;
    removeOutsideVisibleBounds?: boolean;
  };
  simplifyFactor?: number;
  precision?: number;
  defaultOn: boolean;
}

/**
 * All 11 Esri layers for Coquitlam mapping
 */
export const ESRI_LAYERS: EsriLayerConfig[] = [
  {
    id: 'development-applications',
    name: 'Development Applications',
    url: 'https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/arcgis/rest/services/Development_Information_Demo/FeatureServer/0',
    type: 'clusterLayer',
    clustering: {
      maxClusterRadius: 50,
      disableClusteringAtZoom: 18,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      animateAddingMarkers: false,
      removeOutsideVisibleBounds: true,
    },
    defaultOn: true,
  },
  {
    id: 'zoning-land-use',
    name: 'Zoning / Land Use',
    url: 'https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/arcgis/rest/services/Interim_OCP_Portal_for_Public/FeatureServer/78408',
    type: 'featureLayer',
    geometryType: 'polygon',
    style: {
      fillOpacity: 0.5,
      weight: 3,
      opacity: 1,
    },
    simplifyFactor: 0.5,
    precision: 5,
    defaultOn: false,
  },
  // Transportation layers - matching HTML configuration
  {
    id: 'west-coast-express-route',
    name: 'West Coast Express Route',
    url: 'https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/ArcGIS/rest/services/Transportation/FeatureServer/0',
    type: 'featureLayer',
    geometryType: 'line',
    style: { color: '#9B59B6', weight: 2, opacity: 0.7 },
    simplifyFactor: 0.5,
    precision: 5,
    defaultOn: false,
  },
  {
    id: 'bus-stops',
    name: 'Bus Stops',
    url: 'https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/ArcGIS/rest/services/Transportation/FeatureServer/1',
    type: 'featureLayer',
    geometryType: 'point',
    style: { color: '#3498DB', radius: 3, weight: 2, opacity: 0.8 },
    simplifyFactor: 0.5,
    precision: 5,
    defaultOn: false,
  },
  {
    id: 'bus-routes',
    name: 'Bus Routes',
    url: 'https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/ArcGIS/rest/services/Transportation/FeatureServer/2',
    type: 'featureLayer',
    geometryType: 'line',
    style: { color: '#2980B9', weight: 2, opacity: 0.6 },
    simplifyFactor: 0.5,
    precision: 5,
    defaultOn: false,
  },
  {
    id: 'park-and-ride',
    name: 'Park and Ride Locations',
    url: 'https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/ArcGIS/rest/services/Transportation/FeatureServer/5',
    type: 'featureLayer',
    geometryType: 'polygon',
    style: { color: '#27AE60', weight: 2, opacity: 0.7, fillOpacity: 0.35 },
    simplifyFactor: 0.5,
    precision: 5,
    defaultOn: false,
  },
  {
    id: 'west-coast-express-station',
    name: 'West Coast Express Station',
    url: 'https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/ArcGIS/rest/services/Transportation/FeatureServer/7',
    type: 'featureLayer',
    geometryType: 'point',
    style: { color: '#8E44AD', radius: 5, weight: 2, opacity: 0.8 },
    simplifyFactor: 0.5,
    precision: 5,
    defaultOn: false,
  },
  {
    id: 'skytrain-route',
    name: 'SkyTrain Route',
    url: 'https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/ArcGIS/rest/services/Transportation/FeatureServer/8',
    type: 'featureLayer',
    geometryType: 'line',
    style: { color: '#E74C3C', weight: 2, opacity: 0.7 },
    simplifyFactor: 0.5,
    precision: 5,
    defaultOn: false,
  },
  {
    id: 'skytrain-station',
    name: 'SkyTrain Station',
    url: 'https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/ArcGIS/rest/services/Transportation/FeatureServer/9',
    type: 'featureLayer',
    geometryType: 'point',
    style: { color: '#C0392B', radius: 5, weight: 2, opacity: 0.8 },
    simplifyFactor: 0.5,
    precision: 5,
    defaultOn: false,
  },
  {
    id: 'cycling-routes',
    name: 'Cycling Routes',
    url: 'https://services2.arcgis.com/Q6Lq3evZUGfPrN7o/ArcGIS/rest/services/Transportation/FeatureServer/14',
    type: 'featureLayer',
    geometryType: 'line',
    style: { color: '#16A085', weight: 2, opacity: 0.6 },
    simplifyFactor: 0.5,
    precision: 5,
    defaultOn: false,
  },
];

/**
 * Zoning color mapping from HTML reference (19 land use types)
 * Property name: LandUse (not ZONE_CODE)
 */
export const LAND_USE_COLORS: Record<string, string> = {
  'AGR': '#D6D94E',       // Agricultural
  'RURAL': '#BBDF85',     // Rural
  'MHP': '#FAE5C0',       // Mobile Home Park
  'SSR': '#FFFFD6',       // Small-Scale Residential
  'THR': '#FABD14',       // Townhouse Residential
  'MDR': '#B3903E',       // Medium-Density Residential
  'HDR': '#664200',       // High-Density Residential
  'NC': '#FF66BD',        // Neighbourhood Centre
  'TOMU': '#FF0090',      // Transit-Oriented Mixed-Use
  'DTC': '#7D0032',       // City Centre
  'CIVIC': '#3EB4BD',     // Institutional
  'COMM': '#FF6666',      // Commercial
  'COMR': '#FFCDCC',      // Commercial Recreation
  'BUSE': '#9C7BB3',      // Business Enterprise
  'IND': '#CCC4D9',       // Industrial
  'CA': '#05A100',        // Park
  'PR': '#05A100',        // Park & Recreation
  'DEVRS': '#B3B3B3',     // Development Reserve
  'UTOA': '#DEB97A',      // Transit-Oriented Area Reserve
};

/**
 * Land use display names for popups
 */
export const LAND_USE_NAMES: Record<string, string> = {
  'SSR': 'Small-Scale Residential',
  'THR': 'Townhouse Residential',
  'MDR': 'Medium-Density Residential',
  'HDR': 'High-Density Residential',
  'MHP': 'Mobile Home Park',
  'COMM': 'Commercial',
  'COMR': 'Commercial Recreation',
  'NC': 'Neighbourhood Centre',
  'TOMU': 'Transit-Oriented Mixed-Use',
  'DTC': 'City Centre',
  'BUSE': 'Business Enterprise',
  'IND': 'Industrial',
  'CIVIC': 'Institutional',
  'AGR': 'Agricultural',
  'RURAL': 'Rural',
  'CA': 'Park',
  'PR': 'Park & Recreation',
  'DEVRS': 'Development Reserve',
  'UTOA': 'Transit-Oriented Area Reserve',
};
