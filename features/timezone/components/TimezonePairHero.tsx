"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  formatDate,
} from "@/lib/time-engine";

import {
  formatOffsetMinutes,
  getTimezoneOffsetMinutes,
  type TimezoneDefinition,
} from "@/lib/timezones";

type TimezonePairHeroProps = {
  fromTimezone:
    TimezoneDefinition;

  toTimezone:
    TimezoneDefinition;
};

const MINUTE_IN_MILLISECONDS =
  60 * 1000;

function formatFixedClock(
  instant: Date,
  offsetMinutes: number,
) {
  const shiftedDate =
    new Date(
      instant.getTime() +
        offsetMinutes *
          MINUTE_IN_MILLISECONDS,
    );

  return {
    time:
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            "UTC",

          hour:
            "2-digit",

          minute:
            "2-digit",

          second:
            "2-digit",

          hour12:
            true,
        },
      ).format(
        shiftedDate,
      ),

    date:
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            "UTC",

          weekday:
            "short",

          month:
            "short",

          day:
            "numeric",
        },
      ).format(
        shiftedDate,
      ),
  };
}

function formatIanaClock(
  instant: Date,
  timezone: string,
) {
  return {
    time:
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            timezone,

          hour:
            "2-digit",

          minute:
            "2-digit",

          second:
            "2-digit",

          hour12:
            true,
        },
      ).format(
        instant,
      ),

    date:
      formatDate(
        instant,
        timezone,
      ),
  };
}

function getClockData(
  instant:
    Date,

  timezone:
    TimezoneDefinition,
) {
  const offsetMinutes =
    getTimezoneOffsetMinutes(
      timezone,
      instant,
    );

  const formatted =
    timezone.kind ===
      "iana" &&
    timezone.ianaTimezone
      ? formatIanaClock(
          instant,
          timezone.ianaTimezone,
        )
      : formatFixedClock(
          instant,
          offsetMinutes,
        );

  return {
    ...formatted,

    offsetMinutes,

    offsetLabel:
      formatOffsetMinutes(
        offsetMinutes,
      ),
  };
}

function formatDifference(
  fromOffsetMinutes:
    number,

  toOffsetMinutes:
    number,
): string {
  const difference =
    toOffsetMinutes -
    fromOffsetMinutes;

  if (
    difference ===
    0
  ) {
    return "Same current UTC offset";
  }

  const direction =
    difference >
    0
      ? "ahead"
      : "behind";

  const absolute =
    Math.abs(
      difference,
    );

  const hours =
    Math.floor(
      absolute /
        60,
    );

  const minutes =
    absolute %
    60;

  const duration =
    [
      hours >
      0
        ? `${hours}h`
        : "",

      minutes >
      0
        ? `${minutes}m`
        : "",
    ]
      .filter(
        Boolean,
      )
      .join(
        " ",
      );

  return `${duration} ${direction}`;
}

function getTimezoneType(
  timezone:
    TimezoneDefinition,
): string {
  return timezone.kind ===
    "fixed"
    ? "Fixed"
    : "IANA";
}

export default function TimezonePairHero({
  fromTimezone,
  toTimezone,
}: TimezonePairHeroProps) {
  const [
    currentDate,
    setCurrentDate,
  ] =
    useState<Date | null>(
      null,
    );

  useEffect(() => {
    const update =
      () => {
        setCurrentDate(
          new Date(),
        );
      };

    update();

    const timer =
      window.setInterval(
        update,
        1000,
      );

    return () => {
      window.clearInterval(
        timer,
      );
    };
  }, []);

  const information =
    useMemo(
      () => {
        if (
          !currentDate
        ) {
          return null;
        }

        const from =
          getClockData(
            currentDate,
            fromTimezone,
          );

        const to =
          getClockData(
            currentDate,
            toTimezone,
          );

        return {
          from,
          to,

          difference:
            formatDifference(
              from.offsetMinutes,
              to.offsetMinutes,
            ),
        };
      },
      [
        currentDate,
        fromTimezone,
        toTimezone,
      ],
    );

  return (
    <section className="border-b border-border bg-gradient-to-b from-primary-soft/70 via-background to-background">
      <div className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-6 sm:py-9 lg:px-8">
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

          <Link
            href="/timezone"
            className="rounded-md outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            Time Zones
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
              fromTimezone.abbreviation
            }{" "}
            to{" "}
            {
              toTimezone.abbreviation
            }
          </span>
        </nav>

        {/* HERO */}

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch lg:gap-10">
          {/* LEFT */}

          <div className="flex min-w-0 flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              Time Zone Converter
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {
                fromTimezone.abbreviation
              }{" "}
              to{" "}
              {
                toTimezone.abbreviation
              }

              <span className="block text-primary">
                Time Converter
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
              Convert{" "}
              {
                fromTimezone.name
              }{" "}
              to{" "}
              {
                toTimezone.name
              }
              , compare their live UTC
              offsets and explore a
              complete 24-hour
              conversion table.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                Live clocks
              </span>

              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                DST aware
              </span>

              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                24-hour table
              </span>
            </div>
          </div>

          {/* RIGHT */}

          <div className="relative min-w-0 overflow-hidden rounded-3xl border border-primary-muted bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary-soft blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-violet-100/60 blur-3xl"
            />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-35" />

                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>

                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                      Live comparison
                    </p>
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Current local times
                  </p>
                </div>

                {information && (
                  <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                    {
                      information.difference
                    }
                  </span>
                )}
              </div>

              {information ? (
                <>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {/* FROM */}

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                            Source
                          </p>

                          <div className="mt-2 flex min-w-0 items-center gap-2">
                            <span className="truncate text-lg font-black text-slate-950">
                              {
                                fromTimezone.abbreviation
                              }
                            </span>

                            <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500">
                              {
                                getTimezoneType(
                                  fromTimezone,
                                )
                              }
                            </span>
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                          {
                            information.from.offsetLabel
                          }
                        </span>
                      </div>

                      <time
                        suppressHydrationWarning
                        dateTime={
                          currentDate?.toISOString()
                        }
                        className="mt-5 block font-mono text-3xl font-black tracking-tight text-slate-950 tabular-nums sm:text-4xl"
                      >
                        {
                          information.from.time
                        }
                      </time>

                      <p
                        suppressHydrationWarning
                        className="mt-2 truncate text-sm font-medium text-slate-500"
                      >
                        {
                          information.from.date
                        }
                      </p>

                      <p className="mt-3 truncate text-xs font-medium text-slate-400">
                        {
                          fromTimezone.name
                        }
                      </p>
                    </div>

                    {/* TO */}

                    <div className="rounded-2xl border border-primary-muted bg-primary-soft/70 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                            Target
                          </p>

                          <div className="mt-2 flex min-w-0 items-center gap-2">
                            <span className="truncate text-lg font-black text-slate-950">
                              {
                                toTimezone.abbreviation
                              }
                            </span>

                            <span className="shrink-0 rounded-md border border-primary-muted bg-white px-2 py-0.5 text-[10px] font-bold text-primary">
                              {
                                getTimezoneType(
                                  toTimezone,
                                )
                              }
                            </span>
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full border border-blue-200 bg-white px-2.5 py-1 text-[10px] font-bold text-blue-700 shadow-sm">
                          {
                            information.to.offsetLabel
                          }
                        </span>
                      </div>

                      <time
                        suppressHydrationWarning
                        dateTime={
                          currentDate?.toISOString()
                        }
                        className="mt-5 block font-mono text-3xl font-black tracking-tight text-slate-950 tabular-nums sm:text-4xl"
                      >
                        {
                          information.to.time
                        }
                      </time>

                      <p
                        suppressHydrationWarning
                        className="mt-2 truncate text-sm font-medium text-slate-500"
                      >
                        {
                          information.to.date
                        }
                      </p>

                      <p className="mt-3 truncate text-xs font-medium text-slate-400">
                        {
                          toTimezone.name
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                        Current difference
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {
                          toTimezone.abbreviation
                        }{" "}
                        is{" "}
                        <span className="text-primary">
                          {
                            information.difference
                          }
                        </span>{" "}
                        of{" "}
                        {
                          fromTimezone.abbreviation
                        }
                      </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                      Updates every second
                    </span>
                  </div>
                </>
              ) : (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[0, 1].map(
                    (
                      item,
                    ) => (
                      <div
                        key={
                          item
                        }
                        className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
                      />
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}