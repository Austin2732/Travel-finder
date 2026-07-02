"use client";

import { X, Luggage } from "lucide-react";
import { useTripStore } from "@/lib/store";
import { CATEGORY_META, formatPrice, cn } from "@/lib/utils";
import type { TravelCategory } from "@/lib/types";

const ORDER: TravelCategory[] = [
  "flights",
  "hotels",
  "carRentals",
  "food",
  "activities",
  "extras",
];

export default function TripSummary() {
  const { trip, deselectCategory, getTotal, getSelectedCount } = useTripStore();
  const total = getTotal();
  const count = getSelectedCount();

  return (
    <aside
      className="ticket-perforation sticky top-[130px] overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card"
      style={{ "--perf-top": "168px" } as React.CSSProperties}
    >
      <div className="ticket-notch-left" />
      <div className="ticket-notch-right" />

      {/* Stub header */}
      <div className="bg-surface-950 px-5 py-4 text-white">
        <p className="font-mono text-[11px] uppercase tracking-widest text-brand-300">
          {trip.destination ? trip.destination.iataCode ?? trip.destination.countryCode : "No destination"}
        </p>
        <h2 className="font-display text-lg font-bold">
          {trip.destination ? trip.destination.name : "Your trip"}
        </h2>
        <p className="mt-0.5 text-xs text-surface-300">
          {count} of 6 categories selected
        </p>
      </div>

      {/* Selections */}
      <div className="max-h-[46vh] overflow-y-auto px-5 py-4 pt-8">
        {count === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-surface-400">
            <Luggage className="h-6 w-6" />
            <p className="text-xs">
              Choose an option in any category and it'll show up here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {ORDER.map((cat) => {
              const item = trip.selections[cat];
              if (!item) return null;
              const meta = CATEGORY_META[cat];
              return (
                <li key={cat} className="flex items-start gap-2 border-b border-dashed border-surface-200 pb-3 last:border-b-0">
                  <span className="mt-0.5 text-base">{meta.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-surface-900">{item.option.title}</p>
                    <p className="text-xs text-surface-400">{meta.label}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold tabular-nums text-surface-900">
                      {formatPrice(item.option.price)}
                    </span>
                    <button
                      onClick={() => deselectCategory(cat)}
                      aria-label={`Remove ${item.option.title}`}
                      className="text-surface-300 hover:text-rose-500"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-dashed border-surface-200 px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-surface-500">Trip total</span>
          <span className="font-display text-2xl font-extrabold tabular-nums text-surface-900">
            {formatPrice({ amount: total, currency: "USD", unit: "total", taxesIncluded: false })}
          </span>
        </div>
        <button
          disabled={count === 0}
          className={cn(
            "mt-3 w-full rounded-xl py-3 text-sm font-bold transition-colors",
            count > 0
              ? "bg-brand-600 text-white hover:bg-brand-700"
              : "cursor-not-allowed bg-surface-100 text-surface-400"
          )}
        >
          Review trip
        </button>
      </div>
    </aside>
  );
}
