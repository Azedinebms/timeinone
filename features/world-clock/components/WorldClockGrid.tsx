import Card from "@/components/ui/Card";

import type {
  WorldClockCity,
} from "../types";

import WorldClockCard from "./WorldClockCard";

type WorldClockGridProps = {
  cities:
    WorldClockCity[];
};

export default function WorldClockGrid({
  cities,
}: WorldClockGridProps) {
  if (
    cities.length ===
    0
  ) {
    return (
      <Card
        variant="soft"
        padding="lg"
        className="border-dashed text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-xl text-text-muted">
          ◷
        </div>

        <h2 className="mt-4 text-lg font-semibold text-text-primary">
          No cities available
        </h2>

        <p className="mt-2 text-sm text-text-secondary">
          World clocks will
          appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cities.map(
        (
          city,
        ) => (
          <WorldClockCard
            key={
              `${city.countryCode}-${city.slug}`
            }
            city={
              city
            }
          />
        ),
      )}
    </div>
  );
}