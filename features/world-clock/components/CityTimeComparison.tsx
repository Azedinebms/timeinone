"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type CityTimeComparisonProps = {
  cityName: string;
  timeZone: string;
};

type TimeSnapshot = {
  cityTime: string;
  cityDate: string;

  utcTime: string;
  utcDate: string;

  visitorTime: string;
  visitorDate: string;
  visitorTimeZone: string;

  differenceMinutes: number;
  dayRelationship: string;
};

function getPart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return (
    parts.find(
      (part) =>
        part.type === type,
    )?.value ?? ""
  );
}

function getDateKey(
  date: Date,
  timeZone: string,
): string {
  const formatter =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone,

        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    );

  const parts =
    formatter.formatToParts(
      date,
    );

  const year =
    getPart(
      parts,
      "year",
    );

  const month =
    getPart(
      parts,
      "month",
    );

  const day =
    getPart(
      parts,
      "day",
    );

  return `${year}-${month}-${day}`;
}

function getTimeZoneOffsetMinutes(
  date: Date,
  timeZone: string,
): number {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone,

        year: "numeric",
        month: "2-digit",
        day: "2-digit",

        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",

        hourCycle: "h23",
      },
    );

  const parts =
    formatter.formatToParts(
      date,
    );

  const year =
    Number(
      getPart(
        parts,
        "year",
      ),
    );

  const month =
    Number(
      getPart(
        parts,
        "month",
      ),
    );

  const day =
    Number(
      getPart(
        parts,
        "day",
      ),
    );

  const hour =
    Number(
      getPart(
        parts,
        "hour",
      ),
    );

  const minute =
    Number(
      getPart(
        parts,
        "minute",
      ),
    );

  const second =
    Number(
      getPart(
        parts,
        "second",
      ),
    );

  const interpretedUtc =
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
    );

  return Math.round(
    (
      interpretedUtc -
      date.getTime()
    ) /
      60_000,
  );
}

function formatTime(
  date: Date,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone,

      hour: "2-digit",
      minute: "2-digit",

      hour12: false,
    },
  ).format(
    date,
  );
}

function formatDate(
  date: Date,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone,

      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(
    date,
  );
}

function formatDifference(
  differenceMinutes: number,
): string {
  if (
    differenceMinutes === 0
  ) {
    return "Same time";
  }

  const absoluteMinutes =
    Math.abs(
      differenceMinutes,
    );

  const hours =
    Math.floor(
      absoluteMinutes / 60,
    );

  const minutes =
    absoluteMinutes % 60;

  const parts: string[] =
    [];

  if (
    hours > 0
  ) {
    parts.push(
      `${hours}h`,
    );
  }

  if (
    minutes > 0
  ) {
    parts.push(
      `${minutes}m`,
    );
  }

  return parts.join(
    " ",
  );
}

function getDifferenceDirection(
  differenceMinutes: number,
): string {
  if (
    differenceMinutes === 0
  ) {
    return "Same local time";
  }

  return differenceMinutes > 0
    ? "ahead of you"
    : "behind you";
}

function getDayRelationship(
  cityDateKey: string,
  visitorDateKey: string,
): string {
  if (
    cityDateKey ===
    visitorDateKey
  ) {
    return "Same calendar day";
  }

  const cityDate =
    new Date(
      `${cityDateKey}T00:00:00Z`,
    );

  const visitorDate =
    new Date(
      `${visitorDateKey}T00:00:00Z`,
    );

  const dayDifference =
    Math.round(
      (
        cityDate.getTime() -
        visitorDate.getTime()
      ) /
        86_400_000,
    );

  if (
    dayDifference === 1
  ) {
    return "Tomorrow in this city";
  }

  if (
    dayDifference === -1
  ) {
    return "Yesterday in this city";
  }

  if (
    dayDifference > 1
  ) {
    return `${dayDifference} days ahead`;
  }

  return `${Math.abs(
    dayDifference,
  )} days behind`;
}

function createSnapshot(
  date: Date,
  cityTimeZone: string,
  visitorTimeZone: string,
): TimeSnapshot {
  const cityOffset =
    getTimeZoneOffsetMinutes(
      date,
      cityTimeZone,
    );

  const visitorOffset =
    getTimeZoneOffsetMinutes(
      date,
      visitorTimeZone,
    );

  const cityDateKey =
    getDateKey(
      date,
      cityTimeZone,
    );

  const visitorDateKey =
    getDateKey(
      date,
      visitorTimeZone,
    );

  return {
    cityTime:
      formatTime(
        date,
        cityTimeZone,
      ),

    cityDate:
      formatDate(
        date,
        cityTimeZone,
      ),

    utcTime:
      formatTime(
        date,
        "UTC",
      ),

    utcDate:
      formatDate(
        date,
        "UTC",
      ),

    visitorTime:
      formatTime(
        date,
        visitorTimeZone,
      ),

    visitorDate:
      formatDate(
        date,
        visitorTimeZone,
      ),

    visitorTimeZone,

    differenceMinutes:
      cityOffset -
      visitorOffset,

    dayRelationship:
      getDayRelationship(
        cityDateKey,
        visitorDateKey,
      ),
  };
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="10"
        r="2.5"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
      />

      <path
        d="M5 20c.8-4 3.2-6 7-6s6.2 2 7 6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
      />

      <path d="M4 12h16" />

      <path d="M12 4c2 2.2 3 4.8 3 8s-1 5.8-3 8" />

      <path d="M12 4c-2 2.2-3 4.8-3 8s1 5.8 3 8" />
    </svg>
  );
}

export default function CityTimeComparison({
  cityName,
  timeZone,
}: CityTimeComparisonProps) {
  const [
    currentDate,
    setCurrentDate,
  ] =
    useState<Date | null>(
      null,
    );

  const [
    visitorTimeZone,
    setVisitorTimeZone,
  ] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    const initialTimeout =
      window.setTimeout(
        () => {
          const detectedTimeZone =
            Intl.DateTimeFormat()
              .resolvedOptions()
              .timeZone;

          setVisitorTimeZone(
            detectedTimeZone ||
              "UTC",
          );

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
        30_000,
      );

    return () => {
      window.clearTimeout(
        initialTimeout,
      );

      window.clearInterval(
        interval,
      );
    };
  }, []);

  const snapshot =
    useMemo(
      () => {
        if (
          !currentDate ||
          !visitorTimeZone
        ) {
          return null;
        }

        try {
          return createSnapshot(
            currentDate,
            timeZone,
            visitorTimeZone,
          );
        } catch {
          return null;
        }
      },
      [
        currentDate,
        timeZone,
        visitorTimeZone,
      ],
    );

  if (
    !snapshot
  ) {
    return (
      <div className="h-[360px] animate-pulse rounded-3xl border border-border bg-surface-soft" />
    );
  }

  const difference =
    formatDifference(
      snapshot.differenceMinutes,
    );

  const direction =
    getDifferenceDirection(
      snapshot.differenceMinutes,
    );

  return (
  <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
    {/* HEADER */}

    <header className="flex flex-col gap-3 border-b border-border bg-surface-soft px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />

          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
            Live time comparison
          </p>
        </div>

        <h3 className="mt-2 text-lg font-bold text-text-primary">
          {cityName} vs your local time
        </h3>
      </div>

      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-30" />

          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>

        Live
      </span>
    </header>

    {/* TWO MAIN CLOCKS */}

    <div className="grid md:grid-cols-2">
      {/* CITY */}

      <section className="relative border-b border-border p-6 sm:p-7 md:border-b-0 md:border-r">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 bg-primary"
        />

        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600">
            <LocationIcon />
          </span>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              Selected city
            </p>

            <h4 className="mt-1 text-xl font-bold text-slate-950">
              {cityName}
            </h4>
          </div>
        </div>

        <p
          suppressHydrationWarning
          className="mt-7 font-mono text-5xl font-black tracking-[-0.05em] text-slate-950 tabular-nums"
        >
          {snapshot.cityTime}
        </p>

        <p
          suppressHydrationWarning
          className="mt-3 text-sm font-medium text-slate-600"
        >
          {snapshot.cityDate}
        </p>

        <div className="mt-5 inline-flex max-w-full rounded-xl border border-blue-100 bg-blue-50 px-3 py-2">
          <span className="break-all font-mono text-xs font-semibold text-blue-700">
            {timeZone}
          </span>
        </div>
      </section>

      {/* VISITOR */}

      <section className="p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600">
            <UserIcon />
          </span>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
              Your location
            </p>

            <h4 className="mt-1 text-xl font-bold text-slate-950">
              Local time
            </h4>
          </div>
        </div>

        <p
          suppressHydrationWarning
          className="mt-7 font-mono text-5xl font-black tracking-[-0.05em] text-slate-950 tabular-nums"
        >
          {snapshot.visitorTime}
        </p>

        <p
          suppressHydrationWarning
          className="mt-3 text-sm font-medium text-slate-600"
        >
          {snapshot.visitorDate}
        </p>

        <div className="mt-5 inline-flex max-w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="break-all font-mono text-xs font-semibold text-slate-600">
            {snapshot.visitorTimeZone}
          </span>
        </div>
      </section>
    </div>

    {/* DIFFERENCE BAR */}

    <div className="border-t border-border bg-gradient-to-r from-violet-50 via-white to-blue-50 px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-white text-violet-600 shadow-sm">
            ↔
          </span>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-600">
              Current difference
            </p>

            <p className="mt-1 text-base font-bold text-slate-950">
              {snapshot.differenceMinutes === 0
                ? `${cityName} has the same local time`
                : `${cityName} is ${difference} ${direction}`}
            </p>
          </div>
        </div>

        <span className="inline-flex w-fit rounded-full border border-violet-200 bg-white px-4 py-2 text-lg font-black text-violet-700 shadow-sm">
          {snapshot.differenceMinutes === 0
            ? "0h"
            : snapshot.differenceMinutes > 0
              ? `+${difference}`
              : `−${difference}`}
        </span>
      </div>
    </div>

    {/* FOOTER INFO */}

    <footer className="border-t border-border bg-slate-50/70 px-5 py-4 sm:px-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-200 bg-violet-50 text-violet-600">
            <GlobeIcon />
          </span>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted">
              UTC reference
            </p>

            <p className="mt-1 font-mono text-sm font-bold text-slate-950">
              {snapshot.utcTime}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-600">
              Calendar
            </p>

            <p className="mt-1 text-sm font-bold text-emerald-900">
              {snapshot.dayRelationship}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-25" />

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-muted">
              Status
            </p>

            <p className="mt-1 text-sm font-bold text-slate-950">
              Auto-updating
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
);
}