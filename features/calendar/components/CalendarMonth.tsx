import {
  WEEKDAY_NAMES,
  type CalendarMonth as CalendarMonthData,
} from "@/lib/calendar";

type CalendarMonthProps = {
  month:
    CalendarMonthData;
};

export default function CalendarMonth({
  month,
}: CalendarMonthProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-muted hover:shadow-md">
      {/* MONTH HEADER */}

      <header className="flex items-center justify-between border-b border-border bg-surface-soft px-4 py-3">
        <div>
          <h2 className="font-bold text-text-primary">
            {
              month.name
            }
          </h2>

          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            {
              month.year
            }
          </p>
        </div>

        <span className="rounded-lg border border-border bg-white px-2.5 py-1 text-xs font-bold text-text-muted">
          {
            month.daysInMonth
          }{" "}
          days
        </span>
      </header>

      {/* WEEKDAYS */}

      <div className="grid grid-cols-7 border-b border-border bg-white">
        {WEEKDAY_NAMES.map(
          (
            weekday,
            index,
          ) => (
            <div
              key={
                weekday
              }
              className={[
                "py-2",
                "text-center",
                "text-[9px]",
                "font-bold",
                "uppercase",
                "tracking-[0.08em]",

                index === 0 ||
                index === 6
                  ? "text-primary"
                  : "text-text-muted",
              ].join(
                " ",
              )}
            >
              {
                weekday
              }
            </div>
          ),
        )}
      </div>

      {/* DAYS */}

      <div className="grid grid-cols-7 gap-px bg-border/60">
        {Array.from({
          length:
            month.firstWeekday,
        }).map(
          (
            _,
            index,
          ) => (
            <div
              key={
                `empty-${index}`
              }
              className="aspect-square bg-surface-soft/50"
            />
          ),
        )}

        {month.days.map(
          (
            day,
          ) => (
            <div
              key={
                day.date
              }
              className={[
                "relative",
                "flex",
                "aspect-square",
                "items-center",
                "justify-center",
                "bg-white",
                "text-xs",
                "font-semibold",
                "transition-colors",

                day.isWeekend
                  ? "text-primary"
                  : "text-text-primary",

                day.isToday
                  ? "z-10"
                  : "",
              ].join(
                " ",
              )}
            >
              {day.isToday && (
                <span className="absolute inset-1 rounded-lg bg-primary" />
              )}

              <span
                className={[
                  "relative",
                  "z-10",

                  day.isToday
                    ? "font-black text-white"
                    : "",
                ].join(
                  " ",
                )}
              >
                {
                  day.day
                }
              </span>
            </div>
          ),
        )}
      </div>
    </article>
  );
}