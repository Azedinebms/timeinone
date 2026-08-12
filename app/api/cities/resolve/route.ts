import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  resolveAtlasCitiesByRouteSlugs,
} from "@/features/city-search/server";

const MAX_CITIES =
  5;

export async function GET(
  request:
    NextRequest,
) {
  const rawCities =
    request.nextUrl
      .searchParams
      .get("cities") ?? "";

  const routeSlugs =
    rawCities
      .split(",")
      .map(
        (value) =>
          value
            .trim()
            .toLowerCase(),
      )
      .filter(Boolean)
      .slice(
        0,
        MAX_CITIES,
      );

  if (
    routeSlugs.length ===
    0
  ) {
    return NextResponse.json(
      {
        results: [],
        count: 0,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  }

  try {
    const results =
      await resolveAtlasCitiesByRouteSlugs(
        routeSlugs,
      );

    return NextResponse.json(
      {
        results,
        count:
          results.length,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            [
              "public",
              "s-maxage=3600",
              "stale-while-revalidate=86400",
            ].join(", "),
        },
      },
    );
  } catch (error) {
    console.error(
      "[Atlas City Resolver]",
      error,
    );

    return NextResponse.json(
      {
        results: [],
        count: 0,

        error:
          "Unable to restore shared cities.",
      },
      {
        status: 500,

        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  }
}