"use client";

import {
  useState,
} from "react";

import YearCalendar from "./YearCalendar";

type PrintableCalendarProps = {
  initialYear:
    number;
};

export default function PrintableCalendar({
  initialYear,
}: PrintableCalendarProps) {
  const [
    year,
    setYear,
  ] =
    useState(
      initialYear,
    );

  function printCalendar() {
    window.print();
  }

  return (
    <>
      {/* =====================================
          PRINT CONTROLS
      ====================================== */}

      <div className="print:hidden">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <label className="w-full sm:max-w-xs">
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
              Calendar year
            </span>

            <input
              type="number"
              min="1900"
              max="2100"
              value={
                year
              }
              onChange={(
                event,
              ) => {
                setYear(
                  Number(
                    event.target.value,
                  ),
                );
              }}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-text-primary outline-none transition focus:border-primary"
            />
          </label>

          <button
            type="button"
            onClick={
              printCalendar
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M7 8V3h10v5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <rect
                x="6"
                y="14"
                width="12"
                height="7"
                rx="1"
              />

              <path
                d="M6 17H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Print calendar
          </button>
        </div>
      </div>

      {/* =====================================
          PRINTABLE AREA
      ====================================== */}

      <section
        id="print-year-calendar"
        className="print-calendar-page mt-8 print:mt-0"
      >
        <header className="mb-7 text-center print:mb-3">
          <h1 className="text-3xl font-black tracking-tight text-text-primary print:text-[20px] print:text-black">
            {
              year
            }{" "}
            Calendar
          </h1>

          <p className="mt-2 text-sm text-text-muted print:mt-1 print:text-[8px] print:text-black">
            TimeInOne · Full-year calendar
          </p>
        </header>

        <YearCalendar
          year={
            year
          }
        />
      </section>
    </>
  );
}