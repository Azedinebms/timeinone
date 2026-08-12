import Link from "next/link";

import {
  createWorldClockCityPath,
} from "../routing";

import type {
  WorldClockCity,
} from "../types";

import LiveWorldClock from "./LiveWorldClock";

type RelatedWorldClocksProps = {
  cities: WorldClockCity[];
};

export default function RelatedWorldClocks({
  cities,
}: RelatedWorldClocksProps) {
  if (
    cities.length === 0
  ) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cities.map(
        (
          city,
        ) => {
          const cityKey =
            city.geonameId ??
            `${city.countryCode}-${city.slug}`;

          return (
            <Link
              key={
                cityKey
              }
              href={
                createWorldClockCityPath(
                  city,
                )
              }
              className={[
                "group",
                "relative",
                "overflow-hidden",
                "rounded-2xl",
                "border",
                "border-border",
                "bg-surface",
                "p-5",
                "shadow-sm",
                "outline-none",
                "transition-all",
                "duration-200",
                "hover:-translate-y-0.5",
                "hover:border-primary-muted",
                "hover:shadow-lg",
                "hover:shadow-blue-950/5",
                "focus-visible:ring-2",
                "focus-visible:ring-primary/20",
              ].join(
                " ",
              )}
            >
              {/* HOVER GLOW */}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-primary-soft opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
              />

              <div className="relative">
                {/* HEADER */}

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <h3 className="truncate text-base font-bold text-text-primary transition group-hover:text-primary">
                        {
                          city.name
                        }
                      </h3>

                      <span className="shrink-0 rounded-md border border-border bg-surface-soft px-2 py-0.5 text-[10px] font-bold uppercase text-text-muted">
                        {
                          city.countryCode
                        }
                      </span>
                    </div>

                    <p className="mt-1 truncate text-sm font-medium text-text-secondary">
                      {
                        city.country
                      }
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-soft text-sm text-text-muted transition-all duration-200 group-hover:border-primary-muted group-hover:bg-primary-soft group-hover:text-primary"
                  >
                    →
                  </span>
                </div>

                {/* LIVE CLOCK */}

                <div className="mt-6">
                  <LiveWorldClock
                    timeZone={
                      city.timeZone
                    }
                    locale="en-US"
                    showSeconds={
                      false
                    }
                    className={[
                      "[&_time]:text-3xl",
                      "[&_time]:font-black",
                      "[&_time]:tracking-tight",
                      "[&_time]:text-text-primary",
                      "[&_time]:tabular-nums",
                      "[&_p]:mt-2",
                      "[&_p]:text-sm",
                      "[&_p]:font-medium",
                      "[&_p]:text-text-secondary",
                      "[&_span]:mt-2",
                      "[&_span]:inline-flex",
                      "[&_span]:rounded-full",
                      "[&_span]:border",
                      "[&_span]:border-primary-muted",
                      "[&_span]:bg-primary-soft",
                      "[&_span]:px-2.5",
                      "[&_span]:py-1",
                      "[&_span]:text-[10px]",
                      "[&_span]:font-bold",
                      "[&_span]:text-primary",
                    ].join(
                      " ",
                    )}
                  />
                </div>

                {/* FOOTER */}

                <div className="mt-6 border-t border-border pt-4">
                  <div className="flex min-w-0 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                        Time zone
                      </p>

                      <p className="mt-1 truncate font-mono text-xs font-semibold text-text-secondary">
                        {
                          city.timeZone
                        }
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-bold text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                      View clock
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        },
      )}
    </div>
  );
}