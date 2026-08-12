import {
  createMetadata,
} from "./metadata";

type TimezoneConverterMetadataInput = {
  fromSlug: string;
  fromAbbreviation: string;
  fromName: string;

  toSlug: string;
  toAbbreviation: string;
  toName: string;
};

export function createTimezoneConverterMetadata({
  fromSlug,
  fromAbbreviation,
  fromName,

  toSlug,
  toAbbreviation,
  toName,
}: TimezoneConverterMetadataInput) {
  const normalizedFromSlug =
    fromSlug
      .trim()
      .toLowerCase();

  const normalizedToSlug =
    toSlug
      .trim()
      .toLowerCase();

  const path =
    `/timezone/${normalizedFromSlug}-to-${normalizedToSlug}`;

  return createMetadata({
    title:
      `${fromAbbreviation} to ${toAbbreviation} Time Converter | TimeInOne`,

    description:
      `Convert ${fromAbbreviation} (${fromName}) to ${toAbbreviation} (${toName}). Compare UTC offsets, convert any date and view a 24-hour conversion table.`,

    path,

    keywords: [
      `${fromAbbreviation} to ${toAbbreviation}`,
      `${fromAbbreviation} to ${toAbbreviation} time`,
      `${fromAbbreviation} ${toAbbreviation} converter`,
      `${fromName} to ${toName}`,
      `${fromAbbreviation} time converter`,
      "timezone converter",
      "UTC offset converter",
    ],
  });
}