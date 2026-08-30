import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  findCityByNameAndCountry,
} from "@/services/city.service";

/* =========================================================
   GET /api/visitor-city
========================================================= */

export async function GET(
  request: NextRequest,
) {
  try {
    const city =
      request.nextUrl.searchParams
        .get("city")
        ?.trim();

    const countryCode =
      request.nextUrl.searchParams
        .get("countryCode")
        ?.trim()
        .toUpperCase();

    if (
      !city ||
      !countryCode ||
      countryCode.length !== 2
    ) {
      return NextResponse.json(
        {
          city: null,
        },
        {
          status: 400,
        },
      );
    }

    const matchedCity =
      await findCityByNameAndCountry(
        city,
        countryCode,
      );

    return NextResponse.json({
      city:
        matchedCity ?? null,
    });
  } catch (error) {
    console.error(
      "[VisitorCity API]",
      error,
    );

    return NextResponse.json(
      {
        city: null,
      },
      {
        status: 500,
      },
    );
  }
}