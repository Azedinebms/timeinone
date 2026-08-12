import {
  DEFAULT_BUSINESS_HOURS,
  isInsideBusinessHours,
  type BusinessHours,
} from "./businessHours";

const HOUR_IN_MILLISECONDS =
  60 * 60 * 1000;

export type TimelineRow = {
  instant: Date;
  offsetHours: number;
  fromTime: string;
  fromDate: string;
  toTime: string;
  toDate: string;
  fromIsWorking: boolean;
  toIsWorking: boolean;
  isOverlap: boolean;
};

export type BuildTimelineOptions = {
  startDate: Date;
  fromTimezone: string;
  toTimezone: string;
  hours?: number;
  fromBusinessHours?: BusinessHours;
  toBusinessHours?: BusinessHours;
  locale?: string;
};

function addHours(
  date: Date,
  hours: number,
) {
  return new Date(
    date.getTime() +
      hours * HOUR_IN_MILLISECONDS,
  );
}

function formatTimelineTime(
  date: Date,
  timeZone: string,
  locale: string,
) {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatTimelineDate(
  date: Date,
  timeZone: string,
  locale: string,
) {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function buildTimeline({
  startDate,
  fromTimezone,
  toTimezone,
  hours = 24,
  fromBusinessHours =
    DEFAULT_BUSINESS_HOURS,
  toBusinessHours =
    DEFAULT_BUSINESS_HOURS,
  locale = "en-US",
}: BuildTimelineOptions): TimelineRow[] {
  if (
    Number.isNaN(startDate.getTime()) ||
    hours <= 0
  ) {
    return [];
  }

  return Array.from(
    { length: hours },
    (_, index) => {
      const instant = addHours(
        startDate,
        index,
      );

      const fromIsWorking =
        isInsideBusinessHours(
          instant,
          fromTimezone,
          fromBusinessHours,
        );

      const toIsWorking =
        isInsideBusinessHours(
          instant,
          toTimezone,
          toBusinessHours,
        );

      return {
        instant,
        offsetHours: index,

        fromTime: formatTimelineTime(
          instant,
          fromTimezone,
          locale,
        ),

        fromDate: formatTimelineDate(
          instant,
          fromTimezone,
          locale,
        ),

        toTime: formatTimelineTime(
          instant,
          toTimezone,
          locale,
        ),

        toDate: formatTimelineDate(
          instant,
          toTimezone,
          locale,
        ),

        fromIsWorking,
        toIsWorking,

        isOverlap:
          fromIsWorking &&
          toIsWorking,
      };
    },
  );
}