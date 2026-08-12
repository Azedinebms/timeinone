"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  BusinessHours,
} from "@/lib/time-engine";

const HOUR_OPTIONS =
  Array.from(
    {
      length: 25,
    },
    (
      _,
      index,
    ) => index,
  );

const WEEKDAYS = [
  {
    index: 1,
    shortLabel: "M",
    label: "Monday",
  },
  {
    index: 2,
    shortLabel: "T",
    label: "Tuesday",
  },
  {
    index: 3,
    shortLabel: "W",
    label: "Wednesday",
  },
  {
    index: 4,
    shortLabel: "T",
    label: "Thursday",
  },
  {
    index: 5,
    shortLabel: "F",
    label: "Friday",
  },
  {
    index: 6,
    shortLabel: "S",
    label: "Saturday",
  },
  {
    index: 0,
    shortLabel: "S",
    label: "Sunday",
  },
] as const;

type MeetingBusinessHoursProps = {
  participantId: string;

  cityName: string;

  timezoneName: string;

  currentInstant: Date;

  businessHours:
    BusinessHours;

  onChange: (
    participantId: string,
    businessHours:
      BusinessHours,
  ) => void;
};

type LocalTimeData = {
  hour: number;
  minute: number;
  weekdayIndex: number;
};

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  );
}

function formatHour(
  hour: number,
): string {
  return `${String(
    hour,
  ).padStart(
    2,
    "0",
  )}:00`;
}

function getLocalTimeData(
  instant: Date,
  timezoneName: string,
): LocalTimeData {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          timezoneName,

        weekday:
          "short",

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

  const hour =
    Number(
      parts.find(
        (
          part,
        ) =>
          part.type ===
          "hour",
      )?.value ?? 0,
    );

  const minute =
    Number(
      parts.find(
        (
          part,
        ) =>
          part.type ===
          "minute",
      )?.value ?? 0,
    );

  const weekday =
    parts.find(
      (
        part,
      ) =>
        part.type ===
        "weekday",
    )?.value
      .slice(
        0,
        3,
      )
      .toLowerCase() ??
    "";

  const weekdays = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ];

  const weekdayIndex =
    Math.max(
      0,
      weekdays.indexOf(
        weekday,
      ),
    );

  return {
    hour:
      hour === 24
        ? 0
        : hour,

    minute,

    weekdayIndex,
  };
}

function formatDuration(
  minutes: number,
): string {
  const normalizedMinutes =
    Math.max(
      0,
      Math.round(
        minutes,
      ),
    );

  if (
    normalizedMinutes <
    60
  ) {
    return `${normalizedMinutes} min`;
  }

  const hours =
    Math.floor(
      normalizedMinutes /
        60,
    );

  const remainingMinutes =
    normalizedMinutes %
    60;

  if (
    remainingMinutes ===
    0
  ) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export default function MeetingBusinessHours({
  participantId,
  cityName,
  timezoneName,
  currentInstant,
  businessHours,
  onChange,
}: MeetingBusinessHoursProps) {
  const [
    isEditing,
    setIsEditing,
  ] =
    useState(
      false,
    );

  const localTime =
    useMemo(
      () =>
        getLocalTimeData(
          currentInstant,
          timezoneName,
        ),
      [
        currentInstant,
        timezoneName,
      ],
    );

  const decimalHour =
    localTime.hour +
    localTime.minute /
      60;

  const isWorkingDay =
    businessHours
      .workingDays
      .includes(
        localTime.weekdayIndex,
      );

  const isWorkingNow =
    isWorkingDay &&
    decimalHour >=
      businessHours.startHour &&
    decimalHour <
      businessHours.endHour;

  const dayProgress =
    clamp(
      (
        decimalHour /
        24
      ) *
        100,
      0,
      100,
    );

  const workingStartProgress =
    clamp(
      (
        businessHours.startHour /
        24
      ) *
        100,
      0,
      100,
    );

  const workingDurationProgress =
    clamp(
      (
        (
          businessHours.endHour -
          businessHours.startHour
        ) /
        24
      ) *
        100,
      0,
      100,
    );

  let statusLabel =
    "Outside working hours";

  let statusDescription =
    "The participant is currently outside the configured schedule.";

  let statusClasses =
    "border-border bg-surface-soft text-text-secondary";

  let statusDotClasses =
    "bg-text-muted";

  if (
    isWorkingNow
  ) {
    const minutesUntilClose =
      (
        businessHours.endHour -
        decimalHour
      ) *
      60;

    statusLabel =
      "Working now";

    statusDescription =
      `Ends in ${formatDuration(
        minutesUntilClose,
      )}`;

    statusClasses =
      "border-success/20 bg-success-soft text-success";

    statusDotClasses =
      "animate-pulse bg-success";
  } else if (
    !isWorkingDay
  ) {
    statusLabel =
      "Non-working day";

    statusDescription =
      "Today is outside the configured working week.";

    statusClasses =
      "border-accent/20 bg-accent-soft text-accent";

    statusDotClasses =
      "bg-accent";
  } else if (
    decimalHour <
    businessHours.startHour
  ) {
    const minutesUntilOpen =
      (
        businessHours.startHour -
        decimalHour
      ) *
      60;

    statusLabel =
      "Starts later";

    statusDescription =
      `Opens in ${formatDuration(
        minutesUntilOpen,
      )}`;

    statusClasses =
      "border-warning/20 bg-warning-soft text-warning";

    statusDotClasses =
      "bg-warning";
  } else {
    statusLabel =
      "Closed for today";

    statusDescription =
      `Working hours ended at ${formatHour(
        businessHours.endHour,
      )}`;

    statusClasses =
      "border-danger/20 bg-danger-soft text-danger";

    statusDotClasses =
      "bg-danger";
  }

  function updateStartHour(
    startHour: number,
  ): void {
    if (
      startHour >=
      businessHours.endHour
    ) {
      return;
    }

    onChange(
      participantId,
      {
        ...businessHours,
        startHour,
      },
    );
  }

  function updateEndHour(
    endHour: number,
  ): void {
    if (
      endHour <=
      businessHours.startHour
    ) {
      return;
    }

    onChange(
      participantId,
      {
        ...businessHours,
        endHour,
      },
    );
  }

  function toggleWorkingDay(
    weekdayIndex: number,
  ): void {
    const workingDays =
      businessHours
        .workingDays
        .includes(
          weekdayIndex,
        )
        ? businessHours
            .workingDays
            .filter(
              (
                day,
              ) =>
                day !==
                weekdayIndex,
            )
        : [
            ...businessHours
              .workingDays,
            weekdayIndex,
          ].sort(
            (
              firstDay,
              secondDay,
            ) =>
              firstDay -
              secondDay,
          );

    if (
      workingDays.length ===
      0
    ) {
      return;
    }

    onChange(
      participantId,
      {
        ...businessHours,
        workingDays,
      },
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface-soft">
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              Working schedule
            </p>

            <p className="mt-1 text-sm font-semibold text-text-primary">
              {formatHour(
                businessHours.startHour,
              )}{" "}
              –{" "}
              {formatHour(
                businessHours.endHour,
              )}
            </p>
          </div>

          <span
            className={[
              "inline-flex",
              "items-center",
              "gap-2",
              "rounded-full",
              "border",
              "px-3",
              "py-1.5",
              "text-[10px]",
              "font-semibold",
              statusClasses,
            ].join(
              " ",
            )}
          >
            <span
              className={[
                "h-1.5",
                "w-1.5",
                "rounded-full",
                statusDotClasses,
              ].join(
                " ",
              )}
            />

            {statusLabel}
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-text-muted">
          {statusDescription}
        </p>

        <div className="mt-4">
          <div className="relative h-3 overflow-hidden rounded-full border border-border bg-surface">
            <div
              className="absolute bottom-0 top-0 rounded-full bg-success/20"
              style={{
                left:
                  `${workingStartProgress}%`,

                width:
                  `${workingDurationProgress}%`,
              }}
            />

            <div
              className="absolute bottom-[-3px] top-[-3px] z-10 w-0.5 bg-primary shadow-[0_0_8px_rgba(37,99,235,0.35)]"
              style={{
                left:
                  `${dayProgress}%`,
              }}
            />

            <span
              className="absolute top-1/2 z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary bg-primary shadow-[0_0_8px_rgba(37,99,235,0.35)]"
              style={{
                left:
                  `${dayProgress}%`,
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] font-medium text-text-muted">
            <span>
              00:00
            </span>

            <span className="font-semibold text-success">
              Business hours
            </span>

            <span>
              24:00
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={
            isEditing
          }
          onClick={() => {
            setIsEditing(
              (
                currentValue,
              ) =>
                !currentValue,
            );
          }}
          className="mt-4 inline-flex h-10 w-full items-center justify-between rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-text-secondary outline-none transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <span>
            Edit working hours
          </span>

          <span
            aria-hidden="true"
            className={[
              "transition-transform",
              "duration-200",

              isEditing
                ? "rotate-180"
                : "",
            ].join(
              " ",
            )}
          >
            ⌄
          </span>
        </button>
      </div>

      {isEditing && (
        <div className="border-t border-border bg-surface p-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="min-w-0">
              <span className="mb-1.5 block text-xs font-medium text-text-muted">
                Start
              </span>

              <select
                aria-label={`Working day start in ${cityName}`}
                value={
                  businessHours.startHour
                }
                onChange={(
                  event,
                ) => {
                  updateStartHour(
                    Number(
                      event.target.value,
                    ),
                  );
                }}
                className="h-10 w-full min-w-0 rounded-xl border border-border bg-surface px-3 text-sm text-text-primary outline-none transition hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                {HOUR_OPTIONS
                  .slice(
                    0,
                    24,
                  )
                  .map(
                    (
                      hour,
                    ) => (
                      <option
                        key={
                          hour
                        }
                        value={
                          hour
                        }
                      >
                        {formatHour(
                          hour,
                        )}
                      </option>
                    ),
                  )}
              </select>
            </label>

            <label className="min-w-0">
              <span className="mb-1.5 block text-xs font-medium text-text-muted">
                End
              </span>

              <select
                aria-label={`Working day end in ${cityName}`}
                value={
                  businessHours.endHour
                }
                onChange={(
                  event,
                ) => {
                  updateEndHour(
                    Number(
                      event.target.value,
                    ),
                  );
                }}
                className="h-10 w-full min-w-0 rounded-xl border border-border bg-surface px-3 text-sm text-text-primary outline-none transition hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                {HOUR_OPTIONS
                  .slice(
                    1,
                  )
                  .map(
                    (
                      hour,
                    ) => (
                      <option
                        key={
                          hour
                        }
                        value={
                          hour
                        }
                      >
                        {formatHour(
                          hour,
                        )}
                      </option>
                    ),
                  )}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-text-muted">
              Working days
            </p>

            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {WEEKDAYS.map(
                (
                  weekday,
                ) => {
                  const isActive =
                    businessHours
                      .workingDays
                      .includes(
                        weekday.index,
                      );

                  const isCurrentDay =
                    localTime.weekdayIndex ===
                    weekday.index;

                  return (
                    <button
                      key={
                        weekday.label
                      }
                      type="button"
                      title={
                        weekday.label
                      }
                      aria-label={`${isActive ? "Disable" : "Enable"} ${weekday.label} for ${cityName}`}
                      aria-pressed={
                        isActive
                      }
                      onClick={() => {
                        toggleWorkingDay(
                          weekday.index,
                        );
                      }}
                      className={[
                        "relative",
                        "flex",
                        "h-9",
                        "items-center",
                        "justify-center",
                        "rounded-lg",
                        "border",
                        "text-[11px]",
                        "font-bold",
                        "outline-none",
                        "transition",
                        "focus-visible:ring-2",
                        "focus-visible:ring-primary/20",

                        isActive
                          ? [
                              "border-primary-muted",
                              "bg-primary-soft",
                              "text-primary",
                            ].join(
                              " ",
                            )
                          : [
                              "border-border",
                              "bg-surface-soft",
                              "text-text-muted",
                              "hover:border-border-strong",
                              "hover:bg-surface",
                              "hover:text-text-secondary",
                            ].join(
                              " ",
                            ),
                      ].join(
                        " ",
                      )}
                    >
                      {
                        weekday.shortLabel
                      }

                      {isCurrentDay && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-success" />
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}