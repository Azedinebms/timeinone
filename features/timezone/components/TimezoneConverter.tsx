"use client";

import {
  useMemo,
  useState,
} from "react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import {
  convertTimezoneTime,
  type TimezoneDefinition,
} from "@/lib/timezones";

type TimezoneConverterProps = {
  initialFromTimezone:
    TimezoneDefinition;

  initialToTimezone:
    TimezoneDefinition;

  initialDateTime:
    string;
};

function addHours(
  date: Date,
  hours: number,
) {
  return new Date(
    date.getTime() +
      hours *
        60 *
        60 *
        1000,
  );
}

function getDifferenceBadge(
  differenceMinutes:
    number,
) {
  if (
    differenceMinutes ===
    0
  ) {
    return "Same offset";
  }

  const sign =
    differenceMinutes >
    0
      ? "+"
      : "-";

  const absoluteMinutes =
    Math.abs(
      differenceMinutes,
    );

  const hours =
    Math.floor(
      absoluteMinutes /
        60,
    );

  const minutes =
    absoluteMinutes %
    60;

  if (
    minutes ===
    0
  ) {
    return `${sign}${hours}h`;
  }

  return (
    `${sign}${hours}h ` +
    `${minutes}m`
  );
}

export default function TimezoneConverter({
  initialFromTimezone,
  initialToTimezone,
  initialDateTime,
}: TimezoneConverterProps) {
  const [
    fromTimezone,
    setFromTimezone,
  ] =
    useState(
      initialFromTimezone,
    );

  const [
    toTimezone,
    setToTimezone,
  ] =
    useState(
      initialToTimezone,
    );

  const [
    localDateTime,
    setLocalDateTime,
  ] =
    useState(
      initialDateTime,
    );

  const conversionResult =
    useMemo(
      () => {
        if (
          !localDateTime
        ) {
          return null;
        }

        return convertTimezoneTime({
          localDateTime,
          fromTimezone,
          toTimezone,
        });
      },
      [
        localDateTime,
        fromTimezone,
        toTimezone,
      ],
    );

  const timeline =
    useMemo(
      () => {
        if (
          !conversionResult
        ) {
          return [];
        }

        return Array.from(
          {
            length:
              24,
          },
          (
            _,
            index,
          ) => {
            const instant =
              addHours(
                conversionResult.instant,
                index,
              );

            const fromInput =
              convertTimezoneTime({
                localDateTime:
                  conversionResult
                    .from
                    .dateTimeInput,

                fromTimezone,
                toTimezone,
              });

            if (
              !fromInput
            ) {
              return null;
            }

            const rowInstant =
              addHours(
                fromInput.instant,
                index,
              );

            const fromOffset =
              conversionResult
                .from
                .offsetMinutes;

            const fromShifted =
              new Date(
                rowInstant.getTime() +
                  fromOffset *
                    60 *
                    1000,
              );

            const rowLocalInput =
              `${fromShifted
                .getUTCFullYear()
                .toString()
                .padStart(
                  4,
                  "0",
                )}-` +
              `${(
                fromShifted.getUTCMonth() +
                1
              )
                .toString()
                .padStart(
                  2,
                  "0",
                )}-` +
              `${fromShifted
                .getUTCDate()
                .toString()
                .padStart(
                  2,
                  "0",
                )}T` +
              `${fromShifted
                .getUTCHours()
                .toString()
                .padStart(
                  2,
                  "0",
                )}:` +
              `${fromShifted
                .getUTCMinutes()
                .toString()
                .padStart(
                  2,
                  "0",
                )}`;

            const rowConversion =
              convertTimezoneTime({
                localDateTime:
                  rowLocalInput,

                fromTimezone,
                toTimezone,
              });

            return rowConversion
              ? {
                  index,
                  instant,
                  result:
                    rowConversion,
                }
              : null;
          },
        ).filter(
          (
            row,
          ): row is NonNullable<
            typeof row
          > =>
            row !==
            null,
        );
      },
      [
        conversionResult,
        fromTimezone,
        toTimezone,
      ],
    );

  function swapTimezones() {
    const nextFromTimezone =
      toTimezone;

    const nextToTimezone =
      fromTimezone;

    const nextDateTime =
      conversionResult
        ?.to
        .dateTimeInput ??
      localDateTime;

    setFromTimezone(
      nextFromTimezone,
    );

    setToTimezone(
      nextToTimezone,
    );

    setLocalDateTime(
      nextDateTime,
    );
  }

  return (
    <section className="mt-8">
      <Card
        variant="elevated"
        padding="lg"
        className="relative overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-20 -top-px h-px bg-gradient-to-r from-transparent via-primary-muted to-transparent"
        />

        <div className="relative">
          <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                From
              </p>

              <Card
                variant="soft"
                padding="md"
                className="mt-2 min-h-20"
              >
                <p className="text-xl font-bold text-text-primary">
                  {
                    fromTimezone.abbreviation
                  }
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  {
                    fromTimezone.name
                  }
                </p>
              </Card>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={
                swapTimezones
              }
              aria-label="Swap time zones"
              className="mx-auto h-12 w-12 rounded-xl px-0 text-lg"
            >
              ⇄
            </Button>

            <div>
              <p className="text-sm font-semibold text-text-primary">
                To
              </p>

              <Card
                variant="soft"
                padding="md"
                className="mt-2 min-h-20 border-primary-muted bg-primary-soft"
              >
                <p className="text-xl font-bold text-primary">
                  {
                    toTimezone.abbreviation
                  }
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  {
                    toTimezone.name
                  }
                </p>
              </Card>
            </div>
          </div>

          <Card
            variant="soft"
            padding="md"
            className="mt-6"
          >
            <label
              htmlFor="timezone-datetime"
              className="block text-sm font-semibold text-text-primary"
            >
              Date and time in{" "}
              {
                fromTimezone.abbreviation
              }
            </label>

            <input
              id="timezone-datetime"
              type="datetime-local"
              value={
                localDateTime
              }
              onChange={(
                event,
              ) =>
                setLocalDateTime(
                  event.target
                    .value,
                )
              }
              className="mt-3 h-14 w-full rounded-xl border border-border bg-surface px-4 text-text-primary shadow-sm outline-none transition [color-scheme:light] hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15"
            />

            <p className="mt-3 text-xs text-text-muted">
              Enter a local
              date and time
              using{" "}
              {
                fromTimezone.abbreviation
              }
              .
            </p>
          </Card>

          {conversionResult ? (
            <>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Card
                  as="article"
                  variant="default"
                  padding="lg"
                >
                  <Badge
                    variant="neutral"
                    size="sm"
                  >
                    {
                      conversionResult
                        .from
                        .abbreviation
                    }
                  </Badge>

                  <p className="mt-4 font-mono text-4xl font-bold tracking-tight text-text-primary tabular-nums">
                    {
                      conversionResult
                        .from
                        .formattedTime
                    }
                  </p>

                  <p className="mt-2 text-sm text-text-secondary">
                    {
                      conversionResult
                        .from
                        .formattedDate
                    }
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge
                      variant="neutral"
                      size="sm"
                    >
                      {
                        conversionResult
                          .from
                          .offsetLabel
                      }
                    </Badge>

                    <Badge
                      variant="neutral"
                      size="sm"
                    >
                      {fromTimezone.kind ===
                      "fixed"
                        ? "Fixed offset"
                        : "Seasonal zone"}
                    </Badge>
                  </div>
                </Card>

                <Card
                  as="article"
                  variant="soft"
                  padding="lg"
                  className="relative overflow-hidden border-primary-muted bg-primary-soft"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full bg-primary-muted/60 blur-3xl"
                  />

                  <div className="relative">
                    <Badge
                      variant="primary"
                      size="sm"
                    >
                      {
                        conversionResult
                          .to
                          .abbreviation
                      }
                    </Badge>

                    <p className="mt-4 font-mono text-4xl font-bold tracking-tight text-primary tabular-nums">
                      {
                        conversionResult
                          .to
                          .formattedTime
                      }
                    </p>

                    <p className="mt-2 text-sm text-text-secondary">
                      {
                        conversionResult
                          .to
                          .formattedDate
                      }
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Badge
                        variant="primary"
                        size="sm"
                      >
                        {
                          conversionResult
                            .to
                            .offsetLabel
                        }
                      </Badge>

                      <Badge
                        variant="primary"
                        size="sm"
                      >
                        {toTimezone.kind ===
                        "fixed"
                          ? "Fixed offset"
                          : "Seasonal zone"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </div>

              <Card
                variant="soft"
                padding="md"
                className="mt-4 text-center"
              >
                <p className="text-sm text-text-secondary">
                  Time difference
                </p>

                <p className="mt-2 text-xl font-semibold text-text-primary">
                  {
                    conversionResult.differenceLabel
                  }
                </p>
              </Card>

              <Card
                as="section"
                variant="default"
                padding="none"
                className="mt-6 overflow-hidden"
              >
                <div className="flex flex-col gap-3 border-b border-border bg-surface-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <Badge
                      variant="info"
                      size="sm"
                    >
                      Hourly comparison
                    </Badge>

                    <h2 className="mt-3 text-xl font-semibold text-text-primary">
                      24-hour conversion table
                    </h2>

                    <p className="mt-1 text-sm text-text-secondary">
                      Compare each
                      hour in{" "}
                      {
                        fromTimezone.abbreviation
                      }{" "}
                      with{" "}
                      {
                        toTimezone.abbreviation
                      }
                      .
                    </p>
                  </div>

                  <Badge
                    variant="neutral"
                    size="md"
                  >
                    24 hours
                  </Badge>
                </div>

                <div className="max-h-[580px] overflow-auto">
                  <table className="w-full min-w-[620px] border-collapse text-left">
                    <thead className="sticky top-0 z-10 bg-surface">
                      <tr className="border-b border-border">
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                          Hour
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                          {
                            fromTimezone.abbreviation
                          }
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                          {
                            toTimezone.abbreviation
                          }
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-text-muted">
                          Difference
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {timeline.map(
                        ({
                          index,
                          result,
                        }) => (
                          <tr
                            key={`${result.instant.toISOString()}-${index}`}
                            className="border-b border-border-soft transition last:border-b-0 hover:bg-surface-soft"
                          >
                            <td className="px-5 py-4">
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

                                  index ===
                                  0
                                    ? "bg-primary text-white"
                                    : "border border-border bg-surface-soft text-text-secondary",
                                ].join(
                                  " ",
                                )}
                              >
                                {
                                  index
                                }
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-semibold text-text-primary">
                                {
                                  result
                                    .from
                                    .formattedTime
                                }
                              </p>

                              <p className="mt-1 text-xs text-text-muted">
                                {
                                  result
                                    .from
                                    .formattedDate
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <p className="font-semibold text-primary">
                                {
                                  result
                                    .to
                                    .formattedTime
                                }
                              </p>

                              <p className="mt-1 text-xs text-text-muted">
                                {
                                  result
                                    .to
                                    .formattedDate
                                }
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <Badge
                                variant="neutral"
                                size="sm"
                              >
                                {getDifferenceBadge(
                                  result.differenceMinutes,
                                )}
                              </Badge>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          ) : (
            <Card
              variant="soft"
              padding="md"
              className="mt-6 border-danger/20 bg-danger-soft text-center"
            >
              <p className="font-medium text-danger">
                Please enter a
                valid date and
                time.
              </p>
            </Card>
          )}
        </div>
      </Card>
    </section>
  );
}