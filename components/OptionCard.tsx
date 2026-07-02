"use client";

import Image from "next/image";
import { Check, ExternalLink, ChevronDown, ChevronUp, MapPin, Globe2, Navigation, Heart } from "lucide-react";
import { useState } from "react";
import type { TravelOption } from "@/lib/types";
import { formatPriceWithUnit, formatDiscount, CATEGORY_META, formatDuration, cn } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import { Badge, BestValueBadge, FeaturedBadge } from "@/components/ui/Badge";
import { useTripStore } from "@/lib/store";

interface OptionCardProps {
  option: TravelOption;
  mapIndex?: number;
  isMapHighlighted?: boolean;
  onMapFocus?: (optionId: string) => void;
}

export default function OptionCard({ option, mapIndex, isMapHighlighted = false, onMapFocus }: OptionCardProps) {
  const { selectOption, deselectCategory, isSelected } = useTripStore();
  const selected = isSelected(option.id);
  const [expanded, setExpanded] = useState(false);

  const meta = CATEGORY_META[option.category];
  const primaryRating = option.ratings[0];
  const discount = formatDiscount(option.price);

  function handleToggle() {
    selected ? deselectCategory(option.category) : selectOption(option);
  }

  return (
    <article
      className={cn(
        "group relative flex min-h-[560px] flex-col overflow-hidden rounded-[1.6rem] border bg-white shadow-card transition-all duration-300",
        selected || isMapHighlighted
          ? "-translate-y-1 border-brand-400 shadow-card-hover ring-4 ring-brand-500/15"
          : "border-white hover:-translate-y-1 hover:border-brand-100 hover:shadow-card-hover"
      )}
      aria-selected={selected || isMapHighlighted}
      onMouseEnter={() => onMapFocus?.(option.id)}
      onFocus={() => onMapFocus?.(option.id)}
    >
      <button className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-surface-700 shadow-card backdrop-blur transition-colors hover:text-rose-500" aria-label={`Save ${option.title}`}>
        <Heart className="h-4 w-4" />
      </button>

      {option.media[0] ? (
        <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-brand-100 to-cyanpop-100">
          <Image
            src={option.media[0].url}
            alt={option.media[0].alt}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950/30 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex max-w-[calc(100%-4rem)] flex-wrap gap-1.5">
            {typeof mapIndex === "number" && (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-surface-950 text-sm font-black text-white shadow-card">{mapIndex}</span>
            )}
            {option.isBestValue && <BestValueBadge />}
            {option.isFeatured && !option.isBestValue && <FeaturedBadge />}
          </div>
        </div>
      ) : (
        <div className="relative h-40 bg-gradient-to-br from-brand-500 via-cyanpop-500 to-purplepop-600 p-4">
          <div className="absolute left-3 top-3 flex gap-1.5">
            {typeof mapIndex === "number" && <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-brand-700 text-sm font-black shadow-card">{mapIndex}</span>}
            {option.isBestValue && <BestValueBadge />}
            {option.isFeatured && !option.isBestValue && <FeaturedBadge />}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Badge category={option.category} label={`${meta.icon} ${meta.label}`} className="mb-2" />
            <h3 className="min-h-[3.6rem] break-words font-display text-xl font-black leading-tight tracking-[-0.02em] text-surface-950">
              {option.title}
            </h3>
            <p className="mt-1 text-sm font-semibold text-surface-500">{option.provider}</p>
          </div>

          <div className="flex-shrink-0 rounded-2xl bg-gradient-to-br from-brand-50 to-cyanpop-50 px-3 py-2 text-right">
            <p className="text-xl font-black tabular-nums text-surface-950">{formatPriceWithUnit(option.price)}</p>
            {discount && <p className="text-xs font-bold text-emerald-600">{discount}</p>}
            {!option.price.taxesIncluded && <p className="text-[11px] font-medium text-surface-400">+taxes & fees</p>}
          </div>
        </div>

        {primaryRating && <StarRating rating={primaryRating} size="sm" />}

        {option.address && (
          <p className="flex items-start gap-2 text-sm leading-relaxed text-surface-600">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500" />
            <span>{[option.address.street, option.address.city, option.address.region, option.address.postalCode].filter(Boolean).join(", ")}</span>
          </p>
        )}

        <p className="text-sm leading-relaxed text-surface-600 line-clamp-2">{option.description}</p>

        {option.highlights.length > 0 && (
          <ul className="grid grid-cols-1 gap-1.5">
            {option.highlights.slice(0, expanded ? undefined : 2).map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm font-medium text-surface-700">
                <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-600">✓</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        <CategoryDetail option={option} />

        {option.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {option.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-full bg-surface-100 px-2.5 py-1 text-xs font-semibold text-surface-500">{tag}</span>
            ))}
          </div>
        )}

        {option.highlights.length > 2 && (
          <button onClick={() => setExpanded((e) => !e)} className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800">
            {expanded ? <><ChevronUp className="h-3 w-3" /> Show less</> : <><ChevronDown className="h-3 w-3" /> {option.highlights.length - 2} more highlights</>}
          </button>
        )}

        <div className="mt-auto flex gap-2 pt-2">
          <button
            onClick={handleToggle}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition-all",
              selected
                ? "bg-gradient-to-r from-brand-600 to-purplepop-600 text-white shadow-brand hover:-translate-y-0.5"
                : "bg-surface-950 text-white hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-brand"
            )}
          >
            {selected && <Check className="h-4 w-4" />}
            {selected ? "Selected" : "Choose"}
          </button>

          {onMapFocus && (
            <button onClick={() => onMapFocus(option.id)} className="flex items-center justify-center rounded-2xl border border-surface-200 px-3 text-surface-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700" aria-label={`View ${option.title} on map`} title="View on map">
              <MapPin className="h-4 w-4" />
            </button>
          )}

          {option.providerMeta.deepLink && (
            <a href={option.providerMeta.deepLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-2xl border border-surface-200 px-3 text-surface-700 transition-colors hover:border-cyanpop-200 hover:bg-cyanpop-50 hover:text-cyanpop-600" aria-label={`Get directions to ${option.title}`} title="Directions">
              <Navigation className="h-4 w-4" />
            </a>
          )}

          {option.providerMeta.affiliateLink && (
            <a href={option.providerMeta.affiliateLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-2xl border border-surface-200 px-3 text-surface-700 transition-colors hover:border-purplepop-100 hover:bg-purplepop-50 hover:text-purplepop-600" aria-label={`Open ${option.title} website`} title="Website">
              <Globe2 className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function CategoryDetail({ option }: { option: TravelOption }) {
  if (option.category === "flights") {
    const { details } = option;
    const seg = details.outbound[0];
    return (
      <div className="rounded-2xl bg-brand-50 px-3 py-2.5 text-xs text-brand-700">
        <div className="flex items-center justify-between font-bold">
          <span>{seg.origin}</span>
          <span className="flex-1 text-center text-[10px] tracking-widest text-brand-400">✈ {seg.stops === 0 ? "NONSTOP" : `${seg.stops} STOP`}</span>
          <span>{seg.destination}</span>
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-brand-500">
          <span>{formatDuration(seg.durationMinutes)}</span><span>{seg.airline}</span><span>{details.baggage.checked} checked bags</span>
        </div>
      </div>
    );
  }

  if (option.category === "hotels") {
    const { details } = option;
    return <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-surface-500"><span>{"⭐".repeat(details.starRating)}</span><span>{details.roomType}</span><span className={details.cancellationPolicy === "free" ? "text-emerald-600" : ""}>{details.cancellationPolicy === "free" ? "Free cancellation" : details.cancellationPolicy}</span>{details.breakfastIncluded && <span className="text-emerald-600">Breakfast ✓</span>}</div>;
  }

  if (option.category === "carRentals") {
    const { details } = option;
    return <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-surface-500"><span className="capitalize">{details.vehicleClass}</span><span>{details.seats} seats</span><span className={details.unlimitedMileage ? "text-emerald-600" : ""}>{details.unlimitedMileage ? "Unlimited miles" : "Limited mileage"}</span>{details.insuranceIncluded && <span className="text-emerald-600">Insurance ✓</span>}</div>;
  }

  if (option.category === "food") {
    const { details } = option;
    return <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-surface-500"><span>{details.cuisine.slice(0, 3).join(" · ")}</span><span>{"$".repeat(details.priceLevel)}</span>{typeof details.openNow === "boolean" && <span className={details.openNow ? "text-emerald-600" : "text-rose-500"}>{details.openNow ? "Open now" : "Closed now"}</span>}{details.hours && <span>{details.hours}</span>}</div>;
  }

  if (option.category === "activities") {
    const { details } = option;
    return <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-surface-500"><span>{formatDuration(details.durationMinutes)}</span><span className="capitalize">{details.groupSize.replace("_", " ")}</span><span className={details.instantConfirmation ? "text-emerald-600" : ""}>{details.instantConfirmation ? "Instant confirmation" : "Manual confirmation"}</span></div>;
  }

  return null;
}
