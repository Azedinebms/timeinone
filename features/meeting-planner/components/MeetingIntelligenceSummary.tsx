"use client";

import {
  useMemo,
  useState,
} from "react";

import type {
  MeetingRecommendation,
} from "../types";

type MeetingIntelligenceSummaryProps = {
  recommendation:
    MeetingRecommendation;

  durationMinutes: number;
};

type ParticipantInsight = {
  participantId: string;

  cityName: string;

  countryCode: string;

  localTime: string;

  localDate: string;

  timezone: string;

  statusLabel: string;

  analysis: string;

  tone:
    | "emerald"
    | "blue"
    | "violet"
    | "amber"
    | "red";
};

type MeetingIntelligenceAnalysis = {
  headline: string;

  summary: string;

  recommendation: string;

  participantInsights:
    ParticipantInsight[];

  strengths: string[];

  considerations: string[];
};

const COPY_FEEDBACK_DURATION =
  2_000;

function normalizeComfort(
  value: unknown,
): string {
  return String(
    value ?? "",
  )
    .trim()
    .toLowerCase();
}

function getPeriodFromLocalTime(
  localTime: string,
): {
  label: string;
  phrase: string;
} {
  const normalizedTime =
    localTime
      .trim()
      .toUpperCase();

  const hourMatch =
    normalizedTime.match(
      /(\d{1,2})(?::\d{2})?\s*(AM|PM)?/,
    );

  if (!hourMatch) {
    return {
      label:
        "Local time",

      phrase:
        "at the displayed local time",
    };
  }

  let hour =
    Number(
      hourMatch[1],
    );

  const meridiem =
    hourMatch[2];

  if (
    meridiem === "PM" &&
    hour !== 12
  ) {
    hour += 12;
  }

  if (
    meridiem === "AM" &&
    hour === 12
  ) {
    hour = 0;
  }

  if (
    hour >= 5 &&
    hour < 9
  ) {
    return {
      label:
        "Early morning",

      phrase:
        "early in the morning",
    };
  }

  if (
    hour >= 9 &&
    hour < 12
  ) {
    return {
      label:
        "Morning",

      phrase:
        "during the morning",
    };
  }

  if (
    hour >= 12 &&
    hour < 14
  ) {
    return {
      label:
        "Midday",

      phrase:
        "around midday",
    };
  }

  if (
    hour >= 14 &&
    hour < 18
  ) {
    return {
      label:
        "Afternoon",

      phrase:
        "during the afternoon",
    };
  }

  if (
    hour >= 18 &&
    hour < 22
  ) {
    return {
      label:
        "Evening",

      phrase:
        "during the evening",
    };
  }

  return {
    label:
      "Night",

    phrase:
      "during local night hours",
  };
}

function getParticipantInsight(
  participant:
    MeetingRecommendation["participants"][number],
): ParticipantInsight {
  const comfort =
    normalizeComfort(
      participant.comfort,
    );

  const period =
    getPeriodFromLocalTime(
      participant.localTime,
    );

  if (
    participant
      .isInsideBusinessHours
  ) {
    return {
      participantId:
        participant.participantId,

      cityName:
        participant.cityName,

      countryCode:
        participant.countryCode,

      localTime:
        participant.localTime,

      localDate:
        participant.localDate,

      timezone:
        participant.timezone,

      statusLabel:
        "Inside working hours",

      tone:
        "emerald",

      analysis:
        `${participant.cityName} joins ${period.phrase}, fully inside the configured working schedule.`,
    };
  }

  if (
    comfort === "ideal"
  ) {
    return {
      participantId:
        participant.participantId,

      cityName:
        participant.cityName,

      countryCode:
        participant.countryCode,

      localTime:
        participant.localTime,

      localDate:
        participant.localDate,

      timezone:
        participant.timezone,

      statusLabel:
        `${period.label} · comfortable`,

      tone:
        "violet",

      analysis:
        `${participant.cityName} has a comfortable ${period.label.toLowerCase()} time, although the date or working-day configuration places it outside the full professional schedule.`,
    };
  }

  if (
    comfort === "early"
  ) {
    return {
      participantId:
        participant.participantId,

      cityName:
        participant.cityName,

      countryCode:
        participant.countryCode,

      localTime:
        participant.localTime,

      localDate:
        participant.localDate,

      timezone:
        participant.timezone,

      statusLabel:
        "Early start",

      tone:
        "amber",

      analysis:
        `${participant.cityName} joins earlier than its preferred working window, creating a moderate compromise.`,
    };
  }

  if (
    comfort === "late"
  ) {
    return {
      participantId:
        participant.participantId,

      cityName:
        participant.cityName,

      countryCode:
        participant.countryCode,

      localTime:
        participant.localTime,

      localDate:
        participant.localDate,

      timezone:
        participant.timezone,

      statusLabel:
        "Late finish",

      tone:
        "amber",

      analysis:
        `${participant.cityName} joins later than its preferred working window, but the time may still be manageable.`,
    };
  }

  return {
    participantId:
      participant.participantId,

    cityName:
      participant.cityName,

    countryCode:
      participant.countryCode,

    localTime:
      participant.localTime,

    localDate:
      participant.localDate,

    timezone:
      participant.timezone,

    statusLabel:
      "Difficult local time",

    tone:
      "red",

    analysis:
      `${participant.cityName} faces a difficult local time that may increase fatigue or reduce availability.`,
  };
}

function createMeetingIntelligence({
  recommendation,
  durationMinutes,
}: {
  recommendation:
    MeetingRecommendation;

  durationMinutes: number;
}): MeetingIntelligenceAnalysis {
  const participantInsights =
    recommendation.participants.map(
      getParticipantInsight,
    );

  const totalParticipants =
    recommendation
      .totalParticipants ||
    participantInsights.length;

  const workingParticipants =
    recommendation
      .workingParticipants;

  const idealParticipants =
    recommendation.participants.filter(
      (participant) =>
        normalizeComfort(
          participant.comfort,
        ) === "ideal",
    ).length;

  const difficultParticipants =
    recommendation.participants.filter(
      (participant) => {
        const comfort =
          normalizeComfort(
            participant.comfort,
          );

        return (
          comfort ===
            "difficult" ||
          comfort ===
            "uncomfortable"
        );
      },
    ).length;

  const compromiseParticipants =
    recommendation.participants.filter(
      (participant) => {
        const comfort =
          normalizeComfort(
            participant.comfort,
          );

        return (
          comfort === "early" ||
          comfort === "late"
        );
      },
    ).length;

  const strengths:
    string[] = [];

  const considerations:
    string[] = [];

  if (
    recommendation
      .isStrictOverlap
  ) {
    strengths.push(
      "Every participant is inside the configured working schedule.",
    );
  } else if (
    workingParticipants ===
    totalParticipants
  ) {
    strengths.push(
      "All participants are inside their local working hours.",
    );
  } else if (
    workingParticipants >
    0
  ) {
    strengths.push(
      `${workingParticipants} of ${totalParticipants} participants are inside their complete working schedules.`,
    );
  }

  if (
    idealParticipants ===
    totalParticipants
  ) {
    strengths.push(
      "Every city receives a comfortable local meeting time.",
    );
  } else if (
    idealParticipants >
    0
  ) {
    strengths.push(
      `${idealParticipants} of ${totalParticipants} participants receive an ideal local time.`,
    );
  }

  if (
    recommendation.score >=
    90
  ) {
    strengths.push(
      "The TimeInOne score indicates an exceptionally balanced meeting window.",
    );
  } else if (
    recommendation.score >=
    75
  ) {
    strengths.push(
      "The TimeInOne score indicates a strong balance between comfort and availability.",
    );
  }

  if (
    durationMinutes <=
    30
  ) {
    strengths.push(
      "The short meeting duration limits fatigue for participants outside ideal hours.",
    );
  }

  if (
    workingParticipants ===
      0 &&
    totalParticipants >
      0
  ) {
    considerations.push(
      "The hours may feel comfortable, but the selected date falls outside the configured professional schedule for every participant.",
    );
  } else if (
    workingParticipants <
    totalParticipants
  ) {
    considerations.push(
      `${totalParticipants - workingParticipants} participant ${
        totalParticipants -
          workingParticipants ===
        1
          ? "is"
          : "are"
      } outside the complete configured working schedule.`,
    );
  }

  if (
    compromiseParticipants >
    0
  ) {
    considerations.push(
      `${compromiseParticipants} participant ${
        compromiseParticipants ===
        1
          ? "accepts"
          : "accept"
      } an early or late local time.`,
    );
  }

  if (
    difficultParticipants >
    0
  ) {
    considerations.push(
      `${difficultParticipants} participant ${
        difficultParticipants ===
        1
          ? "faces"
          : "face"
      } a difficult local time.`,
    );
  }

  if (
    durationMinutes >=
    90
  ) {
    considerations.push(
      "The long meeting duration may amplify fatigue for participants near the edge of their preferred schedule.",
    );
  }

  if (
    considerations.length ===
    0
  ) {
    considerations.push(
      "No major scheduling concern was detected for this meeting window.",
    );
  }

  let headline =
    "A balanced international meeting window";

  let summary =
    "TimeInOne found a practical compromise between local comfort, working schedules and fairness.";

  let finalRecommendation =
    "This slot is suitable for scheduling.";

  if (
    recommendation.score >=
      90 &&
    difficultParticipants ===
      0
  ) {
    headline =
      "An exceptional global meeting window";

    summary =
      "The selected time offers excellent local comfort and strong balance across all participant cities.";

    finalRecommendation =
      "Schedule this slot with confidence. It minimizes participant fatigue while preserving a high level of fairness.";
  } else if (
    recommendation.score >=
    75
  ) {
    headline =
      "A strong meeting window";

    summary =
      "The selected time creates a good balance across the participating time zones, with only limited compromises.";

    finalRecommendation =
      "This is a strong scheduling choice. Review the noted compromises, then confirm the meeting.";
  } else if (
    recommendation.score >=
    55
  ) {
    headline =
      "A workable international compromise";

    summary =
      "The meeting remains practical, although one or more participants may join outside their preferred local window.";

    finalRecommendation =
      "Use this slot when higher-ranked alternatives are unavailable, and keep the meeting focused.";
  } else {
    headline =
      "A challenging meeting window";

    summary =
      "The selected time creates meaningful local-time or schedule difficulties for the group.";

    finalRecommendation =
      "Consider another recommendation, a shorter duration or different participant working hours before scheduling.";
  }

  return {
    headline,

    summary,

    recommendation:
      finalRecommendation,

    participantInsights,

    strengths,

    considerations,
  };
}

function getToneClasses(
  tone:
    ParticipantInsight["tone"],
): {
  container: string;
  badge: string;
  icon: string;
} {
  switch (tone) {
    case "emerald":
      return {
        container:
          "border-success/20 bg-success-soft",

        badge:
          "border-success/20 bg-success-soft text-success",

        icon:
          "bg-success-soft text-success",
      };

    case "blue":
      return {
        container:
          "border-primary-muted bg-primary-soft",

        badge:
          "border-primary-muted bg-primary-soft text-primary",

        icon:
          "bg-primary-soft text-primary",
      };

    case "violet":
      return {
        container:
          "border-accent/20 bg-accent-soft",

        badge:
          "border-accent/20 bg-accent-soft text-accent",

        icon:
          "bg-accent-soft text-accent",
      };

    case "amber":
      return {
        container:
          "border-warning/20 bg-warning-soft",

        badge:
          "border-warning/20 bg-warning-soft text-warning",

        icon:
          "bg-warning-soft text-warning",
      };

    case "red":
      return {
        container:
          "border-danger/20 bg-danger-soft",

        badge:
          "border-danger/20 bg-danger-soft text-danger",

        icon:
          "bg-danger-soft text-danger",
      };
  }
}

function createClipboardText({
  recommendation,
  durationMinutes,
  analysis,
}: {
  recommendation:
    MeetingRecommendation;

  durationMinutes: number;

  analysis:
    MeetingIntelligenceAnalysis;
}): string {
  const participantLines =
    analysis.participantInsights.map(
      (participant) =>
        [
          `${participant.cityName}, ${participant.countryCode}`,
          `${participant.localTime} · ${participant.localDate}`,
          participant.analysis,
        ].join(" — "),
    );

  return [
    "TimeInOne — Meeting Intelligence",
    "",
    analysis.headline,
    analysis.summary,
    "",
    `TimeInOne score: ${recommendation.score}/100`,
    `Duration: ${durationMinutes} minutes`,
    "",
    "Participant analysis:",
    ...participantLines.map(
      (line) =>
        `• ${line}`,
    ),
    "",
    "Strengths:",
    ...analysis.strengths.map(
      (strength) =>
        `• ${strength}`,
    ),
    "",
    "Considerations:",
    ...analysis.considerations.map(
      (consideration) =>
        `• ${consideration}`,
    ),
    "",
    "TimeInOne recommendation:",
    analysis.recommendation,
  ].join("\n");
}

export default function MeetingIntelligenceSummary({
  recommendation,
  durationMinutes,
}: MeetingIntelligenceSummaryProps) {
  const [
    copied,
    setCopied,
  ] = useState(false);

  const analysis =
    useMemo(
      () =>
        createMeetingIntelligence({
          recommendation,
          durationMinutes,
        }),
      [
        durationMinutes,
        recommendation,
      ],
    );

  async function copyAnalysis():
    Promise<void> {
    const text =
      createClipboardText({
        recommendation,
        durationMinutes,
        analysis,
      });

    try {
      await navigator.clipboard.writeText(
        text,
      );
    } catch {
      const textArea =
        document.createElement(
          "textarea",
        );

      textArea.value =
        text;

      textArea.style.position =
        "fixed";

      textArea.style.opacity =
        "0";

      document.body.appendChild(
        textArea,
      );

      textArea.select();

      document.execCommand(
        "copy",
      );

      textArea.remove();
    }

    setCopied(
      true,
    );

    window.setTimeout(
      () => {
        setCopied(
          false,
        );
      },
      COPY_FEEDBACK_DURATION,
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface">
      <header className="border-b border-border bg-gradient-to-r from-accent-soft via-primary-soft to-surface p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-xl text-accent">
                ✦
              </span>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  TimeInOne meeting intelligence
                </p>

                <h3 className="mt-1 text-2xl font-bold text-text-primary">
                  {analysis.headline}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base">
              {analysis.summary}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              void copyAnalysis();
            }}
            className={[
              "inline-flex",
              "h-11",
              "shrink-0",
              "items-center",
              "justify-center",
              "gap-2",
              "rounded-xl",
              "border",
              "px-4",
              "text-sm",
              "font-semibold",
              "transition",
              "outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-primary/20",

              copied
                ? [
                    "border-success/20",
                    "bg-success-soft",
                    "text-success",
                  ].join(" ")
                : [
                    "border-border",
                    "bg-surface-soft",
                    "text-text-secondary",
                    "hover:border-accent/30",
                    "hover:bg-accent-soft",
                    "hover:text-accent",
                  ].join(" "),
            ].join(" ")}
          >
            <span aria-hidden="true">
              {copied
                ? "✓"
                : "⧉"}
            </span>

            {copied
              ? "Analysis copied"
              : "Copy analysis"}
          </button>
        </div>
      </header>

      <div className="p-5 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Participant analysis
          </p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {analysis.participantInsights.map(
              (participant) => {
                const toneClasses =
                  getToneClasses(
                    participant.tone,
                  );

                return (
                  <article
                    key={
                      participant.participantId
                    }
                    className={[
                      "rounded-2xl",
                      "border",
                      "p-4",
                      "sm:p-5",
                      "transition-all",
                      "duration-300",
                      "hover:-translate-y-0.5",
                      "hover:shadow-md",
                      toneClasses.container,
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={[
                          "flex",
                          "h-10",
                          "w-10",
                          "shrink-0",
                          "items-center",
                          "justify-center",
                          "rounded-xl",
                          "text-sm",
                          "font-bold",
                          toneClasses.icon,
                        ].join(" ")}
                      >
                        {
                          participant
                            .countryCode
                        }
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h4 className="font-semibold text-text-primary">
                              {
                                participant
                                  .cityName
                              }
                            </h4>

                            <p className="mt-1 text-sm font-semibold tabular-nums text-text-secondary">
                              {
                                participant
                                  .localTime
                              }
                            </p>
                          </div>

                          <span
                            className={[
                              "rounded-full",
                              "border",
                              "px-3",
                              "py-1",
                              "text-[10px]",
                              "font-semibold",
                              toneClasses.badge,
                            ].join(" ")}
                          >
                            {
                              participant
                                .statusLabel
                            }
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-text-secondary">
                          {
                            participant
                              .analysis
                          }
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-muted">
                          <span>
                            {
                              participant
                                .localDate
                            }
                          </span>

                          <span className="truncate">
                            {
                              participant
                                .timezone
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-success/20 bg-success-soft p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-soft font-bold text-success">
                ✓
              </span>

              <h4 className="font-semibold text-text-primary">
                Meeting strengths
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
          </section>

          <section className="rounded-2xl border border-warning/20 bg-warning-soft p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning-soft font-bold text-warning">
                !
              </span>

              <h4 className="font-semibold text-text-primary">
                Scheduling considerations
              </h4>
            </div>

            <ul className="mt-4 space-y-3">
              {analysis.considerations.map(
                (
                  consideration,
                  index,
                ) => (
                  <li
                    key={`${consideration}-${index}`}
                    className="flex gap-3 text-sm leading-6 text-text-secondary"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />

                    <span>
                      {consideration}
                    </span>
                  </li>
                ),
              )}
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-primary-muted bg-gradient-to-r from-primary-soft via-accent-soft to-surface p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-xl text-primary">
              →
            </span>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                TimeInOne recommendation
              </p>

              <p className="mt-2 text-base font-semibold leading-7 text-text-primary">
                {analysis.recommendation}
              </p>

              <p className="mt-2 text-sm text-text-muted">
                Based on a{" "}
                {durationMinutes}-minute
                meeting with{" "}
                {
                  recommendation
                    .totalParticipants
                }{" "}
                participants and a TimeInOne
                score of{" "}
                {recommendation.score}
                /100.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}