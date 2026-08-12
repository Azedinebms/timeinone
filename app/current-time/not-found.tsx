import Link from "next/link";

import Header from "@/components/layout/Header";

export default function CurrentTimeNotFound() {
  return (
    <>
      <Header />

      <main className="min-h-[calc(100vh-80px)] bg-background text-text-primary">
        <section className="border-b border-border bg-gradient-to-b from-primary-soft/70 via-background to-background">
          <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center px-5 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl text-center">
              {/* BADGE */}

              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />

                City not found
              </span>

              {/* ICON */}

              <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-primary-muted bg-white shadow-lg shadow-blue-950/5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-9 w-9 text-primary"
                  aria-hidden="true"
                >
                  <path
                    d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <circle
                    cx="12"
                    cy="10"
                    r="2.5"
                  />
                </svg>
              </div>

              {/* TITLE */}

              <h1 className="mt-8 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                We couldn&apos;t find

                <span className="block text-primary">
                  this city
                </span>
              </h1>

              {/* DESCRIPTION */}

              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
                TimeInOne could not find a matching city for this URL.
                Try searching for another city or return to the World Clock.
              </p>

              {/* ACTIONS */}

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  Search another city
                </Link>

                <Link
                  href="/world-clock"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 text-sm font-semibold text-text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-muted hover:bg-primary-soft hover:text-primary hover:shadow-md"
                >
                  Open World Clock
                </Link>
              </div>

              {/* HELP */}

              <div className="mt-10 rounded-2xl border border-border bg-white/80 p-5 text-left shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                  Quick tips
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border bg-surface-soft p-4">
                    <p className="font-semibold text-text-primary">
                      Check the spelling
                    </p>

                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                      Make sure the city name is correct.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-soft p-4">
                    <p className="font-semibold text-text-primary">
                      Search globally
                    </p>

                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                      Try searching by country or time zone.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-soft p-4">
                    <p className="font-semibold text-text-primary">
                      Explore cities
                    </p>

                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                      Browse the global World Clock directory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}