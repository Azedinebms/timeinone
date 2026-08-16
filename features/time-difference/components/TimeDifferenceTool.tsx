"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  CityOption,
} from "@/types/city";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import CitySearch from "@/features/converter/components/CitySearch";

type TimeDifferenceToolProps = {
  initialFromCity:
    CityOption;

  initialToCity:
    CityOption;
};

export default function TimeDifferenceTool({
  initialFromCity,
  initialToCity,
}: TimeDifferenceToolProps) {
  const router =
    useRouter();

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

  const swapCities =
    () => {
      setFromCity(
        toCity,
      );

      setToCity(
        fromCity,
      );
    };

  const compare =
    () => {
      if (
        !fromCity?.slug ||
        !toCity?.slug
      ) {
        return;
      }

      router.push(
        `/time-difference/${fromCity.slug}-to-${toCity.slug}`,
      );
    };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Card
        variant="elevated"
        padding="lg"
        className="mx-auto max-w-5xl"
      >
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <CitySearch
            key={`difference-from-${fromCity.id}`}
            id="difference-from-city"
            label="From"
            value={
              fromCity
            }
            onChange={
              setFromCity
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
            key={`difference-to-${toCity.id}`}
            id="difference-to-city"
            label="To"
            value={
              toCity
            }
            onChange={
              setToCity
            }
          />
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            variant="primary"
            onClick={
              compare
            }
            className="w-full sm:w-auto sm:min-w-[260px]"
          >
            Compare time difference
          </Button>
        </div>

        <p className="mt-4 text-center text-xs leading-6 text-text-muted">
          Compare current local time,
          UTC offsets, working-hour
          overlap and the best time to
          call between two cities.
        </p>
      </Card>
    </div>
  );
}