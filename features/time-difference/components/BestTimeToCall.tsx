"use client";

import {
  useMemo,
} from "react";

import Card from "@/components/ui/Card";

type BestTimeToCallProps = {
  fromCity: string;

  fromCountry: string;

  fromTimezone: string;

  toCity: string;

  toCountry: string;

  toTimezone: string;

  referenceDate?: string;
};

type SlotQuality =
  | "best"
  | "acceptable"
  | "avoid";

type CallWindow = {
  quality:
    SlotQuality;

  label:
    string;

  fromStart:
    string;

  fromEnd:
    string;

  toStart:
    string;

  toEnd:
    string;

  description:
    string;
};

type LocalParts = {
  year: number;

  month: number;

  day: number;

  hour: number;

  minute: number;
};

const HOUR_MS =
  3_600_000;

const WORKING_START =
  9;

const WORKING_END =
  18;

const ACCEPTABLE_START =
  7;

const ACCEPTABLE_END =
  21;

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

  return Number.isNaN(
    parsed.getTime(),
  )
    ? new Date()
    : parsed;
}

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

function getDateKey(
  instant: Date,
  timezone: string,
): string {
  const parts =
    getLocalParts(
      instant,
      timezone,
    );

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

function findLocalMidnight(
  referenceInstant: Date,
  timezone: string,
): Date {
  const target =
    getLocalParts(
      referenceInstant,
      timezone,
    );

  const targetDateKey =
    getDateKey(
      referenceInstant,
      timezone,
    );

  const approximateUtc =
    Date.UTC(
      target.year,
      target.month - 1,
      target.day,
      12,
      0,
      0,
      0,
    );

  for (
    let timestamp =
      approximateUtc -
      18 *
        HOUR_MS;
    timestamp <=
    approximateUtc +
      18 *
        HOUR_MS;
    timestamp +=
      15 *
        60_000
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
      getDateKey(
        candidate,
        timezone,
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

  return referenceInstant;
}

function getSlotQuality(
  fromHour: number,
  toHour: number,
): SlotQuality {
  const bothWorking =
    fromHour >=
      WORKING_START &&
    fromHour <
      WORKING_END &&
    toHour >=
      WORKING_START &&
    toHour <
      WORKING_END;

  if (bothWorking) {
    return "best";
  }

  const bothAcceptable =
    fromHour >=
      ACCEPTABLE_START &&
    fromHour <
      ACCEPTABLE_END &&
    toHour >=
      ACCEPTABLE_START &&
    toHour <
      ACCEPTABLE_END;

  if (bothAcceptable) {
    return "acceptable";
  }

  return "avoid";
}

function buildWindows({
  fromTimezone,
  toTimezone,
  referenceDate,
}: {
  fromTimezone: string;

  toTimezone: string;

  referenceDate?: string;
}): CallWindow[] {
  const referenceInstant =
    getReferenceInstant(
      referenceDate,
    );

  const midnight =
    findLocalMidnight(
      referenceInstant,
      fromTimezone,
    );

  const sourceDateKey =
    getDateKey(
      midnight,
      fromTimezone,
    );

  const slots = [];

  for (
    let index = 0;
    index < 26;
    index += 1
  ) {
    const instant =
      new Date(
        midnight.getTime() +
          index *
            HOUR_MS,
      );

    if (
      getDateKey(
        instant,
        fromTimezone,
      ) !==
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

    slots.push({
      instant,

      quality:
        getSlotQuality(
          fromParts.hour,
          toParts.hour,
        ),
    });
  }

  const groups:
    {
      quality:
        SlotQuality;

      instants:
        Date[];
    }[] = [];

  for (
    const slot of slots
  ) {
    const lastGroup =
      groups[
        groups.length -
          1
      ];

    if (
      lastGroup &&
      lastGroup.quality ===
        slot.quality
    ) {
      lastGroup.instants.push(
        slot.instant,
      );
    } else {
      groups.push({
        quality:
          slot.quality,

        instants: [
          slot.instant,
        ],
      });
    }
  }

  const relevantGroups =
    groups
      .filter(
        (
          group,
        ) =>
          group.quality !==
          "avoid",
      )
      .sort(
        (
          first,
          second,
        ) => {
          const rank:
            Record<
              SlotQuality,
              number
            > = {
            best:
              0,

            acceptable:
              1,

            avoid:
              2,
          };

          return (
            rank[
              first.quality
            ] -
            rank[
              second.quality
            ]
          );
        },
      );

  return relevantGroups.map(
    (
      group,
    ) => {
      const start =
        group.instants[0];

      const last =
        group.instants[
          group.instants.length -
            1
        ];

      const end =
        new Date(
          last.getTime() +
            HOUR_MS,
        );

      const isBest =
        group.quality ===
        "best";

      return {
        quality:
          group.quality,

        label:
          isBest
            ? "Best time"
            : "Acceptable",

        fromStart:
          formatTime(
            start,
            fromTimezone,
          ),

        fromEnd:
          formatTime(
            end,
            fromTimezone,
          ),

        toStart:
          formatTime(
            start,
            toTimezone,
          ),

        toEnd:
          formatTime(
            end,
            toTimezone,
          ),

        description:
          isBest
            ? "Both cities are within typical business hours."
            : "This window is outside standard business hours for at least one city, but is still generally reasonable.",
      };
    },
  );
}

function getCardClasses(
  quality: SlotQuality,
): string {
  if (
    quality ===
    "best"
  ) {
    return [
      "border-success/20",
      "bg-success-soft/45",
    ].join(
      " ",
    );
  }

  return [
    "border-warning/25",
    "bg-warning-soft/30",
  ].join(
    " ",
  );
}

export default function BestTimeToCall({
  fromCity,
  fromCountry,
  fromTimezone,
  toCity,
  toCountry,
  toTimezone,
  referenceDate,
}: BestTimeToCallProps) {
  const windows =
    useMemo(
      () =>
        buildWindows({
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

  const bestWindow =
    windows.find(
      (
        window,
      ) =>
        window.quality ===
        "best",
    );

  const acceptableWindows =
    windows
      .filter(
        (
          window,
        ) =>
          window.quality ===
          "acceptable",
      )
      .slice(
        0,
        2,
      );

  return (
    <section className="mt-10">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Call planning
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Best time to call{" "}
          {toCity} from{" "}
          {fromCity}
        </h2>

        <p className="mt-3 text-sm leading-7 text-text-secondary sm:text-base">
          Compare typical business
          hours in {fromCity},{" "}
          {fromCountry} and{" "}
          {toCity},{" "}
          {toCountry} to find a
          practical time for calls,
          meetings or international
          coordination.
        </p>
      </div>

      {bestWindow ? (
        <Card
          as="article"
          variant="soft"
          padding="lg"
          className={[
            "mt-5",
            getCardClasses(
              "best",
            ),
          ].join(
            " ",
          )}
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-success">
                {fromCity}
              </p>

              <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">
                {
                  bestWindow.fromStart
                }
                {" – "}
                {
                  bestWindow.fromEnd
                }
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                {fromCountry}
              </p>
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-full border border-success/20 bg-surface px-4 py-2 text-xs font-semibold text-success">
                Best overlap
              </div>
            </div>

            <div className="lg:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-success">
                {toCity}
              </p>

              <p className="mt-2 text-2xl font-bold tabular-nums text-text-primary">
                {
                  bestWindow.toStart
                }
                {" – "}
                {
                  bestWindow.toEnd
                }
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                {toCountry}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-success/15 pt-5">
            <p className="text-sm leading-7 text-text-secondary">
              The best time to call{" "}
              <strong className="font-semibold text-text-primary">
                {toCity}
              </strong>{" "}
              from{" "}
              <strong className="font-semibold text-text-primary">
                {fromCity}
              </strong>{" "}
              is between{" "}
              <strong className="font-semibold text-text-primary">
                {
                  bestWindow.fromStart
                }
                {" and "}
                {
                  bestWindow.fromEnd
                }
              </strong>{" "}
              in {fromCity}. This
              corresponds to{" "}
              <strong className="font-semibold text-text-primary">
                {
                  bestWindow.toStart
                }
                {" – "}
                {
                  bestWindow.toEnd
                }
              </strong>{" "}
              in {toCity}.
            </p>
          </div>
        </Card>
      ) : (
        <Card
          as="article"
          variant="soft"
          padding="lg"
          className="mt-5 border-warning/25 bg-warning-soft"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-warning">
            No direct business-hours overlap
          </p>

          <h3 className="mt-3 text-xl font-semibold text-text-primary">
            Flexible scheduling is recommended
          </h3>

          <p className="mt-3 text-sm leading-7 text-text-secondary">
            Typical 9:00 AM–6:00 PM
            working hours do not overlap
            directly between {fromCity}
            and {toCity}. Consider an
            early-morning or evening
            call instead.
          </p>
        </Card>
      )}

      {acceptableWindows.length >
        0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-text-primary">
            Other reasonable windows
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {acceptableWindows.map(
              (
                window,
                index,
              ) => (
                <Card
                  key={`${window.fromStart}-${window.toStart}-${index}`}
                  as="article"
                  variant="soft"
                  padding="md"
                  className={
                    getCardClasses(
                      "acceptable",
                    )
                  }
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warning">
                        {fromCity}
                      </p>

                      <p className="mt-1 font-semibold tabular-nums text-text-primary">
                        {
                          window.fromStart
                        }
                        {" – "}
                        {
                          window.fromEnd
                        }
                      </p>
                    </div>

                    <span
                      aria-hidden="true"
                      className="text-text-muted"
                    >
                      →
                    </span>

                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warning">
                        {toCity}
                      </p>

                      <p className="mt-1 font-semibold tabular-nums text-text-primary">
                        {
                          window.toStart
                        }
                        {" – "}
                        {
                          window.toEnd
                        }
                      </p>
                    </div>
                  </div>
                </Card>
              ),
            )}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-6 text-text-muted">
        Recommendations use typical
        9:00 AM–6:00 PM business hours
        and a broader 7:00 AM–9:00 PM
        acceptable calling window.
        Individual schedules may differ.
      </p>
    </section>
  );
}