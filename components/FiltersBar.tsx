"use client";

import { SlidersHorizontal } from "lucide-react";
import type { FilterState, TravelCategory } from "@/lib/types";
import { CATEGORY_META, cn } from "@/lib/utils";

interface FiltersBarProps {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

const SORT_OPTIONS: { value: FilterState["sortBy"]; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

const ALL_CATEGORIES: TravelCategory[] = [
  "flights",
  "hotels",
  "carRentals",
  "food",
  "activities",
  "extras",
];

export default function FiltersBar({ filters, onChange, onReset }: FiltersBarProps) {
  function toggleCategory(cat: TravelCategory) {
    const active = filters.categories.includes(cat);
    const next = active
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ categories: next });
  }

  return (
    <div className="sticky top-[65px] z-30 -mx-6 border-b border-surface-200 bg-white/95 px-6 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-surface-400">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filter
        </span>

        {/* Category toggles */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = filters.categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-surface-200 text-surface-500 hover:border-surface-300"
                )}
              >
                {meta.icon} {meta.plural}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Min rating */}
          <label className="flex items-center gap-2 text-xs text-surface-500">
            Min rating
            <select
              value={filters.minRating}
              onChange={(e) => onChange({ minRating: Number(e.target.value) })}
              className="rounded-lg border border-surface-200 bg-white px-2 py-1.5 text-xs font-semibold text-surface-700"
            >
              {[0, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "Any" : `${n}+`}
                </option>
              ))}
            </select>
          </label>

          {/* Sort */}
          <label className="flex items-center gap-2 text-xs text-surface-500">
            Sort
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as FilterState["sortBy"] })}
              className="rounded-lg border border-surface-200 bg-white px-2 py-1.5 text-xs font-semibold text-surface-700"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={onReset}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
