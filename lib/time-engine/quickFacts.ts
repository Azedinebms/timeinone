import {
  isInsideBusinessHours,
} from "./businessHours";

import {
  findBestMeetingTimes,
  type MeetingComfort,
} from "./meeting";

import {
  getTimezoneOffset,
} from "./timezone";

export type QuickFactsInput = {
  instant: Date;

  fromCity: string;
  fromTimezone: string;

  toCity: string;
  toTimezone: string;
};

export type QuickFactsMeeting = {
  instant: Date;
  isStrictOverlap: boolean;
  fromComfort: MeetingComfort;
  toComfort: MeetingComfort;
};

export type QuickFactsResult = {
  from: {
    city: string;
    timezone: string;

    utcOffsetHours: number;
    utcOffsetLabel: string;

    localDate: string;
    isBusinessHours: boolean;
    usesDst: boolean;
  };

  to: {
    city: string;
    timezone: string;

    utcOffsetHours: number;
    utcOffsetLabel: string;

    localDate: string;
    isBusinessHours: boolean;
    usesDst: boolean;
  };

  differenceHours: number;
  differenceLabel: string;

  bestMeeting: QuickFactsMeeting | null;
};

function formatUtcOffset(
  offsetHours: number,
) {
  const sign =
    offsetHours >= 0 ? "+" : "-";

  const absoluteOffset =
    Math.abs(offsetHours);

  const hours =
    Math.floor(absoluteOffset);

  const minutes =
    Math.round(
      (absoluteOffset - hours) * 60,
    );

  return (
    `UTC${sign}` +
    `${hours
      .toString()
      .padStart(2, "0")}:` +
    `${minutes
      .toString()
      .padStart(2, "0")}`
  );
}

function formatLocalDate(
  date: Date,
  timezone: string,
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

function usesDst(
  timezone: string,
  referenceYear: number,
) {
  const january = new Date(
    Date.UTC(referenceYear, 0, 1),
  );

  const july = new Date(
    Date.UTC(referenceYear, 6, 1),
  );

  return (
    getTimezoneOffset(
      january,
      timezone,
    ) !==
    getTimezoneOffset(
      july,
      timezone,
    )
  );
}

function formatHourAmount(
  hours: number,
) {
  const absoluteHours =
    Math.abs(hours);

  return Number.isInteger(
    absoluteHours,
  )
    ? absoluteHours.toString()
    : absoluteHours.toFixed(1);
}

function formatDifference(
  differenceHours: number,
  fromCity: string,
  toCity: string,
) {
  if (differenceHours === 0) {
    return (
      `${fromCity} and ${toCity} ` +
      "have the same local time"
    );
  }

  const formattedHours =
    formatHourAmount(
      differenceHours,
    );

  const unit =
    Math.abs(differenceHours) === 1
      ? "hour"
      : "hours";

  if (differenceHours > 0) {
    return (
      `${toCity} is ${formattedHours} ` +
      `${unit} ahead of ${fromCity}`
    );
  }

  return (
    `${toCity} is ${formattedHours} ` +
    `${unit} behind ${fromCity}`
  );
}

export function buildQuickFacts({
  instant,

  fromCity,
  fromTimezone,

  toCity,
  toTimezone,
}: QuickFactsInput): QuickFactsResult {
  const fromOffset =
    getTimezoneOffset(
      instant,
      fromTimezone,
    );

  const toOffset =
    getTimezoneOffset(
      instant,
      toTimezone,
    );

  const differenceHours =
    toOffset - fromOffset;

  const meetingSlots =
    findBestMeetingTimes({
      startDate: instant,

      fromTimezone,
      toTimezone,

      horizonHours: 72,
      intervalMinutes: 30,
      limit: 1,

      allowCompromise: true,
    });

  const meetingSlot =
    meetingSlots[0] ?? null;

  const referenceYear =
    instant.getUTCFullYear();

  return {
    from: {
      city: fromCity,
      timezone: fromTimezone,

      utcOffsetHours:
        fromOffset,

      utcOffsetLabel:
        formatUtcOffset(
          fromOffset,
        ),

      localDate:
        formatLocalDate(
          instant,
          fromTimezone,
        ),

      isBusinessHours:
        isInsideBusinessHours(
          instant,
          fromTimezone,
        ),

      usesDst:
        usesDst(
          fromTimezone,
          referenceYear,
        ),
    },

    to: {
      city: toCity,
      timezone: toTimezone,

      utcOffsetHours:
        toOffset,

      utcOffsetLabel:
        formatUtcOffset(
          toOffset,
        ),

      localDate:
        formatLocalDate(
          instant,
          toTimezone,
        ),

      isBusinessHours:
        isInsideBusinessHours(
          instant,
          toTimezone,
        ),

      usesDst:
        usesDst(
          toTimezone,
          referenceYear,
        ),
    },

    differenceHours,

    differenceLabel:
      formatDifference(
        differenceHours,
        fromCity,
        toCity,
      ),

    bestMeeting: meetingSlot
      ? {
          instant:
            meetingSlot.instant,

          isStrictOverlap:
            meetingSlot.isStrictOverlap,

          fromComfort:
            meetingSlot.fromComfort,

          toComfort:
            meetingSlot.toComfort,
        }
      : null,
  };
}