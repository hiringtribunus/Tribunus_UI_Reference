// Formatting utilities for numbers, currency, and percentages

/**
 * Format a number as Canadian dollars.
 * Returns '—' if value is null or undefined.
 */
export function formatCAD(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number as a percentage.
 * Returns '—' if value is null or undefined.
 */
export function formatPercent(
  value: number | null | undefined,
  decimals = 1
): string {
  if (value === null || value === undefined) return "—";

  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with comma separators.
 * Returns '—' if value is null or undefined.
 */
export function formatNumber(
  value: number | null | undefined,
  decimals = 0
): string {
  if (value === null || value === undefined) return "—";

  return new Intl.NumberFormat("en-CA", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a delta value with +/- prefix and compact notation.
 * Returns '—' if value is null or undefined.
 * Returns empty string if value is 0.
 */
export function formatDelta(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value === 0) return "—";

  const sign = value > 0 ? "+" : "";
  const formatted = formatCAD(Math.abs(value));

  return `${sign}${formatted}`;
}

/**
 * Format a percentage delta value with +/- prefix.
 * Returns '—' if value is null or undefined.
 * Returns empty string if value is 0.
 */
export function formatPercentDelta(
  value: number | null | undefined,
  decimals = 1
): string {
  if (value === null || value === undefined) return "—";
  if (value === 0) return "—";

  const sign = value > 0 ? "+" : "";

  return `${sign}${value.toFixed(decimals)}pp`;
}
