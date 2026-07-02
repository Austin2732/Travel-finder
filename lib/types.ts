// ─── Core Domain Types ────────────────────────────────────────────────────────

export type TravelCategory =
  | "flights"
  | "hotels"
  | "carRentals"
  | "food"
  | "activities"
  | "extras";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "MXN" | "JPY";

export type PriceUnit = "total" | "per_night" | "per_day" | "per_person";

export interface PriceInfo {
  amount: number;
  currency: CurrencyCode;
  unit: PriceUnit;
  originalAmount?: number; // for showing strikethrough discounts
  taxesIncluded: boolean;
}

export interface Rating {
  score: number;      // 0–10
  reviewCount: number;
  source: string;     // "Google", "Yelp", "TripAdvisor", etc.
}

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface Address {
  street?: string;
  city: string;
  region?: string;
  country: string;
  postalCode?: string;
  geo?: GeoLocation;
}

export interface MediaItem {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  credit?: string;
}

// ─── Provider / Source Metadata ───────────────────────────────────────────────

export type DataSource =
  | "amadeus"
  | "skyscanner"
  | "duffel"
  | "kiwi"
  | "booking_com"
  | "expedia"
  | "google_places"
  | "yelp"
  | "viator"
  | "getyourguide"
  | "rentalcars"
  | "priceline"
  | "mock";

export interface ProviderMeta {
  source: DataSource;
  externalId: string;
  deepLink?: string;      // direct booking link at provider
  affiliateLink?: string; // our tracked link
  lastUpdated: string;    // ISO timestamp
}

// ─── Option Variants ──────────────────────────────────────────────────────────

export interface FlightSegment {
  origin: string;         // IATA code
  destination: string;    // IATA code
  departureAt: string;    // ISO datetime
  arrivalAt: string;      // ISO datetime
  airline: string;
  flightNumber: string;
  aircraft?: string;
  durationMinutes: number;
  cabin: "economy" | "premium_economy" | "business" | "first";
  stops: number;
}

export interface FlightOption {
  outbound: FlightSegment[];
  inbound?: FlightSegment[];   // undefined = one-way
  baggage: {
    carry_on: boolean;
    checked: number;            // number of free checked bags
  };
  fareName: string;             // "Basic Economy", "Main Cabin", etc.
  isRefundable: boolean;
  seatsRemaining?: number;
}

export interface HotelOption {
  starRating: 1 | 2 | 3 | 4 | 5;
  roomType: string;
  bedType: string;
  amenities: string[];
  checkInTime: string;          // "15:00"
  checkOutTime: string;         // "11:00"
  cancellationPolicy: "free" | "partial" | "non_refundable";
  breakfastIncluded: boolean;
  distanceFromCenterKm: number;
}

export interface CarRentalOption {
  vehicleClass: "economy" | "compact" | "midsize" | "fullsize" | "suv" | "luxury" | "van";
  transmissionType: "automatic" | "manual";
  seats: number;
  unlimitedMileage: boolean;
  features: string[];
  pickupLocation: Address;
  dropoffLocation?: Address;    // undefined = same as pickup
  insuranceIncluded: boolean;
}

export interface FoodOption {
  cuisine: string[];
  priceLevel: 1 | 2 | 3 | 4;   // $ to $$$$
  mustTryDishes: string[];
  openNow?: boolean;
  reservationRequired: boolean;
  address: Address;
  hours?: string;
}

export interface ActivityOption {
  type: "tour" | "adventure" | "cultural" | "entertainment" | "nature" | "food_tour" | "sports";
  durationMinutes: number;
  groupSize: "private" | "small_group" | "large_group";
  physicalLevel: "easy" | "moderate" | "challenging";
  includes: string[];
  meetingPoint?: string;
  languages: string[];
  instantConfirmation: boolean;
}

export interface ExtraOption {
  type: "insurance" | "sim_card" | "airport_transfer" | "parking" | "lounge_pass" | "visa";
  coverageDetails?: string;
}

export type CategorySpecificData =
  | { category: "flights";    details: FlightOption }
  | { category: "hotels";     details: HotelOption }
  | { category: "carRentals"; details: CarRentalOption }
  | { category: "food";       details: FoodOption }
  | { category: "activities"; details: ActivityOption }
  | { category: "extras";     details: ExtraOption };

// ─── Core TravelOption ────────────────────────────────────────────────────────

export type TravelOption = {
  id: string;
  category: TravelCategory;
  title: string;
  provider: string;
  price: PriceInfo;
  ratings: Rating[];
  description: string;
  highlights: string[];      // 2–4 bullet points
  media: MediaItem[];
  address?: Address;
  tags: string[];
  isFeatured: boolean;
  isBestValue: boolean;
  providerMeta: ProviderMeta;
} & CategorySpecificData;

// ─── Destination ──────────────────────────────────────────────────────────────

export interface Destination {
  id: string;
  name: string;
  country: string;
  countryCode: string;        // ISO 3166-1 alpha-2
  region?: string;
  iataCode?: string;          // nearest major airport
  geo: GeoLocation;
  timezone: string;
  currency: CurrencyCode;
  coverImage: MediaItem;
  description: string;
  popularFor: string[];
  bestTimeToVisit: string;
}

// ─── Search & Filter State ────────────────────────────────────────────────────

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface SearchParams {
  destination: Destination | null;
  destinationQuery: string;
  dates: DateRange;
  travelers: {
    adults: number;
    children: number;
  };
  categories: TravelCategory[];
}

export interface FilterState {
  priceRange: [number, number];
  minRating: number;
  sortBy: "price_asc" | "price_desc" | "rating" | "recommended";
  categories: TravelCategory[];
}

// ─── Trip Builder State ───────────────────────────────────────────────────────

export interface SelectedItem {
  option: TravelOption;
  quantity: number;
  addedAt: string;            // ISO timestamp
  notes?: string;
}

export interface TripState {
  id: string;
  destination: Destination | null;
  searchParams: SearchParams;
  selections: Record<TravelCategory, SelectedItem | null>;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Envelopes ───────────────────────────────────────────────────

export interface ApiSuccess<T> {
  ok: true;
  data: T;
  meta?: {
    total: number;
    page: number;
    perPage: number;
    cached: boolean;
    fetchedAt: string;
  };
}

export interface ApiError {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Route Params ─────────────────────────────────────────────────────────────

export interface ResultsPageParams {
  destination: string;
  from?: string;
  to?: string;
  adults?: string;
  children?: string;
  categories?: string;
}
