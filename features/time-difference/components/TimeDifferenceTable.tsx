"use client";

import {
  useMemo,
} from "react";

import Card from "@/components/ui/Card";

type TimeDifferenceTableProps = {
  fromCity: string;

  fromCountry: string;

  fromTimezone: string;

  toCity: string;

  toCountry: string;

  toTimezone: string;

  referenceDate?: string;
};

type SlotStatus =
  | "good"
  | "possible"
  | "poor"
  | "night";

type LocalParts = {
  year: number;

  month: number;

  day: number;

  hour: number;

  minute: number;
};

type ComparisonRow = {
  id: string;

  instant:
    Date;

  fromTime:
    string;

  toTime:
    string;

  fromDate:
    string;

  toDate:
    string;

  dayOffset:
    number;

  status:
    SlotStatus;

  label:
    string;
};

type BestOverlap = {
  rows:
    ComparisonRow[];

  start:
    ComparisonRow;

  end:
    ComparisonRow;

  fromEndTime:
    string;

  toEndTime:
    string;
};

const WORKING_START =
  9;

const WORKING_END =
  18;

const EARLY_START =
  7;

const LATE_END =
  21;

const HOUR_MS =
  3_600_000;

const DAY_MS =
  86_400_000;

function getLocalParts(
  instant: Date,
  timezone: string,
): LocalParts {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          timezone,

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

        hourCycle:
          "h23",
      },
    );

  const parts =
    formatter.formatToParts(
      instant,
    );

  const map =
    Object.fromEntries(
      parts.map(
        (
          part,
        ) => [
          part.type,
          part.value,
        ],
      ),
    );

  return {
    year:
      Number(
        map.year,
      ),

    month:
      Number(
        map.month,
      ),

    day:
      Number(
        map.day,
      ),

    hour:
      Number(
        map.hour,
      ),

    minute:
      Number(
        map.minute,
      ),
  };
}

function getDateKeyFromParts(
  parts: Pick<
    LocalParts,
    | "year"
    | "month"
    | "day"
  >,
): string {
  return [
    String(
      parts.year,
    ).padStart(
      4,
      "0",
    ),

    String(
      parts.month,
    ).padStart(
      2,
      "0",
    ),

    String(
      parts.day,
    ).padStart(
      2,
      "0",
    ),
  ].join(
    "-",
  );
}

function getLocalDateKey(
  instant: Date,
  timezone: string,
): string {
  return getDateKeyFromParts(
    getLocalParts(
      instant,
      timezone,
    ),
  );
}

function formatTime(
  instant: Date,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        timezone,

      hour:
        "numeric",

      minute:
        "2-digit",

      hour12:
        true,
    },
  ).format(
    instant,
  );
}

function formatShortDate(
  instant: Date,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        timezone,

      weekday:
        "short",

      month:
        "short",

      day:
        "numeric",
    },
  ).format(
    instant,
  );
}

function classifyHour(
  fromHour: number,
  toHour: number,
): {
  status:
    SlotStatus;

  label:
    string;
} {
  const fromWorking =
    fromHour >=
      WORKING_START &&
    fromHour <
      WORKING_END;

  const toWorking =
    toHour >=
      WORKING_START &&
    toHour <
      WORKING_END;

  const fromPossible =
    fromHour >=
      EARLY_START &&
    fromHour <
      LATE_END;

  const toPossible =
    toHour >=
      EARLY_START &&
    toHour <
      LATE_END;

  const fromNight =
    fromHour <
      EARLY_START ||
    fromHour >=
      LATE_END;

  const toNight =
    toHour <
      EARLY_START ||
    toHour >=
      LATE_END;

  if (
    fromWorking &&
    toWorking
  ) {
    return {
      status:
        "good",

      label:
        "Good overlap",
    };
  }

  if (
    fromPossible &&
    toPossible
  ) {
    return {
      status:
        "possible",

      label:
        "Possible",
    };
  }

  if (
    fromNight ||
    toNight
  ) {
    return {
      status:
        "night",

      label:
        "Night",
    };
  }

  return {
    status:
      "poor",

    label:
      "Outside working hours",
  };
}

function getDayOffset(
  fromDateKey: string,
  toDateKey: string,
): number {
  const fromDate =
    new Date(
      `${fromDateKey}T00:00:00Z`,
    );

  const toDate =
    new Date(
      `${toDateKey}T00:00:00Z`,
    );

  return Math.round(
    (
      toDate.getTime() -
      fromDate.getTime()
    ) /
      DAY_MS,
  );
}

function getStatusClasses(
  status: SlotStatus,
): {
  badge: string;

  row: string;

  dot: string;
} {
  switch (status) {
    case "good":
      return {
        badge:
          "border-success/20 bg-success-soft text-success",

        row:
          "bg-success-soft/35",

        dot:
          "bg-success",
      };

    case "possible":
      return {
        badge:
          "border-warning/25 bg-warning-soft text-warning",

        row:
          "bg-warning-soft/25",

        dot:
          "bg-warning",
      };

    case "night":
      return {
        badge:
          "border-border bg-surface-soft text-text-muted",

        row:
          "bg-surface-soft/70",

        dot:
          "bg-text-muted",
      };

    default:
      return {
        badge:
          "border-danger/15 bg-danger-soft text-danger",

        row:
          "bg-danger-soft/20",

        dot:
          "bg-danger",
      };
  }
}

function getReferenceInstant(
  referenceDate?: string,
): Date {
  if (!referenceDate) {
    return new Date();
  }

  const parsed =
    new Date(
      referenceDate,
    );

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return new Date();
  }

  return parsed;
}

/*
 * Find the instant corresponding to
 * 00:00 in the selected FROM timezone.
 *
 * We search around UTC noon because
 * timezone offsets can place local
 * midnight on the previous or next UTC day.
 */
function findLocalMidnight(
  referenceInstant: Date,
  timezone: string,
): Date {
  const targetParts =
    getLocalParts(
      referenceInstant,
      timezone,
    );

  const targetDateKey =
    getDateKeyFromParts(
      targetParts,
    );

  const approximateUtc =
    Date.UTC(
      targetParts.year,
      targetParts.month -
        1,
      targetParts.day,
      12,
      0,
      0,
      0,
    );

  const searchStart =
    approximateUtc -
    18 *
      HOUR_MS;

  const searchEnd =
    approximateUtc +
    18 *
      HOUR_MS;

  /*
   * 15-minute increments cover modern
   * IANA offsets including :15, :30
   * and :45 zones.
   */
  for (
    let timestamp =
      searchStart;
    timestamp <=
    searchEnd;
    timestamp +=
      15 * 60_000
  ) {
    const candidate =
      new Date(
        timestamp,
      );

    const parts =
      getLocalParts(
        candidate,
        timezone,
      );

    if (
      getDateKeyFromParts(
        parts,
      ) ===
        targetDateKey &&
      parts.hour ===
        0 &&
      parts.minute ===
        0
    ) {
      return candidate;
    }
  }

  /*
   * Defensive fallback.
   * This should not normally be reached
   * for modern timezone data.
   */
  return new Date(
    referenceInstant.getTime() -
      targetParts.hour *
        HOUR_MS -
      targetParts.minute *
        60_000 -
      referenceInstant.getSeconds() *
        1_000 -
      referenceInstant.getMilliseconds(),
  );
}

function buildComparisonRows({
  fromTimezone,
  toTimezone,
  referenceDate,
}: {
  fromTimezone: string;

  toTimezone: string;

  referenceDate?: string;
}): ComparisonRow[] {
  const referenceInstant =
    getReferenceInstant(
      referenceDate,
    );

  const startInstant =
    findLocalMidnight(
      referenceInstant,
      fromTimezone,
    );

  const sourceDateKey =
    getLocalDateKey(
      startInstant,
      fromTimezone,
    );

  const rows:
    ComparisonRow[] = [];

  /*
   * We advance through real instants,
   * not "local hour + offset".
   *
   * Normal days produce 24 rows.
   * DST spring-forward days can produce 23.
   * DST fall-back days can produce 25.
   */
  for (
    let index = 0;
    index < 26;
    index += 1
  ) {
    const instant =
      new Date(
        startInstant.getTime() +
          index *
            HOUR_MS,
      );

    const currentFromDateKey =
      getLocalDateKey(
        instant,
        fromTimezone,
      );

    if (
      currentFromDateKey !==
      sourceDateKey
    ) {
      break;
    }

    const fromParts =
      getLocalParts(
        instant,
        fromTimezone,
      );

    const toParts =
      getLocalParts(
        instant,
        toTimezone,
      );

    const classification =
      classifyHour(
        fromParts.hour,
        toParts.hour,
      );

    const toDateKey =
      getLocalDateKey(
        instant,
        toTimezone,
      );

    rows.push({
      id:
        `${instant.getTime()}-${index}`,

      instant,

      fromTime:
        formatTime(
          instant,
          fromTimezone,
        ),

      toTime:
        formatTime(
          instant,
          toTimezone,
        ),

      fromDate:
        formatShortDate(
          instant,
          fromTimezone,
        ),

      toDate:
        formatShortDate(
          instant,
          toTimezone,
        ),

      dayOffset:
        getDayOffset(
          currentFromDateKey,
          toDateKey,
        ),

      status:
        classification.status,

      label:
        classification.label,
    });
  }

  return rows;
}

function findBestOverlap(
  rows: ComparisonRow[],
  fromTimezone: string,
  toTimezone: string,
): BestOverlap | null {
  let bestGroup:
    ComparisonRow[] = [];

  let currentGroup:
    ComparisonRow[] = [];

  for (
    const row of rows
  ) {
    if (
      row.status ===
      "good"
    ) {
      currentGroup.push(
        row,
      );

      if (
        currentGroup.length >
        bestGroup.length
      ) {
        bestGroup = [
          ...currentGroup,
        ];
      }
    } else {
      currentGroup = [];
    }
  }

  if (
    bestGroup.length ===
    0
  ) {
    return null;
  }

  const start =
    bestGroup[0];

  const end =
    bestGroup[
      bestGroup.length -
        1
    ];

  const endInstant =
    new Date(
      end.instant.getTime() +
        HOUR_MS,
    );

  return {
    rows:
      bestGroup,

    start,

    end,

    fromEndTime:
      formatTime(
        endInstant,
        fromTimezone,
      ),

    toEndTime:
      formatTime(
        endInstant,
        toTimezone,
      ),
  };
}

function DayOffsetBadge({
  offset,
}: {
  offset: number;
}) {
  if (
    offset ===
    0
  ) {
    return null;
  }

  return (
    <span
      className={[
        "ml-2",
        "inline-flex",
        "rounded-full",
        "border",
        "border-primary-muted",
        "bg-primary-soft",
        "px-2",
        "py-0.5",
        "text-[10px]",
        "font-semibold",
        "text-primary",
      ].join(
        " ",
      )}
    >
      {offset > 0
        ? "Next day"
        : "Previous day"}
    </span>
  );
}

function DayLengthBadge({
  rowCount,
}: {
  rowCount: number;
}) {
  if (
    rowCount ===
    24
  ) {
    return (
      <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-text-secondary">
        24-hour day
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-warning/25 bg-warning-soft px-3 py-1.5 text-xs font-semibold text-warning">
      {rowCount}-hour DST day
    </span>
  );
}

export default function TimeDifferenceTable({
  fromCity,
  fromCountry,
  fromTimezone,
  toCity,
  toCountry,
  toTimezone,
  referenceDate,
}: TimeDifferenceTableProps) {
  const rows =
    useMemo(
      () =>
        buildComparisonRows({
          fromTimezone,
          toTimezone,
          referenceDate,
        }),
      [
        fromTimezone,
        toTimezone,
        referenceDate,
      ],
    );

  const bestOverlap =
    useMemo(
      () =>
        findBestOverlap(
          rows,
          fromTimezone,
          toTimezone,
        ),
      [
        rows,
        fromTimezone,
        toTimezone,
      ],
    );

  return (
    <section className="mt-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            24-hour comparison
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            Compare{" "}
            {fromCity} and{" "}
            {toCity} hour by hour
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-text-secondary sm:text-base">
            See how a full local day in{" "}
            {fromCity},{" "}
            {fromCountry} maps to{" "}
            {toCity},{" "}
            {toCountry}. TimeInOne
            automatically accounts for
            timezone offsets, date
            changes and daylight-saving
            transitions.
          </p>
        </div>

        <DayLengthBadge
          rowCount={
            rows.length
          }
        />
      </div>

      {bestOverlap ? (
        <Card
          as="div"
          variant="soft"
          padding="md"
          className="mb-5 border-success/20 bg-success-soft/50"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-success">
                Best working-hours overlap
              </p>

              <p className="mt-2 text-lg font-semibold text-text-primary">
                {
                  bestOverlap.start
                    .fromTime
                }
                {" – "}
                {
                  bestOverlap.fromEndTime
                }
                {" in "}
                {fromCity}
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                corresponds to{" "}
                {
                  bestOverlap.start
                    .toTime
                }
                {" – "}
                {
                  bestOverlap.toEndTime
                }
                {" in "}
                {toCity}.
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-full border border-success/20 bg-surface px-3 py-1.5 text-xs font-semibold text-success">
              {
                bestOverlap.rows
                  .length
              }{" "}
              {bestOverlap.rows
                .length === 1
                ? "hour"
                : "hours"}{" "}
              overlap
            </span>
          </div>
        </Card>
      ) : (
        <Card
          as="div"
          variant="soft"
          padding="md"
          className="mb-5 border-warning/25 bg-warning-soft"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warning">
            Working-hours overlap
          </p>

          <p className="mt-2 text-sm leading-6 text-text-secondary">
            There is no direct overlap
            between typical 9:00 AM–6:00
            PM working hours in{" "}
            {fromCity} and{" "}
            {toCity} on this date.
          </p>
        </Card>
      )}

      <Card
        as="div"
        variant="elevated"
        padding="none"
        className="overflow-hidden"
      >
        <div className="overflow-x-auto">
          <div className="min-w-[620px]">
            <div className="grid grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,0.9fr)] border-b border-border bg-surface-soft px-4 py-3 sm:px-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  {fromCity}
                </p>

                <p className="mt-1 text-xs text-text-subtle">
                  {fromTimezone}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  {toCity}
                </p>

                <p className="mt-1 text-xs text-text-subtle">
                  {toTimezone}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  Availability
                </p>
              </div>
            </div>

            <div className="divide-y divide-border">
              {rows.map(
                (
                  row,
                ) => {
                  const classes =
                    getStatusClasses(
                      row.status,
                    );

                  return (
                    <div
                      key={
                        row.id
                      }
                      className={[
                        "grid",
                        "grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,0.9fr)]",
                        "items-center",
                        "gap-3",
                        "px-4",
                        "py-2.5",
                        "transition",
                        "sm:px-5",
                        classes.row,
                      ].join(
                        " ",
                      )}
                    >
                      <div>
                        <p className="font-semibold tabular-nums text-text-primary">
                          {
                            row.fromTime
                          }
                        </p>

                        <p className="mt-0.5 text-[11px] text-text-muted">
                          {
                            row.fromDate
                          }
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center">
                          <p className="font-semibold tabular-nums text-text-primary">
                            {
                              row.toTime
                            }
                          </p>

                          <DayOffsetBadge
                            offset={
                              row.dayOffset
                            }
                          />
                        </div>

                        <p className="mt-0.5 text-[11px] text-text-muted">
                          {
                            row.toDate
                          }
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <span
                          className={[
                            "inline-flex",
                            "items-center",
                            "gap-2",
                            "rounded-full",
                            "border",
                            "px-2.5",
                            "py-1",
                            "text-[11px]",
                            "font-semibold",
                            classes.badge,
                          ].join(
                            " ",
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={[
                              "h-1.5",
                              "w-1.5",
                              "rounded-full",
                              classes.dot,
                            ].join(
                              " ",
                            )}
                          />

                          {
                            row.label
                          }
                        </span>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <p className="text-xs leading-6 text-text-muted">
          Working-hour labels use a
          general 9:00 AM–6:00 PM
          schedule. Individual schedules
          may differ.
        </p>

        <p className="text-xs leading-6 text-text-muted sm:text-right">
          On daylight-saving transition
          dates, a local day can contain
          23 or 25 real hours instead of
          24.
        </p>
      </div>
    </section>
  );
}