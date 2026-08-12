import { getTimezoneOffset } from "./timezone";

export function calculateTimeDifference(
  date: Date,
  fromTimezone: string,
  toTimezone: string,
) {
  return (
    getTimezoneOffset(date, toTimezone) -
    getTimezoneOffset(date, fromTimezone)
  );
}

export function formatTimeDifference(hours: number) {
  if (hours === 0) {
    return "the same time";
  }

  const absoluteHours = Math.abs(hours);
  const direction = hours > 0 ? "ahead" : "behind";

  const value = Number.isInteger(absoluteHours)
    ? absoluteHours.toString()
    : absoluteHours.toFixed(1);

  return `${value} hour${
    absoluteHours === 1 ? "" : "s"
  } ${direction}`;
}