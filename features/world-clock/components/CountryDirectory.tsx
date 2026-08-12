import Link from "next/link";

import Card from "@/components/ui/Card";

import type {
  WorldClockCountry,
} from "../types/country";

type CountryDirectoryProps = {
  countries:
    WorldClockCountry[];
};

export default function CountryDirectory({
  countries,
}: CountryDirectoryProps) {
  if (
    countries.length ===
    0
  ) {
    return (
      <Card
        variant="soft"
        padding="lg"
        className="w-full min-w-0 border-dashed text-center"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-xl text-text-muted">
          🌐
        </div>

        <p className="mt-4 font-semibold text-text-primary">
          No countries available
        </p>

        <p className="mt-2 text-sm text-text-secondary">
          Country pages will
          appear here when data
          is available.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {countries.map(
        (
          country,
        ) => (
          <Link
            key={
              country.countryCode
            }
            href={
              `/world-clock/countries/${country.countryCode.toLowerCase()}`
            }
            className="group relative block min-w-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Card
              variant="default"
              padding="md"
              interactive
              className="h-full w-full min-w-0 overflow-hidden group-hover:border-primary-muted"
            >
              <div className="flex min-w-0 items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0 rounded-lg border border-border bg-surface-soft px-2.5 py-1.5 text-xs font-bold text-text-secondary transition group-hover:border-primary-muted group-hover:bg-primary-soft group-hover:text-primary">
                      {
                        country.countryCode
                      }
                    </span>

                    <h2 className="min-w-0 truncate font-semibold text-text-primary transition group-hover:text-primary">
                      {
                        country.name
                      }
                    </h2>
                  </div>

                  <p className="mt-3 truncate text-sm text-text-muted">
                    {country.cityCount.toLocaleString(
                      "en-US",
                    )}{" "}
                    {country.cityCount ===
                    1
                      ? "city"
                      : "cities"}
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="shrink-0 text-lg text-text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary"
                >
                  →
                </span>
              </div>
            </Card>
          </Link>
        ),
      )}
    </div>
  );
}