import type { TimeLocation } from "@/lib/time-engine";

export type ConverterCity = {
  id: number;
  city: string;
  country: string;
  countryCode: string;
  slug: string;
  timezone: string;
};

export type ConverterClock = {
  city: string;
  country: string;
  timezone: string;
  time: string;
  date: string;
};

export type ConverterDifference = {
  hours: number;
  label: string;
  direction: "ahead" | "behind" | "same";
};

export type ConverterResult = {
  instant: Date;
  source: ConverterClock;
  target: ConverterClock;
  difference: ConverterDifference;
};

export function cityToTimeLocation(
  city: ConverterCity,
): TimeLocation {
  return {
    id: city.id,
    city: city.city,
    country: city.country,
    slug: city.slug,
    timezone: city.timezone,
  };
}