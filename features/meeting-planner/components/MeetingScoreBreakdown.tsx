"use client";

import {
  useMemo,
} from "react";

import Card from "@/components/ui/Card";

import type {
  MeetingRecommendation,
} from "../types";

type MeetingScoreBreakdownProps = {
  recommendation:
    MeetingRecommendation;
};

type ScoreFactor = {
  id: string;

  label: string;

  description: string;

  value: number;

  maximum: number;

  percentage: number;

  tone:
    | "emerald"
    | "blue"
    | "violet"
    | "amber"
    | "red";
};

type ScoreAnalysis = {
  factors:
    ScoreFactor[];

  summary: string;

  strengths:
    string[];

  warning:
    string | null;
};

const FACTOR_MAXIMUMS = {
  scheduleOverlap: 40,
  participantComfort: 30,
  fairness: 20,
  calendarFit: 10,
} as const;

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

function getComfortValue(
  comfort: string,
): number {
  switch (
    comfort
      .trim()
      .toLowerCase()
  ) {
    case "ideal":
      return 1;

    case "comfortable":
      return 0.9;

    case "good":
      return 0.82;

    case "early":
      return 0.62;

    case "late":
      return 0.58;

    case "acceptable":
      return 0.52;

    case "difficult":
      return 0.28;

    case "uncomfortable":
      return 0.18;

    default:
      return 0.45;
  }
}

function distributeScore({
  rawValues,
  targetScore,
}: {
  rawValues: number[];

  targetScore: number;
}): number[] {
  const normalizedTarget =
    clamp(
      Math.round(
        targetScore,
      ),
      0,
      100,
    );

  const rawTotal =
    rawValues.reduce(
      (
        total,
        value,
      ) =>
        total +
        Math.max(
          0,
          value,
        ),
      0,
    );

  if (
    rawTotal <= 0
  ) {
    return [
      0,
      0,
      0,
      normalizedTarget,
    ];
  }

  const distributedValues =
    rawValues.map(
      (value) =>
        Math.floor(
          (
            Math.max(
              0,
              value,
            ) /
            rawTotal
          ) *
            normalizedTarget,
        ),
    );

  let remaining =
    normalizedTarget -
    distributedValues.reduce(
      (
        total,
        value,
      ) =>
        total +
        value,
      0,
    );

  const fractionalOrder =
    rawValues
      .map(
        (
          value,
          index,
        ) => {
          const exactValue =
            (
              Math.max(
                0,
                value,
              ) /
              rawTotal
            ) *
            normalizedTarget;

          return {
            index,

            fraction:
              exactValue -
              Math.floor(
                exactValue,
              ),
          };
        },
      )
      .sort(
        (
          firstValue,
          secondValue,
        ) =>
          secondValue.fraction -
          firstValue.fraction,
      );

  let fractionalIndex =
    0;

  while (
    remaining >
    0
  ) {
    const target =
      fractionalOrder[
        fractionalIndex %
          fractionalOrder.length
      ];

    if (!target) {
      break;
    }

    distributedValues[
      target.index
    ] += 1;

    remaining -= 1;
    fractionalIndex += 1;
  }

  return distributedValues;
}

function getFactorTone(
  percentage: number,
):
  ScoreFactor["tone"] {
  if (
    percentage >= 85
  ) {
    return "emerald";
  }

  if (
    percentage >= 70
  ) {
    return "blue";
  }

  if (
    percentage >= 55
  ) {
    return "violet";
  }

  if (
    percentage >= 35
  ) {
    return "amber";
  }

  return "red";
}

function createScoreAnalysis(
  recommendation:
    MeetingRecommendation,
): ScoreAnalysis {
  const participants =
    recommendation.participants;

  const participantCount =
    Math.max(
      1,
      participants.length,
    );

  const workingParticipants =
    participants.filter(
      (participant) =>
        participant
          .isInsideBusinessHours,
    ).length;

  const workingRatio =
    workingParticipants /
    participantCount;

  const comfortValues =
    participants.map(
      (participant) =>
        getComfortValue(
          String(
            participant.comfort,
          ),
        ),
    );

  const averageComfort =
    comfortValues.reduce(
      (
        total,
        value,
      ) =>
        total +
        value,
      0,
    ) /
    participantCount;

  const highestComfort =
    Math.max(
      ...comfortValues,
      0,
    );

  const lowestComfort =
    Math.min(
      ...comfortValues,
      1,
    );

  const comfortDifference =
    highestComfort -
    lowestComfort;

  const fairnessRatio =
    clamp(
      1 -
        comfortDifference,
      0,
      1,
    );

  const calendarRatio =
    recommendation
      .isStrictOverlap
      ? 1
      : clamp(
          workingRatio *
            0.8 +
            averageComfort *
              0.2,
          0,
          1,
        );

  const rawScheduleScore =
    FACTOR_MAXIMUMS
      .scheduleOverlap *
    (
      recommendation
        .isStrictOverlap
        ? 1
        : workingRatio *
            0.75 +
          averageComfort *
            0.25
    );

  const rawComfortScore =
    FACTOR_MAXIMUMS
      .participantComfort *
    averageComfort;

  const rawFairnessScore =
    FACTOR_MAXIMUMS
      .fairness *
    fairnessRatio;

  const rawCalendarScore =
    FACTOR_MAXIMUMS
      .calendarFit *
    calendarRatio;

  const distributedScores =
    distributeScore({
      rawValues: [
        rawScheduleScore,
        rawComfortScore,
        rawFairnessScore,
        rawCalendarScore,
      ],

      targetScore:
        recommendation.score,
    });

  const [
    scheduleScore,
    comfortScore,
    fairnessScore,
    calendarScore,
  ] =
    distributedScores;

  const factorDefinitions = [
    {
      id:
        "schedule-overlap",

      label:
        "Schedule overlap",

      description:
        recommendation
          .isStrictOverlap
          ? "Every participant fits inside the configured working schedule."
          : `${workingParticipants} of ${participantCount} participants fit inside their complete working schedule.`,

      value:
        scheduleScore,

      maximum:
        FACTOR_MAXIMUMS
          .scheduleOverlap,
    },

    {
      id:
        "participant-comfort",

      label:
        "Participant comfort",

      description:
        "Measures how comfortable the local meeting time is for every participant.",

      value:
        comfortScore,

      maximum:
        FACTOR_MAXIMUMS
          .participantComfort,
    },

    {
      id:
        "fairness",

      label:
        "Fairness",

      description:
        "Rewards slots that distribute inconvenience evenly instead of penalizing one city.",

      value:
        fairnessScore,

      maximum:
        FACTOR_MAXIMUMS
          .fairness,
    },

    {
      id:
        "calendar-fit",

      label:
        "Calendar fit",

      description:
        recommendation
          .isStrictOverlap
          ? "The slot matches the participants’ configured working days and hours."
          : "Some participants may be outside a complete professional working window.",

      value:
        calendarScore,

      maximum:
        FACTOR_MAXIMUMS
          .calendarFit,
    },
  ];

  const factors:
    ScoreFactor[] =
    factorDefinitions.map(
      (factor) => {
        const percentage =
          factor.maximum >
          0
            ? Math.round(
                (
                  factor.value /
                  factor.maximum
                ) *
                  100,
              )
            : 0;

        return {
          ...factor,

          percentage:
            clamp(
              percentage,
              0,
              100,
            ),

          tone:
            getFactorTone(
              percentage,
            ),
        };
      },
    );

  const strengths:
    string[] = [];

  if (
    recommendation
      .isStrictOverlap
  ) {
    strengths.push(
      "Every participant is inside the configured working schedule.",
    );
  } else if (
    workingRatio >=
    0.75
  ) {
    strengths.push(
      "Most participants are inside their regular working schedules.",
    );
  }

  if (
    averageComfort >=
    0.85
  ) {
    strengths.push(
      "The local time is highly comfortable across the selected cities.",
    );
  } else if (
    averageComfort >=
    0.65
  ) {
    strengths.push(
      "The slot offers a reasonable local time for most participants.",
    );
  }

  if (
    fairnessRatio >=
    0.85
  ) {
    strengths.push(
      "The inconvenience is distributed fairly between participants.",
    );
  }

  if (
    strengths.length ===
    0
  ) {
    strengths.push(
      "This is the strongest available compromise for the current settings.",
    );
  }

  let warning:
    string | null = null;

  if (
    workingParticipants ===
    0
  ) {
    warning =
      "The local hours may feel comfortable, but the date or working-day configuration places everyone outside a complete professional schedule.";
  } else if (
    workingRatio <
    0.5
  ) {
    warning =
      "More than half of the participants are outside their complete working schedules.";
  } else if (
    fairnessRatio <
    0.55
  ) {
    warning =
      "The slot is significantly more comfortable for some cities than for others.";
  }

  let summary =
    "TimeInOne found a balanced meeting time based on local comfort, schedule overlap and fairness.";

  if (
    recommendation.score >=
    90
  ) {
    summary =
      "This is an exceptional meeting window with very strong comfort and balance across the selected cities.";
  } else if (
    recommendation.score >=
    75
  ) {
    summary =
      "This is a strong meeting window with only minor compromises for the participants.";
  } else if (
    recommendation.score >=
    55
  ) {
    summary =
      "This slot is workable, although one or more participants may need to accept a compromise.";
  } else {
    summary =
      "This is a difficult meeting window and should be used only when better overlap is unavailable.";
  }

  return {
    factors,
    summary,
    strengths,
    warning,
  };
}

function getToneClasses(
  tone:
    ScoreFactor["tone"],
): {
  bar: string;
  badge: string;
  icon: string;
} {
  switch (tone) {
    case "emerald":
      return {
        bar:
          "bg-success",

        badge:
          "border-success/20 bg-success-soft text-success",

        icon:
          "border border-success/20 bg-success-soft text-success",
      };

    case "blue":
      return {
        bar:
          "bg-primary",

        badge:
          "border-primary-muted bg-primary-soft text-primary",

        icon:
          "border border-primary-muted bg-primary-soft text-primary",
      };

    case "violet":
      return {
        bar:
          "bg-accent",

        badge:
          "border-accent/20 bg-accent-soft text-accent",

        icon:
          "border border-accent/20 bg-accent-soft text-accent",
      };

    case "amber":
      return {
        bar:
          "bg-warning",

        badge:
          "border-warning/20 bg-warning-soft text-warning",

        icon:
          "border border-warning/20 bg-warning-soft text-warning",
      };

    case "red":
      return {
        bar:
          "bg-danger",

        badge:
          "border-danger/20 bg-danger-soft text-danger",

        icon:
          "border border-danger/20 bg-danger-soft text-danger",
      };
  }
}

function getFactorIcon(
  factorId: string,
): string {
  switch (factorId) {
    case "schedule-overlap":
      return "◷";

    case "participant-comfort":
      return "☀";

    case "fairness":
      return "⚖";

    case "calendar-fit":
      return "▣";

    default:
      return "•";
  }
}

function getScoreGrade(
  score: number,
): string {
  if (
    score >= 90
  ) {
    return "Outstanding";
  }

  if (
    score >= 75
  ) {
    return "Strong";
  }

  if (
    score >= 55
  ) {
    return "Workable";
  }

  return "Difficult";
}

export default function MeetingScoreBreakdown({
  recommendation,
}: MeetingScoreBreakdownProps) {
  const analysis =
    useMemo(
      () =>
        createScoreAnalysis(
          recommendation,
        ),
      [
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
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-soft blur-3xl"
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              TimeInOne score analysis
            </p>

            <h3 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
              Why this time scores{" "}
              {recommendation.score}/100
            </h3>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              {analysis.summary}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full">
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full -rotate-90"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-border"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset={
                    100 -
                    clamp(
                      recommendation.score,
                      0,
                      100,
                    )
                  }
                  className="text-primary transition-[stroke-dashoffset] duration-700"
                />
              </svg>

              <div className="relative text-center">
                <p className="text-2xl font-bold tabular-nums text-text-primary">
                  {recommendation.score}
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Score
                </p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-text-primary">
                {getScoreGrade(
                  recommendation.score,
                )}
              </p>

              <p className="mt-1 text-sm text-text-muted">
                Meeting quality
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <div className="space-y-4">
          {analysis.factors.map(
            (factor) => {
              const toneClasses =
                getToneClasses(
                  factor.tone,
                );

              return (
                <article
                  key={
                    factor.id
                  }
                  className="rounded-2xl border border-border bg-surface-soft p-4 sm:p-5"
                >
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className={[
                        "flex",
                        "h-10",
                        "w-10",
                        "shrink-0",
                        "items-center",
                        "justify-center",
                        "rounded-xl",
                        "text-lg",
                        "font-bold",
                        toneClasses.icon,
                      ].join(" ")}
                    >
                      {getFactorIcon(
                        factor.id,
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h4 className="font-semibold text-text-primary">
                          {factor.label}
                        </h4>

                        <span
                          className={[
                            "rounded-full",
                            "border",
                            "px-3",
                            "py-1",
                            "text-xs",
                            "font-bold",
                            "tabular-nums",
                            toneClasses.badge,
                          ].join(" ")}
                        >
                          {factor.value}/
                          {factor.maximum}
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {
                          factor.description
                        }
                      </p>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
                        <div
                          className={[
                            "h-full",
                            "rounded-full",
                            "transition-[width]",
                            "duration-700",
                            "ease-out",
                            toneClasses.bar,
                          ].join(" ")}
                          style={{
                            width:
                              `${factor.percentage}%`,
                          }}
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-text-muted">
                        <span>
                          Contribution
                        </span>

                        <span className="font-semibold tabular-nums">
                          {
                            factor.percentage
                          }%
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            },
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-success/20 bg-success-soft p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-success/20 bg-surface font-bold text-success">
                ✓
              </span>

              <h4 className="font-semibold text-text-primary">
                Why TimeInOne recommends it
              </h4>
            </div>

            <ul className="mt-4 space-y-3">
              {analysis.strengths.map(
                (
                  strength,
                  index,
                ) => (
                  <li
                    key={`${strength}-${index}`}
                    className="flex gap-3 text-sm leading-6 text-text-secondary"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />

                    <span>
                      {strength}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {analysis.warning && (
            <div className="rounded-2xl border border-warning/20 bg-warning-soft p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-warning/20 bg-surface font-bold text-warning">
                  !
                </span>

                <h4 className="font-semibold text-text-primary">
                  Important context
                </h4>
              </div>

              <p className="mt-4 text-sm leading-6 text-text-secondary">
                {analysis.warning}
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface-soft p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
              Score composition
            </p>

            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-border">
              {analysis.factors.map(
                (factor) => {
                  const toneClasses =
                    getToneClasses(
                      factor.tone,
                    );

                  return (
                    <span
                      key={
                        factor.id
                      }
                      title={`${factor.label}: ${factor.value} points`}
                      className={[
                        "h-full",
                        toneClasses.bar,
                      ].join(" ")}
                      style={{
                        width:
                          `${
                            recommendation.score >
                            0
                              ? (
                                  factor.value /
                                  recommendation.score
                                ) *
                                100
                              : 0
                          }%`,
                      }}
                    />
                  );
                },
              )}
            </div>

            <div className="mt-4 space-y-2">
              {analysis.factors.map(
                (factor) => (
                  <div
                    key={
                      factor.id
                    }
                    className="flex items-center justify-between gap-4 text-xs"
                  >
                    <span className="truncate text-text-muted">
                      {
                        factor.label
                      }
                    </span>

                    <span className="shrink-0 font-semibold tabular-nums text-text-primary">
                      {
                        factor.value
                      } points
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </aside>
      </div>

      <footer className="border-t border-border bg-surface-soft px-5 py-4 sm:px-6">
        <p className="text-xs leading-5 text-text-muted">
          The displayed categories
          provide an explanatory
          breakdown of the TimeInOne
          recommendation score using
          participant schedules,
          comfort levels and balance.
        </p>
      </footer>
    </Card>
  );
}