import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  findCityByNameAndCountry,
} from "@/services/city.service";

/* =========================================================
   ROUTE
========================================================= */

export async function GET(
  request: NextRequest,
) {
  try {
    const city =
      request.nextUrl.searchParams.get(
        "city",
      );

    const countryCode =
      request.nextUrl.searchParams.get(
        "countryCode",
      );

    if (
      !city ||
      !countryCode
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

    if (!matchedCity) {
      return NextResponse.json({
        city: null,
      });
    }

    return NextResponse.json({
      city:
        matchedCity,
    });
  } catch (error) {
    console.error(
      "[Visitor City API]",
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