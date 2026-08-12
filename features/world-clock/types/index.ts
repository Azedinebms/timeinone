export type WorldClockCity = {
  slug: string;
  name: string;

  country: string;
  countryCode: string;

  timeZone: string;
  region: string;

  priority: number;

  id?: number;
  geonameId?: number;

  asciiName?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  population?: number | null;
};