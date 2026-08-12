import {
  getSelectedOffsetTimezones,
} from "./offset-catalog";

import {
  resolveTimezone,
} from "./resolver";

import type {
  TimezoneDefinition,
} from "./types";

export type TimezoneSeoPair = {
  fromTimezone:
    TimezoneDefinition;

  toTimezone:
    TimezoneDefinition;
};

/*
 * Fuseaux populaires vers lesquels
 * chaque offset sera relié.
 *
 * Nous gardons une sélection contrôlée
 * pour éviter plusieurs milliers de pages
 * faibles ou inutiles.
 */
const POPULAR_TARGET_SLUGS = [
  "utc",
  "gmt",

  "pst",
  "est",

  "pacific-time",
  "eastern-time",

  "cet",
  "jst",
  "ist-india",
  "aest",
] as const;

function getPopularTargets() {
  const targets =
    POPULAR_TARGET_SLUGS.map(
      (slug) =>
        resolveTimezone(slug),
    );

  return targets.filter(
    (
      timezone,
    ): timezone is TimezoneDefinition =>
      timezone !== null,
  );
}

function createPairKey(
  fromSlug: string,
  toSlug: string,
) {
  return (
    `${fromSlug}::` +
    `${toSlug}`
  );
}

export function getOffsetSeoPairs():
  TimezoneSeoPair[] {
  const offsets =
    getSelectedOffsetTimezones();

  const popularTargets =
    getPopularTargets();

  const pairs:
    TimezoneSeoPair[] = [];

  const usedPairs =
    new Set<string>();

  function addPair(
    fromTimezone:
      TimezoneDefinition,

    toTimezone:
      TimezoneDefinition,
  ) {
    if (
      fromTimezone.slug ===
      toTimezone.slug
    ) {
      return;
    }

    const key =
      createPairKey(
        fromTimezone.slug,
        toTimezone.slug,
      );

    if (
      usedPairs.has(key)
    ) {
      return;
    }

    usedPairs.add(key);

    pairs.push({
      fromTimezone,
      toTimezone,
    });
  }

  for (
    const offsetTimezone of offsets
  ) {
    for (
      const targetTimezone of
        popularTargets
    ) {
      addPair(
        offsetTimezone,
        targetTimezone,
      );

      /*
       * Ajout de la conversion inverse :
       *
       * EST → UTC+01:00
       * UTC+01:00 → EST
       */
      addPair(
        targetTimezone,
        offsetTimezone,
      );
    }
  }

  return pairs;
}