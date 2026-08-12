"use client";

import {
  useRouter,
} from "next/navigation";

import AtlasCitySearch from "@/features/city-search/components/AtlasCitySearch";

import {
  parseWorldClockCityRouteSlug,
} from "@/features/world-clock/routing";

import type {
  CitySearchResult,
} from "@/features/city-search/types";

type CurrentTimeCitySearchProps = {
  placeholder?: string;
  limit?: number;
  autoFocus?: boolean;
  className?: string;
};

export default function CurrentTimeCitySearch({
  placeholder =
    "Search a city...",
  limit =
    10,
  autoFocus =
    false,
  className =
    "",
}: CurrentTimeCitySearchProps) {
  const router =
    useRouter();

  function handleSelect(
    city:
      CitySearchResult,
  ) {
    const parsed =
      parseWorldClockCityRouteSlug(
        city.routeSlug,
      );

    const countryCode =
      city.country.iso2
        .trim()
        .toLowerCase();

    const citySlug =
      parsed.citySlug
        .trim()
        .toLowerCase();

    if (
      !countryCode ||
      !citySlug
    ) {
      return;
    }

    router.push(
      `/current-time/${countryCode}/${citySlug}`,
    );
  }

  return (
    <AtlasCitySearch
      placeholder={
        placeholder
      }
      limit={
        limit
      }
      autoFocus={
        autoFocus
      }
      className={
        className
      }
      onSelect={
        handleSelect
      }
    />
  );
}