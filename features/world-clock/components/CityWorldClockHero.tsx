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
} from "@/features/world-clock";

const MINUTE_IN_MILLISECONDS =
  60 * 1000;

type CityWorldClockHeroProps = {
  city:
    WorldClockCity;
};

function getCurrentOffsetMinutes(
  date: Date,
  timeZone: string,
): number {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone,

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",

        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit",

        hourCycle:
          "h23",
      },
    );

  const parts =
    formatter.formatToParts(
      date,
    );

  const values =
    new Map(
      parts.map(
        (
          part,
        ) => [
          part.type,
          part.value,
        ],
      ),
    );

  const asUtc =
    Date.UTC(
      Number(
        values.get(
          "year",
        ),
      ),
      Number(
        values.get(
          "month",
        ),
      ) -
        1,
      Number(
        values.get(
          "day",
        ),
      ),
      Number(
        values.get(
          "hour",
        ),
      ),
      Number(
        values.get(
          "minute",
        ),
      ),
      Number(
        values.get(
          "second",
        ),
      ),
    );

  return Math.round(
    (
      asUtc -
      date.getTime()
    ) /
      MINUTE_IN_MILLISECONDS,
  );
}

function formatOffset(
  offsetMinutes:
    number,
): string {
  const sign =
    offsetMinutes >=
    0
      ? "+"
      : "-";

  const absolute =
    Math.abs(
      offsetMinutes,
    );

  const hours =
    Math.floor(
      absolute /
        60,
    )
      .toString()
      .padStart(
        2,
        "0",
      );

  const minutes =
    (
      absolute %
      60
    )
      .toString()
      .padStart(
        2,
        "0",
      );

  return `UTC${sign}${hours}:${minutes}`;
}

function getShortZoneName(
  date: Date,
  timeZone: string,
): string {
  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone,

        timeZoneName:
          "short",
      },
    ).formatToParts(
      date,
    );

  return (
    parts.find(
      (
        part,
      ) =>
        part.type ===
        "timeZoneName",
    )?.value ??
    timeZone
  );
}

export default function CityWorldClockHero({
  city,
}: CityWorldClockHeroProps) {
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

        const offsetMinutes =
          getCurrentOffsetMinutes(
            currentDate,
            city.timeZone,
          );

        return {
          offsetLabel:
            formatOffset(
              offsetMinutes,
            ),

          shortZoneName:
            getShortZoneName(
              currentDate,
              city.timeZone,
            ),
        };
      },
      [
        city.timeZone,
        currentDate,
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
            {
              city.name
            }
            ,{" "}
            {
              city.countryCode
            }
          </span>
        </nav>

        {/* HERO */}

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch lg:gap-10">
          {/* LEFT */}

          <div className="flex min-w-0 flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />

              {
                city.region
              }{" "}
              World Clock
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {
                city.name
              }{" "}

              <span className="text-primary">
                World Clock
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
              View the live world clock
              for{" "}
              {
                city.name
              }
              ,{" "}
              {
                city.country
              }
              , including local time,
              date, UTC offset and the
              official{" "}
              <strong className="font-semibold text-text-primary">
                {
                  city.timeZone
                }
              </strong>{" "}
              time zone.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                {
                  city.country
                }
              </span>

              <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-text-secondary shadow-sm">
                {
                  city.timeZone
                }
              </span>

              {typeof city.population ===
                "number" && (
                <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                  Pop.{" "}
                  {new Intl.NumberFormat(
                    "en-US",
                    {
                      notation:
                        "compact",

                      maximumFractionDigits:
                        1,
                    },
                  ).format(
                    city.population,
                  )}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/converter?from=${encodeURIComponent(
                  city.name,
                )}`}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                Convert from{" "}
                {
                  city.name
                }
              </Link>

              <Link
                href="/world-clock"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-muted hover:bg-primary-soft hover:text-primary hover:shadow-md active:translate-y-0"
              >
                All world clocks
              </Link>
            </div>
          </div>

          {/* RIGHT LIVE CLOCK */}

          <div className="relative min-w-0 overflow-hidden rounded-3xl border border-primary-muted bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-6 lg:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary-soft blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-100/60 blur-3xl"
            />

            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-30" />

                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>

                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                      Live local time
                    </p>
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {
                      city.name
                    }
                    ,{" "}
                    {
                      city.country
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

              <div className="mt-7">
                <LiveWorldClock
                  timeZone={
                    city.timeZone
                  }
                  locale="en-US"
                  showSeconds
                  className="city-hero-live-clock"
                />
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    UTC offset
                  </p>

                  <p
                    suppressHydrationWarning
                    className="mt-2 font-mono text-sm font-bold text-slate-950"
                  >
                    {
                      information?.offsetLabel ??
                      "..."
                    }
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Active zone
                  </p>

                  <p
                    suppressHydrationWarning
                    className="mt-2 truncate text-sm font-bold text-slate-950"
                  >
                    {
                      information?.shortZoneName ??
                      "..."
                    }
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Status
                  </p>

                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />

                    Live
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium leading-5 text-slate-500">
                  TimeInOne uses{" "}
                  <span className="font-mono font-semibold text-slate-700">
                    {
                      city.timeZone
                    }
                  </span>{" "}
                  to automatically apply
                  the correct regional
                  and daylight-saving
                  rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .city-hero-live-clock {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .city-hero-live-clock time {
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            "Liberation Mono",
            monospace;
          font-size: clamp(
            2.75rem,
            6vw,
            4.75rem
          );
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.05em;
          color: rgb(15 23 42);
          font-variant-numeric:
            tabular-nums;
        }

        .city-hero-live-clock p {
          margin-top: 0.9rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: rgb(71 85 105);
        }

        .city-hero-live-clock span {
          margin-top: 0.55rem;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            "Liberation Mono",
            monospace;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgb(100 116 139);
        }
      `}</style>
    </section>
  );
}