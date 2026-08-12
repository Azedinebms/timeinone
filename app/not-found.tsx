import Link from "next/link";

import Header from "@/components/layout/Header";

export default function NotFound() {
  return (
    <>
      <Header />

      <main className="min-h-[calc(100vh-4rem)] bg-background text-text-primary">
        <section className="relative overflow-hidden border-b border-border">
          {/* BACKGROUND DECORATION */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-primary-soft/80 blur-3xl" />

            <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-violet-100/50 blur-3xl" />

            <div className="absolute -right-32 top-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
          </div>

          <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center px-5 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl text-center">
              {/* 404 BADGE */}

              <div className="flex justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary-muted bg-primary-soft px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-20" />

                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>

                  Error 404
                </span>
              </div>

              {/* ICON */}

              <div className="relative mx-auto mt-8 flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-[2rem] bg-primary/10 blur-xl" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.6rem] border border-primary-muted bg-white shadow-xl shadow-blue-950/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-9 w-9 text-primary"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8.5"
                    />

                    <path
                      d="M12 7v5l3 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M4.5 4.5 19.5 19.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* TITLE */}

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-text-muted">
                Lost in time?
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                This page is

                <span className="block text-primary">
                  out of time.
                </span>
              </h1>

              {/* DESCRIPTION */}

              <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-text-secondary sm:text-lg">
                The page you&apos;re looking for doesn&apos;t exist,
                may have moved, or the URL may be incorrect.
              </p>

              {/* ACTIONS */}

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 sm:w-auto"
                >
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:-translate-x-1"
                  >
                    ←
                  </span>

                  Back to TimeInOne
                </Link>

                <Link
                  href="/world-clock"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 text-sm font-bold text-text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-muted hover:bg-primary-soft hover:text-primary sm:w-auto"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />

                    <path
                      d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9S14.5 18.5 12 21M12 3C9.5 5.5 8.2 8.5 8.2 12S9.5 18.5 12 21"
                      strokeLinecap="round"
                    />
                  </svg>

                  Explore World Clock
                </Link>
              </div>

              {/* QUICK NAVIGATION */}

              <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-border bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Continue exploring
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Link
                    href="/converter"
                    className="group rounded-2xl border border-border bg-surface-soft p-4 text-left transition hover:border-primary-muted hover:bg-primary-soft"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 font-bold text-blue-600">
                        ↔
                      </span>

                      <span className="text-text-muted transition group-hover:translate-x-1 group-hover:text-primary">
                        →
                      </span>
                    </div>

                    <p className="mt-4 font-bold text-text-primary">
                      Converter
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      Convert time between cities.
                    </p>
                  </Link>

                  <Link
                    href="/world-clock"
                    className="group rounded-2xl border border-border bg-surface-soft p-4 text-left transition hover:border-primary-muted hover:bg-primary-soft"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 font-bold text-violet-600">
                        ◉
                      </span>

                      <span className="text-text-muted transition group-hover:translate-x-1 group-hover:text-primary">
                        →
                      </span>
                    </div>

                    <p className="mt-4 font-bold text-text-primary">
                      World Clock
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      Check local times worldwide.
                    </p>
                  </Link>

                  <Link
                    href="/meeting-planner"
                    className="group rounded-2xl border border-border bg-surface-soft p-4 text-left transition hover:border-primary-muted hover:bg-primary-soft"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 font-bold text-emerald-600">
                        ✓
                      </span>

                      <span className="text-text-muted transition group-hover:translate-x-1 group-hover:text-primary">
                        →
                      </span>
                    </div>

                    <p className="mt-4 font-bold text-text-primary">
                      Meeting Planner
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-secondary">
                      Find the best meeting time.
                    </p>
                  </Link>
                </div>
              </div>

              {/* SMALL FOOTNOTE */}

              <p className="mt-7 text-xs text-text-muted">
                TimeInOne · Global time intelligence
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}