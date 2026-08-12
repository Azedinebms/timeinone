import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
  permanentRedirect,
} from "next/navigation";

import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import CountryWorldClockHero from "@/features/world-clock/components/CountryWorldClockHero";
import WorldClockGrid from "@/features/world-clock/components/WorldClockGrid";

import {
  getWorldClockCountries,
  getWorldClockCountryByCode,
} from "@/features/world-clock";

import {
  SITE_NAME,
  SITE_URL,
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "@/lib/seo";

type CountryPageProps = {
  params: Promise<{
    countryCode: string;
  }>;
};

export const dynamicParams =
  true;

export async function generateStaticParams() {
  const countries =
    await getWorldClockCountries();

  return countries.map(
    (
      country,
    ) => ({
      countryCode:
        country.countryCode.toLowerCase(),
    }),
  );
}

export async function generateMetadata({
  params,
}: CountryPageProps):
  Promise<Metadata> {
  const {
    countryCode,
  } =
    await params;

  const data =
    await getWorldClockCountryByCode(
      countryCode,
      60,
    );

  if (!data) {
    return {
      title:
        "Country Not Found | TimeInOne",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  const code =
    data.country.countryCode.toLowerCase();

  const pageUrl =
    `${SITE_URL}/world-clock/countries/${code}`;

  const title =
    `${data.country.name} World Clock — Local Time & Time Zones | TimeInOne`;

  const description =
    `Explore the ${data.country.name} world clock with current local times, major cities and IANA time zones.`;

  return {
    title,
    description,

    alternates: {
      canonical:
        pageUrl,
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

      title,

      description,

      url:
        pageUrl,

      siteName:
        SITE_NAME,
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,
    },
  };
}

function createCountryJsonLd(
  countryName:
    string,

  countryCode:
    string,
): JsonLdObject[] {
  const path =
    `/world-clock/countries/${countryCode.toLowerCase()}`;

  const pageUrl =
    `${SITE_URL}${path}`;

  const page:
    JsonLdObject = {
    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    "@id":
      `${pageUrl}#webpage`,

    url:
      pageUrl,

    name:
      `${countryName} World Clock`,

    description:
      `Explore current local times, major city clocks and IANA time zones in ${countryName}.`,

    inLanguage:
      "en",

    about: {
      "@type":
        "Country",

      name:
        countryName,

      identifier:
        countryCode,
    },

    isPartOf: {
      "@id":
        `${SITE_URL}/#website`,
    },

    publisher: {
      "@id":
        `${SITE_URL}/#organization`,
    },
  };

  return [
    page,

    createBreadcrumbJsonLd([
      {
        name:
          "Home",

        path:
          "/",
      },
      {
        name:
          "World Clock",

        path:
          "/world-clock",
      },
      {
        name:
          "Countries",

        path:
          "/world-clock/countries",
      },
      {
        name:
          countryName,

        path,
      },
    ]),
  ];
}

export default async function WorldClockCountryPage({
  params,
}: CountryPageProps) {
  const {
    countryCode,
  } =
    await params;

  const normalizedCode =
    decodeURIComponent(
      countryCode,
    )
      .trim()
      .toLowerCase();

  const data =
    await getWorldClockCountryByCode(
      normalizedCode,
      60,
    );

  if (!data) {
    notFound();
  }

  const canonicalCode =
    data.country.countryCode.toLowerCase();

  if (
    normalizedCode !==
    canonicalCode
  ) {
    permanentRedirect(
      `/world-clock/countries/${canonicalCode}`,
    );
  }

  const jsonLd =
    createCountryJsonLd(
      data.country.name,
      data.country.countryCode,
    );

  const timeZones =
    Array.from(
      new Set(
        data.cities.map(
          (
            city,
          ) =>
            city.timeZone,
        ),
      ),
    );

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen overflow-x-hidden bg-background text-text-primary">
        {/* COUNTRY HERO */}

        <CountryWorldClockHero
          countryName={
            data.country.name
          }
          countryCode={
            data.country.countryCode
          }
          cityCount={
            data.country.cityCount
          }
          timeZoneCount={
            timeZones.length
          }
          cities={
            data.cities
          }
        />

        <div className="mx-auto w-full max-w-7xl space-y-8 px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* COUNTRY STATS */}

          <section
            aria-label={`${data.country.name} World Clock statistics`}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Card
              as="article"
              variant="default"
              padding="md"
              interactive
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600">
                ◷
              </span>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
                Database cities
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
                {
                  data.country.cityCount.toLocaleString(
                    "en-US",
                  )
                }
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Cities indexed
                for this country
              </p>
            </Card>

            <Card
              as="article"
              variant="default"
              padding="md"
              interactive
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-600">
                ◎
              </span>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
                Displayed clocks
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
                {
                  data.cities.length
                }
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Major clocks
                on this page
              </p>
            </Card>

            <Card
              as="article"
              variant="default"
              padding="md"
              interactive
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700">
                TZ
              </span>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
                Time zones
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-primary">
                {
                  timeZones.length
                }
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Unique IANA
                zones represented
              </p>
            </Card>

            <Card
              as="article"
              variant="default"
              padding="md"
              interactive
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                ●
              </span>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
                Clock status
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-success">
                Live
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Current local
                time updates
              </p>
            </Card>
          </section>

          {/* CITY CLOCKS */}

          <Card
            id="country-clocks"
            as="section"
            variant="default"
            padding="lg"
            className="scroll-mt-24"
          >
            <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge
                  variant="accent"
                  size="sm"
                >
                  Major cities
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  World clocks in{" "}
                  {
                    data.country.name
                  }
                </h2>

                <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
                  Cities are ordered by
                  population and linked
                  to their individual
                  TimeInOne World Clock
                  pages.
                </p>
              </div>

              <Button
                as={
                  Link
                }
                href="/world-clock/countries"
                variant="secondary"
              >
                All countries
              </Button>
            </div>

            <div className="mt-8">
              <WorldClockGrid
                cities={
                  data.cities
                }
              />
            </div>
          </Card>

          {/* TIME-ZONE SUMMARY */}

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <Card
              as="article"
              variant="default"
              padding="lg"
            >
              <Badge
                variant="info"
                size="sm"
              >
                Time-zone coverage
              </Badge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                Time zones used in{" "}
                {
                  data.country.name
                }
              </h2>

              <p className="mt-3 leading-7 text-text-secondary">
                Major cities on this page
                currently represent the
                following geographical
                IANA time zones.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {timeZones.map(
                  (
                    timeZone,
                  ) => (
                    <span
                      key={
                        timeZone
                      }
                      className="inline-flex rounded-xl border border-border bg-surface-soft px-3 py-2 font-mono text-xs font-semibold text-text-secondary"
                    >
                      {
                        timeZone
                      }
                    </span>
                  ),
                )}
              </div>
            </Card>

            <Card
              as="article"
              variant="soft"
              padding="lg"
              className="relative overflow-hidden border-primary-muted bg-primary-soft/70"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-muted/50 blur-3xl"
              />

              <div className="relative">
                <Badge
                  variant="primary"
                  size="sm"
                >
                  Explore more
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  Compare{" "}
                  {
                    data.country.name
                  }{" "}
                  with the world
                </h2>

                <p className="mt-3 leading-7 text-text-secondary">
                  Convert local times,
                  compare international
                  cities or plan a meeting
                  across time zones.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    as={
                      Link
                    }
                    href="/converter"
                    variant="primary"
                    className="justify-between"
                  >
                    Time Converter

                    <span aria-hidden="true">
                      →
                    </span>
                  </Button>

                  <Button
                    as={
                      Link
                    }
                    href="/meeting-planner"
                    variant="secondary"
                    className="justify-between"
                  >
                    Meeting Planner

                    <span aria-hidden="true">
                      →
                    </span>
                  </Button>

                  <Button
                    as={
                      Link
                    }
                    href="/world-clock"
                    variant="outline"
                    className="justify-between"
                  >
                    Global World Clock

                    <span aria-hidden="true">
                      →
                    </span>
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}