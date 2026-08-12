"use client";

import {
  useState,
} from "react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

import type {
  MeetingRecommendation,
  MeetingRecommendationQuality,
} from "../types";

import MeetingIntelligenceSummary from "./MeetingIntelligenceSummary";
import MeetingRecommendationActions from "./MeetingRecommendationActions";
import MeetingScoreBreakdown from "./MeetingScoreBreakdown";
import MeetingStatistics from "./MeetingStatistics";

type MeetingSelectedSlotProps = {
  recommendation:
    MeetingRecommendation | null;

  durationMinutes:
    number;

  onClear: () => void;

  onShare: (
    instant:
      Date,
  ) => void;
};

function RotateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M4.5 8.5V4.5H8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5.4 8.1C6.9 5.7 9.4 4.3 12.2 4.3C16.6 4.3 20.2 7.9 20.2 12.3C20.2 16.7 16.6 20.3 12.2 20.3C8.6 20.3 5.6 18 4.6 14.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M12 3L13.3 7.7L18 9L13.3 10.3L12 15L10.7 10.3L6 9L10.7 7.7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M18.5 15L19.2 17.3L21.5 18L19.2 18.7L18.5 21L17.8 18.7L15.5 18L17.8 17.3L18.5 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getQualityLabel(
  quality:
    MeetingRecommendationQuality,
): string {
  switch (
    quality
  ) {
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
  switch (
    quality
  ) {
    case "excellent":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";

    case "good":
      return "border-blue-200 bg-blue-50 text-blue-800";

    case "acceptable":
      return "border-amber-200 bg-amber-50 text-amber-800";

    case "difficult":
      return "border-rose-200 bg-rose-50 text-rose-800";
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

export default function MeetingSelectedSlot({
  recommendation,
  durationMinutes,
  onClear,
  onShare,
}: MeetingSelectedSlotProps) {
  const [
    showAdvancedAnalysis,
    setShowAdvancedAnalysis,
  ] =
    useState(
      false,
    );

  if (
    !recommendation
  ) {
    return (
      <Card
        variant="soft"
        padding="lg"
        className="border-dashed text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600">
          <SparklesIcon />
        </div>

        <p className="mt-4 font-semibold text-slate-950">
          No meeting time selected
        </p>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
          Choose one of the recommended
          times above. Your final meeting
          summary will appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card
        as="article"
        variant="elevated"
        padding="none"
        className="overflow-hidden border-blue-200 shadow-lg shadow-slate-200/40 ring-1 ring-blue-500/5"
      >
        {/* =========================
            HEADER
        ========================== */}

        <header className="relative overflow-hidden border-b border-slate-200 bg-white p-5 sm:p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl"
          />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-lg font-black text-emerald-700 shadow-sm">
                  ✓
                </span>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-600">
                    Selected meeting
                  </p>

                  <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                    Ready to schedule
                  </h3>
                </div>

                {recommendation
                  .isStrictOverlap && (
                  <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
                    Full overlap
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm font-medium text-slate-600">
                {formatInstant(
                  recommendation.instant,
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={[
                  "rounded-full",
                  "border",
                  "px-3.5",
                  "py-2",
                  "text-xs",
                  "font-bold",
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

              <div className="flex h-16 min-w-[96px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 shadow-sm">
                <span className="text-3xl font-black tabular-nums text-slate-950">
                  {
                    recommendation.score
                  }
                </span>

                <span className="ml-1 self-end pb-3 text-xs font-bold text-slate-500">
                  /100
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* =========================
            LOCAL TIMES
        ========================== */}

        <div className="grid gap-px bg-slate-200 sm:grid-cols-2 xl:grid-cols-3">
          {recommendation.participants.map(
            (
              participant,
            ) => (
              <section
                key={
                  participant.participantId
                }
                className="min-w-0 bg-white p-5 sm:p-6"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <h4 className="truncate font-bold text-slate-950">
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

                <p className="mt-4 font-mono text-3xl font-black tracking-tight text-slate-950 tabular-nums">
                  {
                    participant.localTime
                  }
                </p>

                <p className="mt-1.5 text-sm font-medium text-slate-500">
                  {
                    participant.localDate
                  }
                </p>

                <div className="mt-4">
                  <span
                    className={[
                      "inline-flex",
                      "rounded-full",
                      "border",
                      "px-2.5",
                      "py-1",
                      "text-[10px]",
                      "font-bold",

                      participant.isInsideBusinessHours
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-amber-200 bg-amber-50 text-amber-800",
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

        {/* =========================
            ACTION BAR
        ========================== */}

        <footer className="border-t border-slate-200 bg-slate-50/80 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-950">
                {durationMinutes}-minute meeting
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Selected and ready
                for scheduling.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={
                  onClear
                }
                className={[
                  "group",
                  "inline-flex",
                  "h-11",
                  "shrink-0",
                  "items-center",
                  "justify-center",
                  "gap-2.5",
                  "rounded-xl",
                  "border",
                  "border-slate-200",
                  "bg-white",
                  "px-4",
                  "text-sm",
                  "font-semibold",
                  "text-slate-700",
                  "shadow-sm",
                  "outline-none",
                  "transition-all",
                  "duration-200",
                  "hover:-translate-y-0.5",
                  "hover:border-blue-200",
                  "hover:bg-blue-50",
                  "hover:text-blue-700",
                  "hover:shadow-md",
                  "active:translate-y-0",
                  "active:scale-[0.98]",
                  "focus-visible:ring-4",
                  "focus-visible:ring-blue-500/10",
                ].join(
                  " ",
                )}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                  <RotateIcon />
                </span>

                Change time
              </button>

              <MeetingRecommendationActions
                recommendation={
                  recommendation
                }
                durationMinutes={
                  durationMinutes
                }
                onShare={
                  onShare
                }
                singleLine
              />
            </div>
          </div>
        </footer>
      </Card>

      {/* =========================
          ADVANCED ANALYSIS
      ========================== */}

      <Card
        as="section"
        variant="default"
        padding="none"
        className="overflow-hidden"
      >
        <button
          type="button"
          aria-expanded={
            showAdvancedAnalysis
          }
          onClick={() => {
            setShowAdvancedAnalysis(
              (
                currentValue,
              ) =>
                !currentValue,
            );
          }}
          className="group flex w-full items-center justify-between gap-5 p-5 text-left outline-none transition hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-blue-500/10 sm:p-6"
        >
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-violet-600 shadow-sm">
              <SparklesIcon />
            </span>

            <div className="min-w-0">
              <p className="font-bold text-slate-950">
                Why does TimeInOne recommend this time?
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Explore statistics,
                score breakdown and
                participant intelligence.
              </p>
            </div>
          </div>

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
              "border-slate-200",
              "bg-white",
              "text-lg",
              "text-slate-500",
              "shadow-sm",
              "transition-all",
              "duration-200",
              "group-hover:border-blue-200",
              "group-hover:text-blue-600",

              showAdvancedAnalysis
                ? "rotate-180"
                : "",
            ].join(
              " ",
            )}
          >
            ⌄
          </span>
        </button>

        {showAdvancedAnalysis && (
          <div className="space-y-5 border-t border-slate-200 bg-slate-50/60 p-5 sm:p-6">
            <MeetingStatistics
              recommendation={
                recommendation
              }
              durationMinutes={
                durationMinutes
              }
            />

            <MeetingScoreBreakdown
              recommendation={
                recommendation
              }
            />

            <MeetingIntelligenceSummary
              recommendation={
                recommendation
              }
              durationMinutes={
                durationMinutes
              }
            />
          </div>
        )}
      </Card>
    </div>
  );
}