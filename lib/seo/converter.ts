import {
  createMetadata,
} from "./metadata";

type ConverterMetadataInput = {
  fromCity: string;
  fromCountry: string;
  fromSlug: string;

  toCity: string;
  toCountry: string;
  toSlug: string;
};

export function createConverterMetadata({
  fromCity,
  fromCountry,
  fromSlug,
  toCity,
  toCountry,
  toSlug,
}: ConverterMetadataInput) {
  const normalizedFromSlug =
    fromSlug
      .trim()
      .toLowerCase();

  const normalizedToSlug =
    toSlug
      .trim()
      .toLowerCase();

  const path =
    `/converter/${normalizedFromSlug}-to-${normalizedToSlug}`;

  return createMetadata({
    title:
      `${fromCity} to ${toCity} Time Converter | TimeInOne`,

    description:
      `Convert ${fromCity}, ${fromCountry} time to ${toCity}, ${toCountry} time. Compare the current time difference, working hours and the best meeting times.`,

    path,

    keywords: [
      `${fromCity} to ${toCity} time`,
      `${fromCity} time to ${toCity}`,
      `${fromCity} ${toCity} time difference`,
      `${fromCity} to ${toCity} converter`,
      `${fromCity} meeting time ${toCity}`,
      "time zone converter",
      "world time converter",
    ],
  });
}