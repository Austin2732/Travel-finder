import type {
  TravelOption,
  TravelCategory,
  ApiResponse,
  FilterState,
  SearchParams,
} from "@/lib/types";
import { getOptionsForDestination } from "@/lib/mockData";

// ─── Provider Registry ────────────────────────────────────────────────────────
// Each category maps to an ordered list of provider fetch functions.
// When real API keys are available, replace the mock fetcher with the real one.
// The first provider to return data wins; others are used as fallbacks.

type ProviderFetcher = (params: SearchParams) => Promise<TravelOption[]>;

const PROVIDER_REGISTRY: Record<TravelCategory, ProviderFetcher[]> = {
  flights:    [fetchFlightsMock],
  hotels:     [fetchHotelsMock],
  carRentals: [fetchCarsMock],
  food:       [fetchFoodGoogle, fetchFoodMock],
  activities: [fetchActivitiesGoogle, fetchActivitiesMock],
  extras:     [fetchExtrasMock],
};

// ─── Mock fetchers (replace with real API calls) ──────────────────────────────

async function fetchFlightsMock(params: SearchParams): Promise<TravelOption[]> {
  await delay(300);
  const all = getOptionsForDestination(params.destination?.id ?? "");
  return all.filter((o) => o.category === "flights");
}

async function fetchHotelsMock(params: SearchParams): Promise<TravelOption[]> {
  await delay(400);
  const all = getOptionsForDestination(params.destination?.id ?? "");
  return all.filter((o) => o.category === "hotels");
}

async function fetchCarsMock(params: SearchParams): Promise<TravelOption[]> {
  await delay(250);
  const all = getOptionsForDestination(params.destination?.id ?? "");
  return all.filter((o) => o.category === "carRentals");
}

async function fetchFoodGoogle(params: SearchParams): Promise<TravelOption[]> {
  if (!params.destinationQuery?.trim()) return [];

  const data = await fetchPlaces(params.destinationQuery, "food", params.destination?.geo);
  return (data.places ?? []).map((place, index) => googlePlaceToFoodOption(place, index));
}

async function fetchActivitiesGoogle(params: SearchParams): Promise<TravelOption[]> {
  if (!params.destinationQuery?.trim()) return [];

  const data = await fetchPlaces(params.destinationQuery, "activities", params.destination?.geo);
  return (data.places ?? []).map((place, index) => googlePlaceToActivityOption(place, index));
}

async function fetchFoodMock(params: SearchParams): Promise<TravelOption[]> {
  await delay(350);
  const all = getOptionsForDestination(params.destination?.id ?? "");
  return all.filter((o) => o.category === "food");
}

async function fetchActivitiesMock(params: SearchParams): Promise<TravelOption[]> {
  await delay(400);
  const all = getOptionsForDestination(params.destination?.id ?? "");
  return all.filter((o) => o.category === "activities");
}

async function fetchExtrasMock(params: SearchParams): Promise<TravelOption[]> {
  await delay(200);
  const all = getOptionsForDestination(params.destination?.id ?? "");
  return all.filter((o) => o.category === "extras");
}

// ─── Core Search ──────────────────────────────────────────────────────────────

export async function searchCategory(
  category: TravelCategory,
  params: SearchParams
): Promise<ApiResponse<TravelOption[]>> {
  const fetchers = PROVIDER_REGISTRY[category];

  for (const fetcher of fetchers) {
    try {
      const data = await fetcher(params);
      return {
        ok: true,
        data,
        meta: {
          total: data.length,
          page: 1,
          perPage: data.length,
          cached: false,
          fetchedAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      console.error(`[search] Provider failed for ${category}:`, err);
      // continue to next provider
    }
  }

  return {
    ok: false,
    error: {
      code: "ALL_PROVIDERS_FAILED",
      message: `Could not fetch ${category} results. Please try again.`,
    },
  };
}

export async function searchAllCategories(
  params: SearchParams,
  categories: TravelCategory[] = ["flights", "hotels", "carRentals", "food", "activities", "extras"]
): Promise<Partial<Record<TravelCategory, ApiResponse<TravelOption[]>>>> {
  const results = await Promise.allSettled(
    categories.map((cat) => searchCategory(cat, params).then((res) => [cat, res] as const))
  );

  return Object.fromEntries(
    results
      .filter((r): r is PromiseFulfilledResult<readonly [TravelCategory, ApiResponse<TravelOption[]>]> =>
        r.status === "fulfilled"
      )
      .map((r) => r.value)
  );
}

// ─── Client-side filtering & sorting ─────────────────────────────────────────

export function applyFilters(
  options: TravelOption[],
  filters: FilterState
): TravelOption[] {
  let result = options.filter((o) => {
    if (o.price.amount < filters.priceRange[0]) return false;
    if (o.price.amount > filters.priceRange[1]) return false;

    const primaryRating = o.ratings[0];
    if (primaryRating && primaryRating.score < filters.minRating) return false;

    return true;
  });

  switch (filters.sortBy) {
    case "price_asc":
      result = result.sort((a, b) => a.price.amount - b.price.amount);
      break;
    case "price_desc":
      result = result.sort((a, b) => b.price.amount - a.price.amount);
      break;
    case "rating":
      result = result.sort((a, b) =>
        (b.ratings[0]?.score ?? 0) - (a.ratings[0]?.score ?? 0)
      );
      break;
    case "recommended":
      result = result.sort((a, b) => {
        // Best value first, then featured, then by price
        if (a.isBestValue && !b.isBestValue) return -1;
        if (!a.isBestValue && b.isBestValue) return 1;
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.price.amount - b.price.amount;
      });
      break;
  }

  return result;
}

// ─── Destination autocomplete ─────────────────────────────────────────────────
// In production: replace with Google Places Autocomplete or GeoDB Cities API

export async function searchDestinations(query: string) {
  if (!query.trim()) return [];

  try {
    const data = await fetchPlaces(query, "destinations");
    const places = data.places ?? [];
    if (places.length > 0) return places.map(googlePlaceToDestination);
  } catch (error) {
    console.warn("[searchDestinations] Google Places failed; falling back to mock destinations", error);
  }

  const { destinations } = await import("@/lib/mockData");
  await delay(80);
  const q = query.toLowerCase();
  return destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.region?.toLowerCase().includes(q)
  );
}

// ─── Google Places helpers ───────────────────────────────────────────────────

type GooglePlace = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  websiteUri?: string;
  priceLevel?: string;
  types?: string[];
  photos?: { name: string; widthPx?: number; heightPx?: number; authorAttributions?: { displayName?: string; uri?: string }[] }[];
  regularOpeningHours?: { openNow?: boolean; weekdayDescriptions?: string[] };
  nationalPhoneNumber?: string;
};

type PlacesApiResponse = {
  places?: GooglePlace[];
  error?: string;
  details?: unknown;
};

async function fetchPlaces(
  query: string,
  mode: "destinations" | "food" | "activities",
  location?: { lat: number; lng: number }
): Promise<PlacesApiResponse> {
  const response = await fetch("/api/places", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, mode, location }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error ?? "Places API request failed");
  }

  return data;
}

function googlePlaceToDestination(place: GooglePlace) {
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
    currency: "USD" as const,
    coverImage: {
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80",
      alt: name,
    },
    description: place.formattedAddress ?? `Explore ${name}.`,
    popularFor: ["Restaurants", "Attractions", "Local Favorites", "Trip Planning"],
    bestTimeToVisit: "Year-round",
  };
}

function placePhotoMedia(place: GooglePlace, fallbackAlt: string) {
  const photo = place.photos?.[0];
  if (!photo?.name) return [];

  return [
    {
      url: `/api/places/photo?name=${encodeURIComponent(photo.name)}&w=900`,
      alt: fallbackAlt,
      width: photo.widthPx,
      height: photo.heightPx,
      credit: photo.authorAttributions?.[0]?.displayName,
    },
  ];
}

function placeDetailsHighlights(place: GooglePlace) {
  const highlights: string[] = [];

  if (typeof place.regularOpeningHours?.openNow === "boolean") {
    highlights.push(place.regularOpeningHours.openNow ? "Open now" : "Currently closed");
  }

  if (place.rating) highlights.push(`${place.rating.toFixed(1)}★ on Google`);
  if (place.userRatingCount) highlights.push(`${place.userRatingCount.toLocaleString()} reviews`);
  if (place.googleMapsUri) highlights.push("Open in Google Maps");
  if (place.websiteUri) highlights.push("Website available");
  if (place.nationalPhoneNumber) highlights.push(place.nationalPhoneNumber);

  return highlights.slice(0, 5);
}

function googlePlaceToFoodOption(place: GooglePlace, index: number): TravelOption {
  const title = place.displayName?.text ?? "Restaurant";
  const parsed = parseAddress(place.formattedAddress ?? title);
  const priceLevel = googlePriceLevelToNumber(place.priceLevel);

  return {
    id: `google-food-${place.id}`,
    category: "food",
    details: {
      cuisine: place.types?.slice(0, 3).map(formatPlaceType) ?? ["Local"],
      priceLevel,
      openNow: place.regularOpeningHours?.openNow,
      hours: place.regularOpeningHours?.weekdayDescriptions?.[0],
      mustTryDishes: ["Popular local picks", "Highly rated menu items"],
      reservationRequired: false,
      address: {
        city: parsed.city,
        region: parsed.region,
        country: parsed.country,
        geo: place.location
          ? { lat: place.location.latitude, lng: place.location.longitude }
          : undefined,
      },
    },
    title,
    provider: "Google Places",
    price: { amount: priceLevel * 20, currency: "USD", unit: "per_person", taxesIncluded: false },
    ratings: [{ score: normalizeGoogleRating(place.rating), reviewCount: place.userRatingCount ?? 0, source: "Google" }],
    description: place.formattedAddress ?? "A Google-rated restaurant near your destination.",
    highlights: placeDetailsHighlights(place),
    media: placePhotoMedia(place, title),
    address: {
      city: parsed.city,
      region: parsed.region,
      country: parsed.country,
      geo: place.location
        ? { lat: place.location.latitude, lng: place.location.longitude }
        : undefined,
    },
    tags: ["google", "restaurant", ...(place.types?.slice(0, 2).map(formatPlaceType) ?? [])],
    isFeatured: index === 0,
    isBestValue: index === 1,
    providerMeta: {
      source: "google_places",
      externalId: place.id,
      deepLink: place.googleMapsUri,
      affiliateLink: place.websiteUri,
      lastUpdated: new Date().toISOString(),
    },
  };
}

function googlePlaceToActivityOption(place: GooglePlace, index: number): TravelOption {
  const title = place.displayName?.text ?? "Attraction";
  const parsed = parseAddress(place.formattedAddress ?? title);

  return {
    id: `google-activity-${place.id}`,
    category: "activities",
    details: {
      type: inferActivityType(place.types),
      durationMinutes: 120,
      groupSize: "small_group",
      physicalLevel: "easy",
      includes: ["Google Maps listing", "Reviews", "Location details"],
      meetingPoint: place.formattedAddress,
      languages: ["English"],
      instantConfirmation: false,
    },
    title,
    provider: "Google Places",
    price: { amount: 0, currency: "USD", unit: "per_person", taxesIncluded: false },
    ratings: [{ score: normalizeGoogleRating(place.rating), reviewCount: place.userRatingCount ?? 0, source: "Google" }],
    description: place.formattedAddress ?? "A Google-rated attraction near your destination.",
    highlights: placeDetailsHighlights(place),
    media: placePhotoMedia(place, title),
    address: {
      city: parsed.city,
      region: parsed.region,
      country: parsed.country,
      geo: place.location
        ? { lat: place.location.latitude, lng: place.location.longitude }
        : undefined,
    },
    tags: ["google", "attraction", ...(place.types?.slice(0, 2).map(formatPlaceType) ?? [])],
    isFeatured: index === 0,
    isBestValue: index === 1,
    providerMeta: {
      source: "google_places",
      externalId: place.id,
      deepLink: place.googleMapsUri,
      affiliateLink: place.websiteUri,
      lastUpdated: new Date().toISOString(),
    },
  };
}

function parseAddress(address: string) {
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  const country = parts.at(-1) ?? "United States";
  const region = parts.length > 2 ? parts.at(-2) : undefined;
  const city = parts.length > 1 ? parts[0] : address;

  return {
    city,
    region,
    country,
    countryCode: country === "United States" || country === "USA" ? "US" : country.slice(0, 2).toUpperCase(),
  };
}

function googlePriceLevelToNumber(priceLevel?: string): 1 | 2 | 3 | 4 {
  switch (priceLevel) {
    case "PRICE_LEVEL_EXPENSIVE":
      return 3;
    case "PRICE_LEVEL_VERY_EXPENSIVE":
      return 4;
    case "PRICE_LEVEL_INEXPENSIVE":
      return 1;
    case "PRICE_LEVEL_MODERATE":
    default:
      return 2;
  }
}

function normalizeGoogleRating(rating?: number) {
  return rating ? Math.round(rating * 2 * 10) / 10 : 0;
}

function formatPlaceType(type: string) {
  return type.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function inferActivityType(types?: string[]): "tour" | "adventure" | "cultural" | "entertainment" | "nature" | "food_tour" | "sports" {
  if (!types) return "cultural";
  if (types.some((type) => ["park", "natural_feature", "campground"].includes(type))) return "nature";
  if (types.some((type) => ["stadium", "gym"].includes(type))) return "sports";
  if (types.some((type) => ["amusement_park", "movie_theater", "night_club"].includes(type))) return "entertainment";
  if (types.some((type) => ["restaurant", "food"].includes(type))) return "food_tour";
  return "cultural";
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
