"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, X, PartyPopper } from "lucide-react";
import { useTripStore } from "@/lib/store";
import { CATEGORY_META, formatPrice, formatPriceWithUnit } from "@/lib/utils";
import type { TravelCategory } from "@/lib/types";

const ORDER: TravelCategory[] = [
  "flights",
  "hotels",
  "carRentals",
  "food",
  "activities",
  "extras",
];

export default function TripPage() {
  const { trip, deselectCategory, clearAll, getTotal, getSelectedCount } = useTripStore();
  const total = getTotal();
  const count = getSelectedCount();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/results"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-surface-500 hover:text-surface-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to results
      </Link>

      <h1 className="font-display text-3xl font-extrabold text-surface-900">
        {trip.destination ? `Your ${trip.destination.name} trip` : "Your trip"}
      </h1>
      <p className="mt-1 text-sm text-surface-500">
        {count} of 6 categories picked · review before you go.
      </p>

      {count === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-surface-300 bg-surface-50 px-6 py-16 text-center">
          <p className="text-sm text-surface-500">Nothing here yet.</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Start a search
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-surface-200 rounded-2xl border border-surface-200 bg-white shadow-card">
            {ORDER.map((cat) => {
              const item = trip.selections[cat];
              if (!item) return null;
              const meta = CATEGORY_META[cat];
              return (
                <li key={cat} className="flex items-start gap-4 p-5">
                  <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg ${meta.bgColor}`}>
                    {meta.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-surface-400">
                      {meta.label}
                    </p>
                    <p className="mt-0.5 font-semibold text-surface-900">{item.option.title}</p>
                    <p className="text-sm text-surface-500">{item.option.provider}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold tabular-nums text-surface-900">
                      {formatPriceWithUnit(item.option.price)}
                    </span>
                    <button
                      onClick={() => deselectCategory(cat)}
                      className="flex items-center gap-1 text-xs font-medium text-surface-400 hover:text-rose-500"
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-surface-200 bg-surface-950 px-6 py-5 text-white">
            <div>
              <p className="text-xs uppercase tracking-widest text-surface-400">Trip total</p>
              <p className="font-display text-3xl font-extrabold tabular-nums">
                {formatPrice({ amount: total, currency: "USD", unit: "total", taxesIncluded: false })}
              </p>
            </div>
            <button
              onClick={() =>
                toast.success("This is a demo — nothing was actually booked.", { icon: "✈️" })
              }
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700"
            >
              <PartyPopper className="h-4 w-4" /> Confirm trip
            </button>
          </div>

          <button
            onClick={clearAll}
            className="mt-4 text-xs font-medium text-surface-400 hover:text-rose-500"
          >
            Clear all selections
          </button>
        </>
      )}
    </div>
  );
}
