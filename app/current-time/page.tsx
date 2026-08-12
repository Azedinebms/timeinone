import type {
  Metadata,
} from "next";

import Link from "next/link";

import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import CurrentTimeCitySearch from "@/features/current-time/components/CurrentTimeCitySearch";

import {
  fetchPopularCities,
} from "@/services/city.service";

import {
  SITE_NAME,
  SITE_URL,
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "@/lib/seo";

/* =========================================================
   CONFIG
========================================================= */

const POPULAR_CITY_LIMIT =
  12;

/* =========================================================
   METADATA
========================================================= */

const TITLE =
  "Current Time Around the World | TimeInOne";

const DESCRIPTION =
  "Find the current local time, date, UTC offset and time zone for cities around the world with TimeInOne.";

export const metadata:
  Metadata = {
  title:
    TITLE,

  description:
    DESCRIPTION,

  alternates: {
    canonical:
      `${SITE_URL}/current-time`,
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
      TITLE,

    description:
      DESCRIPTION,

    url:
      `${SITE_URL}/current-time`,

    siteName:
      SITE_NAME,
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      TITLE,

    description:
      DESCRIPTION,
  },
};

/* =========================================================
   JSON-LD
========================================================= */

function createCurrentTimeIndexJsonLd():
  JsonLdObject[] {
  const pageUrl =
    `${SITE_URL}/current-time`;

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
      "Current Time Around the World",

    description:
      DESCRIPTION,

    inLanguage:
      "en",

    isPartOf: {
      "@id":
        `${SITE_URL}/#website`,
    },

    publisher: {
      "@id":
        `${SITE_URL}/#organization`,
    },
  };

  const breadcrumbs =
    createBreadcrumbJsonLd([
      {
        name:
          "Home",

        path:
          "/",
      },

      {
        name:
          "Current Time",

        path:
          "/current-time",
      },
    ]);

  return [
    page,
    breadcrumbs,
  ];
}

/* =========================================================
   PAGE
========================================================= */

export default async function CurrentTimeIndexPage() {
  const popularCities =
    await fetchPopularCities(
      POPULAR_CITY_LIMIT,
    );

  const jsonLd =
    createCurrentTimeIndexJsonLd();

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
            HERO
        ========================================== */}

        <section className="relative border-b border-border bg-gradient-to-b from-primary-soft/70 via-background to-background">
          {/* DECORATION */}

                <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            <div className="absolute -right-36 -top-36 h-96 w-96 rounded-full bg-primary-muted/40 blur-3xl" />

            <div className="absolute -bottom-36 left-1/4 h-80 w-80 rounded-full bg-violet-100/40 blur-3xl" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-5 py-7 sm:px-6 sm:py-9 lg:px-8">
            {/* BREADCRUMB */}

            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-text-muted"
            >
              <Link
                href="/"
                className="rounded-md outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                Home
              </Link>

              <span
                aria-hidden="true"
                className="text-text-subtle"
              >
                /
              </span>

              <span
                aria-current="page"
                className="font-medium text-text-secondary"
              >
                Current Time
              </span>
            </nav>

            {/* HERO GRID */}

            <div className="mt-7 grid gap-9 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-12">
              {/* LEFT */}

              <div>
                <Badge
                  variant="primary"
                  size="sm"
                  dot
                >
                  Current Local Time
                </Badge>

                <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-text-primary sm:text-5xl lg:text-6xl">
                  Current Time

                  <span className="block text-primary">
                    Around the World
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                  Find the current local
                  time, date, UTC offset
                  and official IANA time
                  zone for cities around
                  the world.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                    Live local time
                  </span>

                  <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                    UTC offsets
                  </span>

                  <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                    IANA time zones
                  </span>

                  <span className="rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
                    DST aware
                  </span>
                </div>
              </div>

              {/* SEARCH */}

              <Card
  as="section"
  variant="elevated"
  padding="lg"
  className="relative z-30 overflow-visible"
>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-20 -top-px h-px bg-gradient-to-r from-transparent via-primary-muted to-transparent"
                />

                <Badge
                  variant="info"
                  size="sm"
                >
                  Find a city
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  What time is it?
                </h2>

                <p className="mt-2 leading-7 text-text-secondary">
                  Search for any city
                  to open its dedicated
                  current local time page.
                </p>

                <div className="mt-6">
                  <CurrentTimeCitySearch
                    placeholder="Search a city, country or time zone..."
                    limit={
                      10
                    }
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-text-muted">
                  Search results open the
                  Current Time page for
                  the selected city.
                </p>
              </Card>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl space-y-8 px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* =====================================
              POPULAR CURRENT TIMES
          ====================================== */}

          <Card
            as="section"
            variant="default"
            padding="lg"
          >
            <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge
                  variant="accent"
                  size="sm"
                >
                  Popular cities
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  Popular current times
                </h2>

                <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
                  Open a city to see its
                  current local time,
                  date, UTC offset and
                  time-zone information.
                </p>
              </div>

              <Button
                as={
                  Link
                }
                href="/world-clock"
                variant="secondary"
              >
                Explore World Clock
              </Button>
            </div>

            {/* CITY DIRECTORY */}

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popularCities.map(
                (
                  city,
                ) => {
                  const countryCode =
                    city.countryCode
                      .trim()
                      .toLowerCase();

                  const path =
                    `/current-time/${countryCode}/${city.slug}`;

                  return (
                    <Link
                      key={
                        `${countryCode}-${city.slug}`
                      }
                      href={
                        path
                      }
                      className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-muted hover:bg-primary-soft/30 hover:shadow-md"
                    >
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary-soft opacity-0 blur-2xl transition group-hover:opacity-100"
                      />

                      <div className="relative">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-lg font-bold text-text-primary transition group-hover:text-primary">
                              {
                                city.city
                              }
                            </p>

                            <p className="mt-1 truncate text-sm font-medium text-text-secondary">
                              {
                                city.country
                              }
                            </p>
                          </div>

                          <span className="shrink-0 rounded-lg border border-primary-muted bg-primary-soft px-2.5 py-1 text-xs font-bold uppercase text-primary">
                            {
                              city.countryCode
                            }
                          </span>
                        </div>

                        <div className="mt-5 border-t border-border pt-4">
                          <p className="truncate font-mono text-xs font-semibold text-text-muted">
                            {
                              city.timezone
                            }
                          </p>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-text-secondary">
                              Current local time
                            </span>

                            <span
                              aria-hidden="true"
                              className="text-lg text-primary transition-transform group-hover:translate-x-1"
                            >
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </Card>

          {/* =====================================
              CURRENT TIME EXPLANATION
          ====================================== */}

          <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <Card
              as="article"
              variant="default"
              padding="lg"
            >
              <Badge
                variant="info"
                size="sm"
              >
                Local time explained
              </Badge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                How current local time works
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-text-secondary">
                A city&apos;s current local
                time is determined by its
                geographical time zone and
                active UTC offset. TimeInOne
                uses IANA time-zone rules
                so seasonal daylight-saving
                changes are applied
                automatically.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <p className="font-semibold text-text-primary">
                    UTC offset
                  </p>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Shows how far a local
                    clock is ahead of or
                    behind Coordinated
                    Universal Time.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <p className="font-semibold text-text-primary">
                    IANA time zone
                  </p>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Provides the official
                    geographical rules used
                    to calculate local time.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <p className="font-semibold text-text-primary">
                    Daylight saving
                  </p>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Seasonal clock changes
                    are automatically applied
                    where supported.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <p className="font-semibold text-text-primary">
                    Live updates
                  </p>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Individual city pages
                    display a live local
                    clock that updates
                    every second.
                  </p>
                </div>
              </div>
            </Card>

            {/* =================================
                WORLD CLOCK DIFFERENTIATION
            ================================== */}

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
                  World Clock
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  Compare cities worldwide
                </h2>

                <p className="mt-3 leading-7 text-text-secondary">
                  Need to view several
                  cities at once? Open the
                  TimeInOne World Clock to
                  explore major cities and
                  compare live local times
                  around the globe.
                </p>

                <Button
                  as={
                    Link
                  }
                  href="/world-clock"
                  variant="primary"
                  className="mt-6"
                >
                  Open World Clock
                </Button>
              </div>
            </Card>
          </section>

          {/* =====================================
              MORE TIME TOOLS
          ====================================== */}

          <Card
            as="section"
            variant="default"
            padding="lg"
          >
            <Badge
              variant="success"
              size="sm"
            >
              Time tools
            </Badge>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
              Explore more time tools
            </h2>

            <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
              Convert local times,
              compare time zones or find
              a comfortable meeting time
              across different cities.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/world-clock"
                className="group rounded-2xl border border-border bg-surface-soft p-5 transition hover:border-primary-muted hover:bg-primary-soft"
              >
                <p className="font-bold text-text-primary group-hover:text-primary">
                  World Clock
                </p>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Explore live clocks
                  around the world.
                </p>
              </Link>

              <Link
                href="/converter"
                className="group rounded-2xl border border-border bg-surface-soft p-5 transition hover:border-primary-muted hover:bg-primary-soft"
              >
                <p className="font-bold text-text-primary group-hover:text-primary">
                  Time Converter
                </p>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Convert time between
                  cities instantly.
                </p>
              </Link>

              <Link
                href="/timezone"
                className="group rounded-2xl border border-border bg-surface-soft p-5 transition hover:border-primary-muted hover:bg-primary-soft"
              >
                <p className="font-bold text-text-primary group-hover:text-primary">
                  Time Zones
                </p>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Explore UTC offsets
                  and time-zone details.
                </p>
              </Link>

              <Link
                href="/meeting-planner"
                className="group rounded-2xl border border-border bg-surface-soft p-5 transition hover:border-primary-muted hover:bg-primary-soft"
              >
                <p className="font-bold text-text-primary group-hover:text-primary">
                  Meeting Planner
                </p>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Find better international
                  meeting times.
                </p>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}