"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type CityTimeDetailsProps = {
  timeZone:
    string;
};

type TimeDetails = {
  utcOffset:
    string;

  timeZoneName:
    string;

  weekday:
    string;

  localDate:
    string;

  localIsoDate:
    string;
};

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
    )?.value ?? ""
  );
}

function getUtcOffset(
  date:
    Date,

  timeZone:
    string,
): string {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone,

        timeZoneName:
          "longOffset",
      },
    );

  const parts =
    formatter.formatToParts(
      date,
    );

  const rawOffset =
    getPart(
      parts,
      "timeZoneName",
    );

  if (
    rawOffset ===
      "GMT" ||
    rawOffset ===
      "UTC"
  ) {
    return "UTC+00:00";
  }

  return rawOffset.replace(
    "GMT",
    "UTC",
  );
}

function getTimeDetails(
  date:
    Date,

  timeZone:
    string,
): TimeDetails {
  const dateFormatter =
    new Intl.DateTimeFormat(
      "en-US",
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

  const shortFormatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone,

        timeZoneName:
          "short",
      },
    );

  const isoFormatter =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone,

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      },
    );

  const dateParts =
    dateFormatter.formatToParts(
      date,
    );

  const shortParts =
    shortFormatter.formatToParts(
      date,
    );

  return {
    utcOffset:
      getUtcOffset(
        date,
        timeZone,
      ),

    timeZoneName:
      getPart(
        shortParts,
        "timeZoneName",
      ),

    weekday:
      getPart(
        dateParts,
        "weekday",
      ),

    localDate:
      dateFormatter.format(
        date,
      ),

    localIsoDate:
      isoFormatter.format(
        date,
      ),
  };
}

function OffsetIcon() {
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

      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function ZoneIcon() {
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

function DayIcon() {
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
        r="4"
      />

      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
      />

      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
    </svg>
  );
}

export default function CityTimeDetails({
  timeZone,
}: CityTimeDetailsProps) {
  const [
    currentDate,
    setCurrentDate,
  ] =
    useState<Date | null>(
      null,
    );

  useEffect(() => {
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
        60_000,
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

  const details =
    useMemo(
      () => {
        if (
          !currentDate
        ) {
          return null;
        }

        try {
          return getTimeDetails(
            currentDate,
            timeZone,
          );
        } catch {
          return null;
        }
      },
      [
        currentDate,
        timeZone,
      ],
    );

  if (
    !details
  ) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length:
            4,
        }).map(
          (
            _,
            index,
          ) => (
            <div
              key={
                index
              }
              className="h-32 animate-pulse rounded-2xl border border-border bg-surface-soft"
            />
          ),
        )}
      </div>
    );
  }

  const items = [
    {
      label:
        "UTC offset",

      value:
        details.utcOffset,

      meta:
        "Current offset",

      icon:
        <OffsetIcon />,

      tone:
        "blue",
    },

    {
      label:
        "Active zone",

      value:
        details.timeZoneName,

      meta:
        timeZone,

      icon:
        <ZoneIcon />,

      tone:
        "violet",
    },

    {
      label:
        "Local day",

      value:
        details.weekday,

      meta:
        "Current weekday",

      icon:
        <DayIcon />,

      tone:
        "emerald",
    },

    {
      label:
        "Local date",

      value:
        details.localIsoDate,

      meta:
        details.localDate,

      icon:
        <CalendarIcon />,

      tone:
        "amber",
    },
  ] as const;

  function getToneClasses(
    tone:
      "blue" |
      "violet" |
      "emerald" |
      "amber",
  ) {
    switch (
      tone
    ) {
      case "blue":
        return {
          icon:
            "border-blue-200 bg-blue-50 text-blue-600",

          value:
            "text-blue-700",

          accent:
            "bg-blue-500",
        };

      case "violet":
        return {
          icon:
            "border-violet-200 bg-violet-50 text-violet-600",

          value:
            "text-violet-700",

          accent:
            "bg-violet-500",
        };

      case "emerald":
        return {
          icon:
            "border-emerald-200 bg-emerald-50 text-emerald-600",

          value:
            "text-emerald-700",

          accent:
            "bg-emerald-500",
        };

      case "amber":
        return {
          icon:
            "border-amber-200 bg-amber-50 text-amber-600",

          value:
            "text-amber-700",

          accent:
            "bg-amber-500",
        };
    }
  }

  return (
    <dl className="grid gap-5 md:grid-cols-2">
      {items.map(
        (
          item,
        ) => {
          const tone =
            getToneClasses(
              item.tone,
            );

          return (
            <div
              key={
                item.label
              }
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-muted hover:shadow-md"
            >
              <div
                aria-hidden="true"
                className={[
                  "absolute",
                  "left-0",
                  "top-0",
                  "h-full",
                  "w-1",
                  tone.accent,
                ].join(
                  " ",
                )}
              />

              <div className="flex items-start justify-between gap-4">
                <div
                  className={[
                    "flex",
                    "h-10",
                    "w-10",
                    "shrink-0",
                    "items-center",
                    "justify-center",
                    "rounded-xl",
                    "border",
                    tone.icon,
                  ].join(
                    " ",
                  )}
                >
                  {
                    item.icon
                  }
                </div>

                <span className="rounded-full border border-border bg-surface-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted">
                  Live
                </span>
              </div>

              <dt className="mt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                {
                  item.label
                }
              </dt>

              <dd
                suppressHydrationWarning
                className={[
                  "mt-2",
                  "truncate",
                  "text-2xl",
                  "font-black",
                  "tracking-tight",
                  tone.value,
                ].join(
                  " ",
                )}
              >
                {
                  item.value
                }
              </dd>

              <p
                suppressHydrationWarning
                className="mt-2 truncate text-sm font-medium text-text-muted"
              >
                {
                  item.meta
                }
              </p>
            </div>
          );
        },
      )}
    </dl>
  );
}