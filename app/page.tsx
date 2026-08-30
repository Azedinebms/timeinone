import type {
  Metadata,
} from "next";

import Header from "@/components/layout/Header";

import ConverterHero from "@/features/converter/components/ConverterHero";

import {
  SITE_URL,
} from "@/lib/seo";

import {
  findCityByGeonameId,
  findCityById,
} from "@/services/city.service";

/* =========================================================
   METADATA
========================================================= */

export const metadata:
  Metadata = {
  title:
    "Time Zone Converter — Compare Cities & Time Zones | TimeInOne",

  description:
    "Convert time between cities and time zones instantly. Compare UTC offsets, working hours and better meeting times with TimeInOne.",

  alternates: {
    canonical:
      SITE_URL,
  },

  robots: {
    index:
      true,

    follow:
      true,
  },

  openGraph: {
    type:
      "website",

    title:
      "Time Zone Converter — Compare Cities & Time Zones | TimeInOne",

    description:
      "Convert time between cities and time zones instantly. Compare UTC offsets, working hours and better meeting times with TimeInOne.",

    url:
      SITE_URL,

    siteName:
      "TimeInOne",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Time Zone Converter — Compare Cities & Time Zones | TimeInOne",

    description:
      "Convert time between cities and time zones instantly. Compare UTC offsets, working hours and better meeting times with TimeInOne.",
  },
};

/* =========================================================
   TYPES
========================================================= */

type HomePageProps = {
  searchParams: Promise<{
    from?: string;
    to?: string;
    datetime?: string;
  }>;
};

/* =========================================================
   DEFAULT CITIES
========================================================= */

const CASABLANCA_GEONAME_ID =
  2553604;

const NEW_YORK_GEONAME_ID =
  5128581;

/* =========================================================
   HELPERS
========================================================= */

function parseCityId(
  value?: string,
): number | null {
  if (!value) {
    return null;
  }

  const id =
    Number(
      value,
    );

  return (
    Number.isInteger(
      id,
    ) &&
    id > 0
      ? id
      : null
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function HomePage({
  searchParams,
}: HomePageProps) {
  const params =
    await searchParams;

  const fromId =
    parseCityId(
      params.from,
    );

  const toId =
    parseCityId(
      params.to,
    );

  const [
    defaultFromCity,
    defaultToCity,
    requestedFromCity,
    requestedToCity,
  ] =
    await Promise.all([
      findCityByGeonameId(
        CASABLANCA_GEONAME_ID,
      ),

      findCityByGeonameId(
        NEW_YORK_GEONAME_ID,
      ),

      fromId
        ? findCityById(
            fromId,
          )
        : Promise.resolve(
            null,
          ),

      toId
        ? findCityById(
            toId,
          )
        : Promise.resolve(
            null,
          ),
    ]);

  /*
   * Explicit URL selection
   * always has priority.
   *
   * Otherwise Casablanca is
   * initially rendered and the
   * browser may replace it with
   * visitor city after hydration.
   */
  const fromCity =
    requestedFromCity ??
    defaultFromCity;

  const toCity =
    requestedToCity ??
    defaultToCity;

  if (
    !fromCity ||
    !toCity
  ) {
    throw new Error(
      "TimeInOne default cities are missing from the database.",
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        <ConverterHero
          initialFromCity={
            fromCity
          }
          initialToCity={
            toCity
          }
          initialDateTime={
            params.datetime ??
            ""
          }
        />
      </main>
    </>
  );
}