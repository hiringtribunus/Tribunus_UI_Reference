"use client";

import { Input } from "@/components/ui/input";
import { forwardRef, useState, useEffect } from "react";

type NumberInputProps = {
  value?: number | null;
  onChange?: (value: number | null) => void;
  onBlur?: () => void;
  placeholder?: string;
  step?: string;
  id?: string;
  className?: string;
};

/**
 * Number input that displays formatted values with comma separators.
 * Handles conversion between formatted display and numeric value.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, onBlur, placeholder, step, id, className }, ref) => {
    const [displayValue, setDisplayValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    // Update display value when prop value changes (but not when focused)
    useEffect(() => {
      if (!isFocused) {
        if (value === null || value === undefined) {
          setDisplayValue("");
        } else {
          // Format with comma separators
          setDisplayValue(formatNumberWithCommas(value));
        }
      }
    }, [value, isFocused]);

    const handleFocus = () => {
      setIsFocused(true);
      // On focus, show unformatted value for easier editing
      if (value !== null && value !== undefined) {
        setDisplayValue(String(value));
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      // Parse and format on blur
      const parsed = parseFormattedNumber(displayValue);
      if (onChange) {
        onChange(parsed);
      }
      if (onBlur) {
        onBlur();
      }
      // Update display with formatted value
      if (parsed !== null) {
        setDisplayValue(formatNumberWithCommas(parsed));
      } else {
        setDisplayValue("");
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDisplayValue(newValue);

      // Parse and send numeric value to form
      const parsed = parseFormattedNumber(newValue);
      if (onChange) {
        onChange(parsed);
      }
    };

    return (
      <Input
        ref={ref}
        id={id}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={className}
      />
    );
  }
);

NumberInput.displayName = "NumberInput";

/**
 * Format a number with comma separators (e.g., 1000000 -> "1,000,000")
 */
function formatNumberWithCommas(value: number): string {
  // Handle decimals
  const parts = value.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/**
 * Parse a formatted number string back to a number
 */
function parseFormattedNumber(value: string): number | null {
  if (!value || value.trim() === "") {
    return null;
  }

  // Remove commas and parse
  const cleaned = value.replace(/,/g, "");
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? null : parsed;
}
