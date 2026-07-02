import { NextResponse } from "next/server";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.websiteUri",
  "places.priceLevel",
  "places.types",
  "places.photos",
  "places.regularOpeningHours",
  "places.nationalPhoneNumber",
].join(",");

type PlacesRequestBody = {
  query?: string;
  mode?: "destinations" | "food" | "activities";
  location?: {
    lat: number;
    lng: number;
  };
};

export async function POST(req: Request) {
  try {
    const { query, mode = "destinations", location } = (await req.json()) as PlacesRequestBody;

    if (!query?.trim()) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_MAPS_API_KEY" }, { status: 500 });
    }

    const textQuery = buildTextQuery(query, mode);
    const body: Record<string, unknown> = {
      textQuery,
      maxResultCount: mode === "destinations" ? 6 : 9,
      languageCode: "en",
    };

    if (location && mode !== "destinations") {
      body.locationBias = {
        circle: {
          center: {
            latitude: location.lat,
            longitude: location.lng,
          },
          radius: 15000,
        },
      };
    }

    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(body),
      next: { revalidate: 60 * 60 },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Google Places request failed",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Places API route failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

function buildTextQuery(query: string, mode: PlacesRequestBody["mode"]) {
  const trimmed = query.trim();

  if (mode === "food") return `best restaurants in ${trimmed}`;
  if (mode === "activities") return `top attractions and things to do in ${trimmed}`;
  return trimmed;
}
