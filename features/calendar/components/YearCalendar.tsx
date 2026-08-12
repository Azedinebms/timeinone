import CalendarMonth from "./CalendarMonth";

import {
  createYearCalendar,
} from "@/lib/calendar";

type YearCalendarProps = {
  year:
    number;
};

export default function YearCalendar({
  year,
}: YearCalendarProps) {
  const months =
    createYearCalendar(
      year,
    );

  return (
    <div className="print-calendar-grid grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {months.map(
        (
          month,
        ) => (
          <CalendarMonth
            key={
              `${year}-${month.month}`
            }
            month={
              month
            }
          />
        ),
      )}
    </div>
  );
}