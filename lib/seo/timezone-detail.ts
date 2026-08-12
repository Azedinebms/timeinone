import {
  createMetadata,
} from "./metadata";

type TimezoneDetailMetadataInput = {
  slug: string;
  abbreviation: string;
  name: string;
};

export function createTimezoneDetailMetadata({
  slug,
  abbreviation,
  name,
}: TimezoneDetailMetadataInput) {
  const normalizedSlug =
    slug
      .trim()
      .toLowerCase();

  return createMetadata({
    title:
      `Current ${abbreviation} Time — ${name} | TimeInOne`,

    description:
      `View the current ${abbreviation} time, active UTC offset, regions, daylight-saving behavior and popular conversions for ${name}.`,

    path:
      `/timezone/${normalizedSlug}`,

    keywords: [
      `${abbreviation} time`,
      `current ${abbreviation} time`,
      `${abbreviation} time now`,
      name,
      `${abbreviation} UTC offset`,
      `${abbreviation} timezone`,
      "current timezone time",
    ],
  });
}