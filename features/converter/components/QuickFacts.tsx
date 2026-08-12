"use client";

import {
  useMemo,
} from "react";

import {
  buildQuickFacts,
  formatMeetingDate,
  formatMeetingTime,
  getMeetingComfortLabel,
  type MeetingComfort,
} from "@/lib/time-engine";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

type QuickFactsProps = {
  instant: Date;

  fromCity: string;
  fromTimezone: string;

  toCity: string;
  toTimezone: string;
};

function getComfortClassName(
  comfort: MeetingComfort,
) {
  switch (comfort) {
    case "ideal":
      return "text-success";

    case "early":
      return "text-info";

    case "late":
      return "text-warning";

    case "uncomfortable":
      return "text-danger";
  }
}

export default function QuickFacts({
  instant,

  fromCity,
  fromTimezone,

  toCity,
  toTimezone,
}: QuickFactsProps) {
  const facts = useMemo(
    () =>
      buildQuickFacts({
        instant,

        fromCity,
        fromTimezone,

        toCity,
        toTimezone,
      }),
    [
      instant,
      fromCity,
      fromTimezone,
      toCity,
      toTimezone,
    ],
  );

  return (
    <Card
      as="section"
      variant="default"
      padding="md"
      className="mt-6"
    >
      <div>
        <Badge
          variant="info"
          size="sm"
        >
          Quick facts
        </Badge>

        <h2 className="mt-3 text-xl font-semibold text-text-primary">
          {fromCity} to {toCity} at a glance
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Current offsets, business-hours status and
          meeting information.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card
          as="article"
          variant="soft"
          padding="md"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Time difference
          </p>

          <p className="mt-3 text-lg font-semibold text-text-primary">
            {facts.differenceLabel}
          </p>
        </Card>

        <Card
          as="article"
          variant="soft"
          padding="md"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            {fromCity}
          </p>

          <p className="mt-3 text-2xl font-bold text-text-primary">
            {facts.from.utcOffsetLabel}
          </p>

          <p className="mt-2 text-sm text-text-secondary">
            {facts.from.localDate}
          </p>

          <p
            className={`mt-3 text-sm font-medium ${
              facts.from.isBusinessHours
                ? "text-success"
                : "text-warning"
            }`}
          >
            {facts.from.isBusinessHours
              ? "Working hours"
              : "Outside working hours"}
          </p>

          <p className="mt-2 text-xs text-text-muted">
            DST observed:{" "}
            {facts.from.usesDst
              ? "Yes"
              : "No"}
          </p>
        </Card>

        <Card
          as="article"
          variant="soft"
          padding="md"
          className="border-primary-muted bg-primary-soft"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {toCity}
          </p>

          <p className="mt-3 text-2xl font-bold text-primary">
            {facts.to.utcOffsetLabel}
          </p>

          <p className="mt-2 text-sm text-text-secondary">
            {facts.to.localDate}
          </p>

          <p
            className={`mt-3 text-sm font-medium ${
              facts.to.isBusinessHours
                ? "text-success"
                : "text-warning"
            }`}
          >
            {facts.to.isBusinessHours
              ? "Working hours"
              : "Outside working hours"}
          </p>

          <p className="mt-2 text-xs text-text-muted">
            DST observed:{" "}
            {facts.to.usesDst
              ? "Yes"
              : "No"}
          </p>
        </Card>
      </div>

      {facts.bestMeeting ? (
        <Card
          as="article"
          variant="soft"
          padding="md"
          className={[
            "mt-4",

            facts.bestMeeting.isStrictOverlap
              ? "border-success/20 bg-success-soft"
              : "border-warning/25 bg-warning-soft",
          ].join(" ")}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p
              className={`text-xs font-semibold uppercase tracking-wider ${
                facts.bestMeeting.isStrictOverlap
                  ? "text-success"
                  : "text-warning"
              }`}
            >
              {facts.bestMeeting.isStrictOverlap
                ? "Next recommended meeting"
                : "Next recommended compromise"}
            </p>

            <Badge
              variant={
                facts.bestMeeting.isStrictOverlap
                  ? "success"
                  : "warning"
              }
              size="sm"
            >
              {facts.bestMeeting.isStrictOverlap
                ? "Working-hours overlap"
                : "No strict overlap"}
            </Badge>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-text-secondary">
                {fromCity}
              </p>

              <p className="mt-1 text-xl font-bold text-text-primary">
                {formatMeetingTime(
                  facts.bestMeeting.instant,
                  fromTimezone,
                )}
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                {formatMeetingDate(
                  facts.bestMeeting.instant,
                  fromTimezone,
                )}
              </p>

              <p
                className={`mt-2 text-xs font-medium ${getComfortClassName(
                  facts.bestMeeting.fromComfort,
                )}`}
              >
                {getMeetingComfortLabel(
                  facts.bestMeeting.fromComfort,
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-text-secondary">
                {toCity}
              </p>

              <p className="mt-1 text-xl font-bold text-primary">
                {formatMeetingTime(
                  facts.bestMeeting.instant,
                  toTimezone,
                )}
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                {formatMeetingDate(
                  facts.bestMeeting.instant,
                  toTimezone,
                )}
              </p>

              <p
                className={`mt-2 text-xs font-medium ${getComfortClassName(
                  facts.bestMeeting.toComfort,
                )}`}
              >
                {getMeetingComfortLabel(
                  facts.bestMeeting.toComfort,
                )}
              </p>
            </div>
          </div>

          {!facts.bestMeeting.isStrictOverlap && (
            <p className="mt-5 border-t border-warning/25 pt-4 text-sm leading-6 text-text-secondary">
              TimeInOne found no simultaneous 9 AM–6 PM
              overlap, so this recommendation uses
              reasonable early or late local hours.
            </p>
          )}
        </Card>
      ) : (
        <Card
          as="article"
          variant="soft"
          padding="md"
          className="mt-4 border-danger/20 bg-danger-soft"
        >
          <p className="text-sm font-medium text-danger">
            No reasonable meeting time was found during
            the next 72 hours.
          </p>
        </Card>
      )}
    </Card>
  );
}