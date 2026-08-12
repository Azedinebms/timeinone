const MINUTES_PER_HOUR = 60;

export function formatOffsetMinutes(
  offsetMinutes: number,
) {
  const sign =
    offsetMinutes >= 0 ? "+" : "-";

  const absoluteMinutes =
    Math.abs(offsetMinutes);

  const hours = Math.floor(
    absoluteMinutes /
      MINUTES_PER_HOUR,
  );

  const minutes =
    absoluteMinutes %
    MINUTES_PER_HOUR;

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

export function formatDifferenceMinutes(
  differenceMinutes: number,
  fromLabel: string,
  toLabel: string,
) {
  if (differenceMinutes === 0) {
    return (
      `${fromLabel} and ${toLabel} ` +
      "have the same UTC offset"
    );
  }

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

  const duration =
    parts.join(" and ");

  return differenceMinutes > 0
    ? `${toLabel} is ${duration} ahead of ${fromLabel}`
    : `${toLabel} is ${duration} behind ${fromLabel}`;
}