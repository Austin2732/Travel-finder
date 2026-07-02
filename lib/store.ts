"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  TripState,
  TravelCategory,
  TravelOption,
  Destination,
  SearchParams,
  SelectedItem,
  FilterState,
} from "./types";

// ─── Trip Store ───────────────────────────────────────────────────────────────

type TripStore = {
  trip: TripState;
  filters: FilterState;

  // Search
  setSearchParams: (params: Partial<SearchParams>) => void;
  setDestination: (dest: Destination | null) => void;

  // Selection
  selectOption: (option: TravelOption) => void;
  deselectCategory: (category: TravelCategory) => void;
  clearAll: () => void;

  // Filters
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;

  // Computed
  getTotal: () => number;
  getSelectedCount: () => number;
  isSelected: (optionId: string) => boolean;
};

const emptySelections = (): Record<TravelCategory, SelectedItem | null> => ({
  flights: null,
  hotels: null,
  carRentals: null,
  food: null,
  activities: null,
  extras: null,
});

const defaultTrip = (): TripState => ({
  id: crypto.randomUUID(),
  destination: null,
  searchParams: {
    destination: null,
    destinationQuery: "",
    dates: { from: null, to: null },
    travelers: { adults: 2, children: 0 },
    categories: ["flights", "hotels", "carRentals", "food", "activities", "extras"],
  },
  selections: emptySelections(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const defaultFilters = (): FilterState => ({
  priceRange: [0, 2000],
  minRating: 0,
  sortBy: "recommended",
  categories: ["flights", "hotels", "carRentals", "food", "activities", "extras"],
});

export const useTripStore = create<TripStore>()(
  persist(
    (set, get) => ({
      trip: defaultTrip(),
      filters: defaultFilters(),

      setSearchParams: (params) =>
        set((s) => ({
          trip: {
            ...s.trip,
            searchParams: { ...s.trip.searchParams, ...params },
            updatedAt: new Date().toISOString(),
          },
        })),

      setDestination: (dest) =>
        set((s) => ({
          trip: {
            ...s.trip,
            destination: dest,
            searchParams: {
              ...s.trip.searchParams,
              destination: dest,
              destinationQuery: dest ? `${dest.name}, ${dest.country}` : "",
            },
            updatedAt: new Date().toISOString(),
          },
        })),

      selectOption: (option) =>
        set((s) => ({
          trip: {
            ...s.trip,
            selections: {
              ...s.trip.selections,
              [option.category]: {
                option,
                quantity: 1,
                addedAt: new Date().toISOString(),
              } satisfies SelectedItem,
            },
            updatedAt: new Date().toISOString(),
          },
        })),

      deselectCategory: (category) =>
        set((s) => ({
          trip: {
            ...s.trip,
            selections: { ...s.trip.selections, [category]: null },
            updatedAt: new Date().toISOString(),
          },
        })),

      clearAll: () =>
        set((s) => ({
          trip: {
            ...s.trip,
            selections: emptySelections(),
            updatedAt: new Date().toISOString(),
          },
        })),

      setFilters: (filters) =>
        set((s) => ({ filters: { ...s.filters, ...filters } })),

      resetFilters: () => set({ filters: defaultFilters() }),

      getTotal: () => {
        const { selections } = get().trip;
        return Object.values(selections).reduce<number>((sum, item) => {
          return sum + (item ? item.option.price.amount * item.quantity : 0);
        }, 0);
      },

      getSelectedCount: () => {
        return Object.values(get().trip.selections).filter(Boolean).length;
      },

      isSelected: (optionId) => {
        const { selections } = get().trip;
        return Object.values(selections).some(
          (item) => item?.option.id === optionId
        );
      },
    }),
    {
      name: "travel-finder-trip",
      storage: createJSONStorage(() => localStorage),
      // Only persist selections + destination, not ephemeral UI state
      partialize: (s) => ({
        trip: {
          id: s.trip.id,
          destination: s.trip.destination,
          selections: s.trip.selections,
          createdAt: s.trip.createdAt,
          updatedAt: s.trip.updatedAt,
          searchParams: s.trip.searchParams,
        },
      }),
    }
  )
);
