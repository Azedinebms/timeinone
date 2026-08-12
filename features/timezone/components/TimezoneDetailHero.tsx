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

type TimezoneDetailHeroProps = {
  timezone:
    TimezoneDefinition;
};

const MINUTE_IN_MILLISECONDS =
  60 * 1000;

function formatFixedTimezone(
  instant: Date,
  offsetMinutes: number,
) {
  const shiftedDate =
    new Date(
      instant.getTime() +
        offsetMinutes *
          MINUTE_IN_MILLISECONDS,
    );

  const time =
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
    );

  const date =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "UTC",

        weekday:
          "long",

        month:
          "long",

        day:
          "numeric",

        year:
          "numeric",
      },
    ).format(
      shiftedDate,
    );

  return {
    time,
    date,
  };
}

function formatIanaTimezone(
  instant: Date,
  timezone: string,
) {
  const time =
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
    );

  return {
    time,

    date:
      formatDate(
        instant,
        timezone,
      ),
  };
}

function getDayPeriod(
  instant:
    Date,

  timezone:
    TimezoneDefinition,
): string {
  let hour:
    number;

  if (
    timezone.kind ===
      "iana" &&
    timezone.ianaTimezone
  ) {
    hour =
      Number(
        new Intl.DateTimeFormat(
          "en-US",
          {
            timeZone:
              timezone.ianaTimezone,

            hour:
              "2-digit",

            hourCycle:
              "h23",
          },
        ).format(
          instant,
        ),
      );
  } else {
    const offsetMinutes =
      timezone.offsetMinutes ??
      0;

    const shiftedDate =
      new Date(
        instant.getTime() +
          offsetMinutes *
            MINUTE_IN_MILLISECONDS,
      );

    hour =
      shiftedDate.getUTCHours();
  }

  if (
    hour >= 5 &&
    hour < 12
  ) {
    return "Morning";
  }

  if (
    hour >= 12 &&
    hour < 17
  ) {
    return "Afternoon";
  }

  if (
    hour >= 17 &&
    hour < 21
  ) {
    return "Evening";
  }

  return "Night";
}

function getTypeLabel(
  timezone:
    TimezoneDefinition,
): string {
  return timezone.kind ===
    "fixed"
    ? "Fixed UTC offset"
    : "Seasonal IANA zone";
}

export default function TimezoneDetailHero({
  timezone,
}: TimezoneDetailHeroProps) {
  const [
    currentDate,
    setCurrentDate,
  ] =
    useState<Date | null>(
      null,
    );

  useEffect(() => {
    const updateClock =
      () => {
        setCurrentDate(
          new Date(),
        );
      };

    updateClock();

    const timer =
      window.setInterval(
        updateClock,
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

        const offsetMinutes =
          getTimezoneOffsetMinutes(
            timezone,
            currentDate,
          );

        const formatted =
          timezone.kind ===
            "iana" &&
          timezone.ianaTimezone
            ? formatIanaTimezone(
                currentDate,
                timezone.ianaTimezone,
              )
            : formatFixedTimezone(
                currentDate,
                offsetMinutes,
              );

        return {
          ...formatted,

          offsetMinutes,

          offsetLabel:
            formatOffsetMinutes(
              offsetMinutes,
            ),

          dayPeriod:
            getDayPeriod(
              currentDate,
              timezone,
            ),
        };
      },
      [
        currentDate,
        timezone,
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
              timezone.abbreviation
            }
          </span>
        </nav>

        {/* 50 / 50 HERO */}

        <div className="mt-7 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          {/* LEFT */}

          <div className="flex min-w-0 flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              Time Zone Guide
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              Current{" "}
              <span className="text-primary">
                {
                  timezone.abbreviation
                }
              </span>{" "}
              Time
            </h1>

            <p className="mt-2 text-xl font-semibold tracking-tight text-text-secondary sm:text-2xl">
              {
                timezone.name
              }
            </p>

            <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
              View the current local
              time, active UTC offset,
              regions and daylight-saving
              behavior for{" "}
              {
                timezone.name
              }.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                {
                  getTypeLabel(
                    timezone,
                  )
                }
              </span>

              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                {
                  timezone.observesDst
                    ? "DST aware"
                    : "No automatic DST"
                }
              </span>

              {timezone.regions.length >
                0 && (
                <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                  {
                    timezone.regions.length
                  }{" "}
                  region
                  {timezone.regions.length ===
                  1
                    ? ""
                    : "s"}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT — LIVE CLOCK */}

          <div className="relative min-w-0 overflow-hidden rounded-3xl border border-primary-muted bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-6 lg:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary-soft blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-violet-100/60 blur-3xl"
            />

            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-35" />

                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>

                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                      Live local time
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-medium text-text-muted">
                    {
                      timezone.abbreviation
                    }{" "}
                    ·{" "}
                    {
                      timezone.name
                    }
                  </p>
                </div>

                {information && (
                  <span
                    suppressHydrationWarning
                    className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                  >
                    {
                      information.offsetLabel
                    }
                  </span>
                )}
              </div>

              {information ? (
                <>
                  <div className="mt-7">
                    <time
                      suppressHydrationWarning
                      dateTime={
                        currentDate?.toISOString()
                      }
                      className="font-mono text-4xl font-black tracking-tight text-slate-950 tabular-nums sm:text-5xl xl:text-6xl"
                    >
                      {
                        information.time
                      }
                    </time>

                    <p
                      suppressHydrationWarning
                      className="mt-3 text-base font-medium text-slate-600"
                    >
                      {
                        information.date
                      }
                    </p>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        UTC offset
                      </p>

                      <p
                        suppressHydrationWarning
                        className="mt-2 font-mono text-sm font-bold text-slate-900"
                      >
                        {
                          information.offsetLabel
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Time of day
                      </p>

                      <p
                        suppressHydrationWarning
                        className="mt-2 text-sm font-bold text-slate-900"
                      >
                        {
                          information.dayPeriod
                        }
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                        Type
                      </p>

                      <p className="mt-2 truncate text-sm font-bold text-slate-900">
                        {timezone.kind ===
                        "fixed"
                          ? "Fixed"
                          : "IANA"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-7">
                  <div className="h-14 w-72 max-w-full animate-pulse rounded-xl bg-slate-100" />

                  <div className="mt-3 h-5 w-56 max-w-full animate-pulse rounded-lg bg-slate-100" />

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}