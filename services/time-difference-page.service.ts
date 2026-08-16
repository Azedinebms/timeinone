import "server-only";

import type {
  CityOption,
} from "@/types/city";

import {
  calculateTimeDifference,
} from "@/lib/time-engine/difference";

import {
  resolveConverterPair,
} from "@/services/converter-page.service";

export type TimeDifferencePageData = {
  fromCity: CityOption;

  toCity: CityOption;

  canonicalPair: string;

  differenceHours: number;

  absoluteDifferenceHours: number;

  direction:
    | "ahead"
    | "behind"
    | "same";

  summary: string;
};

function normalizeDifference(
  value: number,
): number {
  if (
    Object.is(
      value,
      -0,
    )
  ) {
    return 0;
  }

  return value;
}

function formatDifferenceValue(
  hours: number,
): string {
  const absoluteHours =
    Math.abs(
      hours,
    );

  const wholeHours =
    Math.floor(
      absoluteHours,
    );

  const minutes =
    Math.round(
      (
        absoluteHours -
        wholeHours
      ) *
        60,
    );

  if (
    wholeHours ===
      0 &&
    minutes ===
      0
  ) {
    return "the same time";
  }

  if (minutes === 0) {
    return `${wholeHours} ${
      wholeHours === 1
        ? "hour"
        : "hours"
    }`;
  }

  if (wholeHours === 0) {
    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    }`;
  }

  return `${wholeHours} ${
    wholeHours === 1
      ? "hour"
      : "hours"
  } ${minutes} ${
    minutes === 1
      ? "minute"
      : "minutes"
  }`;
}

function createDifferenceSummary({
  fromCity,
  toCity,
  differenceHours,
}: {
  fromCity: CityOption;

  toCity: CityOption;

  differenceHours: number;
}): string {
  if (differenceHours === 0) {
    return `${fromCity.city} and ${toCity.city} currently have the same local time.`;
  }

  const formattedDifference =
    formatDifferenceValue(
      differenceHours,
    );

  if (differenceHours > 0) {
    return `${toCity.city} is currently ${formattedDifference} ahead of ${fromCity.city}.`;
  }

  return `${toCity.city} is currently ${formattedDifference} behind ${fromCity.city}.`;
}

export async function resolveTimeDifferencePair(
  rawPair: string,
  referenceDate:
    Date = new Date(),
): Promise<
  TimeDifferencePageData | null
> {
  const pairData =
    await resolveConverterPair(
      rawPair,
    );

  if (!pairData) {
    return null;
  }

  const {
    fromCity,
    toCity,
    canonicalPair,
  } =
    pairData;

  const differenceHours =
    normalizeDifference(
      calculateTimeDifference(
        referenceDate,
        fromCity.timezone,
        toCity.timezone,
      ),
    );

  const absoluteDifferenceHours =
    Math.abs(
      differenceHours,
    );

  const direction:
    TimeDifferencePageData["direction"] =
    differenceHours === 0
      ? "same"
      : differenceHours > 0
        ? "ahead"
        : "behind";

  return {
    fromCity,

    toCity,

    canonicalPair,

    differenceHours,

    absoluteDifferenceHours,

    direction,

    summary:
      createDifferenceSummary({
        fromCity,
        toCity,
        differenceHours,
      }),
  };
}