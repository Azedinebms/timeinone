"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import LiveWorldClock from "@/features/world-clock/components/LiveWorldClock";

import type {
  WorldClockCity,
} from "@/features/world-clock/types";

type WorldClockHeroProps = {
  cities:
  WorldClockCity[];
};

const ROTATION_INTERVAL_MINUTES =
  30;

const ROTATION_CHECK_INTERVAL =
  60 * 1000;

type FeaturedRegionGroup =
  | "americas"
  | "europe-africa"
  | "asia-oceania";

const FEATURED_REGION_GROUPS:
  FeaturedRegionGroup[] = [
    "americas",
    "europe-africa",
    "asia-oceania",
  ];

function getRegionGroup(
  region: string,
): FeaturedRegionGroup | null {
  const normalizedRegion =
    region
      .trim()
      .toLowerCase();

  if (
    normalizedRegion.includes(
      "america",
    )
  ) {
    return "americas";
  }

  if (
    normalizedRegion.includes(
      "europe",
    ) ||
    normalizedRegion.includes(
      "africa",
    ) ||
    normalizedRegion.includes(
      "atlantic",
    )
  ) {
    return "europe-africa";
  }

  if (
    normalizedRegion.includes(
      "asia",
    ) ||
    normalizedRegion.includes(
      "australia",
    ) ||
    normalizedRegion.includes(
      "pacific",
    ) ||
    normalizedRegion.includes(
      "indian",
    )
  ) {
    return "asia-oceania";
  }

  return null;
}

function getRotationBucket(
  date: Date,
): number {
  const intervalMilliseconds =
    ROTATION_INTERVAL_MINUTES *
    60 *
    1000;

  return Math.floor(
    date.getTime() /
    intervalMilliseconds,
  );
}

function getFeaturedCities(
  cities: WorldClockCity[],
  rotationBucket: number,
): WorldClockCity[] {
  if (
    cities.length <=
    3
  ) {
    return cities;
  }

  const groupedCities =
    new Map<
      FeaturedRegionGroup,
      WorldClockCity[]
    >();

  for (
    const group of
    FEATURED_REGION_GROUPS
  ) {
    groupedCities.set(
      group,
      [],
    );
  }

  for (
    const city of cities
  ) {
    const group =
      getRegionGroup(
        city.region,
      );

    if (
      !group
    ) {
      continue;
    }

    groupedCities
      .get(
        group,
      )
      ?.push(
        city,
      );
  }

  const selected:
    WorldClockCity[] = [];

  FEATURED_REGION_GROUPS.forEach(
    (
      group,
      groupIndex,
    ) => {
      const candidates =
        groupedCities.get(
          group,
        ) ?? [];

      if (
        candidates.length ===
        0
      ) {
        return;
      }

      const cityIndex =
        (
          rotationBucket +
          groupIndex
        ) %
        candidates.length;

      const city =
        candidates[
        cityIndex
        ];

      if (
        city
      ) {
        selected.push(
          city,
        );
      }
    },
  );

  if (
    selected.length <
    3
  ) {
    const selectedIds =
      new Set(
        selected.map(
          (
            city,
          ) =>
            city.id,
        ),
      );

    const fallbackCities =
      cities.filter(
        (
          city,
        ) =>
          !selectedIds.has(
            city.id,
          ),
      );

    const startIndex =
      rotationBucket %
      fallbackCities.length;

    for (
      let offset = 0;
      offset <
      fallbackCities.length &&
      selected.length < 3;
      offset += 1
    ) {
      const city =
        fallbackCities[
        (
          startIndex +
          offset
        ) %
        fallbackCities.length
        ];

      if (
        city
      ) {
        selected.push(
          city,
        );
      }
    }
  }

  return selected.slice(
    0,
    3,
  );
}

export default function WorldClockHero({
  cities,
}: WorldClockHeroProps) {
  const [
    rotationBucket,
    setRotationBucket,
  ] =
    useState(
      0,
    );

  useEffect(() => {
    const updateRotation =
      () => {
        setRotationBucket(
          getRotationBucket(
            new Date(),
          ),
        );
      };

    updateRotation();

    const timer =
      window.setInterval(
        updateRotation,
        ROTATION_CHECK_INTERVAL,
      );

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, []);

  const featuredCities =
    useMemo(
      () =>
        getFeaturedCities(
          cities,
          rotationBucket,
        ),
      [
        cities,
        rotationBucket,
      ],
    );

  return (
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

          <span
            aria-current="page"
            className="font-medium text-text-secondary"
          >
            World Clock
          </span>
        </nav>

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch lg:gap-10">
          <div className="flex min-w-0 flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-30" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              Live Global Time
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              World Clock

              <span className="block text-primary">
                Current Time Around the World
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
              Explore live world clocks
              for major cities around the
              globe. Compare local times,
              dates and IANA time zones
              instantly.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                Live clocks
              </span>

              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                IANA time zones
              </span>

              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                DST aware
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#world-clocks"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Explore world clocks
              </a>

              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-primary-muted hover:bg-primary-soft hover:text-primary hover:shadow-md"
              >
                Open converter
              </Link>
            </div>
          </div>

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
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                    Live city clocks
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Synchronized global time
                  </p>
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  Updating now
                </span>
              </div>

              {featuredCities.length >
                0 ? (
                <div className="mt-5 grid gap-3">
                  {featuredCities.map(
                    (
                      city,
                    ) => (
                      <article
                        key={
                          city.id
                        }
                        className="group flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/60"
                      >
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="truncate font-bold text-slate-950">
                              {
                                city.name
                              }
                            </span>

                            <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                              {
                                city.countryCode
                              }
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs font-medium text-slate-500">
                            {
                              city.country
                            }
                            {" · "}
                            {
                              city.timeZone
                            }
                          </p>
                        </div>

                        <LiveWorldClock
                          timeZone={
                            city.timeZone
                          }
                          locale="en-US"
                          showSeconds
                          className="shrink-0 text-right [&_time]:text-2xl [&_time]:font-black [&_time]:text-slate-950 [&_p]:hidden [&_span]:hidden"
                        />
                      </article>
                    ),
                  )}
                </div>
              ) : (
                <div className="mt-5 grid gap-3">
                  {[0, 1, 2].map(
                    (
                      item,
                    ) => (
                      <div
                        key={
                          item
                        }
                        className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
                      />
                    ),
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">
                  Live clocks update every second · Featured cities rotate every 30 minutes.
                </p>

                <Link
                  href="/world-clock/countries"
                  className="text-xs font-bold text-primary transition hover:text-blue-700"
                >
                  Browse by country →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}