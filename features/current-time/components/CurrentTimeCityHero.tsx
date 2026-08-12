"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Badge from "@/components/ui/Badge";

import {
  formatDate,
  formatTime,
  getTimezoneOffset,
  isInsideBusinessHours,
} from "@/lib/time-engine";

type CurrentTimeCityHeroProps = {
  city: string;
  country: string;
  countryCode: string;
  timezone: string;

  population?: number | null;
};

function formatUtcOffset(
  offsetHours: number,
) {
  const sign =
    offsetHours >= 0
      ? "+"
      : "-";

  const absoluteOffset =
    Math.abs(
      offsetHours,
    );

  const hours =
    Math.floor(
      absoluteOffset,
    );

  const minutes =
    Math.round(
      (
        absoluteOffset -
        hours
      ) * 60,
    );

  return (
    `UTC${sign}` +
    `${hours
      .toString()
      .padStart(
        2,
        "0",
      )}:` +
    `${minutes
      .toString()
      .padStart(
        2,
        "0",
      )}`
  );
}

function getDayPeriod(
  date: Date,
  timezone: string,
) {
  const hourValue =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          timezone,

        hour:
          "2-digit",

        hourCycle:
          "h23",
      },
    ).format(
      date,
    );

  const hour =
    Number(
      hourValue,
    );

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

export default function CurrentTimeCityHero({
  city,
  country,
  countryCode,
  timezone,
  population,
}: CurrentTimeCityHeroProps) {
  const [
    currentDate,
    setCurrentDate,
  ] =
    useState(
      () =>
        new Date(),
    );

  useEffect(() => {
    const timer =
      window.setInterval(
        () => {
          setCurrentDate(
            new Date(),
          );
        },
        1_000,
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
        const offset =
          getTimezoneOffset(
            currentDate,
            timezone,
          );

        return {
          time:
            formatTime(
              currentDate,
              timezone,
            ),

          date:
            formatDate(
              currentDate,
              timezone,
            ),

          offset:
            formatUtcOffset(
              offset,
            ),

          dayPeriod:
            getDayPeriod(
              currentDate,
              timezone,
            ),

          isBusinessHours:
            isInsideBusinessHours(
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
    <section className="relative overflow-hidden border-y border-border bg-gradient-to-br from-background via-primary-soft/35 to-background">
      {/* DECORATION */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-muted/35 blur-3xl" />

        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-5 py-9 sm:px-6 sm:py-11 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8">
        {/* =================================================
            LEFT
        ================================================== */}

        <div>
          <Badge
            variant="primary"
            size="sm"
            dot
          >
            Current Local Time
          </Badge>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-text-primary sm:text-5xl lg:text-6xl">
            Current Time in{" "}

            <span className="block text-primary">
              {city}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
            Live local time, date and UTC
            offset in{" "}
            <strong className="font-semibold text-text-primary">
              {city}, {country}
            </strong>
            , calculated using the official{" "}
            <strong className="font-semibold text-text-primary">
              {timezone}
            </strong>{" "}
            time-zone rules.
          </p>

          {/* TAGS */}

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
              {country}
            </span>

            <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold uppercase text-text-secondary shadow-sm">
              {countryCode}
            </span>

            <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
              {timezone}
            </span>

            {population ? (
              <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                Pop.{" "}
                {population.toLocaleString(
                  "en-US",
                )}
              </span>
            ) : null}
          </div>

          {/* ACTIONS */}

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md"
            >
              Convert from {city}

              <span aria-hidden="true">
                →
              </span>
            </Link>

            <Link
              href="/world-clock"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-bold text-text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
            >
              All world clocks
            </Link>
          </div>
        </div>

        {/* =================================================
            RIGHT — LIVE CLOCK
        ================================================== */}

        <div className="relative overflow-hidden rounded-3xl border border-primary-muted bg-white/90 shadow-lg shadow-slate-950/5 backdrop-blur-sm">
          {/* TOP */}

          <div className="border-b border-border px-6 py-5 sm:px-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-25" />

                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                  </span>

                  <p className="text-[10px] font-black uppercase tracking-[0.17em] text-success">
                    Live local time
                  </p>
                </div>

                <p className="mt-1 text-sm font-medium text-text-secondary">
                  {city}, {country}
                </p>
              </div>

              <span className="rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 font-mono text-xs font-bold text-primary">
                {information.offset}
              </span>
            </div>

            {/* CLOCK */}

            <div className="mt-7 flex flex-wrap items-end gap-3">
              <p
                suppressHydrationWarning
                className="font-mono text-5xl font-black tracking-[-0.06em] text-slate-950 tabular-nums sm:text-6xl xl:text-7xl"
              >
                {information.time}
              </p>

              <span className="mb-2 rounded-lg border border-border bg-surface-soft px-2.5 py-1 font-mono text-xs font-bold text-text-secondary">
                {information.dayPeriod}
              </span>
            </div>

            <p
              suppressHydrationWarning
              className="mt-3 text-sm font-semibold text-text-secondary"
            >
              {information.date}
            </p>
          </div>

          {/* STATS */}

          <div className="grid sm:grid-cols-3">
            <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">
                UTC offset
              </p>

              <p
                suppressHydrationWarning
                className="mt-2 font-mono text-base font-black text-text-primary"
              >
                {information.offset}
              </p>
            </div>

            <div className="border-b border-border p-5 sm:border-b-0 sm:border-r">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Time zone
              </p>

              <p className="mt-2 break-all text-sm font-bold text-text-primary">
                {timezone}
              </p>
            </div>

            <div className="p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted">
                Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={[
                    "h-2",
                    "w-2",
                    "rounded-full",

                    information.isBusinessHours
                      ? "bg-success"
                      : "bg-warning",
                  ].join(
                    " ",
                  )}
                />

                <p
                  suppressHydrationWarning
                  className={[
                    "text-sm",
                    "font-bold",

                    information.isBusinessHours
                      ? "text-success"
                      : "text-warning",
                  ].join(
                    " ",
                  )}
                >
                  {information.isBusinessHours
                    ? "Working hours"
                    : "Outside working hours"}
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOM INFO */}

          <div className="border-t border-border bg-surface-soft px-6 py-4 sm:px-7">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />

              <p className="text-xs leading-5 text-text-secondary">
                TimeInOne uses{" "}
                <strong className="font-semibold text-text-primary">
                  {timezone}
                </strong>{" "}
                to automatically apply the
                correct regional and
                daylight-saving rules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}