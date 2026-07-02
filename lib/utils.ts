import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PriceInfo, Rating, TravelCategory } from "./types";

// ─── Tailwind class merging ───────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Price formatting ─────────────────────────────────────────────────────────

const CURRENCY_FORMATTERS: Record<string, Intl.NumberFormat> = {};

function getCurrencyFormatter(currency: string): Intl.NumberFormat {
  if (!CURRENCY_FORMATTERS[currency]) {
    CURRENCY_FORMATTERS[currency] = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return CURRENCY_FORMATTERS[currency];
}

export function formatPrice(price: PriceInfo): string {
  const formatter = getCurrencyFormatter(price.currency);
  return formatter.format(price.amount);
}

export function formatPriceWithUnit(price: PriceInfo): string {
  const base = formatPrice(price);
  const units: Record<typeof price.unit, string> = {
    total: "",
    per_night: "/night",
    per_day: "/day",
    per_person: "/person",
  };
  return `${base}${units[price.unit]}`;
}

export function formatDiscount(price: PriceInfo): string | null {
  if (!price.originalAmount || price.originalAmount <= price.amount) return null;
  const pct = Math.round(
    ((price.originalAmount - price.amount) / price.originalAmount) * 100
  );
  return `${pct}% off`;
}

// ─── Rating helpers ───────────────────────────────────────────────────────────

export function getPrimaryRating(ratings: Rating[]): Rating | null {
  return ratings[0] ?? null;
}

export function formatRating(rating: Rating): string {
  return rating.score.toFixed(1);
}

export function ratingToStars(score: number): number {
  // Convert 0-10 score to 0-5 star scale
  return Math.round((score / 10) * 5 * 2) / 2;
}

// ─── Category metadata ────────────────────────────────────────────────────────

export const CATEGORY_META: Record<
  TravelCategory,
  { label: string; plural: string; icon: string; color: string; bgColor: string }
> = {
  flights: {
    label: "Flight",
    plural: "Flights",
    icon: "✈️",
    color: "text-brand-600",
    bgColor: "bg-brand-50",
  },
  hotels: {
    label: "Hotel",
    plural: "Hotels",
    icon: "🏨",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  carRentals: {
    label: "Car Rental",
    plural: "Car Rentals",
    icon: "🚗",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  food: {
    label: "Restaurant",
    plural: "Food & Drink",
    icon: "🍽️",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
  },
  activities: {
    label: "Activity",
    plural: "Activities",
    icon: "🎭",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  extras: {
    label: "Extra",
    plural: "Extras",
    icon: "🛡️",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
  },
};

// ─── Duration formatting ──────────────────────────────────────────────────────

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ─── String helpers ───────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── URL / Query param helpers ────────────────────────────────────────────────

export function buildResultsUrl(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  return `/results?${sp.toString()}`;
}

// ─── Array helpers ────────────────────────────────────────────────────────────

export function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});
}

export function sortByPrice(options: { price: PriceInfo }[], dir: "asc" | "desc" = "asc") {
  return [...options].sort((a, b) =>
    dir === "asc" ? a.price.amount - b.price.amount : b.price.amount - a.price.amount
  );
}
