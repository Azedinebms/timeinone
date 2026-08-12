import {
  DEFAULT_BUSINESS_HOURS,
  getLocalBusinessParts,
  isInsideBusinessHours,
  type BusinessHours,
} from "./businessHours";

const MINUTE_IN_MILLISECONDS = 60 * 1000;

export type MeetingComfort =
  | "ideal"
  | "early"
  | "late"
  | "uncomfortable";

export type MeetingRecommendation = {
  instant: Date;

  fromHour: number;
  fromMinute: number;
  fromComfort: MeetingComfort;

  toHour: number;
  toMinute: number;
  toComfort: MeetingComfort;

  score: number;
  isStrictOverlap: boolean;
};

export type FindBestMeetingTimesOptions = {
  startDate: Date;
  fromTimezone: string;
  toTimezone: string;

  fromBusinessHours?: BusinessHours;
  toBusinessHours?: BusinessHours;

  horizonHours?: number;
  intervalMinutes?: number;
  limit?: number;

  allowCompromise?: boolean;
};

const DEFAULT_HORIZON_HOURS = 72;
const DEFAULT_INTERVAL_MINUTES = 30;
const DEFAULT_RESULT_LIMIT = 3;

const REASONABLE_START_HOUR = 7;
const REASONABLE_END_HOUR = 21;

function getBusinessDayCenter(
  businessHours: BusinessHours,
) {
  return (
    businessHours.startHour +
    businessHours.endHour
  ) / 2;
}

function roundDateUpToInterval(
  date: Date,
  intervalMinutes: number,
) {
  const intervalMilliseconds =
    intervalMinutes *
    MINUTE_IN_MILLISECONDS;

  const roundedTimestamp =
    Math.ceil(
      date.getTime() /
        intervalMilliseconds,
    ) * intervalMilliseconds;

  return new Date(roundedTimestamp);
}

function getDecimalHour(
  hour: number,
  minute: number,
) {
  return hour + minute / 60;
}

function isReasonableHour(
  hour: number,
  minute: number,
) {
  const decimalHour =
    getDecimalHour(hour, minute);

  return (
    decimalHour >=
      REASONABLE_START_HOUR &&
    decimalHour <
      REASONABLE_END_HOUR
  );
}

function getMeetingComfort(
  hour: number,
  minute: number,
  businessHours: BusinessHours,
): MeetingComfort {
  const decimalHour =
    getDecimalHour(hour, minute);

  if (
    decimalHour >=
      businessHours.startHour &&
    decimalHour <
      businessHours.endHour
  ) {
    return "ideal";
  }

  if (
    decimalHour >=
      REASONABLE_START_HOUR &&
    decimalHour <
      businessHours.startHour
  ) {
    return "early";
  }

  if (
    decimalHour >=
      businessHours.endHour &&
    decimalHour <
      REASONABLE_END_HOUR
  ) {
    return "late";
  }

  return "uncomfortable";
}

function getComfortPenalty(
  comfort: MeetingComfort,
) {
  switch (comfort) {
    case "ideal":
      return 0;

    case "early":
    case "late":
      return 4;

    case "uncomfortable":
      return 20;
  }
}

function calculateMeetingScore({
  fromHour,
  fromMinute,
  toHour,
  toMinute,
  fromBusinessHours,
  toBusinessHours,
  fromComfort,
  toComfort,
  minutesAfterStart,
}: {
  fromHour: number;
  fromMinute: number;
  toHour: number;
  toMinute: number;

  fromBusinessHours: BusinessHours;
  toBusinessHours: BusinessHours;

  fromComfort: MeetingComfort;
  toComfort: MeetingComfort;

  minutesAfterStart: number;
}) {
  const fromDecimalHour =
    getDecimalHour(
      fromHour,
      fromMinute,
    );

  const toDecimalHour =
    getDecimalHour(
      toHour,
      toMinute,
    );

  const fromCenter =
    getBusinessDayCenter(
      fromBusinessHours,
    );

  const toCenter =
    getBusinessDayCenter(
      toBusinessHours,
    );

  const comfortScore =
    Math.abs(
      fromDecimalHour - fromCenter,
    ) +
    Math.abs(
      toDecimalHour - toCenter,
    );

  const comfortPenalty =
    getComfortPenalty(fromComfort) +
    getComfortPenalty(toComfort);

  const proximityPenalty =
    minutesAfterStart / 100_000;

  return (
    comfortScore +
    comfortPenalty +
    proximityPenalty
  );
}

function buildRecommendations({
  startDate,
  fromTimezone,
  toTimezone,
  fromBusinessHours,
  toBusinessHours,
  horizonHours,
  intervalMinutes,
  allowCompromise,
}: {
  startDate: Date;
  fromTimezone: string;
  toTimezone: string;

  fromBusinessHours: BusinessHours;
  toBusinessHours: BusinessHours;

  horizonHours: number;
  intervalMinutes: number;

  allowCompromise: boolean;
}) {
  const recommendations:
    MeetingRecommendation[] = [];

  const firstSlot =
    roundDateUpToInterval(
      startDate,
      intervalMinutes,
    );

  const totalSlots = Math.ceil(
    (horizonHours * 60) /
      intervalMinutes,
  );

  for (
    let index = 0;
    index < totalSlots;
    index += 1
  ) {
    const minutesAfterStart =
      index * intervalMinutes;

    const instant = new Date(
      firstSlot.getTime() +
        minutesAfterStart *
          MINUTE_IN_MILLISECONDS,
    );

    const fromLocal =
      getLocalBusinessParts(
        instant,
        fromTimezone,
      );

    const toLocal =
      getLocalBusinessParts(
        instant,
        toTimezone,
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

    const isStrictOverlap =
      fromIsWorking &&
      toIsWorking;

    if (
      !isStrictOverlap &&
      !allowCompromise
    ) {
      continue;
    }

    if (
      !isStrictOverlap &&
      (
        !isReasonableHour(
          fromLocal.hour,
          fromLocal.minute,
        ) ||
        !isReasonableHour(
          toLocal.hour,
          toLocal.minute,
        )
      )
    ) {
      continue;
    }

    const fromComfort =
      getMeetingComfort(
        fromLocal.hour,
        fromLocal.minute,
        fromBusinessHours,
      );

    const toComfort =
      getMeetingComfort(
        toLocal.hour,
        toLocal.minute,
        toBusinessHours,
      );

    recommendations.push({
      instant,

      fromHour: fromLocal.hour,
      fromMinute:
        fromLocal.minute,
      fromComfort,

      toHour: toLocal.hour,
      toMinute:
        toLocal.minute,
      toComfort,

      isStrictOverlap,

      score:
        calculateMeetingScore({
          fromHour:
            fromLocal.hour,

          fromMinute:
            fromLocal.minute,

          toHour:
            toLocal.hour,

          toMinute:
            toLocal.minute,

          fromBusinessHours,
          toBusinessHours,

          fromComfort,
          toComfort,

          minutesAfterStart,
        }),
    });
  }

  return recommendations;
}

export function findBestMeetingTimes({
  startDate,
  fromTimezone,
  toTimezone,

  fromBusinessHours =
    DEFAULT_BUSINESS_HOURS,

  toBusinessHours =
    DEFAULT_BUSINESS_HOURS,

  horizonHours =
    DEFAULT_HORIZON_HOURS,

  intervalMinutes =
    DEFAULT_INTERVAL_MINUTES,

  limit =
    DEFAULT_RESULT_LIMIT,

  allowCompromise = true,
}: FindBestMeetingTimesOptions): MeetingRecommendation[] {
  if (
    Number.isNaN(startDate.getTime()) ||
    horizonHours <= 0 ||
    intervalMinutes <= 0 ||
    limit <= 0
  ) {
    return [];
  }

  const strictRecommendations =
    buildRecommendations({
      startDate,
      fromTimezone,
      toTimezone,

      fromBusinessHours,
      toBusinessHours,

      horizonHours,
      intervalMinutes,

      allowCompromise: false,
    });

  const recommendations =
    strictRecommendations.length > 0
      ? strictRecommendations
      : allowCompromise
        ? buildRecommendations({
            startDate,
            fromTimezone,
            toTimezone,

            fromBusinessHours,
            toBusinessHours,

            horizonHours,
            intervalMinutes,

            allowCompromise: true,
          })
        : [];

  return recommendations
    .sort(
      (
        firstRecommendation,
        secondRecommendation,
      ) => {
        if (
          firstRecommendation
            .isStrictOverlap !==
          secondRecommendation
            .isStrictOverlap
        ) {
          return firstRecommendation
            .isStrictOverlap
            ? -1
            : 1;
        }

        if (
          firstRecommendation.score !==
          secondRecommendation.score
        ) {
          return (
            firstRecommendation.score -
            secondRecommendation.score
          );
        }

        return (
          firstRecommendation
            .instant
            .getTime() -
          secondRecommendation
            .instant
            .getTime()
        );
      },
    )
    .slice(0, limit);
}

export function getMeetingComfortLabel(
  comfort: MeetingComfort,
) {
  switch (comfort) {
    case "ideal":
      return "Working hours";

    case "early":
      return "Early local time";

    case "late":
      return "Late local time";

    case "uncomfortable":
      return "Outside reasonable hours";
  }
}

export function formatMeetingTime(
  date: Date,
  timeZone: string,
  locale = "en-US",
) {
  return new Intl.DateTimeFormat(
    locale,
    {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    },
  ).format(date);
}

export function formatMeetingDate(
  date: Date,
  timeZone: string,
  locale = "en-US",
) {
  return new Intl.DateTimeFormat(
    locale,
    {
      timeZone,
      weekday: "short",
      month: "short",
      day: "numeric",
    },
  ).format(date);
}