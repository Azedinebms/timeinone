import type {
  WorldClockCity,
} from "./types";

export type ParsedWorldClockRoute = {
  citySlug: string;
  countryCode: string | null;
};

const COUNTRY_CODE_PATTERN =
  /^[a-z]{2}$/i;

function normalizeRouteValue(
  value: string,
): string {
  try {
    return decodeURIComponent(
      value,
    )
      .trim()
      .toLowerCase();
  } catch {
    return value
      .trim()
      .toLowerCase();
  }
}

export function createWorldClockCityRouteSlug(
  city: Pick<
    WorldClockCity,
    "slug" | "countryCode"
  >,
): string {
  const citySlug =
    normalizeRouteValue(
      city.slug,
    );

  const countryCode =
    city.countryCode
      .trim()
      .toLowerCase();

  return `${citySlug}-${countryCode}`;
}

export function createWorldClockCityPath(
  city: Pick<
    WorldClockCity,
    "slug" | "countryCode"
  >,
): string {
  return `/world-clock/${createWorldClockCityRouteSlug(
    city,
  )}`;
}

export function parseWorldClockCityRouteSlug(
  routeSlug: string,
): ParsedWorldClockRoute {
  const normalizedRouteSlug =
    normalizeRouteValue(
      routeSlug,
    );

  const lastSeparatorIndex =
    normalizedRouteSlug.lastIndexOf(
      "-",
    );

  if (
    lastSeparatorIndex <= 0 ||
    lastSeparatorIndex ===
      normalizedRouteSlug.length - 1
  ) {
    return {
      citySlug:
        normalizedRouteSlug,

      countryCode:
        null,
    };
  }

  const possibleCountryCode =
    normalizedRouteSlug.slice(
      lastSeparatorIndex + 1,
    );

  if (
    !COUNTRY_CODE_PATTERN.test(
      possibleCountryCode,
    )
  ) {
    return {
      citySlug:
        normalizedRouteSlug,

      countryCode:
        null,
    };
  }

  const citySlug =
    normalizedRouteSlug.slice(
      0,
      lastSeparatorIndex,
    );

  return {
    citySlug,

    countryCode:
      possibleCountryCode.toUpperCase(),
  };
}