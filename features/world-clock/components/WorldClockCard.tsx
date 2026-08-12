import Link from "next/link";

import Card from "@/components/ui/Card";

import {
  createWorldClockCityPath,
} from "../routing";

import type {
  WorldClockCity,
} from "../types";

import LiveWorldClock from "./LiveWorldClock";

type WorldClockCardProps = {
  city: WorldClockCity;
};

export default function WorldClockCard({
  city,
}: WorldClockCardProps) {
  const cityPath =
    createWorldClockCityPath(
      city,
    );

  return (
    <Card
      as="article"
      variant="default"
      padding="md"
      interactive
      className="group relative"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
            {city.region}
          </p>

          <h2 className="mt-2 text-xl font-bold text-text-primary transition group-hover:text-primary">
            <Link
              href={cityPath}
              className="after:absolute after:inset-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {city.name}
            </Link>
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            {city.country}
          </p>
        </div>

        <span className="shrink-0 rounded-lg border border-border bg-surface-soft px-2.5 py-1.5 text-xs font-bold text-text-secondary">
          {city.countryCode}
        </span>
      </div>

      <LiveWorldClock
        timeZone={city.timeZone}
        locale="en-US"
        showSeconds
        className="relative mt-7"
      />

      <div className="relative mt-6 flex items-center justify-between border-t border-border pt-4">
        <span className="truncate font-mono text-xs text-text-muted">
          {city.timeZone}
        </span>

        <span
          aria-hidden="true"
          className="ml-4 text-lg text-text-muted transition group-hover:translate-x-1 group-hover:text-primary"
        >
          →
        </span>
      </div>
    </Card>
  );
}