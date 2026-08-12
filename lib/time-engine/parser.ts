import { TimeLocation } from "./types";

export function parseLocation(input: string): TimeLocation {
  const [city, country, timezone] = input.split("|");

  return {
    city: city.trim(),
    country: country.trim(),
    timezone: timezone.trim(),
  };
}

export function serializeLocation(location: TimeLocation): string {
  return [
    location.city,
    location.country,
    location.timezone,
  ].join("|");
}