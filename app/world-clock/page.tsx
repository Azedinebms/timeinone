import type {
  Metadata,
} from "next";

import Link from "next/link";

import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import TimeInOneCitySearch from "@/features/city-search/components/AtlasCitySearch";

import WorldClockGrid from "@/features/world-clock/components/WorldClockGrid";
import WorldClockHero from "@/features/world-clock/components/WorldClockHero";

import {
  getWorldClockIndexCities,
} from "@/features/world-clock";

import {
  SITE_NAME,
  SITE_URL,
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "@/lib/seo";

export const metadata:
  Metadata = {
  title:
    "World Clock — Current Time Around the World | TimeInOne",

  description:
    "Check the current local time, date and IANA time zone in major cities around the world with the TimeInOne World Clock.",

  alternates: {
    canonical:
      `${SITE_URL}/world-clock`,
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
      "World Clock — Current Time Around the World | TimeInOne",

    description:
      "Compare live local times, dates and time zones in major cities around the world.",

    url:
      `${SITE_URL}/world-clock`,

    siteName:
      SITE_NAME,
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "World Clock — Current Time Around the World | TimeInOne",

    description:
      "Compare live local times, dates and time zones in major cities around the world.",
  },
};

function createWorldClockIndexJsonLd():
  JsonLdObject[] {
  const pageUrl =
    `${SITE_URL}/world-clock`;

  const webPage:
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
      "World Clock — Current Time Around the World",

    description:
      "Compare current local times, dates and time zones in major cities around the world.",

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
          "World Clock",

        path:
          "/world-clock",
      },
    ]);

  return [
    webPage,
    breadcrumbs,
  ];
}

export default async function WorldClockPage() {
  const cities =
    await getWorldClockIndexCities(
      24,
    );

  const regions =
    new Set(
      cities.map(
        (
          city,
        ) =>
          city.region,
      ),
    ).size;

  const jsonLd =
    createWorldClockIndexJsonLd();

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen overflow-x-hidden bg-background text-text-primary">
        <WorldClockHero
          cities={
            cities
          }
        />

        <div className="mx-auto w-full max-w-7xl space-y-8 px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* SEARCH */}

          <Card
            as="section"
            variant="elevated"
            padding="lg"
            className="relative overflow-visible"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-24 -top-px h-px bg-gradient-to-r from-transparent via-primary-muted to-transparent"
            />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <Badge
                  variant="info"
                  size="sm"
                >
                  City search
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  Find the current time
                  in any city
                </h2>

                <p className="mt-2 leading-7 text-text-secondary">
                  Search by city,
                  country, country code
                  or IANA time-zone
                  identifier.
                </p>
              </div>

              <div className="w-full lg:max-w-xl">
                <TimeInOneCitySearch
                  placeholder="Search a city, country or time zone..."
                  limit={
                    10
                  }
                />
              </div>
            </div>
          </Card>

          {/* STATS */}

          <section
            aria-label="World Clock statistics"
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
                Major cities
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
                {
                  cities.length
                }
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Live global
                locations
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
                Regions
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
                {
                  regions
                }
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Global time-zone
                regions
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
                Updates
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-success">
                Live
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Current local
                clocks
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
                Standard
              </p>

              <p className="mt-2 text-3xl font-bold tracking-tight text-primary">
                IANA
              </p>

              <p className="mt-2 text-xs leading-5 text-text-muted">
                Recognized
                identifiers
              </p>
            </Card>
          </section>

          {/* CLOCKS */}

          <Card
            id="world-clocks"
            as="section"
            variant="default"
            padding="lg"
            className="scroll-mt-24"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge
                  variant="accent"
                  size="sm"
                >
                  Popular cities
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  World clocks
                </h2>

                <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
                  Explore live local
                  times in major cities
                  around the world.
                </p>
              </div>

              <Button
                as={
                  Link
                }
                href="/world-clock/countries"
                variant="secondary"
              >
                Browse by country
              </Button>
            </div>

            <div className="mt-8">
              <WorldClockGrid
                cities={
                  cities
                }
              />
            </div>
          </Card>

          {/* BOTTOM */}

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
                Reliable global time
              </Badge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                Why use TimeInOne World Clock?
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-text-secondary">
                Every clock uses a
                geographical IANA time
                zone and automatically
                follows the correct
                regional clock rules.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  [
                    "Live updates",
                    "Current local time refreshed every second.",
                  ],
                  [
                    "DST aware",
                    "Seasonal clock changes are handled automatically.",
                  ],
                  [
                    "IANA zones",
                    "Recognized geographical time-zone identifiers.",
                  ],
                  [
                    "Global coverage",
                    "Major cities across multiple regions.",
                  ],
                ].map(
                  (
                    [
                      title,
                      description,
                    ],
                  ) => (
                    <div
                      key={
                        title
                      }
                      className="rounded-2xl border border-border bg-surface-soft p-4"
                    >
                      <p className="font-semibold text-text-primary">
                        ✓{" "}
                        {
                          title
                        }
                      </p>

                      <p className="mt-1 text-sm leading-6 text-text-secondary">
                        {
                          description
                        }
                      </p>
                    </div>
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
                  More time tools
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  Need more than a clock?
                </h2>

                <p className="mt-3 leading-7 text-text-secondary">
                  Compare cities, convert
                  local times or plan an
                  international meeting.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Button
                    as={
                      Link
                    }
                    href="/"
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
                    href="/current-time"
                    variant="outline"
                    className="justify-between"
                  >
                    Current Time

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