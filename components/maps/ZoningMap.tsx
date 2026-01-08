"use client";

import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2, Search } from 'lucide-react';
import type { ZoningCollection } from '@/lib/maps/dummy-zoning';
import { ESRI_LAYERS, LAND_USE_COLORS, LAND_USE_NAMES } from '@/lib/maps/esri-layers';

interface ZoningMapProps {
  center: { lat: number; lng: number };
  pin?: { lat: number; lng: number };
  zones: ZoningCollection; // Accepted but ignored - for compatibility with old API
  className?: string;
}

export function ZoningMap({ center, pin, zones, className }: ZoningMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const pinMarkerRef = useRef<any>(null);
  const searchMarkerRef = useRef<any>(null);
  const layersRef = useRef<Record<string, any>>({});
  const layerControlRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Enable client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Clear search when minimizing
  useEffect(() => {
    if (!isMaximized) {
      setSearchQuery('');
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
        searchMarkerRef.current = null;
      }
    }
  }, [isMaximized]);

  // Geocode address search
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    setIsSearching(true);

    try {
      // Use Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'User-Agent': 'Tribunus-UI-Map',
          },
        }
      );

      const results = await response.json();

      if (results && results.length > 0) {
        const result = results[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        // Center map on result
        mapInstanceRef.current.setView([lat, lng], 16);

        // Add/update search marker
        const L = (await import('leaflet')).default;

        if (searchMarkerRef.current) {
          searchMarkerRef.current.remove();
        }

        const searchIcon = L.divIcon({
          className: 'custom-search-marker',
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background: #F59E0B;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        searchMarkerRef.current = L.marker([lat, lng], { icon: searchIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(result.display_name)
          .openPopup();
      }
    } catch (err) {
      console.error('Geocoding failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Initialize map
  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        // Dynamically import Leaflet and plugins
        const L = (await import('leaflet')).default;
        await import('leaflet.markercluster');
        const Esri = await import('esri-leaflet');
        const EsriCluster = await import('esri-leaflet-cluster');

        // Fix webpack bundling issue with marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Create map instance
        const map = L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: 14,
          preferCanvas: true,
          renderer: L.canvas({ padding: 0.5 }),
          fadeAnimation: false,
          markerZoomAnimation: false,
          zoomControl: true,
          attributionControl: true,
        });

        mapInstanceRef.current = map;

        // Add basemap (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          subdomains: ['a', 'b', 'c'],
          maxZoom: 19,
        }).addTo(map);

        // Layer control object
        const overlays: Record<string, any> = {};

        // Add all Esri layers from configuration
        // Always create all layers, but only show some in the control initially
        for (const config of ESRI_LAYERS) {
          let layer: any;

          if (config.type === 'clusterLayer') {
            // Clustered feature layer (for development applications)
            // Access the featureLayer method from the EsriCluster module
            const clusterFeatureLayer = (EsriCluster as any).featureLayer || (EsriCluster as any).default?.featureLayer;

            if (clusterFeatureLayer) {
              layer = clusterFeatureLayer({
                url: config.url,
                cluster: {
                  maxClusterRadius: config.clustering?.maxClusterRadius || 50,
                  disableClusteringAtZoom: config.clustering?.disableClusteringAtZoom || 18,
                  spiderfyOnMaxZoom: true,
                  showCoverageOnHover: false,
                },
                onEachFeature: (feature: any, layer: any) => {
                  // Add popup with all properties
                  const props = feature.properties;
                  const content = Object.entries(props)
                    .filter(([key]) => key !== 'OBJECTID' && key !== 'FID')
                    .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                    .join('<br/>');
                  layer.bindPopup(`<div class="text-xs">${content}</div>`);
                },
              });
            } else {
              // Fallback to regular feature layer if clustering not available
              layer = (Esri as any).featureLayer({
                url: config.url,
                onEachFeature: (feature: any, layer: any) => {
                  const props = feature.properties;
                  const content = Object.entries(props)
                    .filter(([key]) => key !== 'OBJECTID' && key !== 'FID')
                    .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                    .join('<br/>');
                  layer.bindPopup(`<div class="text-xs">${content}</div>`);
                },
              });
            }
          } else {
            // Regular feature layer
            const layerOptions: any = {
              url: config.url,
              style: (feature: any) => {
                // Special styling for zoning layer
                if (config.id === 'zoning-land-use') {
                  const landUse = feature.properties.LandUse || feature.properties.LAND_USE_DESIGNATION || 'UNKNOWN';
                  const color = LAND_USE_COLORS[landUse] || '#999999';
                  return {
                    fillColor: color,
                    fillOpacity: config.style?.fillOpacity || 0.5,
                    color: color,
                    weight: config.style?.weight || 2,
                    opacity: config.style?.opacity || 1,
                  };
                }

                // Standard styling for other layers (lines and polygons)
                if (config.geometryType === 'line' || config.geometryType === 'polygon') {
                  return {
                    color: config.style?.color || '#3388ff',
                    weight: config.style?.weight || 2,
                    opacity: config.style?.opacity || 0.8,
                    fillOpacity: config.style?.fillOpacity,
                  };
                }

                // Point layers will be handled by pointToLayer
                return {
                  color: config.style?.color || '#3388ff',
                };
              },
              onEachFeature: (feature: any, layer: any) => {
                // Special popup for zoning layer with land use names
                if (config.id === 'zoning-land-use') {
                  const landUse = feature.properties.LandUse || feature.properties.LAND_USE_DESIGNATION || 'UNKNOWN';
                  const displayName = LAND_USE_NAMES[landUse] || landUse;
                  const props = feature.properties;
                  const content = `<strong>Land Use:</strong> ${displayName}<br/>` +
                    Object.entries(props)
                      .filter(([key]) => key !== 'OBJECTID' && key !== 'FID' && key !== 'LandUse')
                      .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                      .join('<br/>');
                  layer.bindPopup(`<div class="text-xs max-h-48 overflow-y-auto">${content}</div>`);
                } else {
                  // Standard popup for other layers
                  const props = feature.properties;
                  const content = Object.entries(props)
                    .filter(([key]) => key !== 'OBJECTID' && key !== 'FID')
                    .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
                    .join('<br/>');
                  layer.bindPopup(`<div class="text-xs max-h-48 overflow-y-auto">${content}</div>`);
                }
              },
            };

            // Add pointToLayer for point geometry types
            if (config.geometryType === 'point') {
              layerOptions.pointToLayer = function (geojson: any, latlng: any) {
                return L.circleMarker(latlng, {
                  radius: config.style?.radius || 5,
                  fillColor: config.style?.color || '#3388ff',
                  color: config.style?.color || '#3388ff',
                  weight: config.style?.weight || 2,
                  opacity: config.style?.opacity || 0.8,
                  fillOpacity: config.style?.fillOpacity || 0.6,
                });
              };
            }

            // Add simplification parameters if specified
            if (config.simplifyFactor !== undefined) {
              layerOptions.simplifyFactor = config.simplifyFactor;
            }
            if (config.precision !== undefined) {
              layerOptions.precision = config.precision;
            }

            layer = (Esri as any).featureLayer(layerOptions);
          }

          // Store reference
          layersRef.current[config.id] = layer;

          // Handle layer visibility based on maximized state
          if (isMaximized) {
            // In maximized view: add to control and show if defaultOn
            if (config.defaultOn) {
              layer.addTo(map);
            }
            overlays[config.name] = layer;
          } else {
            // In minimized view: only show zoning layer, no control
            if (config.id === 'zoning-land-use') {
              layer.addTo(map);
            }
          }
        }

        // Add layer controls only when maximized
        if (isMaximized) {
          layerControlRef.current = L.control.layers(
            {}, // No basemap options for now (just CartoDB Light)
            overlays,
            { collapsed: false, position: 'topright' }
          ).addTo(map);
        }

        // Invalidate size to ensure proper rendering
        setTimeout(() => map.invalidateSize(), 100);
      } catch (err) {
        console.error('Failed to initialize map:', err);
        setError('Failed to load map. Please refresh the page.');
      }
    };

    initMap();

    // Cleanup on unmount or when maximized state changes
    return () => {
      if (searchMarkerRef.current) {
        searchMarkerRef.current.remove();
        searchMarkerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, center.lat, center.lng, isMaximized]);

  // Update map center when center prop changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const L = require('leaflet');
    mapInstanceRef.current.setView([center.lat, center.lng], mapInstanceRef.current.getZoom());
  }, [center.lat, center.lng]);

  // Update pin marker when pin prop changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isClient) return;

    const updatePin = async () => {
      const L = (await import('leaflet')).default;

      // Remove existing pin
      if (pinMarkerRef.current) {
        pinMarkerRef.current.remove();
        pinMarkerRef.current = null;
      }

      // Add new pin if provided
      if (pin) {
        // Custom blue pin marker to match design system
        const pinIcon = L.divIcon({
          className: 'custom-pin-marker',
          html: `
            <div style="
              width: 20px;
              height: 20px;
              background: #1A73E8;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        pinMarkerRef.current = L.marker([pin.lat, pin.lng], { icon: pinIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup('Project Location');
      }
    };

    updatePin();
  }, [pin, isClient]);

  // Show loading state during SSR/hydration
  if (!isClient) {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center bg-surface-2 rounded-md">
          <p className="text-sm text-text-3">Loading map...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center bg-surface-2 rounded-md p-4">
          <p className="text-sm text-danger text-center">{error}</p>
        </div>
      </div>
    );
  }

  // Render map container
  const mapContainer = (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );

  // If maximized, show in modal overlay
  if (isMaximized) {
    return (
      <>
        {/* Overlay backdrop - starts below top bar */}
        <div
          className="fixed top-[var(--topbar-height-mobile)] lg:top-[var(--topbar-height-desktop)] left-0 right-0 bottom-0 bg-black/50 z-[9998]"
          onClick={() => setIsMaximized(false)}
        />

        {/* Modal container - positioned below top bar */}
        <div className="fixed top-[calc(var(--topbar-height-mobile)+16px)] lg:top-[calc(var(--topbar-height-desktop)+32px)] left-4 right-4 bottom-4 md:left-8 md:right-8 md:bottom-8 z-[9999] bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center gap-4">
              <h2 className="text-base font-medium text-text whitespace-nowrap">Site Map</h2>

              {/* Address Search */}
              <form onSubmit={handleAddressSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search address..."
                    disabled={isSearching}
                    className="w-full h-9 pl-10 pr-4 bg-surface-2 border border-transparent rounded-pill text-sm text-text placeholder:text-placeholder focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent-border transition-all duration-150 disabled:opacity-50"
                  />
                </div>
              </form>

              <button
                onClick={() => setIsMaximized(false)}
                className="p-1 hover:bg-surface-2 rounded-sm transition-colors ml-auto"
                title="Minimize map"
              >
                <Minimize2 className="h-5 w-5 text-text-2" />
              </button>
            </div>

            {/* Map content */}
            <div className="flex-1 relative">
              {mapContainer}
            </div>
          </div>
        </div>
      </>
    );
  }

  // Normal inline view with maximize button
  return (
    <div className={className}>
      <div className="relative w-full h-full">
        {mapContainer}
        {/* Maximize button - positioned at top-right to match minimized header position */}
        <button
          onClick={() => setIsMaximized(true)}
          className="absolute top-3 right-3 z-[1000] bg-white border border-border rounded-sm p-2 hover:bg-surface-2 hover:border-border-strong transition-colors shadow-md"
          title="Maximize map"
        >
          <Maximize2 className="h-4 w-4 text-text-2" />
        </button>
      </div>
    </div>
  );
}
