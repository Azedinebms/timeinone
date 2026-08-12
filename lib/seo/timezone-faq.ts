import {
  convertTimezoneTime,
  getTimezoneOffsetMinutes,
  type TimezoneDefinition,
} from "@/lib/timezones";

import type {
  FaqItem,
} from "./faq";

type CreateTimezoneConverterFaqsInput = {
  referenceDate: Date;
  fromTimezone: TimezoneDefinition;
  toTimezone: TimezoneDefinition;
};

const MINUTE_IN_MILLISECONDS =
  60 * 1000;

function padNumber(value: number) {
  return value
    .toString()
    .padStart(2, "0");
}

function formatLocalDateForFixedTimezone(
  date: Date,
  offsetMinutes: number,
) {
  const shiftedDate = new Date(
    date.getTime() +
      offsetMinutes *
        MINUTE_IN_MILLISECONDS,
  );

  return (
    `${shiftedDate.getUTCFullYear()}-` +
    `${padNumber(
      shiftedDate.getUTCMonth() + 1,
    )}-` +
    `${padNumber(
      shiftedDate.getUTCDate(),
    )}`
  );
}

function formatLocalDateForIanaTimezone(
  date: Date,
  timezone: string,
) {
  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    ).formatToParts(date);

  const values =
    Object.fromEntries(
      parts.map((part) => [
        part.type,
        part.value,
      ]),
    );

  return (
    `${values.year}-` +
    `${values.month}-` +
    `${values.day}`
  );
}

function getLocalDateInput(
  date: Date,
  timezone: TimezoneDefinition,
) {
  if (
    timezone.kind === "iana" &&
    timezone.ianaTimezone
  ) {
    return formatLocalDateForIanaTimezone(
      date,
      timezone.ianaTimezone,
    );
  }

  return formatLocalDateForFixedTimezone(
    date,
    timezone.offsetMinutes ?? 0,
  );
}

function formatDuration(
  differenceMinutes: number,
) {
  const absoluteMinutes =
    Math.abs(differenceMinutes);

  const hours = Math.floor(
    absoluteMinutes / 60,
  );

  const minutes =
    absoluteMinutes % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(
      `${hours} hour${
        hours === 1 ? "" : "s"
      }`,
    );
  }

  if (minutes > 0) {
    parts.push(
      `${minutes} minute${
        minutes === 1 ? "" : "s"
      }`,
    );
  }

  return parts.length > 0
    ? parts.join(" and ")
    : "0 hours";
}

function getTypeDescription(
  timezone: TimezoneDefinition,
) {
  if (timezone.kind === "fixed") {
    return (
      `${timezone.abbreviation} is defined ` +
      "as a fixed UTC offset. Its offset " +
      "does not change automatically according " +
      "to the selected date."
    );
  }

  return (
    `${timezone.abbreviation} is represented ` +
    `by the IANA time zone ${timezone.ianaTimezone}. ` +
    "Its active offset can change according to " +
    "the date and daylight-saving rules."
  );
}

export function createTimezoneConverterFaqs({
  referenceDate,
  fromTimezone,
  toTimezone,
}: CreateTimezoneConverterFaqsInput): FaqItem[] {
  const fromOffsetMinutes =
    getTimezoneOffsetMinutes(
      fromTimezone,
      referenceDate,
    );

  const toOffsetMinutes =
    getTimezoneOffsetMinutes(
      toTimezone,
      referenceDate,
    );

  const differenceMinutes =
    toOffsetMinutes -
    fromOffsetMinutes;

  const duration =
    formatDuration(
      differenceMinutes,
    );

  const fromLocalDate =
    getLocalDateInput(
      referenceDate,
      fromTimezone,
    );

  const nineAmConversion =
    convertTimezoneTime({
      localDateTime:
        `${fromLocalDate}T09:00`,

      fromTimezone,
      toTimezone,
    });

const differenceAnswer =
  differenceMinutes === 0
    ? `${fromTimezone.abbreviation} and ${toTimezone.abbreviation} currently have the same UTC offset. A seasonal time zone may use a different offset on another date.`
    : differenceMinutes > 0
      ? `${toTimezone.abbreviation} is ${duration} ahead of ${fromTimezone.abbreviation} on this date.`
      : `${toTimezone.abbreviation} is ${duration} behind ${fromTimezone.abbreviation} on this date.`;

  const nineAmAnswer =
    nineAmConversion
      ? `When it is 9:00 AM in ${fromTimezone.abbreviation}, it is ${nineAmConversion.to.formattedTime} in ${toTimezone.abbreviation} on ${nineAmConversion.to.formattedDate}.`
      : `TimeInOne could not calculate this conversion for this date.`;

  const dstAnswer =
    `${getTypeDescription(
      fromTimezone,
    )} ${getTypeDescription(
      toTimezone,
    )}`;

  const regionsAnswer =
    `${fromTimezone.abbreviation} is associated with ${fromTimezone.regions.join(
      ", ",
    )}. ${toTimezone.abbreviation} is associated with ${toTimezone.regions.join(
      ", ",
    )}. Time-zone abbreviations can be ambiguous, so TimeInOne uses the specific definitions shown on this page.`;

  return [
    {
      question:
        `What is the time difference between ${fromTimezone.abbreviation} and ${toTimezone.abbreviation}?`,

      answer: differenceAnswer,
    },

    {
      question:
        `What time is 9:00 AM ${fromTimezone.abbreviation} in ${toTimezone.abbreviation}?`,

      answer: nineAmAnswer,
    },

    {
      question:
        `Is ${toTimezone.abbreviation} ahead of ${fromTimezone.abbreviation}?`,

      answer:
        differenceMinutes > 0
          ? `Yes. ${toTimezone.abbreviation} is currently ${duration} ahead of ${fromTimezone.abbreviation}.`
          : differenceMinutes < 0
            ? `No. ${toTimezone.abbreviation} is currently ${duration} behind ${fromTimezone.abbreviation}.`
            : `Neither zone is ahead on this date because both use the same UTC offset.`,
    },

    {
      question:
        `Do ${fromTimezone.abbreviation} and ${toTimezone.abbreviation} use daylight saving time?`,

      answer: dstAnswer,
    },

    {
      question:
        `Where are ${fromTimezone.abbreviation} and ${toTimezone.abbreviation} used?`,

      answer: regionsAnswer,
    },
  ];
}