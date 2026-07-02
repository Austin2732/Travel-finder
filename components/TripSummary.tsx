"use client";

import { X, Luggage, Sparkles } from "lucide-react";
import { useTripStore } from "@/lib/store";
import { CATEGORY_META, formatPrice, cn } from "@/lib/utils";
import type { TravelCategory } from "@/lib/types";

const ORDER: TravelCategory[] = ["flights", "hotels", "carRentals", "food", "activities", "extras"];

export default function TripSummary() {
  const { trip, deselectCategory, getTotal, getSelectedCount } = useTripStore();
  const total = getTotal();
  const count = getSelectedCount();

  return (
    <aside className="overflow-hidden rounded-[1.8rem] border border-white bg-white shadow-card">
      <div className="bg-gradient-to-br from-surface-950 via-brand-900 to-purplepop-700 px-5 py-5 text-white">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-cyanpop-200">Trip Overview</p>
        <h2 className="mt-1 font-display text-2xl font-black tracking-tight">{trip.destination ? trip.destination.name : "Your trip"}</h2>
        <p className="mt-1 text-sm text-white/70">{count} of 6 categories selected</p>
        <div className="mt-4 grid grid-cols-6 gap-1.5">
          {ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const active = Boolean(trip.selections[cat]);
            return <div key={cat} title={meta.label} className={cn("flex h-10 items-center justify-center rounded-xl text-sm transition-colors", active ? "bg-white text-brand-700" : "bg-white/10 text-white/55")}>{meta.icon}</div>;
          })}
        </div>
      </div>

      <div className="p-5">
        {count === 0 ? (
          <div className="rounded-3xl border border-dashed border-surface-300 bg-surface-50 p-6 text-center text-surface-500">
            <Luggage className="mx-auto h-7 w-7 text-brand-500" />
            <p className="mt-3 text-sm font-semibold">Choose items from any category to start building your trip.</p>
          </div>
        ) : (
          <ul className="max-h-[260px] space-y-3 overflow-y-auto pr-1">
            {ORDER.map((cat) => {
              const item = trip.selections[cat];
              if (!item) return null;
              const meta = CATEGORY_META[cat];
              return (
                <li key={cat} className="flex items-start gap-3 rounded-2xl border border-surface-100 bg-surface-50 p-3">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">{meta.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="whitespace-normal break-words text-sm font-black leading-snug text-surface-950">{item.option.title}</p>
                    <p className="mt-0.5 text-xs font-semibold text-surface-400">{meta.label}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-black tabular-nums text-surface-950">{formatPrice(item.option.price)}</span>
                    <button onClick={() => deselectCategory(cat)} aria-label={`Remove ${item.option.title}`} className="text-surface-300 hover:text-rose-500"><X className="h-3.5 w-3.5" /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-5 rounded-3xl bg-gradient-to-br from-brand-50 via-white to-cyanpop-50 p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-black text-surface-600">Estimated total</span>
            <span className="font-display text-3xl font-black tabular-nums text-surface-950">{formatPrice({ amount: total, currency: "USD", unit: "total", taxesIncluded: false })}</span>
          </div>
          <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-brand-700"><Sparkles className="h-3.5 w-3.5" /> AI budget insights coming next.</p>
          <button disabled={count === 0} className={cn("mt-4 w-full rounded-2xl py-3 text-sm font-black transition-all", count > 0 ? "bg-gradient-to-r from-brand-600 to-purplepop-600 text-white shadow-brand hover:-translate-y-0.5" : "cursor-not-allowed bg-surface-200 text-surface-400")}>Review trip</button>
        </div>
      </div>
    </aside>
  );
}
