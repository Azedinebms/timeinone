import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  fetchPopularCities,
  findCities,
} from "@/services/city.service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
) {
  try {
    const searchParams =
      request.nextUrl.searchParams;

    const query =
      searchParams.get("q")?.trim() ?? "";

    const requestedLimit = Number(
      searchParams.get("limit") ?? "20",
    );

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(
          Math.max(
            Math.trunc(requestedLimit),
            1,
          ),
          50,
        )
      : 20;

    const cities =
      query.length >= 2
        ? await findCities(query, limit)
        : await fetchPopularCities(limit);

    return NextResponse.json({
      data: cities,
      meta: {
        query,
        count: cities.length,
        limit,
      },
    });
  } catch (error) {
    console.error(
      "Cities API error:",
      error,
    );

    return NextResponse.json(
      {
        data: [],
        error:
          "Unable to retrieve cities.",
      },
      {
        status: 500,
      },
    );
  }
}