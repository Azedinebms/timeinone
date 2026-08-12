"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  zonedDateTimeToDate,
} from "@/lib/time-engine";

import type {
  MeetingParticipant,
  MeetingParticipantComfort,
  MeetingRecommendation,
} from "../types";

const HOURS_IN_DAY =
  24;

const HOUR_IN_MILLISECONDS =
  60 * 60 * 1_000;

const SECOND_IN_MILLISECONDS =
  1_000;

const DESKTOP_CITY_COLUMN_WIDTH =
  220;

const TABLET_CITY_COLUMN_WIDTH =
  176;

const MOBILE_CITY_COLUMN_WIDTH =
  124;

const DESKTOP_HOUR_COLUMN_WIDTH =
  72;

const TABLET_HOUR_COLUMN_WIDTH =
  64;

const MOBILE_HOUR_COLUMN_WIDTH =
  58;

const DAY_START_HOUR =
  6;

const DAY_END_HOUR =
  23;

const IDEAL_WORKDAY_CENTER =
  13;

type MeetingTimelineProps = {
  participants?:
    MeetingParticipant[];

  date?: string;

  recommendations?:
    MeetingRecommendation[];

  selectedRecommendationId?:
    string | null;

  onSelectRecommendation?: (
    recommendation:
      MeetingRecommendation,
  ) => void;
};

type LocalDateTimeParts = {
  year: number;
  month: number;
  day: number;

  hour: number;
  minute: number;
  second: number;

  weekdayIndex: number;
  weekdayLabel: string;

  dateKey: string;
};

type TimelineCell = {
  instant: Date;

  formattedHour: string;
  weekdayLabel: string;

  comfort:
    MeetingParticipantComfort;

  comfortScore: number;

  isInsideBusinessHours:
    boolean;

  isRecommended:
    boolean;

  isSelected:
    boolean;

  isDifferentDay:
    boolean;

  recommendation:
    MeetingRecommendation | null;
};

type TimelineRow = {
  participant:
    MeetingParticipant;

  cells:
    TimelineCell[];
};

type TeamComfortCell = {
  instant: Date;

  averageScore: number;

  formattedScore: string;

  recommendation:
    MeetingRecommendation | null;

  isRecommended: boolean;
  isSelected: boolean;
};

type TimelineMarker = {
  left: number;
  label: string;
};

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

function parseNumericPart(
  parts:
    Intl.DateTimeFormatPart[],

  type:
    Intl.DateTimeFormatPartTypes,
): number {
  const value =
    parts.find(
      (part) =>
        part.type ===
        type,
    )?.value;

  return Number(
    value ?? 0,
  );
}

function getWeekdayIndex(
  weekdayLabel: string,
): number {
  const normalizedValue =
    weekdayLabel
      .slice(
        0,
        3,
      )
      .toLowerCase();

  const weekdays = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ];

  const index =
    weekdays.indexOf(
      normalizedValue,
    );

  return index >= 0
    ? index
    : 0;
}

function getLocalDateTimeParts(
  instant: Date,
  timeZone: string,
): LocalDateTimeParts {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone,

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",

        weekday:
          "short",

        hour:
          "2-digit",

        minute:
          "2-digit",

        second:
          "2-digit",

        hourCycle:
          "h23",
      },
    );

  const parts =
    formatter.formatToParts(
      instant,
    );

  const year =
    parseNumericPart(
      parts,
      "year",
    );

  const month =
    parseNumericPart(
      parts,
      "month",
    );

  const day =
    parseNumericPart(
      parts,
      "day",
    );

  const rawHour =
    parseNumericPart(
      parts,
      "hour",
    );

  const minute =
    parseNumericPart(
      parts,
      "minute",
    );

  const second =
    parseNumericPart(
      parts,
      "second",
    );

  const weekdayLabel =
    parts.find(
      (part) =>
        part.type ===
        "weekday",
    )?.value ?? "";

  return {
    year,
    month,
    day,

    hour:
      rawHour === 24
        ? 0
        : rawHour,

    minute,
    second,

    weekdayIndex:
      getWeekdayIndex(
        weekdayLabel,
      ),

    weekdayLabel,

    dateKey: [
      String(
        year,
      ).padStart(
        4,
        "0",
      ),

      String(
        month,
      ).padStart(
        2,
        "0",
      ),

      String(
        day,
      ).padStart(
        2,
        "0",
      ),
    ].join("-"),
  };
}

function formatHour(
  hour: number,
  minute: number,
): string {
  return [
    String(
      hour,
    ).padStart(
      2,
      "0",
    ),

    String(
      minute,
    ).padStart(
      2,
      "0",
    ),
  ].join(":");
}

function formatHeaderHour(
  hour: number,
): {
  value: string;
  period: "AM" | "PM";
} {
  const normalizedHour =
    ((hour % 24) + 24) % 24;

  return {
    value: String(
      normalizedHour % 12 || 12,
    ),

    period:
      normalizedHour < 12
        ? "AM"
        : "PM",
  };
}

function formatLiveTime(
  instant: Date,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone,

      hour:
        "numeric",

      minute:
        "2-digit",

      second:
        "2-digit",
    },
  ).format(
    instant,
  );
}

function formatMarkerTime(
  instant: Date,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone,

      hour:
        "numeric",

      minute:
        "2-digit",

      second:
        "2-digit",
    },
  ).format(
    instant,
  );
}

function formatFullDateTime(
  instant: Date,
  timeZone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone,

      weekday:
        "long",

      year:
        "numeric",

      month:
        "long",

      day:
        "numeric",

      hour:
        "numeric",

      minute:
        "2-digit",

      timeZoneName:
        "short",
    },
  ).format(
    instant,
  );
}

function isWorkingDay(
  weekdayIndex: number,
  participant:
    MeetingParticipant,
): boolean {
  return participant
    .businessHours
    .workingDays
    .includes(
      weekdayIndex,
    );
}

function getComfortScore({
  participant,
  hour,
  minute,
  weekdayIndex,
}: {
  participant:
    MeetingParticipant;

  hour: number;
  minute: number;

  weekdayIndex: number;
}): number {
  const decimalHour =
    hour +
    minute / 60;

  const {
    startHour,
    endHour,
  } =
    participant.businessHours;

  const workingDay =
    isWorkingDay(
      weekdayIndex,
      participant,
    );

  const insideWorkingHours =
    workingDay &&
    decimalHour >=
      startHour &&
    decimalHour <
      endHour;

  if (
    insideWorkingHours
  ) {
    const workdayCenter =
      (
        startHour +
        endHour
      ) / 2;

    const maximumDistance =
      Math.max(
        workdayCenter -
          startHour,

        endHour -
          workdayCenter,

        1,
      );

    const distanceFromCenter =
      Math.abs(
        decimalHour -
          workdayCenter,
      );

    const centerScore =
      100 -
      (
        distanceFromCenter /
        maximumDistance
      ) *
        22;

    return Math.round(
      clamp(
        centerScore,
        76,
        100,
      ),
    );
  }

  if (
    !workingDay &&
    decimalHour >=
      startHour &&
    decimalHour <
      endHour
  ) {
    const distanceFromIdealCenter =
      Math.abs(
        decimalHour -
          IDEAL_WORKDAY_CENTER,
      );

    return Math.round(
      clamp(
        74 -
          distanceFromIdealCenter *
            3,
        58,
        74,
      ),
    );
  }

  if (
    decimalHour <
    startHour
  ) {
    const hoursBeforeWork =
      startHour -
      decimalHour;

    if (
      decimalHour <
      DAY_START_HOUR
    ) {
      return Math.round(
        clamp(
          18 -
            (
              DAY_START_HOUR -
              decimalHour
            ) *
              5,
          0,
          18,
        ),
      );
    }

    return Math.round(
      clamp(
        65 -
          hoursBeforeWork *
            13,
        20,
        65,
      ),
    );
  }

  if (
    decimalHour >=
    endHour
  ) {
    const hoursAfterWork =
      decimalHour -
      endHour;

    if (
      decimalHour >=
      DAY_END_HOUR
    ) {
      return Math.round(
        clamp(
          14 -
            (
              decimalHour -
              DAY_END_HOUR
            ) *
              5,
          0,
          14,
        ),
      );
    }

    return Math.round(
      clamp(
        64 -
          hoursAfterWork *
            12,
        18,
        64,
      ),
    );
  }

  return 0;
}

function getComfortFromScore(
  score: number,
): MeetingParticipantComfort {
  if (
    score >= 70
  ) {
    return "ideal";
  }

  if (
    score >= 40
  ) {
    return "early";
  }

  if (
    score >= 20
  ) {
    return "late";
  }

  return "uncomfortable";
}

function getHeatmapColorClasses(
  score: number,
): string {
  if (
    score >= 90
  ) {
    return [
      "bg-emerald-200",
      "text-emerald-950",
      "shadow-[inset_0_0_18px_rgba(16,185,129,0.10)]",
    ].join(" ");
  }

  if (
    score >= 75
  ) {
    return [
      "bg-emerald-100",
      "text-emerald-950",
    ].join(" ");
  }

  if (
    score >= 60
  ) {
    return [
      "bg-lime-100",
      "text-lime-950",
    ].join(" ");
  }

  if (
    score >= 45
  ) {
    return [
      "bg-amber-100",
      "text-amber-950",
    ].join(" ");
  }

  if (
    score >= 25
  ) {
    return [
      "bg-orange-100",
      "text-orange-950",
    ].join(" ");
  }

  if (
    score >= 10
  ) {
    return [
      "bg-rose-100",
      "text-rose-950",
    ].join(" ");
  }

  return [
    "bg-slate-900",
    "text-slate-100",
  ].join(" ");
}

function getTeamHeatmapClasses(
  score: number,
): string {
  if (
    score >= 90
  ) {
    return [
      "bg-emerald-200",
      "text-emerald-950",
      "shadow-[inset_0_0_18px_rgba(16,185,129,0.12)]",
    ].join(" ");
  }

  if (
    score >= 75
  ) {
    return [
      "bg-emerald-100",
      "text-emerald-950",
    ].join(" ");
  }

  if (
    score >= 60
  ) {
    return [
      "bg-lime-100",
      "text-lime-950",
    ].join(" ");
  }

  if (
    score >= 45
  ) {
    return [
      "bg-amber-100",
      "text-amber-950",
    ].join(" ");
  }

  if (
    score >= 25
  ) {
    return [
      "bg-orange-100",
      "text-orange-950",
    ].join(" ");
  }

  return [
    "bg-rose-100",
    "text-rose-950",
  ].join(" ");
}

function getCellClasses(
  cell: TimelineCell,
): string {
  const classes = [
    "relative",
    "flex",
    "h-[78px]",
    "flex-col",
    "items-center",
    "justify-center",
    "border-r",
    "border-slate-800",
    "px-2",
    "text-center",
    "transition-all",
    "duration-200",

    getHeatmapColorClasses(
      cell.comfortScore,
    ),
  ];

  if (
    cell.isSelected
  ) {
    classes.push(
      "z-10",
      "ring-2",
      "ring-inset",
      "ring-violet-400",
      "brightness-125",
    );
  } else if (
    cell.isRecommended
  ) {
    classes.push(
      "z-10",
      "cursor-pointer",
      "ring-1",
      "ring-inset",
      "ring-blue-500/60",
      "hover:brightness-125",
      "hover:ring-2",
      "hover:ring-violet-400",
    );
  }

  return classes.join(
    " ",
  );
}

function createStartInstant(
  date: string,
  firstParticipant:
    MeetingParticipant,
): Date | null {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      date,
    )
  ) {
    return null;
  }

  try {
    return zonedDateTimeToDate(
      `${date}T00:00`,
      firstParticipant.city
        .timezone.name,
    );
  } catch {
    return null;
  }
}

function getHourBucket(
  timestamp: number,
): number {
  return Math.floor(
    timestamp /
      HOUR_IN_MILLISECONDS,
  );
}

function createRecommendationMap(
  recommendations:
    MeetingRecommendation[],
): Map<
  number,
  MeetingRecommendation
> {
  const map =
    new Map<
      number,
      MeetingRecommendation
    >();

  for (
    const recommendation
    of recommendations
  ) {
    const bucket =
      getHourBucket(
        recommendation.instant
          .getTime(),
      );

    const existing =
      map.get(
        bucket,
      );

    if (
      !existing ||
      recommendation.score >
        existing.score
    ) {
      map.set(
        bucket,
        recommendation,
      );
    }
  }

  return map;
}

function buildTimelineRows({
  participants,
  startInstant,
  recommendations,
  selectedRecommendationId,
}: {
  participants:
    MeetingParticipant[];

  startInstant: Date;

  recommendations:
    MeetingRecommendation[];

  selectedRecommendationId:
    string | null;
}): TimelineRow[] {
  const firstParticipant =
    participants[0];

  if (!firstParticipant) {
    return [];
  }

  const recommendationMap =
    createRecommendationMap(
      recommendations,
    );

  const referenceDate =
    getLocalDateTimeParts(
      startInstant,
      firstParticipant.city
        .timezone.name,
    ).dateKey;

  return participants.map(
    (participant) => {
      const timeZone =
        participant.city
          .timezone.name;

      const cells =
        Array.from(
          {
            length:
              HOURS_IN_DAY,
          },
          (
            _,
            hourIndex,
          ) => {
            const instant =
              new Date(
                startInstant.getTime() +
                  hourIndex *
                    HOUR_IN_MILLISECONDS,
              );

            const localParts =
              getLocalDateTimeParts(
                instant,
                timeZone,
              );

            const score =
              getComfortScore({
                participant,

                hour:
                  localParts.hour,

                minute:
                  localParts.minute,

                weekdayIndex:
                  localParts.weekdayIndex,
              });

            const workingDay =
              isWorkingDay(
                localParts.weekdayIndex,
                participant,
              );

            const decimalHour =
              localParts.hour +
              localParts.minute /
                60;

            const isInsideBusinessHours =
              workingDay &&
              decimalHour >=
                participant
                  .businessHours
                  .startHour &&
              decimalHour <
                participant
                  .businessHours
                  .endHour;

            const recommendation =
              recommendationMap.get(
                getHourBucket(
                  instant.getTime(),
                ),
              ) ?? null;

            return {
              instant,

              formattedHour:
                formatHour(
                  localParts.hour,
                  localParts.minute,
                ),

              weekdayLabel:
                localParts.weekdayLabel,

              comfort:
                getComfortFromScore(
                  score,
                ),

              comfortScore:
                score,

              isInsideBusinessHours,

              isRecommended:
                recommendation !==
                null,

              isSelected:
                recommendation?.id ===
                selectedRecommendationId,

              isDifferentDay:
                localParts.dateKey !==
                referenceDate,

              recommendation,
            };
          },
        );

      return {
        participant,
        cells,
      };
    },
  );
}

function buildTeamComfortCells({
  rows,
  recommendations,
  selectedRecommendationId,
}: {
  rows:
    TimelineRow[];

  recommendations:
    MeetingRecommendation[];

  selectedRecommendationId:
    string | null;
}): TeamComfortCell[] {
  if (
    rows.length ===
    0
  ) {
    return [];
  }

  const recommendationMap =
    createRecommendationMap(
      recommendations,
    );

  return Array.from(
    {
      length:
        HOURS_IN_DAY,
    },
    (
      _,
      hourIndex,
    ) => {
      const rowCells =
        rows
          .map(
            (row) =>
              row.cells[
                hourIndex
              ],
          )
          .filter(
            (
              cell,
            ): cell is TimelineCell =>
              Boolean(
                cell,
              ),
          );

      const totalScore =
        rowCells.reduce(
          (
            total,
            cell,
          ) =>
            total +
            cell.comfortScore,
          0,
        );

      const averageScore =
        rowCells.length >
        0
          ? Math.round(
              totalScore /
                rowCells.length,
            )
          : 0;

      const instant =
        rowCells[0]?.instant ??
        new Date();

      const recommendation =
        recommendationMap.get(
          getHourBucket(
            instant.getTime(),
          ),
        ) ?? null;

      return {
        instant,

        averageScore,

        formattedScore:
          `${averageScore}%`,

        recommendation,

        isRecommended:
          recommendation !==
          null,

        isSelected:
          recommendation?.id ===
          selectedRecommendationId,
      };
    },
  );
}

function createMarker({
  instant,
  startInstant,
  label,
  cityColumnWidth,
  hourColumnWidth,
}: {
  instant: Date;

  startInstant: Date;

  label: string;

  cityColumnWidth: number;
  hourColumnWidth: number;
}): TimelineMarker | null {
  const elapsedMilliseconds =
    instant.getTime() -
    startInstant.getTime();

  const progress =
    elapsedMilliseconds /
    (
      HOURS_IN_DAY *
      HOUR_IN_MILLISECONDS
    );

  if (
    progress < 0 ||
    progress > 1
  ) {
    return null;
  }

  return {
    left:
      cityColumnWidth +
      progress *
        (
          HOURS_IN_DAY *
          hourColumnWidth
        ),

    label,
  };
}

export default function MeetingTimeline({
  participants = [],
  date = "",
  recommendations = [],
  selectedRecommendationId =
    null,
  onSelectRecommendation,
}: MeetingTimelineProps) {
  const scrollContainerRef =
    useRef<
      HTMLDivElement | null
    >(null);

  const [
    currentInstant,
    setCurrentInstant,
  ] = useState(
    () =>
      new Date(),
  );

  const [
    viewportWidth,
    setViewportWidth,
  ] = useState(
    DESKTOP_CITY_COLUMN_WIDTH *
      6,
  );

  const [
    hoveredHourIndex,
    setHoveredHourIndex,
  ] = useState<
    number | null
  >(null);

  useEffect(() => {
    function updateViewportWidth():
      void {
      setViewportWidth(
        window.innerWidth,
      );
    }

    updateViewportWidth();

    window.addEventListener(
      "resize",
      updateViewportWidth,
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateViewportWidth,
      );
    };
  }, []);

  const timelineMetrics =
    useMemo(
      () => {
        if (
          viewportWidth < 640
        ) {
          return {
            cityColumnWidth:
              MOBILE_CITY_COLUMN_WIDTH,

            hourColumnWidth:
              MOBILE_HOUR_COLUMN_WIDTH,
          };
        }

        if (
          viewportWidth < 1024
        ) {
          return {
            cityColumnWidth:
              TABLET_CITY_COLUMN_WIDTH,

            hourColumnWidth:
              TABLET_HOUR_COLUMN_WIDTH,
          };
        }

        return {
          cityColumnWidth:
            DESKTOP_CITY_COLUMN_WIDTH,

          hourColumnWidth:
            DESKTOP_HOUR_COLUMN_WIDTH,
        };
      },
      [
        viewportWidth,
      ],
    );

  const {
    cityColumnWidth,
    hourColumnWidth,
  } = timelineMetrics;

  const timelineWidth =
    HOURS_IN_DAY *
    hourColumnWidth;

  const totalGridWidth =
    cityColumnWidth +
    timelineWidth;

  const gridTemplateColumns =
    `${cityColumnWidth}px repeat(${HOURS_IN_DAY}, ${hourColumnWidth}px)`;

  useEffect(() => {
    let intervalId:
      number | null = null;

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
          SECOND_IN_MILLISECONDS,
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

  const firstParticipant =
    participants[0] ??
    null;

  const startInstant =
    useMemo(
      () => {
        if (
          !firstParticipant
        ) {
          return null;
        }

        return createStartInstant(
          date,
          firstParticipant,
        );
      },
      [
        date,
        firstParticipant,
      ],
    );

  const selectedRecommendation =
    useMemo(
      () => {
        if (
          selectedRecommendationId
        ) {
          return (
            recommendations.find(
              (recommendation) =>
                recommendation.id ===
                selectedRecommendationId,
            ) ?? null
          );
        }

        return (
          recommendations[0] ??
          null
        );
      },
      [
        recommendations,
        selectedRecommendationId,
      ],
    );

  const rows =
    useMemo(
      () => {
        if (
          !startInstant
        ) {
          return [];
        }

        return buildTimelineRows({
          participants,
          startInstant,
          recommendations,
          selectedRecommendationId,
        });
      },
      [
        participants,
        recommendations,
        selectedRecommendationId,
        startInstant,
      ],
    );

  const teamComfortCells =
    useMemo(
      () =>
        buildTeamComfortCells({
          rows,
          recommendations,
          selectedRecommendationId,
        }),
      [
        recommendations,
        rows,
        selectedRecommendationId,
      ],
    );

  const bestTeamComfort =
    useMemo(
      () =>
        teamComfortCells.reduce(
          (
            highestScore,
            cell,
          ) =>
            Math.max(
              highestScore,
              cell.averageScore,
            ),
          0,
        ),
      [
        teamComfortCells,
      ],
    );

  const currentMarker =
    useMemo(
      () => {
        if (
          !startInstant ||
          !firstParticipant
        ) {
          return null;
        }

        return createMarker({
          instant:
            currentInstant,

          startInstant,

          label:
            `Now · ${formatMarkerTime(
              currentInstant,
              firstParticipant.city
                .timezone.name,
            )}`,

          cityColumnWidth,
          hourColumnWidth,
        });
      },
      [
        cityColumnWidth,
        currentInstant,
        firstParticipant,
        hourColumnWidth,
        startInstant,
      ],
    );

  const selectedMarker =
    useMemo(
      () => {
        if (
          !startInstant ||
          !selectedRecommendation ||
          !firstParticipant
        ) {
          return null;
        }

        return createMarker({
          instant:
            selectedRecommendation
              .instant,

          startInstant,

          label:
            `${selectedRecommendationId
              ? "Selected"
              : "Best"} · ${formatMarkerTime(
              selectedRecommendation
                .instant,
              firstParticipant.city
                .timezone.name,
            )}`,

          cityColumnWidth,
          hourColumnWidth,
        });
      },
      [
        cityColumnWidth,
        firstParticipant,
        hourColumnWidth,
        selectedRecommendation,
        selectedRecommendationId,
        startInstant,
      ],
    );

  const scrollToMarker =
    useCallback(
      (
        marker:
          TimelineMarker,
        behavior:
          ScrollBehavior =
            "smooth",
      ): void => {
        const container =
          scrollContainerRef.current;

        if (!container) {
          return;
        }

        const targetPosition =
          marker.left -
          cityColumnWidth -
          (
            container.clientWidth -
            cityColumnWidth
          ) /
            2;

        container.scrollTo({
          left:
            Math.max(
              0,
              targetPosition,
            ),

          behavior,
        });
      },
      [
        cityColumnWidth,
      ],
    );

  useEffect(() => {
    if (
      !selectedMarker
    ) {
      return;
    }

    const timer =
      window.setTimeout(
        () => {
          scrollToMarker(
            selectedMarker,
          );
        },
        120,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    scrollToMarker,
    selectedMarker,
  ]);

  function handleRecommendationSelection(
    recommendation:
      MeetingRecommendation | null,
  ): void {
    if (
      !recommendation ||
      !onSelectRecommendation
    ) {
      return;
    }

    onSelectRecommendation(
      recommendation,
    );
  }

  if (
  participants.length <
  2
) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-soft p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-info/20 bg-info-soft text-xl text-info">
        ◷
      </div>

      <p className="mt-4 font-semibold text-text-primary">
        Add at least two cities
      </p>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-secondary">
        The animated meeting
        heatmap will appear once
        two participant cities have
        been selected.
      </p>
    </div>
  );
}

if (
  !startInstant ||
  rows.length ===
    0
) {
  return (
    <div className="rounded-2xl border border-warning/20 bg-warning-soft p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-warning/20 bg-surface text-xl font-bold text-warning">
        !
      </div>

      <p className="mt-4 font-semibold text-warning">
        Heatmap unavailable
      </p>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-text-secondary">
        Choose a valid meeting
        date.
      </p>
    </div>
  );
}

  return (
    <div className="min-w-0">
      <div className="mb-5 rounded-2xl border border-border bg-surface-soft p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-primary">
                Comfort scale
              </p>

              <span className="text-xs text-text-muted">
                Higher scores mean better local meeting conditions.
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3.5 py-2 shadow-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />

                <span className="text-xs font-bold text-slate-900">
                  Excellent
                </span>

                <span className="text-xs font-semibold text-slate-600">
                  75–100
                </span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-lime-300 bg-lime-50 px-3.5 py-2 shadow-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime-500" />

                <span className="text-xs font-bold text-slate-900">
                  Comfortable
                </span>

                <span className="text-xs font-semibold text-slate-600">
                  60–74
                </span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-2 shadow-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />

                <span className="text-xs font-bold text-slate-900">
                  Compromise
                </span>

                <span className="text-xs font-semibold text-slate-600">
                  40–59
                </span>
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-rose-50 px-3.5 py-2 shadow-sm">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" />

                <span className="text-xs font-bold text-slate-900">
                  Difficult
                </span>

                <span className="text-xs font-semibold text-slate-600">
                  0–39
                </span>
              </span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <div className="flex h-14 min-w-[190px] items-center justify-between gap-4 rounded-2xl border border-primary-muted bg-white px-4 shadow-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                  Best team comfort
                </p>

                <p className="mt-0.5 text-xs font-medium text-text-secondary">
                  Highest score today
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-muted bg-primary-soft">
                <span className="text-sm font-black tabular-nums text-primary">
                  {bestTeamComfort}%
                </span>
              </div>
            </div>

            {currentMarker && (
              <button
                type="button"
                onClick={() => {
                  scrollToMarker(
                    currentMarker,
                  );
                }}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 text-sm font-bold text-cyan-800 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20"
              >
                <span
                  aria-hidden="true"
                  className="relative flex h-2.5 w-2.5"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-50" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-600" />
                </span>

                Jump to now
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-md shadow-slate-200/50">
        <div
          ref={
            scrollContainerRef
          }
          className="overflow-x-auto scroll-smooth overscroll-x-contain [scrollbar-color:rgba(148,163,184,0.9)_rgba(241,245,249,0.95)] [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]"
        >
          <div
            className="relative"
            style={{
              minWidth:
                `${totalGridWidth}px`,
            }}
          >
            {currentMarker && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 top-0 z-40 transition-[left] duration-1000 ease-linear"
                style={{
                  left:
                    `${currentMarker.left}px`,
                }}
              >
                <div className="absolute bottom-0 top-0 w-0.5 bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.45)]" />

                <div className="absolute -left-2 bottom-0 top-0 w-4 bg-cyan-400/10 blur-sm" />

                <span className="absolute left-1/2 top-1 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-500/30 bg-cyan-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />

                  {
                    currentMarker.label
                  }
                </span>
              </div>
            )}

            {selectedMarker && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 top-0 z-30 transition-[left] duration-500 ease-out"
                style={{
                  left:
                    `${selectedMarker.left}px`,
                }}
              >
                <div className="absolute bottom-0 top-0 w-0.5 bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.4)]" />

                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-violet-500/30 bg-violet-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                  {
                    selectedMarker.label
                  }
                </span>
              </div>
            )}

            <div className="sticky top-0 z-20 grid border-b border-slate-300 bg-white/95 backdrop-blur"
              style={{
                gridTemplateColumns,
              }}>
              <div className="sticky left-0 z-50 flex h-16 items-center border-r border-slate-300 bg-white px-2.5 shadow-[8px_0_16px_rgba(15,23,42,0.06)] sm:px-4">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                  City
                </span>
              </div>

              {Array.from(
                {
                  length:
                    HOURS_IN_DAY,
                },
                (
                  _,
                  hour,
                ) => (
                  <div
                    key={
                      hour
                    }
                    onMouseEnter={() => {
                      setHoveredHourIndex(
                        hour,
                      );
                    }}
                    onMouseLeave={() => {
                      setHoveredHourIndex(
                        null,
                      );
                    }}
                    className={[
                      "flex",
                      "h-16",
                      "snap-start",
                      "flex-col",
                      "items-center",
                      "justify-center",
                      "border-r",
                      "border-slate-800",
                      "px-1",
                      "transition-colors",
                      hour > 0 &&
                      hour % 6 === 0
                        ? "border-l-2 border-l-slate-600"
                        : "",

                      hoveredHourIndex ===
                      hour
                        ? "bg-primary-soft"
                        : "",
                    ].join(" ")}
                    style={{
                      minWidth:
                        `${hourColumnWidth}px`,
                    }}
                  >
                    <span className="text-sm font-semibold tabular-nums text-text-primary">
                      {formatHeaderHour(
                        hour,
                      ).value}
                    </span>

                    <span className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-text-muted">
                      {formatHeaderHour(
                        hour,
                      ).period}
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="grid border-b border-slate-700"
              style={{
                gridTemplateColumns,
              }}>
              <div className="sticky left-0 z-50 flex h-[72px] min-w-0 items-center border-r border-slate-300 bg-white px-2.5 shadow-[10px_0_18px_rgba(15,23,42,0.08)] sm:px-4">
                <div>
                  <p className="truncate text-xs font-semibold text-text-primary sm:text-sm">
                    Team comfort
                  </p>

                  <p className="mt-1 hidden text-[11px] text-text-muted sm:block">
                    Average score
                  </p>
                </div>
              </div>

              {teamComfortCells.map(
                (
                  cell,
                  index,
                ) => {
                  const clickable =
                    Boolean(
                      cell.recommendation &&
                      onSelectRecommendation,
                    );

                  const className = [
                    "relative",
                    "flex",
                    "h-[72px]",
                    "flex-col",
                    "items-center",
                    "justify-center",
                    "border-r",
                    "border-slate-800",
                    "text-center",
                    "transition-all",
                    "duration-200",

                    getTeamHeatmapClasses(
                      cell.averageScore,
                    ),

                    index > 0 &&
                    index % 6 === 0
                      ? "border-l-2 border-l-slate-600"
                      : "",

                    clickable
                      ? [
                          "cursor-pointer",
                          "hover:brightness-125",
                          "hover:ring-2",
                          "hover:ring-inset",
                          "hover:ring-violet-400",
                        ].join(" ")
                      : "",

                    cell.isSelected
                      ? [
                          "z-10",
                          "ring-2",
                          "ring-inset",
                          "ring-violet-400",
                          "brightness-125",
                        ].join(" ")
                      : "",

                    !cell.isSelected &&
                    cell.isRecommended
                      ? [
                          "ring-1",
                          "ring-inset",
                          "ring-blue-500/70",
                        ].join(" ")
                      : "",
                  ].join(" ");

                  const content = (
                    <>
                      <span className="text-base font-bold tabular-nums">
                        {
                          cell.formattedScore
                        }
                      </span>

                      <span className="mt-1 text-[9px] font-bold uppercase tracking-wide opacity-80">
                        Team
                      </span>

                      <span className="mt-1.5 h-1 w-9 overflow-hidden rounded-full bg-black/20">
                        <span
                          className="block h-full rounded-full bg-slate-700/70 transition-[width] duration-300"
                          style={{
                            width:
                              `${cell.averageScore}%`,
                          }}
                        />
                      </span>

                      {cell.isRecommended && (
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-400" />
                      )}
                    </>
                  );

                  if (
                    clickable
                  ) {
                    return (
                      <button
                        key={`${cell.instant.toISOString()}-${index}`}
                        type="button"
                        title={`Select this recommendation · Team comfort ${cell.averageScore}%`}
                        aria-label={`Select recommended meeting time with a team comfort score of ${cell.averageScore} percent`}
                        onClick={() => {
                          handleRecommendationSelection(
                            cell.recommendation,
                          );
                        }}
                        onMouseEnter={() => {
                          setHoveredHourIndex(
                            index,
                          );
                        }}
                        onMouseLeave={() => {
                          setHoveredHourIndex(
                            null,
                          );
                        }}
                        className={[
                          className,
                          "snap-start",
                          hoveredHourIndex ===
                          index
                            ? "brightness-125 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.45)]"
                            : "",
                        ].join(" ")}
                        style={{
                          minWidth:
                            `${hourColumnWidth}px`,
                        }}
                      >
                        {content}
                      </button>
                    );
                  }

                  return (
                    <div
                      key={`${cell.instant.toISOString()}-${index}`}
                      title={`Team comfort: ${cell.averageScore}%`}
                      onMouseEnter={() => {
                        setHoveredHourIndex(
                          index,
                        );
                      }}
                      onMouseLeave={() => {
                        setHoveredHourIndex(
                          null,
                        );
                      }}
                      className={[
                        className,
                        "snap-start",
                        hoveredHourIndex ===
                        index
                          ? "brightness-125 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.45)]"
                          : "",
                      ].join(" ")}
                      style={{
                        minWidth:
                          `${hourColumnWidth}px`,
                      }}
                    >
                      {content}
                    </div>
                  );
                },
              )}
            </div>

            {rows.map(
              ({
                participant,
                cells,
              }) => (
                <div
                  key={
                    participant.id
                  }
                  className="grid border-b border-slate-800 last:border-b-0"
                  style={{
                    gridTemplateColumns,
                  }}
                >
                  <div className="sticky left-0 z-50 flex h-[78px] min-w-0 items-center border-r border-slate-300 bg-white px-2.5 shadow-[10px_0_18px_rgba(15,23,42,0.08)] sm:px-4">
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-xs font-semibold text-text-primary sm:text-sm">
                          {
                            participant
                              .city.name
                          }
                        </span>

                        <span className="shrink-0 rounded-md border border-border bg-surface-soft px-1.5 py-0.5 text-[9px] font-bold uppercase text-text-muted">
                          {
                            participant
                              .city.country
                              .iso2
                          }
                        </span>
                      </div>

                      <p className="mt-1 hidden truncate text-[11px] text-text-muted sm:block">
                        {
                          participant
                            .city.timezone
                            .name
                        }
                      </p>

                      <p className="mt-1 truncate text-[10px] font-semibold tabular-nums text-primary sm:text-[11px]">
                        {formatLiveTime(
                          currentInstant,
                          participant.city
                            .timezone.name,
                        )}
                      </p>
                    </div>
                  </div>

                  {cells.map(
                    (
                      cell,
                      hourIndex,
                    ) => {
                      const clickable =
                        Boolean(
                          cell.recommendation &&
                          onSelectRecommendation,
                        );

                      const content = (
                        <>
                          {cell.isSelected && (
                            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(196,181,253,0.9)]" />
                          )}

                          {!cell.isSelected &&
                            cell.isRecommended && (
                              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-400" />
                            )}

                          <span className="text-sm font-semibold tabular-nums">
                            {
                              cell.formattedHour
                            }
                          </span>

                          <span className="mt-1 text-[10px] font-extrabold tabular-nums opacity-90">
                            {
                              cell.comfortScore
                            }%
                          </span>

                          <span className="mt-1 h-1 w-8 overflow-hidden rounded-full bg-black/20">
                            <span
                              className="block h-full rounded-full bg-slate-700/70 transition-[width] duration-300"
                              style={{
                                width:
                                  `${cell.comfortScore}%`,
                              }}
                            />
                          </span>

                          <span
                            className={[
                              "mt-0.5",
                              "text-[8px]",
                              "font-semibold",
                              "uppercase",
                              "tracking-wide",

                              cell.isDifferentDay
                                ? "text-violet-700"
                                : "opacity-70",
                            ].join(" ")}
                          >
                            {
                              cell.weekdayLabel
                            }
                          </span>
                        </>
                      );

                      if (
                        clickable
                      ) {
                        return (
                          <button
                            key={`${participant.id}-${cell.instant.toISOString()}`}
                            type="button"
                            title={`${formatFullDateTime(
                              cell.instant,
                              participant.city
                                .timezone.name,
                            )} · Comfort ${cell.comfortScore}%`}
                            aria-label={`Select recommended time at ${cell.formattedHour} in ${participant.city.name}. Comfort score ${cell.comfortScore} percent.`}
                            onClick={() => {
                              handleRecommendationSelection(
                                cell.recommendation,
                              );
                            }}
                            onMouseEnter={() => {
                              setHoveredHourIndex(
                                hourIndex,
                              );
                            }}
                            onMouseLeave={() => {
                              setHoveredHourIndex(
                                null,
                              );
                            }}
                            className={[
                              getCellClasses(
                                cell,
                              ),

                              hourIndex > 0 &&
                              hourIndex % 6 === 0
                                ? "border-l-2 border-l-slate-600"
                                : "",

                              "snap-start",
                              hoveredHourIndex ===
                              hourIndex
                                ? "brightness-125 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.45)]"
                                : "",
                            ].join(" ")}
                            style={{
                              minWidth:
                                `${hourColumnWidth}px`,
                            }}
                          >
                            {content}
                          </button>
                        );
                      }

                      return (
                        <div
                          key={`${participant.id}-${cell.instant.toISOString()}`}
                          title={`${formatFullDateTime(
                            cell.instant,
                            participant.city
                              .timezone.name,
                          )} · Comfort ${cell.comfortScore}%`}
                          onMouseEnter={() => {
                            setHoveredHourIndex(
                              hourIndex,
                            );
                          }}
                          onMouseLeave={() => {
                            setHoveredHourIndex(
                              null,
                            );
                          }}
                          className={[
                            getCellClasses(
                              cell,
                            ),
                            "snap-start",
                            hoveredHourIndex ===
                            hourIndex
                              ? "brightness-125 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.45)]"
                              : "",
                          ].join(" ")}
                          style={{
                            minWidth:
                              `${hourColumnWidth}px`,
                          }}
                        >
                          {content}
                        </div>
                      );
                    },
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-xs leading-5 text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          Live local clocks and the
          Now cursor refresh every
          second.
        </p>

        <p>
          Animation pauses
          automatically when the
          browser tab is hidden.
        </p>
      </div>
    </div>
  );
}