"use client";

import {
  useMemo,
} from "react";

import {
  findBestMeetingTimes,
  formatMeetingDate,
  formatMeetingTime,
  getMeetingComfortLabel,
  type MeetingComfort,
} from "@/lib/time-engine";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

type BestMeetingTimesProps = {
  date: Date;

  fromTimezone: string;
  toTimezone: string;

  fromCity: string;
  toCity: string;

  onSelectTime:
    (
      date: Date,
    ) => void;
};

function getComfortClassName(
  comfort:
    MeetingComfort,
) {
  switch (
    comfort
  ) {
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

export default function BestMeetingTimes({
  date,
  fromTimezone,
  toTimezone,
  fromCity,
  toCity,
  onSelectTime,
}: BestMeetingTimesProps) {
  const meetingSlots =
    useMemo(
      () =>
        findBestMeetingTimes({
          startDate:
            date,

          fromTimezone,

          toTimezone,

          horizonHours:
            72,

          intervalMinutes:
            30,

          limit:
            3,

          allowCompromise:
            true,
        }),
      [
        date,
        fromTimezone,
        toTimezone,
      ],
    );

  const hasStrictOverlap =
    meetingSlots.some(
      (
        slot,
      ) =>
        slot.isStrictOverlap,
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
          variant="accent"
          size="sm"
        >
          Smart recommendation
        </Badge>

        <h2 className="mt-3 text-xl font-semibold text-text-primary">
          {hasStrictOverlap
            ? "Best meeting times"
            : "Best meeting compromises"}
        </h2>

        <p className="mt-1 text-sm leading-6 text-text-secondary">
          {hasStrictOverlap
            ? `Recommended working-hour overlaps between ${fromCity} and ${toCity}.`
            : `No strict working-hours overlap was found, so TimeInOne selected the most reasonable compromises for ${fromCity} and ${toCity}.`}
        </p>
      </div>

      {meetingSlots.length >
      0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {meetingSlots.map(
            (
              slot,
              index,
            ) => {
              const isBest =
                index ===
                0;

              return (
                <Card
                  key={
                    slot.instant.toISOString()
                  }
                  as="article"
                  variant="soft"
                  padding="md"
                  interactive
                  className={[
                    "relative",

                    isBest
                      ? "border-accent/25 bg-accent-soft"
                      : "",
                  ]
                    .filter(
                      Boolean,
                    )
                    .join(
                      " ",
                    )}
                >
                  {isBest && (
                    <div className="absolute right-4 top-4">
                      <Badge
                        variant={
                          slot.isStrictOverlap
                            ? "accent"
                            : "warning"
                        }
                        size="sm"
                      >
                        {slot.isStrictOverlap
                          ? "Best choice"
                          : "Best compromise"}
                      </Badge>
                    </div>
                  )}

                  <p className="pr-24 text-sm font-medium text-text-secondary">
                    {formatMeetingDate(
                      slot.instant,
                      fromTimezone,
                    )}
                  </p>

                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {
                        fromCity
                      }
                    </p>

                    <p className="mt-1 text-2xl font-bold text-text-primary">
                      {formatMeetingTime(
                        slot.instant,
                        fromTimezone,
                      )}
                    </p>

                    <p
                      className={`mt-2 text-xs font-medium ${getComfortClassName(
                        slot.fromComfort,
                      )}`}
                    >
                      {getMeetingComfortLabel(
                        slot.fromComfort,
                      )}
                    </p>
                  </div>

                  <div className="my-4 border-t border-border" />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {
                        toCity
                      }
                    </p>

                    <p className="mt-1 text-2xl font-bold text-primary">
                      {formatMeetingTime(
                        slot.instant,
                        toTimezone,
                      )}
                    </p>

                    <p
                      className={`mt-2 text-xs font-medium ${getComfortClassName(
                        slot.toComfort,
                      )}`}
                    >
                      {getMeetingComfortLabel(
                        slot.toComfort,
                      )}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant={
                      isBest
                        ? "primary"
                        : "secondary"
                    }
                    className="mt-5 w-full"
                    onClick={() => {
                      onSelectTime(
                        slot.instant,
                      );
                    }}
                  >
                    Select this time
                  </Button>
                </Card>
              );
            },
          )}
        </div>
      ) : (
        <Card
          variant="soft"
          padding="md"
          className="mt-6 border-warning/25 bg-warning-soft"
        >
          <p className="text-sm font-medium text-warning">
            No reasonable meeting
            time was found during the
            next 72 hours.
          </p>
        </Card>
      )}
    </Card>
  );
}