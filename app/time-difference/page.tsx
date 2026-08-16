import type {
  Metadata,
} from "next";

import Link from "next/link";

import Header from "@/components/layout/Header";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHero from "@/components/ui/PageHero";

import TimeDifferenceTool from "@/features/time-difference/components/TimeDifferenceTool";

import {
  SITE_URL,
} from "@/lib/seo";

import {
  findCityByGeonameId,
} from "@/services/city.service";

/* =========================================================
   METADATA
========================================================= */

const PAGE_URL =
  `${SITE_URL}/time-difference`;

export const metadata:
  Metadata = {
  title:
    "Time Difference Between Cities | TimeInOne",

  description:
    "Compare the current time difference between two cities. Check local times, UTC offsets, working-hour overlap and the best time to call.",

  alternates: {
    canonical:
      PAGE_URL,
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
      "Time Difference Between Cities | TimeInOne",

    description:
      "Compare current local times, UTC offsets, working hours and the best time to call between cities worldwide.",

    url:
      PAGE_URL,

    siteName:
      "TimeInOne",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Time Difference Between Cities | TimeInOne",

    description:
      "Compare current local times, UTC offsets, working hours and the best time to call between cities worldwide.",
  },
};

/* =========================================================
   DEFAULT CITIES
========================================================= */

const CASABLANCA_GEONAME_ID =
  2553604;

const NEW_YORK_GEONAME_ID =
  5128581;

/* =========================================================
   POPULAR PAIRS
========================================================= */

const POPULAR_PAIRS = [
  {
    from:
      "New York",

    to:
      "London",

    href:
      "/time-difference/new-york-to-london",

    description:
      "Compare US Eastern Time with the United Kingdom.",
  },

  {
    from:
      "Paris",

    to:
      "Tokyo",

    href:
      "/time-difference/paris-to-tokyo",

    description:
      "Compare Central European time with Japan.",
  },

  {
    from:
      "Los Angeles",

    to:
      "Sydney",

    href:
      "/time-difference/los-angeles-to-sydney",

    description:
      "Compare the US West Coast with eastern Australia.",
  },

  {
    from:
      "London",

    to:
      "Dubai",

    href:
      "/time-difference/london-to-dubai",

    description:
      "Compare United Kingdom time with the UAE.",
  },

  {
    from:
      "New York",

    to:
      "Tokyo",

    href:
      "/time-difference/new-york-to-tokyo",

    description:
      "Compare US Eastern Time with Japan.",
  },

  {
    from:
      "Casablanca",

    to:
      "Paris",

    href:
      "/time-difference/casablanca-to-paris",

    description:
      "Compare Morocco and France local time.",
  },
] as const;

/* =========================================================
   PAGE
========================================================= */

export default async function TimeDifferenceLandingPage() {
  const [
    fromCity,
    toCity,
  ] =
    await Promise.all([
      findCityByGeonameId(
        CASABLANCA_GEONAME_ID,
      ),

      findCityByGeonameId(
        NEW_YORK_GEONAME_ID,
      ),
    ]);

  if (
    !fromCity ||
    !toCity
  ) {
    throw new Error(
      "TimeInOne default Time Difference cities are missing from the database.",
    );
  }

  const jsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "WebApplication",

    name:
      "TimeInOne Time Difference",

    url:
      PAGE_URL,

    applicationCategory:
      "UtilityApplication",

    operatingSystem:
      "Any",

    description:
      "Compare current local time differences, UTC offsets and working-hour overlap between cities worldwide.",

    isPartOf: {
      "@type":
        "WebSite",

      name:
        "TimeInOne",

      url:
        SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              jsonLd,
            ).replace(
              /</g,
              "\\u003c",
            ),
        }}
      />

      <Header />

      <main className="min-h-screen overflow-x-hidden bg-background text-text-primary">
        {/* =====================================================
            HERO
        ====================================================== */}

        <PageHero
          badge="Time Difference"
          title="Compare time between"
          highlight="two cities"
          description="Find the current time difference, UTC offsets, working-hour overlap and the best time to call between cities worldwide."
          breadcrumbs={[
            {
              label:
                "Home",

              href:
                "/",
            },

            {
              label:
                "Time Difference",
            },
          ]}
          tags={[
            "Live local time",
            "DST aware",
            "Working-hour overlap",
          ]}
        />

        {/* =====================================================
            TOOL
        ====================================================== */}

        <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          <TimeDifferenceTool
            initialFromCity={
              fromCity
            }
            initialToCity={
              toCity
            }
          />
        </section>

        {/* =====================================================
            INTRODUCTION
        ====================================================== */}

        <section className="border-t border-border bg-background px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card
                as="article"
                variant="default"
                padding="lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-lg font-bold text-primary">
                  ↔
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-text-primary">
                  What is a time difference?
                </h2>

                <p className="mt-4 leading-7 text-text-secondary">
                  The time difference between
                  two cities is the difference
                  between their current local
                  clock times.
                </p>

                <p className="mt-4 leading-7 text-text-secondary">
                  TimeInOne calculates this
                  using each city&apos;s
                  timezone and current UTC
                  offset, including
                  date-specific daylight-saving
                  changes.
                </p>
              </Card>

              <Card
                as="article"
                variant="soft"
                padding="lg"
                className="border-primary-muted bg-primary-soft/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-muted bg-surface text-lg font-bold text-primary">
                  ✦
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-text-primary">
                  More than an hour difference
                </h2>

                <p className="mt-4 leading-7 text-text-secondary">
                  A simple offset does not
                  always tell you when two
                  people can realistically
                  communicate.
                </p>

                <p className="mt-4 leading-7 text-text-secondary">
                  TimeInOne also compares
                  working hours and highlights
                  practical calling and meeting
                  windows between locations.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* =====================================================
            POPULAR PAIRS
        ====================================================== */}

        <section className="border-t border-border bg-surface-soft px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Popular comparisons
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Popular time differences
              </h2>

              <p className="mt-4 text-base leading-8 text-text-secondary">
                Quickly compare local time
                between major cities around the
                world.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {POPULAR_PAIRS.map(
                (
                  pair,
                ) => (
                  <Link
                    key={
                      pair.href
                    }
                    href={
                      pair.href
                    }
                    className="group block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Card
                      variant="default"
                      padding="md"
                      interactive
                      className="h-full group-hover:border-primary-muted"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            {
                              pair.from
                            }
                          </p>

                          <p className="mt-1 text-xs text-text-muted">
                            From
                          </p>
                        </div>

                        <span
                          aria-hidden="true"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-soft text-text-muted transition group-hover:border-primary-muted group-hover:bg-primary-soft group-hover:text-primary"
                        >
                          ↔
                        </span>

                        <div className="text-right">
                          <p className="text-sm font-semibold text-text-primary">
                            {
                              pair.to
                            }
                          </p>

                          <p className="mt-1 text-xs text-text-muted">
                            To
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 text-sm leading-6 text-text-secondary">
                        {
                          pair.description
                        }
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition group-hover:text-primary-hover">
                        Compare times

                        <span
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </Card>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section className="border-t border-border bg-background px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                How it works
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Compare cities in seconds
              </h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <Card
                as="article"
                variant="default"
                padding="md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-sm font-bold text-primary">
                  01
                </span>

                <h3 className="mt-5 text-lg font-semibold text-text-primary">
                  Choose two cities
                </h3>

                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  Search for your starting
                  city and the location you
                  want to compare.
                </p>
              </Card>

              <Card
                as="article"
                variant="default"
                padding="md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-sm font-bold text-primary">
                  02
                </span>

                <h3 className="mt-5 text-lg font-semibold text-text-primary">
                  Compare local time
                </h3>

                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  TimeInOne calculates the
                  current difference using
                  the cities&apos; real
                  timezone rules.
                </p>
              </Card>

              <Card
                as="article"
                variant="default"
                padding="md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-sm font-bold text-primary">
                  03
                </span>

                <h3 className="mt-5 text-lg font-semibold text-text-primary">
                  Find a better time
                </h3>

                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  Review the 24-hour
                  comparison and practical
                  working-hours overlap.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}

        <section className="border-t border-border bg-surface-soft px-5 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Card
              as="section"
              variant="elevated"
              padding="lg"
              className="relative overflow-hidden border-primary-muted text-center"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-[-180px] h-[320px] w-[620px] -translate-x-1/2 rounded-full bg-primary-soft blur-3xl"
              />

              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Need a specific conversion?
                </p>

                <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                  Convert a specific date and
                  time
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
                  Use the TimeInOne converter
                  when you need to convert a
                  specific hour instead of
                  comparing the current time
                  difference.
                </p>

                <Button
                  as={
                    Link
                  }
                  href="/"
                  variant="primary"
                  className="mt-6"
                >
                  Open Time Converter
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}