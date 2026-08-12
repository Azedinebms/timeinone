"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

import type {
  BusinessHours,
} from "@/lib/time-engine";

import type {
  MeetingParticipant,
} from "../types";

import MeetingBusinessHours from "./MeetingBusinessHours";

const CLOCK_INTERVAL_MS =
  1_000;

type MeetingParticipantsProps = {
  participants:
    MeetingParticipant[];

  highlightedParticipantId?:
    string | null;

  onRemove: (
    participantId: string,
  ) => void;

  onBusinessHoursChange: (
    participantId: string,
    businessHours:
      BusinessHours,
  ) => void;
};

type LocalClockData = {
  time:
    string;

  date:
    string;

  periodLabel:
    string;

  periodIcon:
    string;

  offsetLabel:
    string;
};

function getUtcOffsetLabel(
  instant:
    Date,

  timezoneName:
    string,
): string {
  try {
    const formatter =
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            timezoneName,

          timeZoneName:
            "shortOffset",
        },
      );

    const offsetPart =
      formatter
        .formatToParts(
          instant,
        )
        .find(
          (
            part,
          ) =>
            part.type ===
            "timeZoneName",
        )
        ?.value;

    return (
      offsetPart ??
      timezoneName
    );
  } catch {
    return timezoneName;
  }
}

function getLocalHour(
  instant:
    Date,

  timezoneName:
    string,
): number {
  const hour =
    Number(
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            timezoneName,

          hour:
            "2-digit",

          hourCycle:
            "h23",
        },
      ).format(
        instant,
      ),
    );

  return hour ===
    24
    ? 0
    : hour;
}

function getPeriodData(
  hour:
    number,
): {
  label:
    string;

  icon:
    string;
} {
  if (
    hour >= 5 &&
    hour < 9
  ) {
    return {
      label:
        "Early morning",

      icon:
        "🌅",
    };
  }

  if (
    hour >= 9 &&
    hour < 12
  ) {
    return {
      label:
        "Morning",

      icon:
        "☀",
    };
  }

  if (
    hour >= 12 &&
    hour < 17
  ) {
    return {
      label:
        "Afternoon",

      icon:
        "☀",
    };
  }

  if (
    hour >= 17 &&
    hour < 21
  ) {
    return {
      label:
        "Evening",

      icon:
        "🌇",
    };
  }

  return {
    label:
      "Night",

    icon:
      "🌙",
  };
}

function getLocalClockData(
  instant:
    Date,

  timezoneName:
    string,
): LocalClockData {
  const hour =
    getLocalHour(
      instant,
      timezoneName,
    );

  const period =
    getPeriodData(
      hour,
    );

  return {
    time:
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            timezoneName,

          hour:
            "numeric",

          minute:
            "2-digit",

          second:
            "2-digit",
        },
      ).format(
        instant,
      ),

    date:
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            timezoneName,

          weekday:
            "short",

          month:
            "short",

          day:
            "numeric",
        },
      ).format(
        instant,
      ),

    periodLabel:
      period.label,

    periodIcon:
      period.icon,

    offsetLabel:
      getUtcOffsetLabel(
        instant,
        timezoneName,
      ),
  };
}

export default function MeetingParticipants({
  participants,
  highlightedParticipantId =
    null,
  onRemove,
  onBusinessHoursChange,
}: MeetingParticipantsProps) {
  const [
    currentInstant,
    setCurrentInstant,
  ] =
    useState(
      () =>
        new Date(),
    );

  useEffect(() => {
    let intervalId:
      number | null =
      null;

    function stopClock():
      void {
      if (
        intervalId !==
        null
      ) {
        window.clearInterval(
          intervalId,
        );

        intervalId =
          null;
      }
    }

    function startClock():
      void {
      stopClock();

      intervalId =
        window.setInterval(
          () => {
            setCurrentInstant(
              new Date(),
            );
          },
          CLOCK_INTERVAL_MS,
        );
    }

    function handleVisibilityChange():
      void {
      if (
        document.visibilityState ===
        "visible"
      ) {
        setCurrentInstant(
          new Date(),
        );

        startClock();
      } else {
        stopClock();
      }
    }

    startClock();

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      stopClock();

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, []);

  const participantClocks =
    useMemo(
      () =>
        new Map(
          participants.map(
            (
              participant,
            ) => [
              participant.id,

              getLocalClockData(
                currentInstant,
                participant.city
                  .timezone.name,
              ),
            ],
          ),
        ),
      [
        currentInstant,
        participants,
      ],
    );

  if (
    participants.length ===
    0
  ) {
    return (
      <Card
        variant="soft"
        padding="lg"
        className="border-dashed text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-muted bg-primary-soft text-xl">
          🌍
        </div>

        <p className="mt-4 font-semibold text-text-primary">
          No participant cities yet
        </p>

        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-text-secondary">
          Add at least two cities
          to calculate the best
          meeting times.
        </p>
      </Card>
    );
  }

  return (
    <div
  className="
    grid
    gap-6

    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
  "
>
      {participants.map(
        (
          participant,
          index,
        ) => {
          const clock =
            participantClocks.get(
              participant.id,
            );

          const isHighlighted =
            highlightedParticipantId ===
            participant.id;

          return (
            <Card
              id={`meeting-participant-${participant.id}`}
              key={
                participant.id
              }
              as="article"
              variant="default"
              padding="none"
              className={[
                "min-w-0",
                "scroll-mt-24",
                "overflow-hidden",
                "transition-all",
                "duration-500",

                isHighlighted
                  ? [
                      "border-primary",
                      "bg-primary-soft",
                      "shadow-lg",
                      "ring-2",
                      "ring-primary/15",
                    ].join(
                      " ",
                    )
                  : "",
              ]
                .filter(
                  Boolean,
                )
                .join(
                  " ",
                )}
            >
              <div className="p-4 sm:p-5">
                {/* PARTICIPANT HEADER */}

                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-sm font-bold text-primary">
                      {
                        index +
                        1
                      }
                    </span>

                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-text-primary">
                          {
                            participant
                              .city.name
                          }
                        </h3>

                        <Badge
                          variant="neutral"
                          size="sm"
                        >
                          {
                            participant
                              .city
                              .country
                              .iso2
                          }
                        </Badge>
                      </div>

                      <p className="mt-1 truncate text-xs text-text-muted">
                        {
                          participant
                            .city
                            .country
                            .name
                        }
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`Remove ${participant.city.name}`}
                    onClick={() => {
                      onRemove(
                        participant.id,
                      );
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-lg text-text-muted outline-none transition hover:border-danger/30 hover:bg-danger-soft hover:text-danger focus-visible:ring-2 focus-visible:ring-danger/30"
                  >
                    ×
                  </button>
                </div>

                {/* LIVE LOCAL CLOCK */}

                {clock && (
                  <div className="mt-5 space-y-3">
  {/* CURRENT LOCAL TIME */}

  <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-surface-soft p-5">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-primary-soft blur-3xl"
    />

    <div className="relative">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
          Current local time
        </p>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />

          Live
        </span>
      </div>

      <p
        suppressHydrationWarning
        className="mt-3 font-mono text-3xl font-bold tracking-tight text-text-primary tabular-nums sm:text-4xl"
      >
        {clock.time}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
        <span className="text-text-muted">
          {clock.date}
        </span>

        <span className="inline-flex items-center gap-1.5 font-medium text-primary">
          <span aria-hidden="true">
            {clock.periodIcon}
          </span>

          {clock.periodLabel}
        </span>
      </div>
    </div>
  </div>

  {/* UTC OFFSET */}

  <div className="w-full rounded-2xl border border-primary-muted bg-primary-soft p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
          UTC offset
        </p>

        <p
          suppressHydrationWarning
          className="mt-2 font-mono text-xl font-bold text-primary"
        >
          {clock.offsetLabel}
        </p>
      </div>

      <div className="min-w-0 sm:text-right">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
          Time zone
        </p>

        <p
          title={
            participant.city.timezone.name
          }
          className="mt-2 break-all text-sm font-medium text-text-secondary"
        >
          {participant.city.timezone.name}
        </p>
      </div>
    </div>
  </div>
</div>
                )}

                {/* BUSINESS HOURS */}

                <MeetingBusinessHours
                  participantId={
                    participant.id
                  }
                  cityName={
                    participant
                      .city.name
                  }
                  timezoneName={
                    participant
                      .city
                      .timezone.name
                  }
                  currentInstant={
                    currentInstant
                  }
                  businessHours={
                    participant.businessHours
                  }
                  onChange={
                    onBusinessHoursChange
                  }
                />

                {/* FOOTER */}

                <div className="mt-4 flex min-w-0 items-center justify-between gap-3 border-t border-border pt-4">
                  <p
                    title={
                      participant
                        .city
                        .timezone
                        .name
                    }
                    className="min-w-0 truncate font-mono text-[10px] text-text-muted"
                  >
                    {
                      participant
                        .city
                        .timezone
                        .name
                    }
                  </p>

                  <Link
                    href={
                      participant
                        .city
                        .worldClockPath
                    }
                    className="group/link inline-flex shrink-0 items-center gap-1.5 rounded-md text-xs font-semibold text-primary outline-none transition hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Open world clock

                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover/link:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </Card>
          );
        },
      )}
    </div>
  );
}