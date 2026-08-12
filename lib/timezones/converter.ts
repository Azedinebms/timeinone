import {
  formatDate,
  formatDateTimeInput,
  formatTime,
  getTimezoneOffset,
  zonedDateTimeToDate,
} from "@/lib/time-engine";

import {
  formatDifferenceMinutes,
  formatOffsetMinutes,
} from "./formatter";

import type {
  TimezoneConversionInput,
  TimezoneConversionResult,
  TimezoneDefinition,
} from "./types";

const MILLISECONDS_PER_MINUTE =
  60 * 1000;

function parseLocalDateTime(
  localDateTime: string,
) {
  const match =
    localDateTime.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/,
    );

  if (!match) {
    return null;
  }

  const [
    ,
    year,
    month,
    day,
    hour,
    minute,
  ] = match;

  const values = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
  };

  const wallTimeAsUtc = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour,
    values.minute,
  );

  const validationDate =
    new Date(wallTimeAsUtc);

  const isValid =
    validationDate.getUTCFullYear() ===
      values.year &&
    validationDate.getUTCMonth() ===
      values.month - 1 &&
    validationDate.getUTCDate() ===
      values.day &&
    validationDate.getUTCHours() ===
      values.hour &&
    validationDate.getUTCMinutes() ===
      values.minute;

  return isValid
    ? {
        ...values,
        wallTimeAsUtc,
      }
    : null;
}

export function getTimezoneOffsetMinutes(
  timezone: TimezoneDefinition,
  instant: Date,
) {
  if (timezone.kind === "fixed") {
    return timezone.offsetMinutes ?? 0;
  }

  if (!timezone.ianaTimezone) {
    throw new Error(
      `Missing IANA time zone for ${timezone.slug}.`,
    );
  }

  return Math.round(
    getTimezoneOffset(
      instant,
      timezone.ianaTimezone,
    ) * 60,
  );
}

function timezoneLocalDateTimeToInstant(
  localDateTime: string,
  timezone: TimezoneDefinition,
) {
  if (
    timezone.kind === "iana" &&
    timezone.ianaTimezone
  ) {
    return zonedDateTimeToDate(
      localDateTime,
      timezone.ianaTimezone,
    );
  }

  const parsed =
    parseLocalDateTime(
      localDateTime,
    );

  if (!parsed) {
    return null;
  }

  const offsetMinutes =
    timezone.offsetMinutes ?? 0;

  return new Date(
    parsed.wallTimeAsUtc -
      offsetMinutes *
        MILLISECONDS_PER_MINUTE,
  );
}

function formatFixedTimezoneTime(
  instant: Date,
  offsetMinutes: number,
) {
  const shiftedDate = new Date(
    instant.getTime() +
      offsetMinutes *
        MILLISECONDS_PER_MINUTE,
  );

  return {
    time:
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone: "UTC",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        },
      ).format(shiftedDate),

    date:
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone: "UTC",
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        },
      ).format(shiftedDate),

    dateTimeInput:
      `${shiftedDate
        .getUTCFullYear()
        .toString()
        .padStart(4, "0")}-` +
      `${(shiftedDate.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-` +
      `${shiftedDate
        .getUTCDate()
        .toString()
        .padStart(2, "0")}T` +
      `${shiftedDate
        .getUTCHours()
        .toString()
        .padStart(2, "0")}:` +
      `${shiftedDate
        .getUTCMinutes()
        .toString()
        .padStart(2, "0")}`,
  };
}

function createConversionSide(
  timezone: TimezoneDefinition,
  instant: Date,
) {
  const offsetMinutes =
    getTimezoneOffsetMinutes(
      timezone,
      instant,
    );

  if (
    timezone.kind === "iana" &&
    timezone.ianaTimezone
  ) {
    return {
      slug: timezone.slug,
      abbreviation:
        timezone.abbreviation,
      name: timezone.name,

      formattedTime:
        formatTime(
          instant,
          timezone.ianaTimezone,
        ),

      formattedDate:
        formatDate(
          instant,
          timezone.ianaTimezone,
        ),

      dateTimeInput:
        formatDateTimeInput(
          instant,
          timezone.ianaTimezone,
        ),

      offsetMinutes,
      offsetLabel:
        formatOffsetMinutes(
          offsetMinutes,
        ),

      ianaTimezone:
        timezone.ianaTimezone,
    };
  }

  const formatted =
    formatFixedTimezoneTime(
      instant,
      offsetMinutes,
    );

  return {
    slug: timezone.slug,
    abbreviation:
      timezone.abbreviation,
    name: timezone.name,

    formattedTime:
      formatted.time,

    formattedDate:
      formatted.date,

    dateTimeInput:
      formatted.dateTimeInput,

    offsetMinutes,
    offsetLabel:
      formatOffsetMinutes(
        offsetMinutes,
      ),

    ianaTimezone: null,
  };
}

export function convertTimezoneTime({
  localDateTime,
  fromTimezone,
  toTimezone,
}: TimezoneConversionInput):
  TimezoneConversionResult | null {
  const instant =
    timezoneLocalDateTimeToInstant(
      localDateTime,
      fromTimezone,
    );

  if (
    !instant ||
    Number.isNaN(instant.getTime())
  ) {
    return null;
  }

  const from = createConversionSide(
    fromTimezone,
    instant,
  );

  const to = createConversionSide(
    toTimezone,
    instant,
  );

  const differenceMinutes =
    to.offsetMinutes -
    from.offsetMinutes;

  return {
    instant,
    from,
    to,
    differenceMinutes,

    differenceLabel:
      formatDifferenceMinutes(
        differenceMinutes,
        from.abbreviation,
        to.abbreviation,
      ),
  };
}