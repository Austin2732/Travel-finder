import { cn } from "@/lib/utils";
import type { TravelCategory } from "@/lib/types";

const CATEGORY_STYLES: Record<TravelCategory, string> = {
  flights:    "bg-brand-50 text-brand-700 ring-brand-200",
  hotels:     "bg-violet-50 text-violet-700 ring-violet-200",
  carRentals: "bg-amber-50 text-amber-700 ring-amber-200",
  food:       "bg-rose-50 text-rose-700 ring-rose-200",
  activities: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  extras:     "bg-slate-50 text-slate-700 ring-slate-200",
};

interface BadgeProps {
  category?: TravelCategory;
  label: string;
  className?: string;
}

export function Badge({ category, label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        category ? CATEGORY_STYLES[category] : "bg-surface-100 text-surface-600 ring-surface-200",
        className
      )}
    >
      {label}
    </span>
  );
}

interface BestValueBadgeProps {
  className?: string;
}

export function BestValueBadge({ className }: BestValueBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm",
        className
      )}
    >
      ✦ Best Value
    </span>
  );
}

export function FeaturedBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm",
        className
      )}
    >
      ★ Featured
    </span>
  );
}
