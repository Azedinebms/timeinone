export type CitySearchResult = {
  id: number;
  geonameId: number;

  name: string;
  asciiName: string | null;
  slug: string;

  country: {
    id: number;
    name: string;
    iso2: string;
    iso3: string | null;
  };

  timezone: {
    id: number;
    name: string;
  };

  latitude: number | null;
  longitude: number | null;
  population: number | null;

  routeSlug: string;
  worldClockPath: string;
};

export type CitySearchResponse = {
  query: string;
  normalizedQuery: string;

  results: CitySearchResult[];
  count: number;

  limit: number;
  minimumQueryLength: number;
};

export type CitySearchErrorResponse = {
  query: string;
  results: [];
  count: 0;

  error: string;
};