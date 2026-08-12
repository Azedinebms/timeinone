"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type {
  MeetingRecommendation,
  MeetingRecommendationQuality,
} from "../types";

import MeetingRecommendationActions from "./MeetingRecommendationActions";

type MeetingRecommendationsProps = {
  recommendations:
  MeetingRecommendation[];

  hasMinimumParticipants:
  boolean;

  durationMinutes: number;

  selectedRecommendationId?:
  string | null;

  onSelectRecommendation?: (
    recommendation:
      MeetingRecommendation,
  ) => void;

  onShareSlot?: (
    instant: Date,
  ) => void;
};

function getQualityLabel(
  quality:
    MeetingRecommendationQuality,
): string {
  switch (quality) {
    case "excellent":
      return "Excellent";

    case "good":
      return "Good";

    case "acceptable":
      return "Acceptable";

    case "difficult":
      return "Difficult";
  }
}

function getQualityClasses(
  quality:
    MeetingRecommendationQuality,
): string {
  switch (quality) {
    case "excellent":
      return "border-success/20 bg-success-soft text-success";

    case "good":
      return "border-primary-muted bg-primary-soft text-primary";

    case "acceptable":
      return "border-warning/20 bg-warning-soft text-warning";

    case "difficult":
      return "border-danger/20 bg-danger-soft text-danger";
  }
}

function formatInstant(
  instant:
    Date,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        "UTC",

      weekday:
        "long",

      month:
        "long",

      day:
        "numeric",

      year:
        "numeric",
    },
  ).format(
    instant,
  );
}

export default function MeetingRecommendations({
  recommendations,
  hasMinimumParticipants,
  durationMinutes,
  selectedRecommendationId =
  null,
  onSelectRecommendation,
  onShareSlot,
}: MeetingRecommendationsProps) {
  if (
    !hasMinimumParticipants
  ) {
    return (
      <Card
        variant="soft"
        padding="lg"
        className="border-dashed text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-muted bg-primary-soft text-xl text-primary">
          ✦
        </div>

        <p className="mt-4 font-semibold text-text-primary">
          Add another city
        </p>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-secondary">
          At least two participant
          cities are required before
          TimeInOne can calculate
          meeting recommendations.
        </p>
      </Card>
    );
  }

  if (
    recommendations.length ===
    0
  ) {
    return (
      <Card
        variant="soft"
        padding="lg"
        className="border-warning/20 bg-warning-soft text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-warning/20 bg-surface text-xl text-warning">
          !
        </div>

        <p className="mt-4 font-semibold text-warning">
          No comfortable slots found
        </p>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-secondary">
          Try another date, reduce
          the meeting duration or
          enable compromise slots.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {recommendations.map(
        (
          recommendation,
          index,
        ) => {
          const isSelected =
            selectedRecommendationId ===
            recommendation.id;

          return (
            <Card
              id={`meeting-recommendation-${recommendation.id}`}
              key={
                recommendation.id
              }
              as="article"
              variant={
                isSelected
                  ? "soft"
                  : "default"
              }
              padding="none"
              className={[
                "scroll-mt-24",
                "overflow-hidden",
                "transition-all",
                "duration-300",

                isSelected
                  ? [
                    "border-primary",
                    "bg-primary-soft",
                    "shadow-lg",
                    "ring-2",
                    "ring-primary/10",
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
              <header className="flex flex-col gap-4 border-b border-border bg-surface-soft p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={[
                        "flex",
                        "h-10",
                        "w-10",
                        "shrink-0",
                        "items-center",
                        "justify-center",
                        "rounded-xl",
                        "border",
                        "text-sm",
                        "font-bold",

                        isSelected
                          ? "border-primary-muted bg-primary-soft text-primary"
                          : "border-border bg-surface text-text-secondary",
                      ].join(
                        " ",
                      )}
                    >
                      {isSelected
                        ? "✓"
                        : index + 1}
                    </span>

                    <h3 className="text-lg font-semibold text-text-primary">
                      {isSelected
                        ? "Selected slot"
                        : "Recommended slot"}
                    </h3>

                    {recommendation
                      .isStrictOverlap && (
                        <Badge
                          variant="success"
                          size="sm"
                        >
                          Full overlap
                        </Badge>
                      )}
                  </div>

                  <p className="mt-3 text-sm text-text-secondary sm:text-base">
                    {formatInstant(
                      recommendation.instant,
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <span
                    className={[
                      "rounded-full",
                      "border",
                      "px-4",
                      "py-2",
                      "text-sm",
                      "font-semibold",
                      getQualityClasses(
                        recommendation.quality,
                      ),
                    ].join(
                      " ",
                    )}
                  >
                    {getQualityLabel(
                      recommendation.quality,
                    )}
                  </span>

                  <span className="text-3xl font-bold tabular-nums text-text-primary">
                    {
                      recommendation.score
                    }

                    <span className="text-sm font-medium text-text-muted">
                      /100
                    </span>
                  </span>
                </div>
              </header>

              <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
                {recommendation.participants.map(
                  (
                    participant,
                  ) => (
                    <section
                      key={
                        participant.participantId
                      }
                      className="min-w-0 bg-surface p-5 sm:p-6"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <h4 className="truncate text-lg font-semibold text-text-primary">
                          {
                            participant.cityName
                          }
                        </h4>

                        <Badge
                          variant="neutral"
                          size="sm"
                        >
                          {
                            participant.countryCode
                          }
                        </Badge>
                      </div>

                      <p className="mt-5 font-mono text-3xl font-bold tabular-nums text-text-primary">
                        {
                          participant.localTime
                        }
                      </p>

                      <p className="mt-2 text-sm text-text-muted">
                        {
                          participant.localDate
                        }
                      </p>

                      <div className="mt-5">
                        <span
                          className={[
                            "inline-flex",
                            "rounded-full",
                            "border",
                            "px-3",
                            "py-1.5",
                            "text-[10px]",
                            "font-semibold",

                            participant.isInsideBusinessHours
                              ? "border-success/20 bg-success-soft text-success"
                              : "border-warning/20 bg-warning-soft text-warning",
                          ].join(
                            " ",
                          )}
                        >
                          {participant.isInsideBusinessHours
                            ? "Working hours"
                            : participant.comfort}
                        </span>
                      </div>
                    </section>
                  ),
                )}
              </div>

              <footer className="border-t border-border bg-surface-soft p-5 sm:p-6">
                <div>
                  <p className="text-base font-semibold text-text-primary">
                    {durationMinutes}-minute meeting
                  </p>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {isSelected
                      ? "This meeting time is selected and ready to schedule."
                      : "Select this time to create a final meeting summary."}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 lg:flex-nowrap">
                  {onSelectRecommendation && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectRecommendation(
                          recommendation,
                        );
                      }}
                      className={[
                        "group",
                        "relative",
                        "inline-flex",
                        "h-11",
                        "shrink-0",
                        "items-center",
                        "justify-center",
                        "gap-2.5",
                        "overflow-hidden",
                        "rounded-xl",
                        "border",
                        "px-5",
                        "text-sm",
                        "font-bold",
                        "outline-none",
                        "transition-all",
                        "duration-200",
                        "hover:-translate-y-0.5",
                        "active:translate-y-0",
                        "active:scale-[0.98]",
                        "focus-visible:ring-4",

                        isSelected
                          ? [
                            "border-emerald-200",
                            "bg-emerald-50",
                            "text-emerald-800",
                            "shadow-sm",
                            "focus-visible:ring-emerald-500/10",
                          ].join(" ")
                          : [
                            "border-blue-600",
                            "bg-gradient-to-r",
                            "from-blue-600",
                            "to-indigo-600",
                            "text-white",
                            "shadow-lg",
                            "shadow-blue-500/20",
                            "hover:from-blue-500",
                            "hover:to-indigo-500",
                            "hover:shadow-xl",
                            "hover:shadow-blue-500/25",
                            "focus-visible:ring-blue-500/20",
                          ].join(" "),
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "relative",
                          "flex",
                          "h-7",
                          "w-7",
                          "items-center",
                          "justify-center",
                          "rounded-lg",
                          "text-base",
                          "transition",

                          isSelected
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-white/15 text-white ring-1 ring-white/20",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        ✓
                      </span>

                      <span className="relative">
                        {isSelected
                          ? "Selected"
                          : "Select this time"}
                      </span>
                    </button>
                  )}

                  <MeetingRecommendationActions
                    recommendation={
                      recommendation
                    }
                    durationMinutes={
                      durationMinutes
                    }
                    onShare={
                      onShareSlot
                    }
                    singleLine
                  />
                </div>
              </footer>
            </Card>
          );
        },
      )}
    </div>
  );
}