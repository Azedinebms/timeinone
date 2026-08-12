export type BusinessHours = {
  startHour: number;
  endHour: number;
  workingDays: number[];
};

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  startHour: 9,
  endHour: 18,
  workingDays: [1, 2, 3, 4, 5],
};

type LocalBusinessParts = {
  hour: number;
  minute: number;
  weekday: number;
};

const WEEKDAY_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function getLocalBusinessParts(
  date: Date,
  timeZone: string,
): LocalBusinessParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    hour: Number(values.hour),
    minute: Number(values.minute),
    weekday: WEEKDAY_MAP[values.weekday] ?? -1,
  };
}

export function isInsideBusinessHours(
  date: Date,
  timeZone: string,
  businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS,
) {
  const local = getLocalBusinessParts(
    date,
    timeZone,
  );

  if (
    !businessHours.workingDays.includes(
      local.weekday,
    )
  ) {
    return false;
  }

  const decimalHour =
    local.hour + local.minute / 60;

  return (
    decimalHour >= businessHours.startHour &&
    decimalHour < businessHours.endHour
  );
}