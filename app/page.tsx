import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Map, ShieldCheck, Sparkles, Sun } from "lucide-react";
import DestinationSearch from "@/components/DestinationSearch";
import { destinations } from "@/lib/mockData";
import { buildResultsUrl } from "@/lib/utils";

const BOARD_ROWS = [
  { code: "FLT", label: "Flights", status: "COMPARED" },
  { code: "HTL", label: "Hotels", status: "COMPARED" },
  { code: "CAR", label: "Car Rentals", status: "COMPARED" },
  { code: "FOD", label: "Food & Drink", status: "COMPARED" },
  { code: "ACT", label: "Activities", status: "COMPARED" },
  { code: "XTR", label: "Extras", status: "COMPARED" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-surface-950">
        <Image
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2400&q=85&auto=format&fit=crop"
          alt="Scenic travel destination"
          fill
          priority
          unoptimized
          className="-z-20 object-cover opacity-65"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface-950 via-surface-950/78 to-brand-900/40" />
        <div className="absolute inset-0 -z-10 bg-brand-radial opacity-80" />

        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-14 sm:px-6 sm:pb-28 sm:pt-20 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyanpop-100 shadow-card backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-cyanpop-300" />
              AI-powered travel planning
            </div>

            <h1 className="max-w-4xl text-balance font-display text-5xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl md:text-7xl">
              Your perfect trip, planned <span className="bg-gradient-to-r from-cyanpop-300 to-purplepop-500 bg-clip-text text-transparent">in seconds.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/82 sm:text-xl">
              Compare flights, hotels, restaurants, rentals, and experiences in one clean dashboard — then build the best-value trip without the tabs.
            </p>

            <div className="mt-10 rounded-[2rem] border border-white/20 bg-white/15 p-2 shadow-brand backdrop-blur-xl">
              <DestinationSearch />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: BadgeDollarSign, title: "Best-value picks", body: "Find the deal in every category" },
                { icon: Map, title: "Live map", body: "See restaurants and activities nearby" },
                { icon: ShieldCheck, title: "All in one trip", body: "Build, compare, and organize fast" },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/15 bg-white/10 p-4 text-white shadow-card backdrop-blur-xl">
                  <item.icon className="mb-3 h-5 w-5 text-cyanpop-300" />
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/70">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 lg:justify-self-end">
            <div className="animate-float rounded-[2rem] border border-white/20 bg-white/90 p-6 shadow-brand backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-100 text-amber-500">
                  <Sun className="h-8 w-8" />
                </div>
                <div>
                  <p className="font-display text-4xl font-black text-surface-950">72°F</p>
                  <p className="text-sm font-semibold text-surface-500">Sunny travel weather</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-gradient-to-r from-brand-50 to-cyanpop-50 p-4 text-sm text-surface-700">
                <p className="font-bold text-surface-950">AI trip insight</p>
                <p className="mt-1">Search a city to see food, activities, and map pins instantly.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-black/35 font-mono text-sm text-white shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-widest text-white/50">
                <span>Category</span>
                <span>Status</span>
              </div>
              {BOARD_ROWS.map((row, i) => (
                <div key={row.code} className="flap flex items-center justify-between border-b border-white/5 px-4 py-3 last:border-b-0" style={{ animationDelay: `${i * 60}ms` }}>
                  <span className="flex items-center gap-3">
                    <span className="rounded-lg bg-white/10 px-2 py-1 text-[11px] text-cyanpop-200">{row.code}</span>
                    {row.label}
                  </span>
                  <span className="text-[11px] font-black tracking-widest text-emerald-300">{row.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-brand-600">Popular right now</p>
            <h2 className="mt-2 font-display text-3xl font-black tracking-tight text-surface-950 sm:text-4xl">Start with a city people already love</h2>
            <p className="mt-2 text-surface-500">Jump into a full comparison for these destinations.</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <Link key={dest.id} href={buildResultsUrl({ destination: `${dest.name}, ${dest.country}` }) as any} className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-[2rem] border border-white bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
              <Image src={dest.coverImage.url} alt={dest.coverImage.alt} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950/88 via-surface-950/20 to-transparent" />
              <div className="relative p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyanpop-200">{dest.iataCode ?? dest.countryCode} · Best {dest.bestTimeToVisit}</p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl font-black">{dest.name}</h3>
                    <p className="mt-1 text-sm text-white/75">{dest.popularFor.slice(0, 3).join(" · ")}</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-600 transition-transform group-hover:translate-x-1">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
