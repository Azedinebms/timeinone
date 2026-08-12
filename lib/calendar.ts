export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const WEEKDAY_NAMES = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

export type CalendarDay = {
  day: number;
  date: string;
  weekday: number;

  isWeekend: boolean;
  isToday: boolean;
};

export type CalendarMonth = {
  year: number;
  month: number;

  name: string;

  firstWeekday: number;
  daysInMonth: number;

  days: CalendarDay[];
};

function padNumber(
  value: number,
): string {
  return value
    .toString()
    .padStart(
      2,
      "0",
    );
}

export function createDateKey(
  year: number,
  month: number,
  day: number,
): string {
  return [
    year,
    padNumber(
      month + 1,
    ),
    padNumber(
      day,
    ),
  ].join(
    "-",
  );
}

export function isLeapYear(
  year: number,
): boolean {
  return (
    year % 400 === 0 ||
    (
      year % 4 === 0 &&
      year % 100 !== 0
    )
  );
}

export function getDaysInMonth(
  year: number,
  month: number,
): number {
  return new Date(
    Date.UTC(
      year,
      month + 1,
      0,
    ),
  ).getUTCDate();
}

export function getFirstWeekday(
  year: number,
  month: number,
): number {
  return new Date(
    Date.UTC(
      year,
      month,
      1,
    ),
  ).getUTCDay();
}

export function createCalendarMonth(
  year: number,
  month: number,
  today = new Date(),
): CalendarMonth {
  const daysInMonth =
    getDaysInMonth(
      year,
      month,
    );

  const firstWeekday =
    getFirstWeekday(
      year,
      month,
    );

  const todayKey =
    createDateKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

  const days =
    Array.from(
      {
        length:
          daysInMonth,
      },
      (
        _,
        index,
      ) => {
        const day =
          index + 1;

        const date =
          new Date(
            Date.UTC(
              year,
              month,
              day,
            ),
          );

        const weekday =
          date.getUTCDay();

        const dateKey =
          createDateKey(
            year,
            month,
            day,
          );

        return {
          day,

          date:
            dateKey,

          weekday,

          isWeekend:
            weekday === 0 ||
            weekday === 6,

          isToday:
            dateKey ===
            todayKey,
        };
      },
    );

  return {
    year,
    month,

    name:
      MONTH_NAMES[
        month
      ],

    firstWeekday,
    daysInMonth,

    days,
  };
}

export function createYearCalendar(
  year: number,
): CalendarMonth[] {
  return Array.from(
    {
      length:
        12,
    },
    (
      _,
      month,
    ) =>
      createCalendarMonth(
        year,
        month,
      ),
  );
}

export function isValidCalendarYear(
  year: number,
): boolean {
  return (
    Number.isInteger(
      year,
    ) &&
    year >= 1900 &&
    year <= 2100
  );
}