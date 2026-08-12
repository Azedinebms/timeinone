import {
  buildQuickFacts,
  formatMeetingDate,
  formatMeetingTime,
  formatTime,
  getMeetingComfortLabel,
  zonedDateTimeToDate,
} from "@/lib/time-engine";

export type FaqItem = {
  question: string;
  answer: string;
};

type CreateConverterFaqsInput = {
  referenceDate: Date;

  fromCity: string;
  fromCountry: string;
  fromTimezone: string;

  toCity: string;
  toCountry: string;
  toTimezone: string;
};

function getLocalDateInput(
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

function createNineAmConversion({
  referenceDate,
  fromTimezone,
  toTimezone,
}: {
  referenceDate: Date;
  fromTimezone: string;
  toTimezone: string;
}) {
  const localDate =
    getLocalDateInput(
      referenceDate,
      fromTimezone,
    );

  const sourceDateTime =
    `${localDate}T09:00`;

  const instant =
    zonedDateTimeToDate(
      sourceDateTime,
      fromTimezone,
    );

  if (!instant) {
    return null;
  }

  return {
    instant,

    targetTime:
      formatTime(
        instant,
        toTimezone,
      ),
  };
}

function formatHourAmount(
  value: number,
) {
  const absoluteValue =
    Math.abs(value);

  return Number.isInteger(
    absoluteValue,
  )
    ? absoluteValue.toString()
    : absoluteValue.toFixed(1);
}

export function createConverterFaqs({
  referenceDate,

  fromCity,
  fromCountry,
  fromTimezone,

  toCity,
  toCountry,
  toTimezone,
}: CreateConverterFaqsInput): FaqItem[] {
  const facts =
    buildQuickFacts({
      instant: referenceDate,

      fromCity,
      fromTimezone,

      toCity,
      toTimezone,
    });

  const nineAmConversion =
    createNineAmConversion({
      referenceDate,
      fromTimezone,
      toTimezone,
    });

  const differenceAnswer =
    facts.differenceHours === 0
      ? `${fromCity} and ${toCity} currently have the same local time. Their time difference may still change during the year if their daylight-saving rules differ.`
      : `${facts.differenceLabel}. The exact difference can change during the year when one location changes its clocks before the other.`;

  const absoluteDifference =
    Math.abs(
      facts.differenceHours,
    );

  const formattedDifference =
    formatHourAmount(
      facts.differenceHours,
    );

  const directionAnswer =
    facts.differenceHours > 0
      ? `Yes. ${toCity} is currently ${formattedDifference} hour${
          absoluteDifference === 1
            ? ""
            : "s"
        } ahead of ${fromCity}.`
      : facts.differenceHours < 0
        ? `No. ${toCity} is currently ${formattedDifference} hour${
            absoluteDifference === 1
              ? ""
              : "s"
          } behind ${fromCity}.`
        : `${fromCity} and ${toCity} currently have the same local time.`;

  const nineAmAnswer =
    nineAmConversion
      ? `When it is 9:00 AM in ${fromCity}, it is ${nineAmConversion.targetTime} in ${toCity} on the current reference date. The result can differ during another part of the year because of daylight-saving changes.`
      : `TimeInOne could not calculate the 9:00 AM conversion for this date. Select another date in the converter to see the exact corresponding time.`;

  const dstAnswer =
    `${fromCity}, ${fromCountry} ${
      facts.from.usesDst
        ? "uses seasonal daylight-saving changes in its time-zone rules"
        : "does not normally use a seasonal daylight-saving offset"
    }. ${toCity}, ${toCountry} ${
      facts.to.usesDst
        ? "uses seasonal daylight-saving changes in its time-zone rules"
        : "does not normally use a seasonal daylight-saving offset"
    }. TimeInOne uses the IANA zones ${fromTimezone} and ${toTimezone} for date-specific conversions.`;

  let meetingAnswer: string;

  if (!facts.bestMeeting) {
    meetingAnswer =
      "No reasonable meeting time was found during the next 72 hours.";
  } else {
    const fromTime =
      formatMeetingTime(
        facts.bestMeeting.instant,
        fromTimezone,
      );

    const toTime =
      formatMeetingTime(
        facts.bestMeeting.instant,
        toTimezone,
      );

    const meetingDate =
      formatMeetingDate(
        facts.bestMeeting.instant,
        fromTimezone,
      );

    if (
      facts.bestMeeting
        .isStrictOverlap
    ) {
      meetingAnswer =
        `The next recommended working-hours overlap is ${fromTime} in ${fromCity} and ${toTime} in ${toCity}, on ${meetingDate}.`;
    } else {
      const fromComfort =
        getMeetingComfortLabel(
          facts.bestMeeting
            .fromComfort,
        );

      const toComfort =
        getMeetingComfortLabel(
          facts.bestMeeting
            .toComfort,
        );

      meetingAnswer =
        `There is no strict 9:00 AM to 6:00 PM overlap during the next 72 hours. TimeInOne recommends ${fromTime} in ${fromCity} and ${toTime} in ${toCity}, on ${meetingDate}, as the best reasonable compromise. This is classified as “${fromComfort}” in ${fromCity} and “${toComfort}” in ${toCity}.`;
    }
  }

  return [
    {
      question:
        `What is the time difference between ${fromCity} and ${toCity}?`,

      answer:
        differenceAnswer,
    },

    {
      question:
        `Is ${toCity} ahead of ${fromCity}?`,

      answer:
        directionAnswer,
    },

    {
      question:
        `What time is 9:00 AM in ${fromCity} in ${toCity}?`,

      answer:
        nineAmAnswer,
    },

    {
      question:
        `Do ${fromCity} and ${toCity} observe daylight saving time?`,

      answer:
        dstAnswer,
    },

    {
      question:
        `What is the best meeting time between ${fromCity} and ${toCity}?`,

      answer:
        meetingAnswer,
    },
  ];
}