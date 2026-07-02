"use client";

import Link from "next/link";
import { PlaneTakeoff, Briefcase, Sparkles, Heart } from "lucide-react";
import { useTripStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function Header() {
  const count = useTripStore((s) => s.getSelectedCount());

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-3 font-display text-xl font-extrabold tracking-tight text-surface-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-cyanpop-500 to-purplepop-600 text-white shadow-brand transition-transform group-hover:-rotate-3 group-hover:scale-105">
            <PlaneTakeoff className="h-5 w-5" />
          </span>
          <span>Fareboard</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-surface-600 md:flex">
          <Link href="/" className="text-brand-600">Discover</Link>
          <span className="cursor-default hover:text-surface-950">Trips</span>
          <span className="inline-flex cursor-default items-center gap-1 hover:text-surface-950"><Sparkles className="h-4 w-4 text-purplepop-600" /> AI Assistant</span>
          <span className="inline-flex cursor-default items-center gap-1 hover:text-surface-950"><Heart className="h-4 w-4" /> Saved</span>
        </nav>

        <Link
          href="/trip"
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all",
            count > 0
              ? "border-brand-500 bg-gradient-to-r from-brand-600 to-purplepop-600 text-white shadow-brand hover:-translate-y-0.5"
              : "border-surface-200 bg-white text-surface-600 shadow-sm hover:border-brand-200 hover:text-brand-700"
          )}
        >
          <Briefcase className="h-4 w-4" />
          My Trip
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-extrabold text-brand-700">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
