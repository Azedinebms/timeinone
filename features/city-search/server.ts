import "server-only";

export {
  CITY_SEARCH_MIN_QUERY_LENGTH,
  citySearchService,
  getNormalizedCitySearchLimit,
  getNormalizedCitySearchQuery,
  resolveAtlasCitiesByRouteSlugs,
  searchAtlasCities,
} from "./services/citySearchService";

export type {
  CitySearchErrorResponse,
  CitySearchResponse,
  CitySearchResult,
} from "./types";