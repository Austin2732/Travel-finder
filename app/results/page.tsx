"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Sparkles, Sun, TrendingUp } from "lucide-react";
import type { TravelCategory, TravelOption, ApiResponse, Destination, SearchParams } from "@/lib/types";
import { searchAllCategories, applyFilters, searchDestinations } from "@/lib/api/search";
import { useTripStore } from "@/lib/store";
import { CATEGORY_META } from "@/lib/utils";
import DestinationSearch from "@/components/DestinationSearch";
import FiltersBar from "@/components/FiltersBar";
import TripSummary from "@/components/TripSummary";
import OptionCard from "@/components/OptionCard";
import PlaceMapPanel from "@/components/PlaceMapPanel";
import { CategorySectionSkeleton } from "@/components/ui/Skeleton";

const ALL_CATEGORIES: TravelCategory[] = ["flights", "hotels", "carRentals", "food", "activities", "extras"];

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-16 text-sm text-surface-400">Loading…</div>}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const destinationQuery = searchParams.get("destination") ?? "";

  const { trip, filters, setSearchParams, setDestination, setFilters, resetFilters } = useTripStore();

  const [results, setResults] = useState<Partial<Record<TravelCategory, ApiResponse<TravelOption[]>>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedDestination, setResolvedDestination] = useState<Destination | null>(trip.destination);
  const [selectedMapOptionId, setSelectedMapOptionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function runResultsSearch() {
      const query = destinationQuery.trim();
      setIsLoading(true);
      setResults({});

      if (!query) {
        setSearchParams({ destinationQuery: "", destination: null });
        setDestination(null);
        setResolvedDestination(null);
        setIsLoading(false);
        return;
      }

      try {
        const matches = await searchDestinations(query);
        const destination = matches[0] ?? null;
        const nextParams: SearchParams = {
          ...trip.searchParams,
          destination,
          destinationQuery: query,
          categories: ALL_CATEGORIES,
        };

        if (cancelled) return;
        setSearchParams({ destinationQuery: query, destination });
        setDestination(destination);
        setResolvedDestination(destination);

        const categoryResults = await searchAllCategories(nextParams, ALL_CATEGORIES);
        if (!cancelled) setResults(categoryResults);
      } catch (error) {
        console.error("[ResultsPage] Search failed", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    runResultsSearch();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationQuery]);

  const visibleCategories = useMemo(() => ALL_CATEGORIES.filter((c) => filters.categories.includes(c)), [filters.categories]);

  const mapOptions = useMemo(() => {
    const food = results.food?.ok ? applyFilters(results.food.data, filters) : [];
    const activities = results.activities?.ok ? applyFilters(results.activities.data, filters) : [];
    return [...food, ...activities].filter((option) => option.address?.geo).slice(0, 12);
  }, [results, filters]);

  const destinationName = (resolvedDestination?.name ?? destinationQuery) || "Your destination";
  const destinationLabel = [resolvedDestination?.name, resolvedDestination?.region, resolvedDestination?.country].filter(Boolean).join(", ");
  const heroImage = resolvedDestination?.coverImage.url ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2400&q=85&auto=format&fit=crop";
  const totalOptions = Object.values(results).reduce((sum, response) => sum + (response?.ok ? response.data.length : 0), 0);

  return (
    <div className="pb-14">
      <section className="relative isolate overflow-hidden bg-surface-950">
        <Image src={heroImage} alt={destinationName} fill priority unoptimized className="-z-20 object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface-950 via-surface-950/80 to-brand-900/30" />
        <div className="absolute inset-0 -z-10 bg-brand-radial opacity-70" />

        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyanpop-100 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-cyanpop-300" />
              Live trip intelligence
            </div>
            <h1 className="text-balance font-display text-4xl font-black leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl">
              {destinationName}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/78">
              Compare restaurants, activities, hotels, cars, flights, and extras with real places, photos, map pins, and trip totals.
            </p>

            <div className="mt-8 max-w-3xl rounded-[1.7rem] border border-white/20 bg-white/15 p-2 shadow-brand backdrop-blur-xl">
              <DestinationSearch initialQuery={destinationQuery} compact />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[1.7rem] border border-white/15 bg-white/90 p-5 shadow-card backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-500"><Sun className="h-6 w-6" /></div>
                <div>
                  <p className="font-display text-3xl font-black text-surface-950">73°F</p>
                  <p className="text-xs font-semibold text-surface-500">Sunny outlook</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.7rem] border border-white/15 bg-white/90 p-5 shadow-card backdrop-blur-xl sm:col-span-2 lg:col-span-1">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-purplepop-100 p-3 text-purplepop-600"><TrendingUp className="h-6 w-6" /></div>
                <div>
                  <p className="font-bold text-surface-950">AI trip read</p>
                  <p className="mt-1 text-sm leading-relaxed text-surface-600">Found {isLoading ? "fresh" : totalOptions || "fresh"} options for {destinationName}. Start with Food & Drink or Activities for the strongest live data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        {resolvedDestination && (
          <div className="mb-6 rounded-[1.5rem] border border-brand-100 bg-white/80 px-5 py-4 text-sm text-surface-700 shadow-card backdrop-blur-xl">
            Showing trip options for <span className="font-bold text-brand-700">{destinationLabel}</span>.
          </div>
        )}

        <div className="sticky top-[73px] z-30 -mx-5 border-y border-surface-200 bg-white/88 px-5 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
          <FiltersBar filters={filters} onChange={setFilters} onReset={resetFilters} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0">
            {isLoading && visibleCategories.map((cat) => <CategorySectionSkeleton key={cat} />)}

            {!isLoading && visibleCategories.map((cat) => {
              const response = results[cat];
              const options = response?.ok ? applyFilters(response.data, filters) : [];
              const meta = CATEGORY_META[cat];

              return (
                <section key={cat} className="my-12 first:mt-0">
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-600">{meta.label}</p>
                      <h2 className="mt-1 flex items-center gap-2 font-display text-3xl font-black tracking-tight text-surface-950">
                        <span>{meta.icon}</span> {meta.plural}
                      </h2>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-surface-500 shadow-sm">
                      {options.length} option{options.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {response && !response.ok && (
                    <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{response.error.message}</p>
                  )}

                  {response?.ok && options.length === 0 && (
                    <p className="rounded-2xl border border-surface-200 bg-white px-4 py-8 text-center text-sm text-surface-400 shadow-card">Nothing matches your current filters in this category.</p>
                  )}

                  {options.length > 0 && (
                    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                      {options.map((option) => {
                        const mapIndex = mapOptions.findIndex((mapOption) => mapOption.id === option.id);
                        return (
                          <OptionCard
                            key={option.id}
                            option={option}
                            mapIndex={mapIndex >= 0 ? mapIndex + 1 : undefined}
                            isMapHighlighted={selectedMapOptionId === option.id}
                            onMapFocus={mapIndex >= 0 ? setSelectedMapOptionId : undefined}
                          />
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <div className="hidden xl:block">
            <div className="sticky top-28 space-y-5">
              <PlaceMapPanel destination={resolvedDestination} options={mapOptions} selectedId={selectedMapOptionId} onSelect={setSelectedMapOptionId} />
              <TripSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
