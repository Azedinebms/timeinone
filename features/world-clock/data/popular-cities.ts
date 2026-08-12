import type {
  WorldClockCity,
} from "../types";

export const POPULAR_WORLD_CLOCK_CITIES:
  readonly WorldClockCity[] = [
  {
    slug: "new-york",
    name: "New York",
    country: "United States",
    countryCode: "US",
    timeZone: "America/New_York",
    region: "North America",
    priority: 10,
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    country: "United States",
    countryCode: "US",
    timeZone: "America/Los_Angeles",
    region: "North America",
    priority: 20,
  },
  {
    slug: "toronto",
    name: "Toronto",
    country: "Canada",
    countryCode: "CA",
    timeZone: "America/Toronto",
    region: "North America",
    priority: 30,
  },
  {
    slug: "london",
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    timeZone: "Europe/London",
    region: "Europe",
    priority: 40,
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    countryCode: "FR",
    timeZone: "Europe/Paris",
    region: "Europe",
    priority: 50,
  },
  {
    slug: "berlin",
    name: "Berlin",
    country: "Germany",
    countryCode: "DE",
    timeZone: "Europe/Berlin",
    region: "Europe",
    priority: 60,
  },
  {
    slug: "madrid",
    name: "Madrid",
    country: "Spain",
    countryCode: "ES",
    timeZone: "Europe/Madrid",
    region: "Europe",
    priority: 70,
  },
  {
    slug: "rome",
    name: "Rome",
    country: "Italy",
    countryCode: "IT",
    timeZone: "Europe/Rome",
    region: "Europe",
    priority: 80,
  },
  {
    slug: "casablanca",
    name: "Casablanca",
    country: "Morocco",
    countryCode: "MA",
    timeZone: "Africa/Casablanca",
    region: "Africa",
    priority: 90,
  },
  {
    slug: "cairo",
    name: "Cairo",
    country: "Egypt",
    countryCode: "EG",
    timeZone: "Africa/Cairo",
    region: "Africa",
    priority: 100,
  },
  {
    slug: "johannesburg",
    name: "Johannesburg",
    country: "South Africa",
    countryCode: "ZA",
    timeZone: "Africa/Johannesburg",
    region: "Africa",
    priority: 110,
  },
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    timeZone: "Asia/Dubai",
    region: "Asia",
    priority: 120,
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    country: "India",
    countryCode: "IN",
    timeZone: "Asia/Kolkata",
    region: "Asia",
    priority: 130,
  },
  {
    slug: "singapore",
    name: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    timeZone: "Asia/Singapore",
    region: "Asia",
    priority: 140,
  },
  {
    slug: "hong-kong",
    name: "Hong Kong",
    country: "Hong Kong",
    countryCode: "HK",
    timeZone: "Asia/Hong_Kong",
    region: "Asia",
    priority: 150,
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    timeZone: "Asia/Tokyo",
    region: "Asia",
    priority: 160,
  },
  {
    slug: "seoul",
    name: "Seoul",
    country: "South Korea",
    countryCode: "KR",
    timeZone: "Asia/Seoul",
    region: "Asia",
    priority: 170,
  },
  {
    slug: "sydney",
    name: "Sydney",
    country: "Australia",
    countryCode: "AU",
    timeZone: "Australia/Sydney",
    region: "Oceania",
    priority: 180,
  },
  {
    slug: "auckland",
    name: "Auckland",
    country: "New Zealand",
    countryCode: "NZ",
    timeZone: "Pacific/Auckland",
    region: "Oceania",
    priority: 190,
  },
  {
    slug: "sao-paulo",
    name: "São Paulo",
    country: "Brazil",
    countryCode: "BR",
    timeZone: "America/Sao_Paulo",
    region: "South America",
    priority: 200,
  },
] as const;

export function getPopularWorldClockCities():
  WorldClockCity[] {
  return [
    ...POPULAR_WORLD_CLOCK_CITIES,
  ].sort(
    (
      firstCity,
      secondCity,
    ) =>
      firstCity.priority -
      secondCity.priority,
  );
}

export function getPopularWorldClockCityBySlug(
  slug: string,
): WorldClockCity | null {
  const normalizedSlug =
    decodeURIComponent(slug)
      .trim()
      .toLowerCase();

  return (
    POPULAR_WORLD_CLOCK_CITIES.find(
      (city) =>
        city.slug ===
        normalizedSlug,
    ) ?? null
  );
}

export function getRelatedWorldClockCities(
  currentCity: WorldClockCity,
  limit = 6,
): WorldClockCity[] {
  const cities =
    getPopularWorldClockCities();

  const sameRegion =
    cities.filter(
      (city) =>
        city.slug !==
          currentCity.slug &&
        city.region ===
          currentCity.region,
    );

  const otherRegions =
    cities.filter(
      (city) =>
        city.slug !==
          currentCity.slug &&
        city.region !==
          currentCity.region,
    );

  return [
    ...sameRegion,
    ...otherRegions,
  ].slice(0, limit);
}