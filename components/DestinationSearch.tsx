"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Loader2, X } from "lucide-react";
import type { Destination } from "@/lib/types";
import { useTripStore } from "@/lib/store";
import { buildResultsUrl, cn } from "@/lib/utils";

interface DestinationSearchProps {
  initialQuery?: string;
  compact?: boolean;
  onSearch?: (dest: string) => void;
}

type GooglePlace = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
};

export default function DestinationSearch({
  initialQuery = "",
  compact = false,
  onSearch,
}: DestinationSearchProps) {
  const router = useRouter();
  const { setDestination } = useTripStore();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Destination | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed, mode: "destinations" }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Destination search failed");

      const destinations = (data.places ?? []).map(googlePlaceToDestination);
      setResults(destinations);
      setIsOpen(destinations.length > 0);
    } catch (error) {
      console.error("[DestinationSearch] Google Places autocomplete failed", error);
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!(e.target as Element).closest("[data-destination-search]")) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(dest: Destination) {
    setSelected(dest);
    setQuery(formatDestinationLabel(dest));
    setIsOpen(false);
    setActiveIndex(-1);
    setDestination(dest);
    inputRef.current?.focus();
  }

  function handleClear() {
    setQuery("");
    setSelected(null);
    setResults([]);
    setIsOpen(false);
    setDestination(null);
    inputRef.current?.focus();
  }

  function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    if (selected) setDestination(selected);

    const url = buildResultsUrl({ destination: trimmed });
    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(url as any);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        if (!isOpen) return;
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        if (!isOpen) return;
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
        break;
      case "Enter":
        if (isOpen && activeIndex >= 0 && results[activeIndex]) {
          e.preventDefault();
          handleSelect(results[activeIndex]);
        } else {
          e.preventDefault();
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  return (
    <div
      data-destination-search
      className={cn("relative w-full", compact ? "max-w-2xl" : "mx-auto max-w-5xl")}
    >
      <div
        className={cn(
          "flex overflow-hidden border border-white/70 bg-white/95 shadow-card backdrop-blur-xl transition-all duration-200 focus-within:border-brand-300 focus-within:shadow-glow",
          compact ? "rounded-2xl" : "rounded-[1.7rem]"
        )}
      >
        <div className="flex items-center pl-4 text-surface-400">
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Where do you want to go?"
          aria-label="Destination search"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-activedescendant={activeIndex >= 0 ? `dest-option-${activeIndex}` : undefined}
          role="combobox"
          className={cn(
            "flex-1 bg-transparent py-4 pl-3 pr-2 font-semibold text-surface-900 placeholder:font-medium placeholder:text-surface-400 focus:outline-none",
            compact ? "text-base" : "text-lg"
          )}
        />

        {query && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="flex items-center pr-3 text-surface-400 hover:text-surface-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={handleSearch}
          className={cn(
            "m-1.5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-cyanpop-500 to-purplepop-600 px-5 font-extrabold text-white shadow-brand transition-all hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0",
            compact ? "text-sm py-2.5" : "text-base py-3"
          )}
        >
          <Search className="h-4 w-4" />
          <span className={cn(compact ? "hidden sm:inline" : "")}>Search</span>
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-3 w-full overflow-hidden rounded-3xl border border-surface-200 bg-white/95 shadow-card-hover backdrop-blur-xl animate-slide-down"
        >
          {results.map((dest, i) => (
            <li
              key={dest.id}
              id={`dest-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(dest)}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors",
                i === activeIndex ? "bg-brand-50" : "hover:bg-surface-50",
                i > 0 && "border-t border-surface-100"
              )}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-cyanpop-100 text-brand-700">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900">
                  {dest.name}
                  {dest.region ? `, ${dest.region}` : ""}
                </p>
                <p className="text-xs text-surface-500">{dest.country}</p>
              </div>
              <div className="ml-auto flex flex-wrap gap-1">
                {dest.popularFor.slice(0, 2).map((tag) => (
                  <span key={tag} className="rounded-full bg-surface-100 px-2 py-0.5 text-xs text-surface-500">
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function googlePlaceToDestination(place: GooglePlace): Destination {
  const name = place.displayName?.text ?? "Unknown destination";
  const parsed = parseAddress(place.formattedAddress ?? name);

  return {
    id: `google-${place.id}`,
    name,
    country: parsed.country,
    countryCode: parsed.countryCode,
    region: parsed.region,
    geo: {
      lat: place.location?.latitude ?? 0,
      lng: place.location?.longitude ?? 0,
    },
    timezone: "Etc/UTC",
    currency: "USD",
    coverImage: {
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
      alt: name,
    },
    description: place.formattedAddress ?? `Explore ${name}.`,
    popularFor: ["Google Places", "Restaurants", "Attractions", "Trip Planning"],
    bestTimeToVisit: "Year-round",
  };
}

function parseAddress(address: string) {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  const country = parts.at(-1) ?? "United States";
  const region = parts.length > 2 ? parts.at(-2) : undefined;

  return {
    region,
    country,
    countryCode: country === "United States" || country === "USA" ? "US" : country.slice(0, 2).toUpperCase(),
  };
}

function formatDestinationLabel(dest: Destination) {
  return [dest.name, dest.region, dest.country].filter(Boolean).join(", ");
}
