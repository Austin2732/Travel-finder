"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const ALL_CATEGORIES: TravelCategory[] = [
  "flights",
  "hotels",
  "carRentals",
  "food",
  "activities",
  "extras",
];

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-16 text-sm text-surface-400">Loading…</div>}>
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
    // Keep this tied to the URL query. The store is updated inside this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationQuery]);

  const visibleCategories = useMemo(
    () => ALL_CATEGORIES.filter((c) => filters.categories.includes(c)),
    [filters.categories]
  );

  const mapOptions = useMemo(() => {
    const food = results.food?.ok ? applyFilters(results.food.data, filters) : [];
    const activities = results.activities?.ok ? applyFilters(results.activities.data, filters) : [];
    return [...food, ...activities].filter((option) => option.address?.geo).slice(0, 12);
  }, [results, filters]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6">
        <DestinationSearch initialQuery={destinationQuery} compact />
      </div>

      {resolvedDestination && (
        <div className="mb-6 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900">
          Showing trip options for <span className="font-semibold">{resolvedDestination.name}</span>
          {resolvedDestination.region ? `, ${resolvedDestination.region}` : ""}
          {resolvedDestination.country ? `, ${resolvedDestination.country}` : ""}.
        </div>
      )}

      <FiltersBar filters={filters} onChange={setFilters} onReset={resetFilters} />

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_380px]">
        <div>
          {isLoading && visibleCategories.map((cat) => <CategorySectionSkeleton key={cat} />)}

          {!isLoading &&
            visibleCategories.map((cat) => {
              const response = results[cat];
              const options = response?.ok ? applyFilters(response.data, filters) : [];
              const meta = CATEGORY_META[cat];

              return (
                <section key={cat} className="my-10 first:mt-0">
                  <div className="mb-5 flex items-baseline justify-between">
                    <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-surface-900">
                      <span>{meta.icon}</span> {meta.plural}
                    </h2>
                    <span className="text-xs text-surface-400">
                      {options.length} option{options.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {response && !response.ok && (
                    <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {response.error.message}
                    </p>
                  )}

                  {response?.ok && options.length === 0 && (
                    <p className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-6 text-center text-sm text-surface-400">
                      Nothing matches your current filters in this category.
                    </p>
                  )}

                  {options.length > 0 && (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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

        <div className="hidden space-y-6 xl:block">
          <PlaceMapPanel
            destination={resolvedDestination}
            options={mapOptions}
            selectedId={selectedMapOptionId}
            onSelect={setSelectedMapOptionId}
          />
          <TripSummary />
        </div>
      </div>
    </div>
  );
}
