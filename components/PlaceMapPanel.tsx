"use client";

import { ExternalLink, MapPin, Navigation } from "lucide-react";
import type { Destination, TravelOption } from "@/lib/types";
import { cn, getPrimaryRating } from "@/lib/utils";

type MapOption = TravelOption & {
  address: NonNullable<TravelOption["address"]> & {
    geo: NonNullable<NonNullable<TravelOption["address"]>["geo"]>;
  };
};

interface PlaceMapPanelProps {
  destination: Destination | null;
  options: TravelOption[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export default function PlaceMapPanel({ destination, options, selectedId, onSelect }: PlaceMapPanelProps) {
  const mappableOptions = options.filter(hasGeo).slice(0, 12);
  const activeOption = mappableOptions.find((option) => option.id === selectedId) ?? mappableOptions[0];

  const mapCenter = activeOption?.address.geo ?? destination?.geo;
  const mapTitle = activeOption?.title ?? destination?.name ?? "Trip map";
  const mapQuery = activeOption
    ? `${activeOption.title} ${activeOption.address.city ?? ""} ${activeOption.address.region ?? ""}`
    : destination
      ? `${destination.name} ${destination.region ?? ""} ${destination.country}`
      : "United States";

  const mapsUrl = activeOption?.providerMeta.deepLink ?? buildGoogleMapsSearchUrl(mapQuery, mapCenter);
  const embedUrl = buildEmbedMapUrl(mapQuery, mapCenter);

  return (
    <aside className="overflow-hidden rounded-[1.8rem] border border-white bg-white shadow-card">
      <div className="border-b border-surface-100 bg-gradient-to-r from-brand-50 to-cyanpop-50 p-5">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-600">Live map</p>
        <h3 className="mt-1 font-display text-2xl font-black tracking-tight text-surface-950">
          {destination ? `${destination.name} pins` : "Trip pins"}
        </h3>
        <p className="mt-1 text-sm text-surface-500">Tap a result below to preview it on the map.</p>
      </div>

      <div className="relative h-80 bg-surface-100">
        <iframe key={embedUrl} title={`${mapTitle} map`} src={embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full border-0" />
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-black text-surface-800 shadow-card hover:bg-white">
          <Navigation className="h-3.5 w-3.5" /> Directions
        </a>
      </div>

      <div className="max-h-[330px] space-y-2 overflow-y-auto p-3">
        {mappableOptions.length === 0 && (
          <div className="rounded-2xl bg-surface-50 p-4 text-sm text-surface-500">Map pins will appear when live Google Places results include coordinates.</div>
        )}

        {mappableOptions.map((option, index) => {
          const rating = getPrimaryRating(option.ratings);
          const isActive = option.id === activeOption?.id;

          return (
            <button
              key={option.id}
              onClick={() => onSelect?.(option.id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-all",
                isActive ? "border-brand-300 bg-gradient-to-r from-brand-50 to-cyanpop-50 shadow-sm" : "border-surface-100 bg-white hover:border-brand-100 hover:bg-surface-50"
              )}
            >
              <span className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl text-xs font-black", isActive ? "bg-gradient-to-br from-brand-600 to-purplepop-600 text-white" : "bg-surface-950 text-white")}>{index + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block whitespace-normal break-words text-sm font-black leading-snug text-surface-950">{option.title}</span>
                <span className="mt-1 flex items-center gap-1 text-xs text-surface-500"><MapPin className="h-3 w-3" /><span className="truncate">{option.address.street ?? option.address.city}{option.address.region ? `, ${option.address.region}` : ""}</span></span>
                {rating && rating.score > 0 && <span className="mt-1 block text-xs font-bold text-amber-600">{(rating.score / 2).toFixed(1)}★ · {rating.reviewCount.toLocaleString()} reviews</span>}
              </span>
              {option.providerMeta.deepLink && <ExternalLink className="mt-1 h-3.5 w-3.5 text-surface-400" />}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function hasGeo(option: TravelOption): option is MapOption {
  return Boolean(option.address?.geo?.lat && option.address?.geo?.lng);
}

function buildEmbedMapUrl(query: string, geo?: { lat: number; lng: number }) {
  const encodedQuery = encodeURIComponent(query);
  const center = geo ? `${geo.lat},${geo.lng}` : encodedQuery;
  return `https://www.google.com/maps?q=${center}&z=14&output=embed`;
}

function buildGoogleMapsSearchUrl(query: string, geo?: { lat: number; lng: number }) {
  const encodedQuery = encodeURIComponent(query);
  if (geo) return `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lng}&query_place_id=${encodedQuery}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}
