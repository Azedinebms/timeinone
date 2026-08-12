import type {
  Metadata,
} from "next";

import Link from "next/link";

import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

import CountryDirectory from "@/features/world-clock/components/CountryDirectory";

import {
  getWorldClockCountries,
} from "@/features/world-clock";

import {
  SITE_URL,
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "@/lib/seo";

export const metadata:
  Metadata = {
  title:
    "World Clock by Country | TimeInOne",

  description:
    "Browse current local times and major cities by country with the TimeInOne World Clock directory.",

  alternates: {
    canonical:
      `${SITE_URL}/world-clock/countries`,
  },

  robots: {
    index:
      true,

    follow:
      true,
  },
};

function createCountriesJsonLd():
  JsonLdObject[] {
  const pageUrl =
    `${SITE_URL}/world-clock/countries`;

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
      "World Clock by Country",

    description:
      "Browse countries and their major city clocks.",

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
    ]),
  ];
}

export default async function WorldClockCountriesPage() {
  const countries =
    await getWorldClockCountries();

  const totalCities =
    countries.reduce(
      (
        total,
        country,
      ) =>
        total +
        country.cityCount,

      0,
    );

  return (
    <>
      <JsonLd
        data={
          createCountriesJsonLd()
        }
      />

      <Header />

      <main className="min-h-screen overflow-x-hidden bg-background text-text-primary">
        {/* =========================================
            DIRECTORY HERO
        ========================================== */}

        <section className="border-b border-border bg-gradient-to-b from-primary-soft/70 via-background to-background">
          <div className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-6 sm:py-9 lg:px-8">
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

              <Link
                href="/world-clock"
                className="rounded-md outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                World Clock
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
                Countries
              </span>
            </nav>

            <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-10">
              {/* LEFT */}

              <div className="flex min-w-0 flex-col justify-center">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                  Global Directory
                </span>

                <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                  World Clock

                  <span className="block text-primary">
                    by Country
                  </span>
                </h1>

                <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
                  Explore countries and
                  access live clocks for
                  their major cities,
                  time zones and local
                  times.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                    Country directory
                  </span>

                  <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                    Live city clocks
                  </span>

                  <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                    IANA time zones
                  </span>
                </div>
              </div>

              {/* RIGHT STATS */}

              <div className="relative min-w-0 overflow-hidden rounded-3xl border border-primary-muted bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-6">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-soft blur-3xl"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-100/60 blur-3xl"
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                        World Clock Database
                      </p>

                      <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950">
                        Global coverage
                      </h2>
                    </div>

                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      Live
                    </span>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Countries
                      </p>

                      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        {
                          countries.length
                        }
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        Available directories
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Major cities
                      </p>

                      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                        {
                          totalCities.toLocaleString(
                            "en-US",
                          )
                        }
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        City clocks indexed
                      </p>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">
                        Time standard
                      </p>

                      <p className="mt-2 text-2xl font-black text-blue-900">
                        IANA
                      </p>

                      <p className="mt-1 text-xs font-medium text-blue-700">
                        Geographic time zones
                      </p>
                    </div>

                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                        Clock status
                      </p>

                      <p className="mt-2 text-2xl font-black text-emerald-900">
                        Live
                      </p>

                      <p className="mt-1 text-xs font-medium text-emerald-700">
                        Current local times
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Select a country to
                      explore its major
                      city clocks.
                    </p>

                    <Link
                      href="/world-clock"
                      className="text-xs font-bold text-primary transition hover:text-blue-700"
                    >
                      Global World Clock →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            COUNTRY DIRECTORY
        ========================================== */}

        <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
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
                  {
                    countries.length
                  }{" "}
                  countries
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  Select a country
                </h2>

                <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
                  Browse countries
                  available in the
                  TimeInOne database and
                  open their major city
                  clocks.
                </p>
              </div>

              <Link
                href="/world-clock"
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface px-4 text-sm font-semibold text-text-secondary shadow-sm transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
              >
                View global clocks
              </Link>
            </div>

            <div className="mt-8">
              <CountryDirectory
                countries={
                  countries
                }
              />
            </div>
          </Card>
        </section>
      </main>
    </>
  );
}