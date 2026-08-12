"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  MONTH_NAMES,
  createCalendarMonth,
} from "@/lib/calendar";

import CalendarMonth from "./CalendarMonth";

type MonthlyCalendarProps = {
  initialYear?:
    number;

  initialMonth?:
    number;
};

export default function MonthlyCalendar({
  initialYear,
  initialMonth,
}: MonthlyCalendarProps) {
  const now =
    new Date();

  const [
    year,
    setYear,
  ] =
    useState(
      initialYear ??
        now.getFullYear(),
    );

  const [
    month,
    setMonth,
  ] =
    useState(
      initialMonth ??
        now.getMonth(),
    );

  const calendarMonth =
    useMemo(
      () =>
        createCalendarMonth(
          year,
          month,
        ),
      [
        year,
        month,
      ],
    );

  function goPreviousMonth() {
    if (
      month === 0
    ) {
      setMonth(
        11,
      );

      setYear(
        (
          current,
        ) =>
          current - 1,
      );

      return;
    }

    setMonth(
      (
        current,
      ) =>
        current - 1,
    );
  }

  function goNextMonth() {
    if (
      month === 11
    ) {
      setMonth(
        0,
      );

      setYear(
        (
          current,
        ) =>
          current + 1,
      );

      return;
    }

    setMonth(
      (
        current,
      ) =>
        current + 1,
    );
  }

  function goToday() {
    const today =
      new Date();

    setYear(
      today.getFullYear(),
    );

    setMonth(
      today.getMonth(),
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-white p-5 shadow-sm sm:p-6">
      {/* CONTROLS */}

      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
            Monthly view
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight text-text-primary">
            {
              MONTH_NAMES[
                month
              ]
            }{" "}
            {
              year
            }
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={
              goPreviousMonth
            }
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
          >
            ← Previous
          </button>

          <button
            type="button"
            onClick={
              goToday
            }
            className="inline-flex h-10 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft px-4 text-sm font-bold text-primary transition hover:bg-primary/10"
          >
            Today
          </button>

          <button
            type="button"
            onClick={
              goNextMonth
            }
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
          >
            Next →
          </button>
        </div>
      </div>

      {/* SELECTORS */}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
            Month
          </span>

          <select
            value={
              month
            }
            onChange={(
              event,
            ) => {
              setMonth(
                Number(
                  event.target.value,
                ),
              );
            }}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-text-primary outline-none transition focus:border-primary"
          >
            {MONTH_NAMES.map(
              (
                monthName,
                index,
              ) => (
                <option
                  key={
                    monthName
                  }
                  value={
                    index
                  }
                >
                  {
                    monthName
                  }
                </option>
              ),
            )}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
            Year
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
      </div>

      {/* CALENDAR */}

      <div className="mx-auto mt-6 max-w-xl">
        <CalendarMonth
          month={
            calendarMonth
          }
        />
      </div>
    </section>
  );
}