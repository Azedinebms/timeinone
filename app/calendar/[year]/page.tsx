import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import YearCalendar from "@/features/calendar/components/YearCalendar";

import {
  isLeapYear,
  isValidCalendarYear,
} from "@/lib/calendar";

import {
  SITE_NAME,
  SITE_URL,
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "@/lib/seo";

/* =========================================================
   CONFIG
========================================================= */

const MIN_YEAR =
  2024;

const MAX_YEAR =
  2030;

const MONTHS = [
  {
    name:
      "January",
    slug:
      "january",
  },
  {
    name:
      "February",
    slug:
      "february",
  },
  {
    name:
      "March",
    slug:
      "march",
  },
  {
    name:
      "April",
    slug:
      "april",
  },
  {
    name:
      "May",
    slug:
      "may",
  },
  {
    name:
      "June",
    slug:
      "june",
  },
  {
    name:
      "July",
    slug:
      "july",
  },
  {
    name:
      "August",
    slug:
      "august",
  },
  {
    name:
      "September",
    slug:
      "september",
  },
  {
    name:
      "October",
    slug:
      "october",
  },
  {
    name:
      "November",
    slug:
      "november",
  },
  {
    name:
      "December",
    slug:
      "december",
  },
] as const;

/* =========================================================
   TYPES
========================================================= */

type CalendarYearPageProps = {
  params: Promise<{
    year: string;
  }>;
};

/* =========================================================
   HELPERS
========================================================= */

function isSupportedCalendarYear(
  year: number,
): boolean {
  return (
    isValidCalendarYear(
      year,
    ) &&
    year >= MIN_YEAR &&
    year <= MAX_YEAR
  );
}

/* =========================================================
   STATIC PARAMS
========================================================= */

export function generateStaticParams() {
  return Array.from(
    {
      length:
        MAX_YEAR -
        MIN_YEAR +
        1,
    },
    (
      _,
      index,
    ) => ({
      year:
        String(
          MIN_YEAR +
          index,
        ),
    }),
  );
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: CalendarYearPageProps):
  Promise<Metadata> {
  const {
    year:
      rawYear,
  } =
    await params;

  const year =
    Number(
      rawYear,
    );

  if (
    !isSupportedCalendarYear(
      year,
    )
  ) {
    return {
      title:
        "Calendar Not Found | TimeInOne",

      robots: {
        index:
          false,

        follow:
          true,
      },
    };
  }

  const path =
    `/calendar/${year}`;

  const pageUrl =
    `${SITE_URL}${path}`;

  const title =
    `${year} Calendar | TimeInOne`;

  const description =
    `View the complete ${year} calendar with all 12 months, weekdays and dates. Browse each month or print the full-year calendar with TimeInOne.`;

  return {
    title,

    description,

    alternates: {
      canonical:
        pageUrl,
    },

    robots: {
      index:
        true,

      follow:
        true,
    },

    openGraph: {
      type:
        "website",

      title,

      description,

      url:
        pageUrl,

      siteName:
        SITE_NAME,
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,
    },
  };
}

/* =========================================================
   JSON-LD
========================================================= */

function createYearJsonLd(
  year: number,
): JsonLdObject[] {
  const path =
    `/calendar/${year}`;

  const pageUrl =
    `${SITE_URL}${path}`;

  const page:
    JsonLdObject = {
    "@context":
      "https://schema.org",

    "@type":
      "WebPage",

    "@id":
      `${pageUrl}#webpage`,

    url:
      pageUrl,

    name:
      `${year} Calendar`,

    description:
      `Complete ${year} calendar with all 12 months, weekdays and dates.`,

    inLanguage:
      "en",

    isPartOf: {
      "@id":
        `${SITE_URL}/#website`,
    },

    publisher: {
      "@id":
        `${SITE_URL}/#organization`,
    },
  };

  const breadcrumbs =
    createBreadcrumbJsonLd([
      {
        name:
          "Home",

        path:
          "/",
      },

      {
        name:
          `${year} Calendar`,

        path,
      },
    ]);

  return [
    page,
    breadcrumbs,
  ];
}

/* =========================================================
   PAGE
========================================================= */

export default async function CalendarYearPage({
  params,
}: CalendarYearPageProps) {
  const {
    year:
      rawYear,
  } =
    await params;

  const year =
    Number(
      rawYear,
    );

  if (
    !isSupportedCalendarYear(
      year,
    )
  ) {
    notFound();
  }

  const previousYear =
    year - 1;

  const nextYear =
    year + 1;

  const hasPreviousYear =
    isSupportedCalendarYear(
      previousYear,
    );

  const hasNextYear =
    isSupportedCalendarYear(
      nextYear,
    );

  const jsonLd =
    createYearJsonLd(
      year,
    );

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen overflow-x-hidden bg-background text-text-primary">
        {/* =====================================
            HERO
        ====================================== */}

        <section className="border-b border-border bg-gradient-to-b from-primary-soft/70 via-background to-background">
          <div className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-6 sm:py-9 lg:px-8">
            {/* BREADCRUMB */}

            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-text-muted"
            >
              <Link
                href="/"
                className="transition hover:text-primary"
              >
                Home
              </Link>

              <span
                aria-hidden="true"
              >
                /
              </span>

              <span
                aria-current="page"
                className="font-medium text-text-secondary"
              >
                {year} Calendar
              </span>
            </nav>

            {/* HERO CONTENT */}

            <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center lg:gap-12">
              {/* LEFT */}

              <div>
                <Badge
                  variant="primary"
                  size="sm"
                >
                  Annual Calendar
                </Badge>

                <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-text-primary sm:text-5xl">
                  {year}{" "}

                  <span className="text-primary">
                    Calendar
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
                  View all 12 months of
                  the{" "}
                  <strong className="font-semibold text-text-primary">
                    {year} calendar
                  </strong>{" "}
                  in one clean overview.
                  Browse individual months,
                  dates and weekdays or
                  print the full year.
                </p>

                {/* HERO TAGS */}

                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                    12 months
                  </span>

                  <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                    {isLeapYear(
                      year,
                    )
                      ? "366 days"
                      : "365 days"}
                  </span>

                  <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                    Sunday start
                  </span>

                  <span className="rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
                    Print ready
                  </span>
                </div>

                {/* HERO ACTIONS */}

                <div className="mt-7 flex flex-wrap gap-3">
                  <Button
                    as={
                      Link
                    }
                    href="/calendar/monthly"
                    variant="primary"
                  >
                    Monthly Calendar
                  </Button>

                  <Button
                    as={
                      Link
                    }
                    href="/calendar/printable"
                    variant="secondary"
                  >
                    Printable Calendar
                  </Button>
                </div>
              </div>

              {/* RIGHT */}

              <Card
                as="aside"
                variant="soft"
                padding="lg"
                className="relative overflow-hidden border-primary-muted bg-primary-soft/70"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary-muted/50 blur-3xl"
                />

                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    Calendar navigation
                  </p>

                  <p className="mt-2 text-3xl font-black text-text-primary">
                    {year}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Browse nearby years,
                    explore individual
                    months or open the
                    printable calendar.
                  </p>

                  {/* YEAR NAVIGATION */}

                  <div
                    className={[
                      "mt-6",
                      "grid",
                      "gap-3",

                      hasPreviousYear &&
                      hasNextYear
                        ? "grid-cols-2"
                        : "grid-cols-1",
                    ].join(
                      " ",
                    )}
                  >
                    {hasPreviousYear && (
                      <Button
                        as={
                          Link
                        }
                        href={
                          `/calendar/${previousYear}`
                        }
                        variant="secondary"
                      >
                        ← {previousYear}
                      </Button>
                    )}

                    {hasNextYear && (
                      <Button
                        as={
                          Link
                        }
                        href={
                          `/calendar/${nextYear}`
                        }
                        variant="primary"
                      >
                        {nextYear} →
                      </Button>
                    )}
                  </div>

                  <Button
                    as={
                      Link
                    }
                    href="/calendar/monthly"
                    variant="outline"
                    className="mt-3 w-full"
                  >
                    Monthly Calendar
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* =====================================
            YEAR CALENDAR
        ====================================== */}

        <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge
                variant="accent"
                size="sm"
              >
                Full year
              </Badge>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
                {year} at a glance
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                All 12 months and dates
                in one overview.
              </p>
            </div>

            {/* SECONDARY YEAR NAV */}

            <div className="flex flex-wrap gap-2">
              {hasPreviousYear && (
                <Link
                  href={
                    `/calendar/${previousYear}`
                  }
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
                >
                  ← {previousYear}
                </Link>
              )}

              {hasNextYear && (
                <Link
                  href={
                    `/calendar/${nextYear}`
                  }
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
                >
                  {nextYear} →
                </Link>
              )}
            </div>
          </div>

          <YearCalendar
            year={
              year
            }
          />
        </section>

        {/* =====================================
            MONTH DIRECTORY
        ====================================== */}

        <section className="border-t border-border bg-surface-soft">
          <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="max-w-3xl">
              <Badge
                variant="primary"
                size="sm"
              >
                Monthly Calendars
              </Badge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                Months in {year}
              </h2>

              <p className="mt-3 leading-7 text-text-secondary">
                Open a dedicated monthly
                calendar to view all dates,
                weekdays, month details
                and printing options.
              </p>
            </div>

            {/* MONTH LINKS */}

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {MONTHS.map(
                (
                  month,
                  index,
                ) => (
                  <Link
                    key={
                      month.slug
                    }
                    href={
                      `/calendar/${year}/${month.slug}`
                    }
                    className="group flex items-center justify-between rounded-2xl border border-border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-muted hover:shadow-md"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-sm font-black text-primary">
                        {String(
                          index +
                            1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <div className="min-w-0">
                        <p className="font-bold text-text-primary transition group-hover:text-primary">
                          {
                            month.name
                          }{" "}
                          {
                            year
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-text-muted">
                          Monthly calendar
                        </p>
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className="ml-3 text-text-muted transition group-hover:translate-x-1 group-hover:text-primary"
                    >
                      →
                    </span>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>

        {/* =====================================
            CALENDAR TOOLS
        ====================================== */}

        <section className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <Card
            as="section"
            variant="soft"
            padding="lg"
            className="border-primary-muted bg-primary-soft/60"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge
                  variant="accent"
                  size="sm"
                >
                  Calendar tools
                </Badge>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                  Explore {year} your way
                </h2>

                <p className="mt-2 max-w-2xl leading-7 text-text-secondary">
                  Browse month by month
                  or generate a clean
                  printable version of
                  the full {year} calendar.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  as={
                    Link
                  }
                  href="/calendar/monthly"
                  variant="secondary"
                >
                  Monthly Calendar
                </Button>

                <Button
                  as={
                    Link
                  }
                  href="/calendar/printable"
                  variant="primary"
                >
                  Printable Calendar
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </main>
    </>
  );
}