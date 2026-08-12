import type {
  TimezoneDefinition,
} from "./types";

const MINUTES_PER_HOUR = 60;

const MIN_OFFSET_MINUTES =
  -12 * MINUTES_PER_HOUR;

const MAX_OFFSET_MINUTES =
  14 * MINUTES_PER_HOUR;

const ALLOWED_MINUTE_PARTS =
  new Set([
    0,
    15,
    30,
    45,
  ]);

type OffsetBase =
  | "utc"
  | "gmt";

type OffsetDirection =
  | "plus"
  | "minus";

function normalizeValue(
  value: string,
) {
  return decodeURIComponent(value)
    .trim()
    .toLowerCase()

    // Normalise les différents signes moins Unicode.
    .replace(/[−–—]/g, "-")

    // Normalise aussi le signe plus pleine largeur.
    .replace(/＋/g, "+")

    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function padNumber(
  value: number,
) {
  return value
    .toString()
    .padStart(2, "0");
}

function formatSignedOffset(
  base: OffsetBase,
  offsetMinutes: number,
) {
  const sign =
    offsetMinutes >= 0
      ? "+"
      : "-";

  const absoluteMinutes =
    Math.abs(offsetMinutes);

  const hours =
    Math.floor(
      absoluteMinutes /
        MINUTES_PER_HOUR,
    );

  const minutes =
    absoluteMinutes %
    MINUTES_PER_HOUR;

  return (
    `${base.toUpperCase()}` +
    `${sign}` +
    `${padNumber(hours)}:` +
    `${padNumber(minutes)}`
  );
}

function createOffsetSlug(
  base: OffsetBase,
  offsetMinutes: number,
) {
  if (offsetMinutes === 0) {
    return base;
  }

  const direction:
    OffsetDirection =
      offsetMinutes > 0
        ? "plus"
        : "minus";

  const absoluteMinutes =
    Math.abs(offsetMinutes);

  const hours =
    Math.floor(
      absoluteMinutes /
        MINUTES_PER_HOUR,
    );

  const minutes =
    absoluteMinutes %
    MINUTES_PER_HOUR;

  return minutes === 0
    ? `${base}-${direction}-${hours}`
    : `${base}-${direction}-${hours}-${padNumber(
        minutes,
      )}`;
}

function isOffsetValid(
  offsetMinutes: number,
) {
  return (
    Number.isInteger(
      offsetMinutes,
    ) &&
    offsetMinutes >=
      MIN_OFFSET_MINUTES &&
    offsetMinutes <=
      MAX_OFFSET_MINUTES
  );
}

function createDynamicOffsetDefinition({
  base,
  offsetMinutes,
}: {
  base: OffsetBase;
  offsetMinutes: number;
}): TimezoneDefinition {
  const abbreviation =
    formatSignedOffset(
      base,
      offsetMinutes,
    );

  const baseName =
    base === "utc"
      ? "Coordinated Universal Time"
      : "Greenwich Mean Time";

  return {
    slug:
      createOffsetSlug(
        base,
        offsetMinutes,
      ),

    abbreviation,

    name:
      `${abbreviation} Fixed Offset`,

    description:
      `${abbreviation} is a fixed time offset based on ${baseName}. It remains ${Math.abs(
        offsetMinutes,
      )} minute${
        Math.abs(
          offsetMinutes,
        ) === 1
          ? ""
          : "s"
      } ${
        offsetMinutes > 0
          ? "ahead of"
          : offsetMinutes < 0
            ? "behind"
            : "equal to"
      } ${base.toUpperCase()} and does not change automatically for daylight saving time.`,

    kind: "fixed",

    offsetMinutes,

    observesDst: false,

    regions: [
      "Worldwide",
    ],
  };
}

function parseCanonicalSlug(
  normalizedValue: string,
) {
  const match =
    normalizedValue.match(
      /^(utc|gmt)-(plus|minus)-(\d{1,2})(?:-(\d{1,2}))?$/,
    );

  if (!match) {
    return null;
  }

  const [
    ,
    baseValue,
    directionValue,
    hourValue,
    minuteValue,
  ] = match;

  const base =
    baseValue as OffsetBase;

  const direction =
    directionValue as OffsetDirection;

  const hours =
    Number(hourValue);

  const minutes =
    minuteValue
      ? Number(minuteValue)
      : 0;

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    minutes < 0 ||
    minutes >= 60 ||
    !ALLOWED_MINUTE_PARTS.has(
      minutes,
    )
  ) {
    return null;
  }

  const absoluteOffset =
    hours *
      MINUTES_PER_HOUR +
    minutes;

  const offsetMinutes =
    direction === "plus"
      ? absoluteOffset
      : -absoluteOffset;

  if (
    !isOffsetValid(
      offsetMinutes,
    )
  ) {
    return null;
  }

  return {
    base,
    offsetMinutes,
  };
}

function parseDisplayValue(
  normalizedValue: string,
) {
  /*
   * Formats acceptés :
   *
   * UTC+05:30
   * UTC-05:30
   * UTC+0530
   * UTC-0530
   * UTC+5
   * UTC-5
   *
   * utc-plus-5-30 et utc-minus-5-30
   * sont déjà traités par parseCanonicalSlug().
   */
  const match =
    normalizedValue.match(
      /^(utc|gmt)([+-])(\d{1,2})(?::?(\d{2}))?$/,
    );

  if (!match) {
    return null;
  }

  const [
    ,
    baseValue,
    sign,
    hourValue,
    minuteValue,
  ] = match;

  const base =
    baseValue as OffsetBase;

  const hours =
    Number(hourValue);

  const minutes =
    minuteValue
      ? Number(minuteValue)
      : 0;

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    minutes < 0 ||
    minutes >= 60 ||
    !ALLOWED_MINUTE_PARTS.has(
      minutes,
    )
  ) {
    return null;
  }

  const absoluteOffset =
    hours *
      MINUTES_PER_HOUR +
    minutes;

  const offsetMinutes =
    sign === "+"
      ? absoluteOffset
      : -absoluteOffset;

  if (
    !isOffsetValid(
      offsetMinutes,
    )
  ) {
    return null;
  }

  return {
    base,
    offsetMinutes,
  };
}

export function resolveDynamicOffset(
  value: string,
): TimezoneDefinition | null {
  const normalizedValue =
    normalizeValue(value);

  if (!normalizedValue) {
    return null;
  }

  const parsed =
    parseCanonicalSlug(
      normalizedValue,
    ) ??
    parseDisplayValue(
      normalizedValue,
    );

  if (!parsed) {
    return null;
  }

  if (
    parsed.offsetMinutes === 0
  ) {
    return {
      slug: parsed.base,

      abbreviation:
        parsed.base.toUpperCase(),

      name:
        parsed.base === "utc"
          ? "Coordinated Universal Time"
          : "Greenwich Mean Time",

      description:
        parsed.base === "utc"
          ? "The primary international time standard used to coordinate clocks worldwide."
          : "A time standard based on mean solar time at Greenwich, London.",

      kind: "fixed",

      offsetMinutes: 0,

      observesDst: false,

      regions: [
        "Worldwide",
      ],
    };
  }

  return createDynamicOffsetDefinition(
    parsed,
  );
}

export function createUtcOffsetTimezone(
  offsetMinutes: number,
) {
  if (
    !isOffsetValid(
      offsetMinutes,
    )
  ) {
    return null;
  }

  return createDynamicOffsetDefinition({
    base: "utc",
    offsetMinutes,
  });
}

export function createGmtOffsetTimezone(
  offsetMinutes: number,
) {
  if (
    !isOffsetValid(
      offsetMinutes,
    )
  ) {
    return null;
  }

  return createDynamicOffsetDefinition({
    base: "gmt",
    offsetMinutes,
  });
}