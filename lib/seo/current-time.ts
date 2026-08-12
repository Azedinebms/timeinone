import {
  createMetadata,
} from "./metadata";

type CurrentTimeMetadataInput = {
  city: string;
  country: string;
  countryCode: string;
  slug: string;
  timezone: string;
};

export function createCurrentTimeMetadata({
  city,
  country,
  countryCode,
  slug,
  timezone,
}: CurrentTimeMetadataInput) {
  const path =
    `/current-time/${countryCode
      .trim()
      .toLowerCase()}/${slug
      .trim()
      .toLowerCase()}`;

  return createMetadata({
    title:
      `Current Time in ${city}, ${country} | TimeInOne`,

    description:
      `Find the current local time in ${city}, ${country}. View the date, UTC offset, time zone, working-hours status and daylight-saving information for ${timezone}.`,

    path,

    keywords: [
      `current time in ${city}`,
      `${city} time now`,
      `${city} local time`,
      `${country} current time`,
      timezone,
      "world clock",
      "time zone converter",
    ],
  });
}