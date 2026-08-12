import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  CITY_SEARCH_MIN_QUERY_LENGTH,
  getNormalizedCitySearchLimit,
  getNormalizedCitySearchQuery,
  searchAtlasCities,
  type CitySearchErrorResponse,
  type CitySearchResponse,
} from "@/features/city-search/server";

const DEFAULT_LIMIT =
  10;

function parseLimit(
  value: string | null,
): number {
  if (!value) {
    return DEFAULT_LIMIT;
  }

  const parsedValue =
    Number(value);

  return getNormalizedCitySearchLimit(
    parsedValue,
  );
}

export async function GET(
  request: NextRequest,
) {
  const rawQuery =
    request.nextUrl.searchParams
      .get("q") ?? "";

  const query =
    getNormalizedCitySearchQuery(
      rawQuery,
    );

  const limit =
    parseLimit(
      request.nextUrl.searchParams
        .get("limit"),
    );

  if (
    query.length <
    CITY_SEARCH_MIN_QUERY_LENGTH
  ) {
    const response:
      CitySearchResponse = {
      query:
        rawQuery,

      normalizedQuery:
        query,

      results: [],

      count: 0,

      limit,

      minimumQueryLength:
        CITY_SEARCH_MIN_QUERY_LENGTH,
    };

    return NextResponse.json(
      response,
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
      await searchAtlasCities(
        query,
        limit,
      );

    const response:
      CitySearchResponse = {
      query:
        rawQuery,

      normalizedQuery:
        query,

      results,

      count:
        results.length,

      limit,

      minimumQueryLength:
        CITY_SEARCH_MIN_QUERY_LENGTH,
    };

    return NextResponse.json(
      response,
      {
        status: 200,

        headers: {
          "Cache-Control":
            [
              "public",
              "s-maxage=300",
              "stale-while-revalidate=600",
            ].join(", "),
        },
      },
    );
  } catch (error) {
    console.error(
      "[Atlas City Search API]",
      error,
    );

    const response:
      CitySearchErrorResponse = {
      query:
        rawQuery,

      results: [],

      count: 0,

      error:
        "Unable to search cities right now.",
    };

    return NextResponse.json(
      response,
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