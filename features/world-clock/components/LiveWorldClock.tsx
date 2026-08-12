"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Badge from "@/components/ui/Badge";

type LiveWorldClockProps = {
  timeZone: string;
  locale?: string;
  showSeconds?: boolean;
  className?: string;
};

type ClockValue = {
  time: string;
  date: string;
  abbreviation: string;
};

function isValidTimeZone(
  timeZone: string,
): boolean {
  try {
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone,
      },
    ).format();

    return true;
  } catch {
    return false;
  }
}

function getPart(
  parts:
    Intl.DateTimeFormatPart[],
  type:
    Intl.DateTimeFormatPartTypes,
): string {
  return (
    parts.find(
      (
        part,
      ) =>
        part.type ===
        type,
    )?.value ??
    ""
  );
}

function formatClock(
  date: Date,
  timeZone: string,
  locale: string,
  showSeconds: boolean,
): ClockValue {
  const timeFormatter =
    new Intl.DateTimeFormat(
      locale,
      {
        timeZone,

        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          showSeconds
            ? "2-digit"
            : undefined,

        hour12:
          false,

        timeZoneName:
          "short",
      },
    );

  const dateFormatter =
    new Intl.DateTimeFormat(
      locale,
      {
        timeZone,

        weekday:
          "long",

        year:
          "numeric",

        month:
          "long",

        day:
          "numeric",
      },
    );

  const parts =
    timeFormatter.formatToParts(
      date,
    );

  const hour =
    getPart(
      parts,
      "hour",
    );

  const minute =
    getPart(
      parts,
      "minute",
    );

  const second =
    getPart(
      parts,
      "second",
    );

  const abbreviation =
    getPart(
      parts,
      "timeZoneName",
    );

  return {
    time:
      showSeconds
        ? `${hour}:${minute}:${second}`
        : `${hour}:${minute}`,

    date:
      dateFormatter.format(
        date,
      ),

    abbreviation,
  };
}

export default function LiveWorldClock({
  timeZone,
  locale = "en-US",
  showSeconds = true,
  className = "",
}: LiveWorldClockProps) {
  const validTimeZone =
    useMemo(
      () =>
        isValidTimeZone(
          timeZone,
        ),
      [
        timeZone,
      ],
    );

  const [
    currentDate,
    setCurrentDate,
  ] =
    useState<
      Date | null
    >(
      null,
    );

  useEffect(() => {
    if (
      !validTimeZone
    ) {
      return;
    }

    const initialTimeout =
      window.setTimeout(
        () => {
          setCurrentDate(
            new Date(),
          );
        },
        0,
      );

    const interval =
      window.setInterval(
        () => {
          setCurrentDate(
            new Date(),
          );
        },
        1_000,
      );

    return () => {
      window.clearTimeout(
        initialTimeout,
      );

      window.clearInterval(
        interval,
      );
    };
  }, [
    validTimeZone,
  ]);

  const clock =
    useMemo(
      () => {
        if (
          !currentDate ||
          !validTimeZone
        ) {
          return null;
        }

        return formatClock(
          currentDate,
          timeZone,
          locale,
          showSeconds,
        );
      },
      [
        currentDate,
        locale,
        showSeconds,
        timeZone,
        validTimeZone,
      ],
    );

  if (
    !validTimeZone
  ) {
    return (
      <div
        className={
          className
        }
        role="status"
      >
        <p className="text-sm font-medium text-danger">
          Invalid time zone
        </p>
      </div>
    );
  }

  if (
    !clock
  ) {
    return (
      <div
        className={
          className
        }
        role="status"
      >
        <div className="h-11 w-44 animate-pulse rounded-lg bg-surface-muted" />

        <div className="mt-3 h-5 w-52 animate-pulse rounded bg-surface-muted" />
      </div>
    );
  }

  return (
    <div
      className={
        className
      }
      role="timer"
      aria-label={
        `Current time in ${timeZone}: ${clock.time}`
      }
    >
      <div className="flex flex-wrap items-end gap-3">
        <time
          dateTime={
            currentDate
              ?.toISOString()
          }
          className="font-mono text-3xl font-bold tracking-tight text-text-primary tabular-nums sm:text-4xl"
        >
          {
            clock.time
          }
        </time>

        {clock.abbreviation && (
          <Badge
            variant="primary"
            size="sm"
          >
            {
              clock.abbreviation
            }
          </Badge>
        )}
      </div>

      <p className="mt-3 text-sm text-text-secondary">
        {
          clock.date
        }
      </p>
    </div>
  );
}