const MILLISECONDS_PER_HOUR = 3_600_000;

export function getTimezoneOffset(
  date: Date,
  timeZone: string,
) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  const utcTimestamp = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );

  return (
    utcTimestamp - date.getTime()
  ) / MILLISECONDS_PER_HOUR;
}

export function formatDateTimeInput(
  date: Date,
  timeZone: string,
) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

export function zonedDateTimeToDate(
  localDateTime: string,
  timeZone: string,
) {
  const match = localDateTime.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/,
  );

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute] = match;

  const wallTimeAsUtc = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    0,
  );

  let utcTimestamp = wallTimeAsUtc;

  for (let index = 0; index < 3; index += 1) {
    const offset = getTimezoneOffset(
      new Date(utcTimestamp),
      timeZone,
    );

    utcTimestamp =
      wallTimeAsUtc -
      offset * MILLISECONDS_PER_HOUR;
  }

  const result = new Date(utcTimestamp);

  return Number.isNaN(result.getTime())
    ? null
    : result;
}