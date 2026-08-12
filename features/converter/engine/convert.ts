import {
  calculateTimeDifference,
  formatDate,
  formatTime,
  formatTimeDifference,
  zonedDateTimeToDate,
} from "@/lib/time-engine";

import {
  cityToTimeLocation,
  type ConverterCity,
  type ConverterDifference,
  type ConverterResult,
} from "./types";

type ConvertTimeInput = {
  fromCity: ConverterCity;
  toCity: ConverterCity;
  instant?: Date | null;
  localDateTime?: string;
};

function createDifference(
  hours: number,
): ConverterDifference {
  if (hours === 0) {
    return {
      hours,
      label: "the same time",
      direction: "same",
    };
  }

  return {
    hours,
    label: formatTimeDifference(hours),
    direction: hours > 0
      ? "ahead"
      : "behind",
  };
}

export function convertTime({
  fromCity,
  toCity,
  instant,
  localDateTime,
}: ConvertTimeInput): ConverterResult | null {
  const from = cityToTimeLocation(fromCity);
  const to = cityToTimeLocation(toCity);

  const conversionInstant =
    instant ??
    (localDateTime
      ? zonedDateTimeToDate(
          localDateTime,
          from.timezone,
        )
      : null);

  if (
    !conversionInstant ||
    Number.isNaN(conversionInstant.getTime())
  ) {
    return null;
  }

  const differenceHours =
    calculateTimeDifference(
      conversionInstant,
      from.timezone,
      to.timezone,
    );

  return {
    instant: conversionInstant,

    source: {
      city: from.city,
      country: from.country,
      timezone: from.timezone,
      time: formatTime(
        conversionInstant,
        from.timezone,
      ),
      date: formatDate(
        conversionInstant,
        from.timezone,
      ),
    },

    target: {
      city: to.city,
      country: to.country,
      timezone: to.timezone,
      time: formatTime(
        conversionInstant,
        to.timezone,
      ),
      date: formatDate(
        conversionInstant,
        to.timezone,
      ),
    },

    difference: createDifference(
      differenceHours,
    ),
  };
}