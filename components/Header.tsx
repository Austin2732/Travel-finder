"use client";

import Link from "next/link";
import { PlaneTakeoff, Briefcase } from "lucide-react";
import { useTripStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function Header() {
  const count = useTripStore((s) => s.getSelectedCount());

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-surface-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <PlaneTakeoff className="h-4.5 w-4.5" />
          </span>
          Fareboard
        </Link>

        <Link
          href="/trip"
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            count > 0
              ? "border-brand-600 bg-brand-600 text-white hover:bg-brand-700"
              : "border-surface-200 text-surface-500 hover:border-surface-300 hover:text-surface-700"
          )}
        >
          <Briefcase className="h-4 w-4" />
          My Trip
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold text-brand-700">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
