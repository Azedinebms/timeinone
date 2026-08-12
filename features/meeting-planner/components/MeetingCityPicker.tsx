"use client";

import {
  useState,
} from "react";

import Card from "@/components/ui/Card";

import {
  AtlasCitySearch,
} from "@/features/city-search/client";

import type {
  CitySearchResult,
} from "@/features/city-search/types";

type MeetingCityPickerProps = {
  disabled?: boolean;

  onSelect: (
    city: CitySearchResult,
  ) => boolean;
};

export default function MeetingCityPicker({
  disabled = false,
  onSelect,
}: MeetingCityPickerProps) {
  const [
    resetKey,
    setResetKey,
  ] = useState(0);

  function handleSelect(
    city: CitySearchResult,
  ) {
    const added =
      onSelect(
        city,
      );

    if (!added) {
      return;
    }

    setResetKey(
      (
        currentValue,
      ) =>
        currentValue + 1,
    );
  }

  if (
    disabled
  ) {
    return (
      <Card
        variant="soft"
        padding="md"
        className="border-dashed text-center"
      >
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface text-lg text-text-muted">
          +
        </div>

        <p className="mt-4 font-semibold text-text-primary">
          Participant limit reached
        </p>

        <p className="mt-1 text-sm leading-6 text-text-secondary">
          You can add up to five
          cities to one meeting.
        </p>
      </Card>
    );
  }

  return (
    <Card
      variant="soft"
      padding="md"
    >
      <div className="mb-4">
        <p className="text-sm font-semibold text-text-primary">
          Add a participant city
        </p>

        <p className="mt-1 text-sm leading-6 text-text-secondary">
          Search by city, country,
          country code or time zone.
        </p>
      </div>

      <AtlasCitySearch
        limit={
          10
        }
        resetKey={
          resetKey
        }
        placeholder="Search Paris, New York, Tokyo..."
        onSelect={
          handleSelect
        }
      />
    </Card>
  );
}