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

import CityTimeDetails from "@/features/world-clock/components/CityTimeDetails";
import CityTimeComparison from "@/features/world-clock/components/CityTimeComparison";
import CityWorldClockHero from "@/features/world-clock/components/CityWorldClockHero";
import RelatedWorldClocks from "@/features/world-clock/components/RelatedWorldClocks";

import {
  createWorldClockCityPath,
  createWorldClockCityRouteSlug,
  getRelatedWorldClockCitiesForCity,
  getWorldClockCityBySlug,
  getWorldClockCityBySlugAndCountry,
  getWorldClockIndexCities,
  parseWorldClockCityRouteSlug,
  type WorldClockCity,
} from "@/features/world-clock";

import {
  SITE_URL,
  createBreadcrumbJsonLd,
  createOrganizationJsonLd,
  createWebsiteJsonLd,
  type JsonLdObject,
} from "@/lib/seo";

type WorldClockCityPageProps = {
  params: Promise<{
    city: string;
  }>;
};

export const dynamicParams =
  true;

async function resolveWorldClockCity(
  routeSlug: string,
): Promise<
  WorldClockCity | null
> {
  const parsedRoute =
    parseWorldClockCityRouteSlug(
      routeSlug,
    );

  if (
    parsedRoute.countryCode
  ) {
    const countryCity =
      await getWorldClockCityBySlugAndCountry(
        parsedRoute.citySlug,
        parsedRoute.countryCode,
      );

    if (countryCity) {
      return countryCity;
    }

    /*
     * Un véritable slug de ville peut
     * parfois se terminer par deux lettres.
     * On tente donc aussi le slug complet.
     */
    return getWorldClockCityBySlug(
      routeSlug,
    );
  }

  return getWorldClockCityBySlug(
    parsedRoute.citySlug,
  );
}

export async function generateStaticParams() {
  const cities =
    await getWorldClockIndexCities(
      24,
    );

  return cities.map(
    (city) => ({
      city:
        createWorldClockCityRouteSlug(
          city,
        ),
    }),
  );
}

export async function generateMetadata({
  params,
}: WorldClockCityPageProps):
  Promise<Metadata> {
  const {
    city: routeSlug,
  } = await params;

  const city =
    await resolveWorldClockCity(
      routeSlug,
    );

  if (!city) {
    return {
      title:
        "World Clock Not Found | TimeInOne",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const pagePath =
    createWorldClockCityPath(
      city,
    );

  const pageUrl =
    `${SITE_URL}${pagePath}`;

  const title =
    `Current Time in ${city.name}, ${city.country} | TimeInOne`;

  const description =
    `Check the current local time, date, UTC offset and IANA time zone in ${city.name}, ${city.country}.`;

  return {
    title,
    description,

    alternates: {
      canonical:
        pageUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      type: "website",
      title,
      description,
      url: pageUrl,
      siteName: "Atlas",
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
    },
  };
}

function createCityWorldClockJsonLd(
  city: WorldClockCity,
): JsonLdObject[] {
  const pagePath =
    createWorldClockCityPath(
      city,
    );

  const pageUrl =
    `${SITE_URL}${pagePath}`;

  const webPage:
    JsonLdObject = {
    "@context":
      "https://schema.org",

    "@type":
      "WebPage",

    "@id":
      `${pageUrl}#webpage`,

    url:
      pageUrl,

    name:
      `Current Time in ${city.name}, ${city.country}`,

    description:
      `Current local time, date, UTC offset and time-zone information for ${city.name}, ${city.country}.`,

    isPartOf: {
      "@id":
        `${SITE_URL}/#website`,
    },

    publisher: {
      "@id":
        `${SITE_URL}/#organization`,
    },

    about: {
      "@type":
        "City",

      name:
        city.name,

      containedInPlace: {
        "@type":
          "Country",

        name:
          city.country,
      },

      ...(typeof city.latitude ===
        "number" &&
      typeof city.longitude ===
        "number"
        ? {
            geo: {
              "@type":
                "GeoCoordinates",

              latitude:
                city.latitude,

              longitude:
                city.longitude,
            },
          }
        : {}),
    },
  };

  const breadcrumbs =
    createBreadcrumbJsonLd([
      {
        name: "Home",
        path: "/",
      },
      {
        name:
          "World Clock",
        path:
          "/world-clock",
      },
      {
        name:
          `${city.name}, ${city.countryCode}`,

        path:
          pagePath,
      },
    ]);

  return [
    createOrganizationJsonLd(),
    createWebsiteJsonLd(),
    webPage,
    breadcrumbs,
  ];
}

export default async function WorldClockCityPage({
  params,
}: WorldClockCityPageProps) {
  const {
    city: routeSlug,
  } = await params;

  const city =
    await resolveWorldClockCity(
      routeSlug,
    );

  if (!city) {
    notFound();
  }

  const canonicalRouteSlug =
    createWorldClockCityRouteSlug(
      city,
    );

  const normalizedRequestedSlug =
    decodeURIComponent(
      routeSlug,
    )
      .trim()
      .toLowerCase();

  if (
    normalizedRequestedSlug !==
    canonicalRouteSlug
  ) {
    permanentRedirect(
      createWorldClockCityPath(
        city,
      ),
    );
  }

  const relatedCities =
    await getRelatedWorldClockCitiesForCity(
      city,
      6,
    );

  const jsonLd =
    createCityWorldClockJsonLd(
      city,
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
        {/* =========================================
            CITY HERO
        ========================================== */}

        <CityWorldClockHero
          city={
            city
          }
        />

        <div className="mx-auto w-full max-w-7xl space-y-8 px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* =====================================
              TIME INTELLIGENCE
          ====================================== */}

          <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <Card
              as="section"
              variant="default"
              padding="lg"
            >
              <Badge
                variant="info"
                size="sm"
              >
                Time intelligence
              </Badge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                Time-zone information
                for{" "}
                {
                  city.name
                }
              </h2>

              <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
                The active UTC offset,
                local abbreviation and
                daylight-saving status
                are calculated using the
                IANA{" "}
                <strong className="font-semibold text-text-primary">
                  {
                    city.timeZone
                  }
                </strong>{" "}
                rules.
              </p>

              <div className="mt-7">
                <CityTimeDetails
                  timeZone={
                    city.timeZone
                  }
                />
              </div>
            </Card>

            <Card
              as="section"
              variant="soft"
              padding="lg"
              className="relative overflow-hidden border-primary-muted bg-primary-soft/70"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-28 -top-32 h-72 w-72 rounded-full bg-primary-muted/50 blur-3xl"
              />

              <div className="relative">
                <Badge
                  variant="primary"
                  size="sm"
                >
                  Time comparison
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  {
                    city.name
                  }{" "}
                  and your local time
                </h2>

                <p className="mt-2 leading-7 text-text-secondary">
                  Compare the current
                  local time in{" "}
                  {
                    city.name
                  }{" "}
                  with your detected time
                  zone and Coordinated
                  Universal Time.
                </p>

                <div className="mt-7">
                  <CityTimeComparison
                    cityName={
                      city.name
                    }
                    timeZone={
                      city.timeZone
                    }
                  />
                </div>
              </div>
            </Card>
          </section>

          {/* =====================================
              LOCATION + CONVERTER
          ====================================== */}

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card
              as="article"
              variant="default"
              padding="lg"
            >
              <Badge
                variant="accent"
                size="sm"
              >
                Location
              </Badge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                About{" "}
                {
                  city.name
                }
              </h2>

              <p className="mt-2 leading-7 text-text-secondary">
                Geographic and World
                Clock information for
                this location.
              </p>

              <dl className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                    City
                  </dt>

                  <dd className="mt-2 font-semibold text-text-primary">
                    {
                      city.name
                    }
                  </dd>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Country
                  </dt>

                  <dd className="mt-2 font-semibold text-text-primary">
                    {
                      city.country
                    }
                  </dd>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Country code
                  </dt>

                  <dd className="mt-2 font-semibold text-text-primary">
                    {
                      city.countryCode
                    }
                  </dd>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Region
                  </dt>

                  <dd className="mt-2 font-semibold text-text-primary">
                    {
                      city.region
                    }
                  </dd>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft p-4 sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Population
                  </dt>

                  <dd className="mt-2 text-xl font-bold tracking-tight text-text-primary">
                    {typeof city.population ===
                    "number"
                      ? new Intl.NumberFormat(
                          "en-US",
                        ).format(
                          city.population,
                        )
                      : "Not available"}
                  </dd>
                </div>
              </dl>
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
                  Compare time
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  Convert time from{" "}
                  {
                    city.name
                  }
                </h2>

                <p className="mt-3 leading-7 text-text-secondary">
                  Compare{" "}
                  {
                    city.name
                  }{" "}
                  with another city,
                  understand the time
                  difference and find
                  comfortable international
                  meeting hours.
                </p>

                <div className="mt-7 rounded-2xl border border-primary-muted bg-white/80 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Source city
                  </p>

                  <div className="mt-3 flex min-w-0 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-lg font-bold text-text-primary">
                        {
                          city.name
                        }
                      </p>

                      <p className="mt-1 truncate font-mono text-xs text-text-muted">
                        {
                          city.timeZone
                        }
                      </p>
                    </div>

                    <span className="shrink-0 rounded-lg border border-primary-muted bg-primary-soft px-2.5 py-1 text-xs font-bold text-primary">
                      {
                        city.countryCode
                      }
                    </span>
                  </div>
                </div>

                <Button
                  as={
                    Link
                  }
                  href={`/converter?from=${encodeURIComponent(
                    city.name,
                  )}`}
                  variant="primary"
                  className="mt-6"
                >
                  Open time converter
                </Button>
              </div>
            </Card>
          </section>

          {/* =====================================
              RELATED WORLD CLOCKS
          ====================================== */}

          <Card
            as="section"
            variant="default"
            padding="lg"
          >
            <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge
                  variant="success"
                  size="sm"
                >
                  Related locations
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  Other world clocks
                </h2>

                <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
                  Compare the current
                  time in{" "}
                  {
                    city.name
                  }{" "}
                  with other important
                  cities around the world.
                </p>
              </div>

              <Button
                as={
                  Link
                }
                href="/world-clock"
                variant="secondary"
              >
                All world clocks
              </Button>
            </div>

            <div className="mt-8">
              <RelatedWorldClocks
                cities={
                  relatedCities
                }
              />
            </div>
          </Card>

          {/* =====================================
              FAQ
          ====================================== */}

          <Card
            as="section"
            variant="default"
            padding="lg"
          >
            <Badge
              variant="warning"
              size="sm"
            >
              Frequently asked questions
            </Badge>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
              Time in{" "}
              {
                city.name
              }{" "}
              FAQ
            </h2>

            <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
              Common questions about
              local time, IANA time-zone
              rules and automatic clock
              updates in{" "}
              {
                city.name
              }.
            </p>

            <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface">
              <details className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-semibold text-text-primary">
                  <span>
                    What time zone does{" "}
                    {
                      city.name
                    }{" "}
                    use?
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-lg text-primary transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>

                <p className="mt-4 leading-7 text-text-secondary">
                  {
                    city.name
                  }{" "}
                  uses the IANA
                  time-zone identifier{" "}
                  <strong className="font-semibold text-text-primary">
                    {
                      city.timeZone
                    }
                  </strong>
                  .
                </p>
              </details>

              <details className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-semibold text-text-primary">
                  <span>
                    Does this clock
                    update automatically?
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-lg text-primary transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>

                <p className="mt-4 leading-7 text-text-secondary">
                  Yes. The TimeInOne clock
                  refreshes every second
                  directly in the browser.
                </p>
              </details>

              <details className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-5 font-semibold text-text-primary">
                  <span>
                    Does TimeInOne account
                    for daylight-saving
                    changes?
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-lg text-primary transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>

                <p className="mt-4 leading-7 text-text-secondary">
                  TimeInOne uses the IANA{" "}
                  {
                    city.timeZone
                  }{" "}
                  rules, so the active
                  UTC offset automatically
                  follows the seasonal
                  rules for the current
                  date.
                </p>
              </details>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}