import "server-only";

import type { CityOption } from "@/types/city";

import {
  findCityBySlug,
} from "@/services/city.service";

export type ConverterPageData = {
  fromCity: CityOption;
  toCity: CityOption;
  canonicalPair: string;
};

function getSeparatorIndexes(
  value: string,
  separator: string,
) {
  const indexes: number[] = [];

  let position = value.indexOf(
    separator,
  );

  while (position !== -1) {
    indexes.push(position);

    position = value.indexOf(
      separator,
      position + separator.length,
    );
  }

  return indexes;
}

export async function resolveConverterPair(
  rawPair: string,
): Promise<ConverterPageData | null> {
  const pair = decodeURIComponent(
    rawPair,
  )
    .trim()
    .toLowerCase();

  const separator = "-to-";

  const separatorIndexes =
    getSeparatorIndexes(
      pair,
      separator,
    );

  if (separatorIndexes.length === 0) {
    return null;
  }

  /*
   * On teste chaque occurrence de "-to-".
   *
   * Cela évite de casser les rares slugs
   * pouvant eux-mêmes contenir cette chaîne.
   */
  for (
    const separatorIndex of
      separatorIndexes
  ) {
    const fromSlug = pair
      .slice(0, separatorIndex)
      .trim();

    const toSlug = pair
      .slice(
        separatorIndex +
          separator.length,
      )
      .trim();

    if (!fromSlug || !toSlug) {
      continue;
    }

    const [
      fromCity,
      toCity,
    ] = await Promise.all([
      findCityBySlug(fromSlug),
      findCityBySlug(toSlug),
    ]);

    if (!fromCity || !toCity) {
      continue;
    }

    return {
      fromCity,
      toCity,

      canonicalPair:
        `${fromCity.slug}-to-${toCity.slug}`,
    };
  }

  return null;
}