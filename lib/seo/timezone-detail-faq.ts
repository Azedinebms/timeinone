import {
  formatOffsetMinutes,
  getTimezoneOffsetMinutes,
  type TimezoneDefinition,
} from "@/lib/timezones";

import type {
  FaqItem,
} from "./faq";

type CreateTimezoneDetailFaqsInput = {
  timezone: TimezoneDefinition;
  referenceDate: Date;
};

export function createTimezoneDetailFaqs({
  timezone,
  referenceDate,
}: CreateTimezoneDetailFaqsInput): FaqItem[] {
  const offsetMinutes =
    getTimezoneOffsetMinutes(
      timezone,
      referenceDate,
    );

  const offsetLabel =
    formatOffsetMinutes(
      offsetMinutes,
    );

  const typeAnswer =
    timezone.kind === "fixed"
      ? `${timezone.abbreviation} is defined as a fixed offset of ${offsetLabel}. Its offset does not change automatically according to the date.`
      : `${timezone.abbreviation} is represented by the IANA time zone ${timezone.ianaTimezone}. Its active UTC offset can change according to daylight-saving rules.`;

  const dstAnswer =
    timezone.observesDst
      ? `${timezone.name} uses seasonal clock rules. TimeInOne calculates its active offset from ${timezone.ianaTimezone} for the selected date.`
      : `${timezone.name} is represented on TimeInOne as a fixed offset and does not automatically switch for daylight-saving time.`;

  return [
    {
      question:
        `What is ${timezone.abbreviation}?`,

      answer:
        `${timezone.abbreviation} stands for ${timezone.name}. ${timezone.description}`,
    },

    {
      question:
        `What is the current UTC offset for ${timezone.abbreviation}?`,

      answer:
        `The active offset for ${timezone.abbreviation} on this date is ${offsetLabel}.`,
    },

    {
      question:
        `Does ${timezone.abbreviation} use daylight saving time?`,

      answer: dstAnswer,
    },

    {
      question:
        `Where is ${timezone.abbreviation} used?`,

      answer:
        `${timezone.abbreviation} is associated with ${timezone.regions.join(
          ", ",
        )}. Time-zone abbreviations can sometimes be ambiguous, so TimeInOne uses the definition displayed on this page.`,
    },

    {
      question:
        `Is ${timezone.abbreviation} a fixed time zone?`,

      answer: typeAnswer,
    },
  ];
}