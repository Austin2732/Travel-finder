"use client";

import Image from "next/image";
import { Check, ExternalLink, ChevronDown, ChevronUp, MapPin, Globe2, Navigation } from "lucide-react";
import { useState } from "react";
import type { TravelOption } from "@/lib/types";
import {
  formatPriceWithUnit,
  formatDiscount,
  CATEGORY_META,
  formatDuration,
  cn,
} from "@/lib/utils";
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
    if (selected) {
      deselectCategory(option.category);
    } else {
      selectOption(option);
    }
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-card transition-all duration-200",
        selected || isMapHighlighted
          ? "border-brand-500 shadow-glow ring-1 ring-brand-500"
          : "border-surface-200 hover:shadow-card-hover hover:border-surface-300"
      )}
      aria-selected={selected || isMapHighlighted}
      onMouseEnter={() => onMapFocus?.(option.id)}
      onFocus={() => onMapFocus?.(option.id)}
    >
      {/* Image */}
      {option.media[0] && (
        <div className="relative h-44 w-full overflow-hidden bg-surface-100">
          <Image
            src={option.media[0].url}
            alt={option.media[0].alt}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {typeof mapIndex === "number" && (
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-900 text-xs font-bold text-white shadow-sm">
                {mapIndex}
              </span>
            )}
            {option.isBestValue && <BestValueBadge />}
            {option.isFeatured && !option.isBestValue && <FeaturedBadge />}
          </div>
        </div>
      )}

      {/* No-image badges */}
      {!option.media[0] && (option.isBestValue || option.isFeatured) && (
        <div className="flex gap-1.5 px-5 pt-4">
          {option.isBestValue && <BestValueBadge />}
          {option.isFeatured && !option.isBestValue && <FeaturedBadge />}
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">

        {/* Header: title + price */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Badge category={option.category} label={`${meta.icon} ${meta.label}`} className="mb-1.5" />
            <h3 className="text-base font-bold leading-snug text-surface-900 line-clamp-2">
              {option.title}
            </h3>
            <p className="mt-0.5 text-sm text-surface-500">{option.provider}</p>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-xl font-extrabold tabular-nums text-surface-900">
              {formatPriceWithUnit(option.price)}
            </p>
            {discount && (
              <p className="text-xs font-semibold text-emerald-600">{discount}</p>
            )}
            {!option.price.taxesIncluded && (
              <p className="text-[11px] text-surface-400">+taxes & fees</p>
            )}
          </div>
        </div>

        {/* Rating */}
        {primaryRating && (
          <StarRating rating={primaryRating} size="sm" />
        )}

        {/* Description */}
        <p className="text-sm leading-relaxed text-surface-600 line-clamp-2">
          {option.description}
        </p>

        {/* Highlights */}
        {option.highlights.length > 0 && (
          <ul className="grid grid-cols-1 gap-1">
            {option.highlights.slice(0, expanded ? undefined : 2).map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-surface-700">
                <span className="mt-0.5 flex-shrink-0 text-emerald-500">✓</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Category-specific detail snippet */}
        <CategoryDetail option={option} />

        {/* Tags */}
        {option.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {option.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-100 px-2.5 py-0.5 text-xs text-surface-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Expand/collapse */}
        {option.highlights.length > 2 && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3" /> {option.highlights.length - 2} more highlights
              </>
            )}
          </button>
        )}

        {/* CTA row */}
        <div className="mt-auto flex gap-2 pt-1">
          <button
            onClick={handleToggle}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
              selected
                ? "bg-brand-600 text-white hover:bg-brand-700"
                : "bg-surface-900 text-white hover:bg-surface-800"
            )}
          >
            {selected && <Check className="h-4 w-4" />}
            {selected ? "Selected" : "Choose This"}
          </button>

          {onMapFocus && (
            <button
              onClick={() => onMapFocus(option.id)}
              className="flex items-center justify-center rounded-xl border border-surface-200 px-3 text-surface-600 transition-colors hover:bg-surface-50 hover:text-surface-900"
              aria-label={`View ${option.title} on map`}
              title="View on map"
            >
              <MapPin className="h-4 w-4" />
            </button>
          )}

          {option.providerMeta.deepLink && (
            <a
              href={option.providerMeta.deepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl border border-surface-200 px-3 text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
              aria-label={`Get directions to ${option.title}`}
              title="Directions"
            >
              <Navigation className="h-4 w-4" />
            </a>
          )}

          {option.providerMeta.affiliateLink && (
            <a
              href={option.providerMeta.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl border border-surface-200 px-3 text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition-colors"
              aria-label={`Open ${option.title} website`}
              title="Website"
            >
              <Globe2 className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Category-specific detail snippets ───────────────────────────────────────

function CategoryDetail({ option }: { option: TravelOption }) {
  if (option.category === "flights") {
    const { details } = option;
    const seg = details.outbound[0];
    return (
      <div className="rounded-xl bg-brand-50 px-3 py-2.5 text-xs text-brand-700">
        <div className="flex items-center justify-between font-semibold">
          <span>{seg.origin}</span>
          <span className="flex-1 text-center text-[10px] tracking-widest text-brand-400">
            ✈ {seg.stops === 0 ? "NONSTOP" : `${seg.stops} STOP`}
          </span>
          <span>{seg.destination}</span>
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-brand-500">
          <span>{formatDuration(seg.durationMinutes)}</span>
          <span>{seg.airline}</span>
          <span>{details.baggage.checked} checked bag{details.baggage.checked !== 1 ? "s" : ""} free</span>
        </div>
      </div>
    );
  }

  if (option.category === "hotels") {
    const { details } = option;
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-500">
        <span>{"⭐".repeat(details.starRating)}</span>
        <span>{details.roomType}</span>
        <span className={cn(details.cancellationPolicy === "free" ? "text-emerald-600 font-medium" : "")}>
          {details.cancellationPolicy === "free" ? "Free cancellation" : details.cancellationPolicy === "partial" ? "Partial refund" : "Non-refundable"}
        </span>
        {details.breakfastIncluded && <span className="font-medium text-emerald-600">Breakfast ✓</span>}
      </div>
    );
  }

  if (option.category === "carRentals") {
    const { details } = option;
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-500">
        <span className="capitalize">{details.vehicleClass}</span>
        <span>{details.seats} seats</span>
        <span className={cn(details.unlimitedMileage ? "font-medium text-emerald-600" : "")}>
          {details.unlimitedMileage ? "Unlimited miles" : "Limited mileage"}
        </span>
        {details.insuranceIncluded && <span className="font-medium text-emerald-600">Insurance ✓</span>}
      </div>
    );
  }

  if (option.category === "food") {
    const { details } = option;
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-500">
        <span>{details.cuisine.join(" · ")}</span>
        <span>{"$".repeat(details.priceLevel)}</span>
        {typeof details.openNow === "boolean" && (
          <span className={details.openNow ? "font-medium text-emerald-600" : "font-medium text-red-500"}>
            {details.openNow ? "Open now" : "Closed now"}
          </span>
        )}
        {details.hours && <span>{details.hours}</span>}
      </div>
    );
  }

  if (option.category === "activities") {
    const { details } = option;
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-500">
        <span>{formatDuration(details.durationMinutes)}</span>
        <span className="capitalize">{details.groupSize.replace("_", " ")}</span>
        <span className={cn(details.instantConfirmation ? "font-medium text-emerald-600" : "")}>
          {details.instantConfirmation ? "Instant confirmation" : "Manual confirmation"}
        </span>
      </div>
    );
  }

  return null;
}
