import {
  convertTimezoneTime,
  resolveTimezone,
} from "../lib/timezones";

const testValues = [
  "utc-plus-1",
  "utc-minus-5",
  "utc-plus-5-30",
  "gmt-plus-2",
  "gmt-minus-3-30",
  "UTC+05:30",
  "GMT-04:00",
  "utc-plus-14",
  "utc-minus-12",
];

for (
  const value of testValues
) {
  const timezone =
    resolveTimezone(value);

  console.log(
    value,
    "=>",
    timezone
      ? {
          slug:
            timezone.slug,

          abbreviation:
            timezone.abbreviation,

          offsetMinutes:
            timezone.offsetMinutes,
        }
      : null,
  );
}

const fromTimezone =
  resolveTimezone(
    "utc-plus-5-30",
  );

const toTimezone =
  resolveTimezone(
    "gmt-minus-4",
  );

if (
  !fromTimezone ||
  !toTimezone
) {
  throw new Error(
    "Dynamic offset resolution failed.",
  );
}

const result =
  convertTimezoneTime({
    localDateTime:
      "2026-07-28T09:00",

    fromTimezone,
    toTimezone,
  });

console.log(
  "\nConversion result:",
  result,
);