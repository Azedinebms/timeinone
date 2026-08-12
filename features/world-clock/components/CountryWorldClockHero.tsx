"use client";

import Link from "next/link";

import LiveWorldClock from "@/features/world-clock/components/LiveWorldClock";

import type {
  WorldClockCity,
} from "@/features/world-clock/types";

type CountryWorldClockHeroProps = {
  countryName:
  string;

  countryCode:
  string;

  cityCount:
  number;

  timeZoneCount:
  number;

  cities:
  WorldClockCity[];
};

export default function CountryWorldClockHero({
  countryName,
  countryCode,
  cityCount,
  timeZoneCount,
  cities,
}: CountryWorldClockHeroProps) {
  const featuredCities =
    cities.slice(
      0,
      3,
    );

  return (
    <section className="border-b border-border bg-gradient-to-b from-primary-soft/70 via-background to-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* =====================================
            BREADCRUMB
        ====================================== */}

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

          <Link
            href="/world-clock/countries"
            className="rounded-md outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            Countries
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
            {
              countryName
            }
          </span>
        </nav>

        {/* =====================================
            HERO 50 / 50
        ====================================== */}

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch lg:gap-10">
          {/* =================================
              LEFT SIDE
          ================================== */}

          <div className="flex min-w-0 flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              {
                countryCode
              }{" "}
              World Clock
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {countryName}

              <span className="block text-primary">
                World Clock
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
              Explore live local times,
              major city clocks and IANA
              time zones across{" "}
              {countryName}.
            </p>

            {/* TAGS */}

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                {
                  cityCount.toLocaleString(
                    "en-US",
                  )
                }{" "}
                cities
              </span>

              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                {
                  timeZoneCount
                }{" "}
                time zone
                {timeZoneCount ===
                  1
                  ? ""
                  : "s"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                Live clocks
              </span>
            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#country-clocks"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                Explore city clocks
              </a>

              <Link
                href="/world-clock/countries"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-muted hover:bg-primary-soft hover:text-primary hover:shadow-md active:translate-y-0"
              >
                All countries
              </Link>
            </div>
          </div>

          {/* =================================
              RIGHT SIDE
          ================================== */}

          <div className="relative min-w-0 overflow-hidden rounded-3xl border border-primary-muted bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-6">
            {/* DECORATION */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-soft blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-100/60 blur-3xl"
            />

            <div className="relative">
              {/* HEADER */}

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-30" />

                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>

                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                      Live city clocks
                    </p>
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Major cities in{" "}
                    {
                      countryName
                    }
                  </p>
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  Updating now
                </span>
              </div>

              {/* =================================
                  FEATURED CITIES
              ================================== */}

              {featuredCities.length >
                0 ? (
                <div className="mt-5 grid gap-3">
                  {featuredCities.map(
                    (
                      city,
                      index,
                    ) => {
                      const cityKey =
                        city.id ??
                        `${city.countryCode}-${city.name}-${city.timeZone}-${index}`;

                      return (
                        <article
                          key={
                            cityKey
                          }
                          className="group flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/60"
                        >
                          {/* CITY */}

                          <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="truncate font-bold text-slate-950">
                                {
                                  city.name
                                }
                              </span>

                              <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500 shadow-sm">
                                {
                                  city.countryCode
                                }
                              </span>
                            </div>

                            <p className="mt-1 truncate font-mono text-xs font-medium text-slate-500">
                              {
                                city.timeZone
                              }
                            </p>
                          </div>

                          {/* CLOCK */}

                          <LiveWorldClock
                            timeZone={
                              city.timeZone
                            }
                            locale="en-US"
                            showSeconds
                            className="shrink-0 text-right [&_time]:text-2xl [&_time]:font-black [&_time]:tracking-tight [&_time]:text-slate-950 [&_time]:tabular-nums [&_p]:hidden [&_span]:hidden"
                          />
                        </article>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400">
                    ◷
                  </div>

                  <p className="mt-3 font-semibold text-slate-700">
                    No city clocks available
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    No major city clocks
                    are currently available
                    for this country.
                  </p>
                </div>
              )}

              {/* FOOTER */}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  Live clocks update every second.
                </p>

                <a
                  href="#country-clocks"
                  className="text-xs font-bold text-primary transition hover:text-blue-700"
                >
                  View all city clocks →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}