"use client";

import {
  useMemo,
} from "react";

import Card from "@/components/ui/Card";

import type {
  MeetingRecommendation,
} from "../types";

type MeetingStatisticsProps = {
  recommendation:
    MeetingRecommendation;

  durationMinutes:
    number;
};

type MeetingStatistic = {
  id:
    string;

  label:
    string;

  value:
    string;

  description:
    string;

  icon:
    string;

  tone:
    | "blue"
    | "emerald"
    | "violet"
    | "amber"
    | "cyan"
    | "slate";
};

type ParsedLocalTime = {
  minutesFromMidnight:
    number;
};

function clamp(
  value:
    number,

  minimum:
    number,

  maximum:
    number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  );
}

function parseLocalTime(
  localTime:
    string,
): ParsedLocalTime | null {
  const normalizedTime =
    localTime
      .trim()
      .toUpperCase();

  const match =
    normalizedTime.match(
      /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/,
    );

  if (
    !match
  ) {
    return null;
  }

  let hour =
    Number(
      match[1],
    );

  const minute =
    Number(
      match[2] ??
        0,
    );

  const meridiem =
    match[3];

  if (
    !Number.isFinite(
      hour,
    ) ||
    !Number.isFinite(
      minute,
    )
  ) {
    return null;
  }

  if (
    meridiem ===
      "PM" &&
    hour !==
      12
  ) {
    hour +=
      12;
  }

  if (
    meridiem ===
      "AM" &&
    hour ===
      12
  ) {
    hour =
      0;
  }

  if (
    !meridiem &&
    hour ===
      24
  ) {
    hour =
      0;
  }

  return {
    minutesFromMidnight:
      hour *
        60 +
      minute,
  };
}

function getComfortScore(
  participant:
    MeetingRecommendation["participants"][number],
): number {
  if (
    participant.isInsideBusinessHours
  ) {
    return 100;
  }

  const comfort =
    String(
      participant.comfort,
    )
      .trim()
      .toLowerCase();

  switch (
    comfort
  ) {
    case "ideal":
      return 85;

    case "comfortable":
      return 78;

    case "good":
      return 72;

    case "early":
      return 55;

    case "late":
      return 50;

    case "acceptable":
      return 48;

    case "difficult":
      return 25;

    case "uncomfortable":
      return 15;

    default:
      return 40;
  }
}

function formatTimeSpread(
  minutes:
    number,
): string {
  const normalizedMinutes =
    Math.max(
      0,
      Math.round(
        minutes,
      ),
    );

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

function calculateTimeSpread(
  recommendation:
    MeetingRecommendation,
): number {
  const localTimes =
    recommendation.participants
      .map(
        (
          participant,
        ) =>
          parseLocalTime(
            participant.localTime,
          ),
      )
      .filter(
        (
          value,
        ): value is ParsedLocalTime =>
          value !==
          null,
      )
      .map(
        (
          value,
        ) =>
          value.minutesFromMidnight,
      );

  if (
    localTimes.length <
    2
  ) {
    return 0;
  }

  const sortedTimes = [
    ...localTimes,
  ].sort(
    (
      firstTime,
      secondTime,
    ) =>
      firstTime -
      secondTime,
  );

  let largestGap =
    0;

  for (
    let index =
      0;
    index <
    sortedTimes.length;
    index +=
      1
  ) {
    const currentTime =
      sortedTimes[
        index
      ];

    const nextTime =
      index ===
      sortedTimes.length -
        1
        ? sortedTimes[0] +
          24 *
            60
        : sortedTimes[
            index +
              1
          ];

    largestGap =
      Math.max(
        largestGap,
        nextTime -
          currentTime,
      );
  }

  return (
    24 *
      60 -
    largestGap
  );
}

function getQualityLabel(
  score:
    number,
): string {
  if (
    score >=
    90
  ) {
    return "Outstanding";
  }

  if (
    score >=
    75
  ) {
    return "Strong";
  }

  if (
    score >=
    55
  ) {
    return "Workable";
  }

  return "Difficult";
}

function getToneClasses(
  tone:
    MeetingStatistic["tone"],
): {
  container:
    string;

  icon:
    string;

  value:
    string;
} {
  switch (
    tone
  ) {
    case "blue":
      return {
        container:
          "border-primary-muted bg-primary-soft",

        icon:
          "border-primary-muted bg-surface text-primary",

        value:
          "text-primary",
      };

    case "emerald":
      return {
        container:
          "border-success/20 bg-success-soft",

        icon:
          "border-success/20 bg-surface text-success",

        value:
          "text-success",
      };

    case "violet":
      return {
        container:
          "border-accent/20 bg-accent-soft",

        icon:
          "border-accent/20 bg-surface text-accent",

        value:
          "text-accent",
      };

    case "amber":
      return {
        container:
          "border-warning/20 bg-warning-soft",

        icon:
          "border-warning/20 bg-surface text-warning",

        value:
          "text-warning",
      };

    case "cyan":
      return {
        container:
          "border-info/20 bg-info-soft",

        icon:
          "border-info/20 bg-surface text-info",

        value:
          "text-info",
      };

    case "slate":
      return {
        container:
          "border-border bg-surface-soft",

        icon:
          "border-border bg-surface text-text-secondary",

        value:
          "text-text-primary",
      };
  }
}

export default function MeetingStatistics({
  recommendation,
  durationMinutes,
}: MeetingStatisticsProps) {
  const statistics =
    useMemo(
      () => {
        const participants =
          recommendation.participants;

        const participantCount =
          Math.max(
            recommendation.totalParticipants,
            participants.length,
          );

        const countryCount =
          new Set(
            participants.map(
              (
                participant,
              ) =>
                participant.countryCode,
            ),
          ).size;

        const timezoneCount =
          new Set(
            participants.map(
              (
                participant,
              ) =>
                participant.timezone,
            ),
          ).size;

        const workingParticipants =
          participants.filter(
            (
              participant,
            ) =>
              participant.isInsideBusinessHours,
          ).length;

        const workingHoursMatch =
          participantCount >
          0
            ? Math.round(
                (
                  workingParticipants /
                  participantCount
                ) *
                  100,
              )
            : 0;

        const averageComfort =
          participants.length >
          0
            ? Math.round(
                participants.reduce(
                  (
                    total,
                    participant,
                  ) =>
                    total +
                    getComfortScore(
                      participant,
                    ),
                  0,
                ) /
                  participants.length,
              )
            : 0;

        const timeSpread =
          calculateTimeSpread(
            recommendation,
          );

        const normalizedScore =
          clamp(
            recommendation.score,
            0,
            100,
          );

        const items:
          MeetingStatistic[] = [
          {
            id:
              "participants",

            label:
              "Participants",

            value:
              String(
                participantCount,
              ),

            description:
              "Cities included in this meeting.",

            icon:
              "◉",

            tone:
              "blue",
          },

          {
            id:
              "countries",

            label:
              "Countries",

            value:
              String(
                countryCount,
              ),

            description:
              "Different countries represented.",

            icon:
              "◎",

            tone:
              "cyan",
          },

          {
            id:
              "timezones",

            label:
              "Time zones",

            value:
              String(
                timezoneCount,
              ),

            description:
              "Unique IANA time zones involved.",

            icon:
              "◷",

            tone:
              "violet",
          },

          {
            id:
              "working-hours",

            label:
              "Working-hours match",

            value:
              `${workingHoursMatch}%`,

            description:
              `${workingParticipants} of ${participantCount} participants are inside working hours.`,

            icon:
              "✓",

            tone:
              workingHoursMatch >=
              75
                ? "emerald"
                : workingHoursMatch >=
                    40
                  ? "amber"
                  : "slate",
          },

          {
            id:
              "comfort",

            label:
              "Average comfort",

            value:
              `${averageComfort}%`,

            description:
              "Estimated local-time comfort across the group.",

            icon:
              "☀",

            tone:
              averageComfort >=
              75
                ? "emerald"
                : averageComfort >=
                    50
                  ? "amber"
                  : "slate",
          },

          {
            id:
              "spread",

            label:
              "Local-time spread",

            value:
              formatTimeSpread(
                timeSpread,
              ),

            description:
              "Smallest clock range containing all local meeting times.",

            icon:
              "↔",

            tone:
              "cyan",
          },

          {
            id:
              "duration",

            label:
              "Meeting duration",

            value:
              `${durationMinutes} min`,

            description:
              "Duration used for scoring and calendar export.",

            icon:
              "◴",

            tone:
              "blue",
          },

          {
            id:
              "quality",

            label:
              "Meeting quality",

            value:
              getQualityLabel(
                normalizedScore,
              ),

            description:
              `TimeInOne score: ${normalizedScore}/100.`,

            icon:
              "✦",

            tone:
              normalizedScore >=
              90
                ? "emerald"
                : normalizedScore >=
                    75
                  ? "blue"
                  : normalizedScore >=
                      55
                    ? "amber"
                    : "slate",
          },
        ];

        return items;
      },
      [
        durationMinutes,
        recommendation,
      ],
    );

  return (
    <Card
      as="section"
      variant="default"
      padding="none"
      className="overflow-hidden"
    >
      <header className="relative overflow-hidden border-b border-border bg-surface-soft p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-info-soft blur-3xl"
        />

        <div className="relative flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-info/20 bg-info-soft text-xl text-info">
            ◫
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-info">
              Global meeting statistics
            </p>

            <h3 className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
              Meeting at a glance
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
              A compact overview of
              participants, time-zone
              complexity, schedule match
              and local-time comfort.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
        {statistics.map(
          (
            statistic,
          ) => {
            const toneClasses =
              getToneClasses(
                statistic.tone,
              );

            return (
              <article
                key={
                  statistic.id
                }
                className={[
                  "min-w-0",
                  "rounded-2xl",
                  "border",
                  "p-4",
                  "transition-all",
                  "duration-300",
                  "hover:-translate-y-0.5",
                  "hover:shadow-md",
                  toneClasses.container,
                ].join(
                  " ",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className={[
                      "flex",
                      "h-9",
                      "w-9",
                      "shrink-0",
                      "items-center",
                      "justify-center",
                      "rounded-xl",
                      "border",
                      "text-sm",
                      "font-bold",
                      toneClasses.icon,
                    ].join(
                      " ",
                    )}
                  >
                    {
                      statistic.icon
                    }
                  </span>

                  <p
                    className={[
                      "truncate",
                      "text-right",
                      "text-2xl",
                      "font-bold",
                      "tabular-nums",
                      toneClasses.value,
                    ].join(
                      " ",
                    )}
                  >
                    {
                      statistic.value
                    }
                  </p>
                </div>

                <h4 className="mt-4 text-sm font-semibold text-text-primary">
                  {
                    statistic.label
                  }
                </h4>

                <p className="mt-2 text-xs leading-5 text-text-muted">
                  {
                    statistic.description
                  }
                </p>
              </article>
            );
          },
        )}
      </div>
    </Card>
  );
}