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

const ALL_CATEGORIES: TravelCategory[] = ["flights", "hotels", "carRentals", "food", "activities", "extras"];

export default function FiltersBar({ filters, onChange, onReset }: FiltersBarProps) {
  function toggleCategory(cat: TravelCategory) {
    const active = filters.categories.includes(cat);
    const next = active ? filters.categories.filter((c) => c !== cat) : [...filters.categories, cat];
    onChange({ categories: next });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-2 rounded-full bg-surface-100 px-3 py-2 text-xs font-black uppercase tracking-wide text-surface-500">
        <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
      </span>

      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const active = filters.categories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition-all",
                active
                  ? "border-brand-500 bg-gradient-to-r from-brand-600 to-purplepop-600 text-white shadow-brand"
                  : "border-surface-200 bg-white text-surface-600 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
              )}
            >
              {meta.icon} {meta.plural}
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-surface-500 shadow-sm">
          Min rating
          <select value={filters.minRating} onChange={(e) => onChange({ minRating: Number(e.target.value) })} className="bg-transparent text-xs font-black text-surface-800 outline-none">
            {[0, 3, 4, 5, 6, 7, 8, 9].map((n) => <option key={n} value={n}>{n === 0 ? "Any" : `${n}+`}</option>)}
          </select>
        </label>

        <label className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-surface-500 shadow-sm">
          Sort by
          <select value={filters.sortBy} onChange={(e) => onChange({ sortBy: e.target.value as FilterState["sortBy"] })} className="bg-transparent text-xs font-black text-surface-800 outline-none">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>

        <button onClick={onReset} className="rounded-full px-3 py-2 text-xs font-black text-brand-600 hover:bg-brand-50">Reset</button>
      </div>
    </div>
  );
}
