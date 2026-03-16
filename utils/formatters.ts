/**
 * Formatting utility functions for consistent display across the application
 */

import type { CalendarDate } from "@internationalized/date";

/**
 * Format a number or string as Indonesian Rupiah currency
 * @param amount - The amount to format (number or string)
 * @returns Formatted currency string (e.g., "Rp 1.000.000")
 */
export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

/**
 * Format a decimal number as a percentage
 * @param decimal - The decimal value (e.g., 0.01 for 1%)
 * @returns Formatted percentage string (e.g., "1.00%")
 */
export const formatPercentage = (decimal: number): string => {
  return `${(decimal * 100).toFixed(2)}%`;
};

/**
 * Format a date string to Indonesian long date format
 * @param dateString - ISO date string
 * @param fallback - Optional fallback text if dateString is null/undefined
 * @returns Formatted date string (e.g., "1 Januari 2024")
 */
export const formatDate = (
  dateString: string | null | undefined,
  fallback: string = "—",
): string => {
  if (!dateString) return fallback;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format a date string to Indonesian date and time format
 * @param dateString - ISO date string
 * @param fallback - Optional fallback text if dateString is null/undefined
 * @returns Formatted date and time string (e.g., "1 Januari 2024, 10:30")
 */
export const formatDateTime = (
  dateString: string | null | undefined,
  fallback: string = "—",
): string => {
  if (!dateString) return fallback;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return fallback;

  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format a date string to month and year only (for periods)
 * @param dateString - ISO date string
 * @returns Formatted period string (e.g., "January 2024")
 */
export const formatPeriod = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
};

/**
 * Format a single `@internationalized/date` CalendarDate-like object
 * into an ISO `YYYY-MM-DD` string for query params.
 */
export const formatCalendarDateToQuery = (
  date: CalendarDate | null | undefined,
): string | undefined => {
  if (!date) return undefined;

  const { year, month, day } = date;
  if (
    typeof year !== "number" ||
    typeof month !== "number" ||
    typeof day !== "number"
  ) {
    return undefined;
  }

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}`;
};
