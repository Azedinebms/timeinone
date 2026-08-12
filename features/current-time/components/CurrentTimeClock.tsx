"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

import {
  formatDate,
  formatTime,
  getTimezoneOffset,
  isInsideBusinessHours,
} from "@/lib/time-engine";

type CurrentTimeClockProps = {
  city: string;
  country: string;
  timezone: string;
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
      ) *
        60,
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

export default function CurrentTimeClock({
  city,
  country,
  timezone,
}: CurrentTimeClockProps) {
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
    <Card
      as="section"
      variant="elevated"
      padding="none"
      className="mt-10 overflow-hidden"
    >
      <div className="relative overflow-hidden border-b border-border bg-surface-soft p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-primary-soft blur-3xl"
        />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="primary"
              size="sm"
              dot
            >
              Current local time
            </Badge>

            <Badge
              variant={
                information.isBusinessHours
                  ? "success"
                  : "warning"
              }
              size="sm"
            >
              {information.isBusinessHours
                ? "Working hours"
                : "Outside working hours"}
            </Badge>
          </div>

          <h2
            suppressHydrationWarning
            className="mt-5 font-mono text-5xl font-bold tracking-tight text-text-primary tabular-nums sm:text-7xl"
          >
            {
              information.time
            }
          </h2>

          <p
            suppressHydrationWarning
            className="mt-4 text-lg text-text-secondary"
          >
            {
              information.date
            }
          </p>

          <p className="mt-2 text-sm text-text-muted">
            {city},{" "}
            {country}
          </p>
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        <article className="bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            City
          </p>

          <p className="mt-2 font-semibold text-text-primary">
            {
              city
            }
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            {
              country
            }
          </p>
        </article>

        <article className="bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Time zone
          </p>

          <p className="mt-2 break-all font-semibold text-text-primary">
            {
              timezone
            }
          </p>

          <p
            suppressHydrationWarning
            className="mt-1 text-sm font-medium text-primary"
          >
            {
              information.offset
            }
          </p>
        </article>

        <article className="bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Time of day
          </p>

          <p
            suppressHydrationWarning
            className="mt-2 font-semibold text-text-primary"
          >
            {
              information.dayPeriod
            }
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            Local day period
          </p>
        </article>

        <article className="bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Availability
          </p>

          <p
            suppressHydrationWarning
            className={[
              "mt-2",
              "font-semibold",

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

          <p className="mt-1 text-sm text-text-secondary">
            Based on 9 AM–6 PM
          </p>
        </article>
      </div>
    </Card>
  );
}