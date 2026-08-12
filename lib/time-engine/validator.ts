export function isTimezoneValid(
  timezone: string,
) {
  try {
    Intl.DateTimeFormat(undefined, {
      timeZone: timezone,
    });

    return true;
  } catch {
    return false;
  }
}

export function isDateValid(
  date: Date,
) {
  return !Number.isNaN(date.getTime());
}