import Image from "next/image";
import Link from "next/link";
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
      {/* ── Hero: departures board ─────────────────────────────────────── */}
      <section className="border-b border-surface-200 bg-surface-950">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-14 sm:pb-24 sm:pt-20">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono uppercase tracking-widest text-brand-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            One search, six categories, zero overpaying
          </div>

          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            Plan the trip, not just the flight.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-surface-300 sm:text-lg">
            Fareboard runs your destination against flights, hotels, cars, food, and
            activities at once — and flags the best-value pick in every row.
          </p>

          <div className="mt-9">
            <DestinationSearch />
          </div>

          {/* Split-flap board */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-black/40 font-mono text-sm shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-[11px] uppercase tracking-widest text-surface-400">
              <span>Category</span>
              <span>Status</span>
            </div>
            {BOARD_ROWS.map((row, i) => (
              <div
                key={row.code}
                className="flap flex items-center justify-between border-b border-white/5 px-4 py-2.5 text-surface-100 last:border-b-0"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="flex items-center gap-3">
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] text-brand-300">
                    {row.code}
                  </span>
                  {row.label}
                </span>
                <span className="text-[11px] font-semibold tracking-widest text-emerald-400">
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular destinations ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-surface-900 sm:text-3xl">
              Popular right now
            </h2>
            <p className="mt-1 text-sm text-surface-500">
              Jump straight into a full comparison for these destinations.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={buildResultsUrl({ destination: `${dest.name}, ${dest.country}` }) as any}
              className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border border-surface-200 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <Image
                src={dest.coverImage.url}
                alt={dest.coverImage.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="relative p-5 text-white">
                <p className="text-xs font-mono uppercase tracking-widest text-white/70">
                  {dest.iataCode ?? dest.countryCode} · Best {dest.bestTimeToVisit}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold">{dest.name}</h3>
                <p className="mt-1 text-xs text-white/70">
                  {dest.popularFor.slice(0, 3).join(" · ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="border-t border-surface-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-3">
          {[
            {
              title: "Search once",
              body: "Tell us where and when. We fan the search out across six categories at the same time.",
            },
            {
              title: "Compare fairly",
              body: "Every category surfaces its own best-value pick, so you're never just sorting by lowest price.",
            },
            {
              title: "Build the trip",
              body: "Choose one option per category and watch your running total update as you go.",
            },
          ].map((step) => (
            <div key={step.title}>
              <h3 className="font-display text-lg font-bold text-surface-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-500">{step.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
