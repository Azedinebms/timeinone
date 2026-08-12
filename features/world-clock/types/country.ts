import type {
  WorldClockCity,
} from "./index";

export type WorldClockCountry = {
  id: number;

  name: string;
  countryCode: string;
  iso3: string | null;

  cityCount: number;
};

export type WorldClockCountryPageData = {
  country: WorldClockCountry;
  cities: WorldClockCity[];
};