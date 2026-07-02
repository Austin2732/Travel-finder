import { cn } from "@/lib/utils";
import type { TravelCategory } from "@/lib/types";

const CATEGORY_STYLES: Record<TravelCategory, string> = {
  flights: "bg-brand-50 text-brand-700 ring-brand-200",
  hotels: "bg-purplepop-50 text-purplepop-700 ring-purplepop-100",
  carRentals: "bg-amber-50 text-amber-700 ring-amber-200",
  food: "bg-rose-50 text-rose-700 ring-rose-200",
  activities: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  extras: "bg-slate-50 text-slate-700 ring-slate-200",
};

interface BadgeProps {
  category?: TravelCategory;
  label: string;
  className?: string;
}

export function Badge({ category, label, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-black ring-1 ring-inset", category ? CATEGORY_STYLES[category] : "bg-surface-100 text-surface-600 ring-surface-200", className)}>
      {label}
    </span>
  );
}

export function BestValueBadge({ className }: { className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-3 py-1.5 text-xs font-black text-white shadow-card", className)}>✦ Best Value</span>;
}

export function FeaturedBadge({ className }: { className?: string }) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-purplepop-600 px-3 py-1.5 text-xs font-black text-white shadow-card", className)}>★ Featured</span>;
}
