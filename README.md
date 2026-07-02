# Fareboard — travel trip finder

A Next.js 14 (App Router) demo that searches a destination across six
categories — flights, hotels, car rentals, food, activities, extras — and
lets you assemble a one-pick-per-category trip, with each category's
best-value option flagged.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Pages

- `/` — landing page with the destination search and a "departures board"
  hero.
- `/results?destination=Orlando,%20United%20States` — the comparison view.
  Six category sections, a filter/sort bar, and a sticky ticket-style trip
  summary.
- `/trip` — full review of everything you've picked, with a demo "Confirm
  trip" action.

## Data

Everything is mocked in `lib/mockData.ts` and served through the provider
registry in `lib/api/search.ts`. Swap any `fetch*Mock` function there for a
real API call (Amadeus, Booking.com, Yelp, Viator, etc.) — the rest of the
app doesn't need to change.

## Stack

Next.js 14, TypeScript, Tailwind CSS, Zustand (persisted trip state),
Framer Motion, Radix UI primitives, lucide-react icons.
