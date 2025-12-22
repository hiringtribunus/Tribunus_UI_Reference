"use client";

import { useState } from "react";
import { ZoningCollection, getZoneColor } from "@/lib/maps/dummy-zoning";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/cn";

interface ZoningPlaceholderMapProps {
  center: { lat: number; lng: number };
  pin?: { lat: number; lng: number };
  zones: ZoningCollection;
  className?: string;
}

export function ZoningPlaceholderMap({
  center,
  pin,
  zones,
  className,
}: ZoningPlaceholderMapProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    new Set(["residential", "commercial", "industrial", "parks", "mixed"])
  );

  // SVG viewport dimensions
  const width = 600;
  const height = 450;

  // Calculate bounds from all zone coordinates
  const allCoords = zones.features.flatMap((f) =>
    f.geometry.coordinates[0].map(([lng, lat]) => ({ lat, lng }))
  );

  const minLat = Math.min(...allCoords.map((c) => c.lat));
  const maxLat = Math.max(...allCoords.map((c) => c.lat));
  const minLng = Math.min(...allCoords.map((c) => c.lng));
  const maxLng = Math.max(...allCoords.map((c) => c.lng));

  // Convert lat/lng to SVG coordinates
  const latLngToSvg = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = ((maxLat - lat) / (maxLat - minLat)) * height; // Flip Y axis
    return { x, y };
  };

  // Calculate polygon centroid for label placement
  const getCentroid = (coords: number[][]) => {
    const points = coords.map(([lng, lat]) => latLngToSvg(lat, lng));
    const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    return { x, y };
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Map SVG */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto border border-border rounded-md bg-surface-2"
      >
        {/* Render zones */}
        {zones.features.map((feature, index) => {
          if (!visibleCategories.has(feature.properties.zoneCategory)) return null;

          const points = feature.geometry.coordinates[0]
            .map(([lng, lat]) => {
              const { x, y } = latLngToSvg(lat, lng);
              return `${x},${y}`;
            })
            .join(" ");

          const isSelected = selectedZone === feature.properties.zoneCode;
          const isHovered = hoveredZone === feature.properties.zoneCode;
          const centroid = getCentroid(feature.geometry.coordinates[0]);

          return (
            <g key={index}>
              {/* Zone polygon */}
              <polygon
                points={points}
                fill={getZoneColor(feature.properties.zoneCategory)}
                fillOpacity={isSelected ? 0.6 : isHovered ? 0.5 : 0.3}
                stroke="#333"
                strokeWidth={isSelected || isHovered ? 2 : 1}
                className="cursor-pointer transition-all"
                onClick={() =>
                  setSelectedZone(
                    isSelected ? null : feature.properties.zoneCode
                  )
                }
                onMouseEnter={() => setHoveredZone(feature.properties.zoneCode)}
                onMouseLeave={() => setHoveredZone(null)}
              />

              {/* Zone code label (show on hover or selection) */}
              {(isSelected || isHovered) && (
                <text
                  x={centroid.x}
                  y={centroid.y}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="text-xs font-semibold fill-text pointer-events-none select-none"
                  style={{ fontSize: "12px" }}
                >
                  {feature.properties.zoneCode}
                </text>
              )}
            </g>
          );
        })}

        {/* Project pin */}
        {pin && (
          <g>
            <circle
              cx={latLngToSvg(pin.lat, pin.lng).x}
              cy={latLngToSvg(pin.lat, pin.lng).y}
              r={8}
              fill="#1A73E8"
              stroke="white"
              strokeWidth={2}
              className="drop-shadow-md"
            />
            <circle
              cx={latLngToSvg(pin.lat, pin.lng).x}
              cy={latLngToSvg(pin.lat, pin.lng).y}
              r={3}
              fill="white"
            />
          </g>
        )}
      </svg>

      {/* Legend */}
      <MapLegend
        visibleCategories={visibleCategories}
        onToggle={(category) => {
          const updated = new Set(visibleCategories);
          if (updated.has(category)) {
            updated.delete(category);
          } else {
            updated.add(category);
          }
          setVisibleCategories(updated);
        }}
      />

      {/* Selected zone info */}
      {selectedZone && (
        <div className="text-xs text-text-3 px-3 py-2 bg-surface-2 border border-border rounded-md">
          Selected zone: <span className="font-medium text-text">{selectedZone}</span>
        </div>
      )}
    </div>
  );
}

interface MapLegendProps {
  visibleCategories: Set<string>;
  onToggle: (category: string) => void;
}

function MapLegend({ visibleCategories, onToggle }: MapLegendProps) {
  const categories = [
    { key: "residential", label: "Residential", color: "#FFD700" },
    { key: "commercial", label: "Commercial", color: "#FF6B6B" },
    { key: "industrial", label: "Industrial", color: "#9B59B6" },
    { key: "parks", label: "Parks", color: "#27AE60" },
    { key: "mixed", label: "Mixed Use", color: "#3498DB" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isVisible = visibleCategories.has(cat.key);
        return (
          <button
            key={cat.key}
            onClick={() => onToggle(cat.key)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              isVisible
                ? "bg-surface-2 border border-border text-text"
                : "bg-surface border border-border text-text-3 opacity-50"
            )}
          >
            <div
              className="w-3 h-3 rounded-sm border border-border/50"
              style={{ backgroundColor: cat.color }}
            />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
