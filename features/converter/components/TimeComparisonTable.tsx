"use client";

import {
  useMemo,
} from "react";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

import {
  buildTimeline,
} from "@/lib/time-engine";

type TimeComparisonTableProps = {
  date: Date;
  fromTimezone: string;
  toTimezone: string;
  fromCity: string;
  toCity: string;
};

export default function TimeComparisonTable({
  date,
  fromTimezone,
  toTimezone,
  fromCity,
  toCity,
}: TimeComparisonTableProps) {
  const rows =
    useMemo(
      () =>
        buildTimeline({
          startDate:
            date,

          fromTimezone,

          toTimezone,

          hours:
            24,
        }),
      [
        date,
        fromTimezone,
        toTimezone,
      ],
    );

  const overlapCount =
    useMemo(
      () =>
        rows.filter(
          (
            row,
          ) =>
            row.isOverlap,
        ).length,
      [
        rows,
      ],
    );

  return (
    <Card
      as="section"
      variant="default"
      padding="none"
      className="mt-6 overflow-hidden"
    >
      <div className="flex flex-col gap-4 border-b border-border bg-surface-soft p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge
            variant="info"
            size="sm"
          >
            Hourly comparison
          </Badge>

          <h2 className="mt-3 text-lg font-semibold text-text-primary">
            Next 24 hours
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Compare {fromCity} and{" "}
            {toCity} hour by hour.
          </p>
        </div>

        <Badge
          variant={
            overlapCount > 0
              ? "success"
              : "neutral"
          }
          size="md"
          dot={
            overlapCount > 0
          }
        >
          {overlapCount} working-hour
          {overlapCount ===
          1
            ? ""
            : "s"}{" "}
          overlap
        </Badge>
      </div>

      <div className="max-h-[580px] overflow-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="border-b border-border">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Hour
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {fromCity}
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {toCity}
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Availability
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map(
              (
                row,
              ) => (
                <tr
                  key={
                    row.instant.toISOString()
                  }
                  className={[
                    "border-b",
                    "border-border-soft",
                    "transition",
                    "last:border-b-0",

                    row.isOverlap
                      ? "bg-success-soft/60"
                      : "hover:bg-surface-soft",
                  ].join(
                    " ",
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "flex",
                          "h-8",
                          "w-8",
                          "items-center",
                          "justify-center",
                          "rounded-lg",
                          "text-xs",
                          "font-bold",

                          row.offsetHours ===
                          0
                            ? "bg-primary text-white"
                            : "border border-border bg-surface-soft text-text-secondary",
                        ].join(
                          " ",
                        )}
                      >
                        {
                          row.offsetHours
                        }
                      </span>

                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {row.offsetHours ===
                          0
                            ? "Selected time"
                            : `+${row.offsetHours}h`}
                        </p>

                        <p className="text-xs text-text-muted">
                          {
                            row.fromDate
                          }
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-base font-semibold text-text-primary">
                      {
                        row.fromTime
                      }
                    </p>

                    <p
                      className={[
                        "mt-1",
                        "text-xs",
                        "font-medium",

                        row.fromIsWorking
                          ? "text-success"
                          : "text-text-muted",
                      ].join(
                        " ",
                      )}
                    >
                      {row.fromIsWorking
                        ? "Working hours"
                        : "Outside working hours"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-base font-semibold text-primary">
                      {
                        row.toTime
                      }
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      {
                        row.toDate
                      }
                    </p>

                    <p
                      className={[
                        "mt-1",
                        "text-xs",
                        "font-medium",

                        row.toIsWorking
                          ? "text-success"
                          : "text-text-muted",
                      ].join(
                        " ",
                      )}
                    >
                      {row.toIsWorking
                        ? "Working hours"
                        : "Outside working hours"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    {row.isOverlap ? (
                      <Badge
                        variant="success"
                        size="sm"
                      >
                        Good meeting time
                      </Badge>
                    ) : (
                      <Badge
                        variant="neutral"
                        size="sm"
                      >
                        Limited availability
                      </Badge>
                    )}
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}