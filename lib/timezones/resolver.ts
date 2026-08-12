import {
  TIMEZONE_ALIASES,
} from "./aliases";

import {
  TIMEZONE_DEFINITIONS,
} from "./definitions";

import {
  resolveDynamicOffset,
} from "./dynamic-offset";

import type {
  TimezoneDefinition,
} from "./types";

function normalizeTimezoneValue(
  value: string,
) {
  return decodeURIComponent(value)
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function resolveTimezone(
  value: string,
): TimezoneDefinition | null {
  const normalized =
    normalizeTimezoneValue(value);

  if (!normalized) {
    return null;
  }

  const canonicalSlug =
    TIMEZONE_ALIASES[normalized] ??
    normalized;

  const predefinedTimezone =
    TIMEZONE_DEFINITIONS.find(
      (timezone) =>
        timezone.slug ===
        canonicalSlug,
    );

  if (predefinedTimezone) {
    return predefinedTimezone;
  }

  return resolveDynamicOffset(
    canonicalSlug,
  );
}

export function getAllTimezones() {
  return [
    ...TIMEZONE_DEFINITIONS,
  ];
}