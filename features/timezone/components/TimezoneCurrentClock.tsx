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
} from "@/lib/time-engine";

import {
  formatOffsetMinutes,
  getTimezoneOffsetMinutes,
  type TimezoneDefinition,
} from "@/lib/timezones";

type TimezoneCurrentClockProps = {
  timezone:
    TimezoneDefinition;
};

const MINUTE_IN_MILLISECONDS =
  60 * 1000;

function formatFixedTimezone(
  instant:
    Date,

  offsetMinutes:
    number,
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
          "numeric",

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

function formatIanaTime(
  instant:
    Date,

  timezone:
    string,
) {
  const time =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          timezone,

        hour:
          "numeric",

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
) {
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

export default function TimezoneCurrentClock({
  timezone,
}: TimezoneCurrentClockProps) {
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
        const offsetMinutes =
          getTimezoneOffsetMinutes(
            timezone,
            currentDate,
          );

        const formatted =
          timezone.kind ===
            "iana" &&
          timezone.ianaTimezone
            ? formatIanaTime(
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

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
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
                  timezone.observesDst
                    ? "accent"
                    : "neutral"
                }
                size="sm"
              >
                {timezone.observesDst
                  ? "DST supported"
                  : "Fixed offset"}
              </Badge>
            </div>

            <p
              suppressHydrationWarning
              className="mt-5 font-mono text-5xl font-bold tracking-tight text-text-primary tabular-nums sm:text-7xl"
            >
              {
                information.time
              }
            </p>

            <p
              suppressHydrationWarning
              className="mt-4 text-lg text-text-secondary"
            >
              {
                information.date
              }
            </p>
          </div>

          <Badge
            variant="primary"
            size="md"
          >
            {
              information.offsetLabel
            }
          </Badge>
        </div>
      </div>

      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        <article className="bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Abbreviation
          </p>

          <p className="mt-2 text-xl font-bold text-text-primary">
            {
              timezone.abbreviation
            }
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            {
              timezone.name
            }
          </p>
        </article>

        <article className="bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Active offset
          </p>

          <p
            suppressHydrationWarning
            className="mt-2 text-xl font-bold text-primary"
          >
            {
              information.offsetLabel
            }
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            {
              information.offsetMinutes
            }{" "}
            minutes
          </p>
        </article>

        <article className="bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Time-zone type
          </p>

          <p className="mt-2 font-semibold text-text-primary">
            {timezone.kind ===
            "fixed"
              ? "Fixed offset"
              : "Seasonal IANA zone"}
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            DST rules:{" "}
            {timezone.observesDst
              ? "Supported"
              : "Not automatic"}
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
            Current local period
          </p>
        </article>
      </div>
    </Card>
  );
}