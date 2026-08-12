import "server-only";

import {
  resolveTimezone,
  type TimezoneDefinition,
} from "@/lib/timezones";

export type TimezonePageData = {
  fromTimezone: TimezoneDefinition;
  toTimezone: TimezoneDefinition;
  canonicalPair: string;
};

function getSeparatorIndexes(
  value: string,
  separator: string,
) {
  const indexes: number[] = [];

  let position = value.indexOf(separator);

  while (position !== -1) {
    indexes.push(position);

    position = value.indexOf(
      separator,
      position + separator.length,
    );
  }

  return indexes;
}

function normalizePair(value: string) {
  return decodeURIComponent(value)
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function resolveTimezonePair(
  rawPair: string,
): TimezonePageData | null {
  const pair = normalizePair(rawPair);
  const separator = "-to-";

  if (!pair) {
    return null;
  }

  const separatorIndexes =
    getSeparatorIndexes(
      pair,
      separator,
    );

  for (const separatorIndex of separatorIndexes) {
    const fromValue = pair
      .slice(0, separatorIndex)
      .trim();

    const toValue = pair
      .slice(
        separatorIndex +
          separator.length,
      )
      .trim();

    if (!fromValue || !toValue) {
      continue;
    }

    const fromTimezone =
      resolveTimezone(fromValue);

    const toTimezone =
      resolveTimezone(toValue);

    if (!fromTimezone || !toTimezone) {
      continue;
    }

    return {
      fromTimezone,
      toTimezone,

      canonicalPair:
        `${fromTimezone.slug}-to-${toTimezone.slug}`,
    };
  }

  return null;
}