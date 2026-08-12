"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  formatDateTimeInput,
} from "@/lib/time-engine";

import type {
  CityOption,
} from "@/types/city";

import {
  convertTime,
} from "../engine";

import {
  useCurrentTime,
} from "../hooks/useCurrentTime";

import BestMeetingTimes from "./BestMeetingTimes";
import CitySearch from "./CitySearch";
import ConverterCard from "./ConverterCard";
import QuickFacts from "./QuickFacts";
import ResultCard from "./ResultCard";
import TimeComparisonTable from "./TimeComparisonTable";

import Button from "@/components/ui/Button";

type ConversionMode =
  | "live"
  | "custom";

type ShareStatus =
  | "idle"
  | "copied"
  | "error";

type ConverterToolProps = {
  initialFromCity:
    CityOption;

  initialToCity:
    CityOption;

  initialDateTime?:
    string;
};

export default function ConverterTool({
  initialFromCity,
  initialToCity,
  initialDateTime = "",
}: ConverterToolProps) {
  const [
    fromCity,
    setFromCity,
  ] =
    useState<CityOption>(
      initialFromCity,
    );

  const [
    toCity,
    setToCity,
  ] =
    useState<CityOption>(
      initialToCity,
    );

  const [
    conversionMode,
    setConversionMode,
  ] =
    useState<ConversionMode>(
      initialDateTime
        ? "custom"
        : "live",
    );

  const [
    selectedDateTime,
    setSelectedDateTime,
  ] =
    useState(
      initialDateTime,
    );

  const [
    shareStatus,
    setShareStatus,
  ] =
    useState<ShareStatus>(
      "idle",
    );

  const currentDate =
    useCurrentTime();

  const displayedDateTime =
    useMemo(
      () => {
        if (
          conversionMode ===
            "live" &&
          currentDate
        ) {
          return formatDateTimeInput(
            currentDate,
            fromCity.timezone,
          );
        }

        return selectedDateTime;
      },
      [
        conversionMode,
        currentDate,
        fromCity.timezone,
        selectedDateTime,
      ],
    );

  const conversionResult =
    useMemo(
      () => {
        if (
          conversionMode ===
          "live"
        ) {
          if (
            !currentDate
          ) {
            return null;
          }

          return convertTime({
            instant:
              currentDate,

            fromCity,

            toCity,
          });
        }

        if (
          !selectedDateTime
        ) {
          return null;
        }

        return convertTime({
          localDateTime:
            selectedDateTime,

          fromCity,

          toCity,
        });
      },
      [
        conversionMode,
        currentDate,
        selectedDateTime,
        fromCity,
        toCity,
      ],
    );

  const updateShareableUrl = (
    nextFromCity =
      fromCity,

    nextToCity =
      toCity,

    nextDateTime =
      displayedDateTime,
  ) => {
    const searchParams =
      new URLSearchParams();

    searchParams.set(
      "from",
      nextFromCity.id.toString(),
    );

    searchParams.set(
      "to",
      nextToCity.id.toString(),
    );

    if (
      nextDateTime
    ) {
      searchParams.set(
        "datetime",
        nextDateTime,
      );
    }

    const relativeUrl =
      `/?${searchParams.toString()}`;

    window.history.replaceState(
      null,
      "",
      relativeUrl,
    );

    return (
      window.location.origin +
      relativeUrl
    );
  };

  const handleFromCityChange = (
    nextCity:
      CityOption,
  ) => {
    let nextDateTime =
      selectedDateTime;

    if (
      conversionMode ===
        "custom" &&
      conversionResult
    ) {
      nextDateTime =
        formatDateTimeInput(
          conversionResult.instant,
          nextCity.timezone,
        );

      setSelectedDateTime(
        nextDateTime,
      );
    }

    setFromCity(
      nextCity,
    );

    setShareStatus(
      "idle",
    );

    updateShareableUrl(
      nextCity,
      toCity,
      conversionMode ===
        "custom"
        ? nextDateTime
        : "",
    );
  };

  const handleToCityChange = (
    nextCity:
      CityOption,
  ) => {
    setToCity(
      nextCity,
    );

    setShareStatus(
      "idle",
    );

    updateShareableUrl(
      fromCity,
      nextCity,
      conversionMode ===
        "custom"
        ? selectedDateTime
        : "",
    );
  };

  const swapCities = () => {
    const nextFromCity =
      toCity;

    const nextToCity =
      fromCity;

    let nextDateTime =
      selectedDateTime;

    if (
      conversionMode ===
        "custom" &&
      conversionResult
    ) {
      nextDateTime =
        formatDateTimeInput(
          conversionResult.instant,
          nextFromCity.timezone,
        );

      setSelectedDateTime(
        nextDateTime,
      );
    }

    setFromCity(
      nextFromCity,
    );

    setToCity(
      nextToCity,
    );

    setShareStatus(
      "idle",
    );

    updateShareableUrl(
      nextFromCity,
      nextToCity,
      conversionMode ===
        "custom"
        ? nextDateTime
        : "",
    );
  };

  const handleDateTimeChange = (
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nextDateTime =
      event.target.value;

    setSelectedDateTime(
      nextDateTime,
    );

    setConversionMode(
      "custom",
    );

    setShareStatus(
      "idle",
    );

    updateShareableUrl(
      fromCity,
      toCity,
      nextDateTime,
    );
  };

  const useCurrentDateTime =
    () => {
      setSelectedDateTime(
        "",
      );

      setConversionMode(
        "live",
      );

      setShareStatus(
        "idle",
      );

      updateShareableUrl(
        fromCity,
        toCity,
        "",
      );
    };

  const handleSelectMeetingTime = (
    date:
      Date,
  ) => {
    const nextDateTime =
      formatDateTimeInput(
        date,
        fromCity.timezone,
      );

    setSelectedDateTime(
      nextDateTime,
    );

    setConversionMode(
      "custom",
    );

    setShareStatus(
      "idle",
    );

    updateShareableUrl(
      fromCity,
      toCity,
      nextDateTime,
    );

    document
      .getElementById(
        "conversion-datetime",
      )
      ?.scrollIntoView({
        behavior:
          "smooth",

        block:
          "center",
      });
  };

  const copyShareLink =
    async () => {
      try {
        const shareUrl =
          updateShareableUrl(
            fromCity,
            toCity,
            displayedDateTime,
          );

        await navigator.clipboard.writeText(
          shareUrl,
        );

        setShareStatus(
          "copied",
        );

        window.setTimeout(
          () => {
            setShareStatus(
              "idle",
            );
          },
          2500,
        );
      } catch {
        setShareStatus(
          "error",
        );
      }
    };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <ConverterCard className="mx-auto max-w-5xl">
        {/* =========================
            CITY SELECTORS
        ========================== */}

        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <CitySearch
            key={`from-${fromCity.id}`}
            id="from-city"
            label="From"
            value={
              fromCity
            }
            onChange={
              handleFromCityChange
            }
          />

          <button
            type="button"
            onClick={
              swapCities
            }
            aria-label="Swap cities"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-soft text-xl text-text-secondary shadow-sm outline-none transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
          >
            ⇄
          </button>

          <CitySearch
            key={`to-${toCity.id}`}
            id="to-city"
            label="To"
            value={
              toCity
            }
            onChange={
              handleToCityChange
            }
          />
        </div>

        {/* =========================
            DATE / TIME
        ========================== */}

        <div className="mt-6 rounded-2xl border border-border bg-surface-soft p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="conversion-datetime"
                className="mb-2 block text-sm font-semibold text-text-primary"
              >
                Date and time in{" "}
                {
                  fromCity.city
                }
              </label>

              <input
                id="conversion-datetime"
                type="datetime-local"
                value={
                  displayedDateTime
                }
                onChange={
                  handleDateTimeChange
                }
                className="h-14 w-full rounded-xl border border-border bg-surface px-4 text-text-primary shadow-sm outline-none transition [color-scheme:light] hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <button
              type="button"
              onClick={
                useCurrentDateTime
              }
              className="h-14 rounded-xl border border-border bg-surface px-6 text-sm font-semibold text-text-primary shadow-sm outline-none transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              Use current time
            </button>
          </div>

          <p className="mt-3 text-xs text-text-muted">
            {conversionMode ===
            "live"
              ? "Live mode: the clock updates automatically."
              : "Custom mode: conversion uses your selected date and time."}
          </p>
        </div>

        {/* =========================
            RESULTS
        ========================== */}

        {conversionResult ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ResultCard
                city={
                  conversionResult
                    .source.city
                }
                time={
                  conversionResult
                    .source.time
                }
                date={
                  conversionResult
                    .source.date
                }
                timezone={
                  conversionResult
                    .source.timezone
                }
              />

              <ResultCard
                city={
                  conversionResult
                    .target.city
                }
                time={
                  conversionResult
                    .target.time
                }
                date={
                  conversionResult
                    .target.date
                }
                timezone={
                  conversionResult
                    .target.timezone
                }
                variant="highlighted"
              />
            </div>

            {/* TIME DIFFERENCE */}

            <div className="mt-4 rounded-2xl border border-border bg-surface-soft p-5 text-center shadow-sm">
              <p className="text-sm text-text-secondary">
                Time difference
              </p>

              <p className="mt-1 text-xl font-semibold text-text-primary">
                {
                  conversionResult
                    .target.city
                }{" "}
                is{" "}

                <span className="text-primary">
                  {
                    conversionResult
                      .difference
                      .label
                  }
                </span>{" "}

                of{" "}
                {
                  conversionResult
                    .source.city
                }
              </p>
            </div>

            {/* SHARE */}

            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-text-primary">
                  Share this conversion
                </p>

                <p className="mt-1 text-sm text-text-secondary">
                  Copy a link containing
                  the selected cities and
                  time.
                </p>
              </div>

              <Button
                type="button"
                onClick={
                  copyShareLink
                }
                variant="primary"
              >
                {shareStatus ===
                "copied"
                  ? "Link copied!"
                  : shareStatus ===
                      "error"
                    ? "Copy failed"
                    : "Copy share link"}
              </Button>
            </div>

            {/* QUICK FACTS */}

            <QuickFacts
              instant={
                conversionResult.instant
              }
              fromCity={
                conversionResult
                  .source.city
              }
              fromTimezone={
                conversionResult
                  .source.timezone
              }
              toCity={
                conversionResult
                  .target.city
              }
              toTimezone={
                conversionResult
                  .target.timezone
              }
            />

            {/* BEST MEETING TIMES */}

            <BestMeetingTimes
              date={
                conversionResult.instant
              }
              fromTimezone={
                conversionResult
                  .source.timezone
              }
              toTimezone={
                conversionResult
                  .target.timezone
              }
              fromCity={
                conversionResult
                  .source.city
              }
              toCity={
                conversionResult
                  .target.city
              }
              onSelectTime={
                handleSelectMeetingTime
              }
            />

            {/* TIMELINE */}

            <TimeComparisonTable
              date={
                conversionResult.instant
              }
              fromTimezone={
                conversionResult
                  .source.timezone
              }
              toTimezone={
                conversionResult
                  .target.timezone
              }
              fromCity={
                conversionResult
                  .source.city
              }
              toCity={
                conversionResult
                  .target.city
              }
            />
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-danger/20 bg-danger-soft p-5 text-center font-medium text-danger">
            Please select a valid
            date and time.
          </div>
        )}
      </ConverterCard>
    </div>
  );
}