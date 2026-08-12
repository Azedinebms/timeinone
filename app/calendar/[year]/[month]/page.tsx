import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
  permanentRedirect,
} from "next/navigation";

import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

import CalendarMonth from "@/features/calendar/components/CalendarMonth";
import MonthPrintButton from "@/features/calendar/components/MonthPrintButton";

import {
  MONTH_NAMES,
  createCalendarMonth,
} from "@/lib/calendar";

import {
  SITE_NAME,
  SITE_URL,
  createBreadcrumbJsonLd,
  createFaqJsonLd,
  type JsonLdObject,
} from "@/lib/seo";

/* =========================================================
   CONFIG
========================================================= */

const MIN_YEAR =
  2024;

const MAX_YEAR =
  2030;

const MONTH_SLUGS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

/* =========================================================
   TYPES
========================================================= */

type PageProps = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

/* =========================================================
   HELPERS
========================================================= */

function getMonthIndex(
  month:
    string,
): number {
  return MONTH_SLUGS.indexOf(
    month.toLowerCase() as
    (typeof MONTH_SLUGS)[number],
  );
}

function getMonthSlug(
  monthIndex:
    number,
): string {
  return (
    MONTH_SLUGS[
    monthIndex
    ] ?? ""
  );
}

function getMonthName(
  monthIndex:
    number,
): string {
  return (
    MONTH_NAMES[
    monthIndex
    ] ?? ""
  );
}

function isValidYear(
  year:
    number,
): boolean {
  return (
    Number.isInteger(
      year,
    ) &&
    year >=
    MIN_YEAR &&
    year <=
    MAX_YEAR
  );
}

function getPreviousMonth(
  year:
    number,
  month:
    number,
) {
  if (
    month === 0
  ) {
    return {
      year:
        year - 1,

      month:
        11,
    };
  }

  return {
    year,

    month:
      month - 1,
  };
}

function getNextMonth(
  year:
    number,
  month:
    number,
) {
  if (
    month === 11
  ) {
    return {
      year:
        year + 1,

      month:
        0,
    };
  }

  return {
    year,

    month:
      month + 1,
  };
}

function getMonthInformation(
  year:
    number,
  month:
    number,
) {
  const firstDay =
    new Date(
      Date.UTC(
        year,
        month,
        1,
      ),
    );

  const lastDay =
    new Date(
      Date.UTC(
        year,
        month + 1,
        0,
      ),
    );

  const daysInMonth =
    lastDay.getUTCDate();

  const weekdayFormatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        weekday:
          "long",

        timeZone:
          "UTC",
      },
    );

  return {
    daysInMonth,

    firstWeekday:
      weekdayFormatter.format(
        firstDay,
      ),

    lastWeekday:
      weekdayFormatter.format(
        lastDay,
      ),
  };
}

function createDateList(
  year:
    number,
  month:
    number,
  daysInMonth:
    number,
) {
  const formatter =
    new Intl.DateTimeFormat(
      "en-US",
      {
        weekday:
          "long",

        month:
          "long",

        day:
          "numeric",

        year:
          "numeric",

        timeZone:
          "UTC",
      },
    );

  return Array.from(
    {
      length:
        daysInMonth,
    },
    (
      _,
      index,
    ) => {
      const day =
        index + 1;

      const date =
        new Date(
          Date.UTC(
            year,
            month,
            day,
          ),
        );

      return {
        day,

        label:
          formatter.format(
            date,
          ),
      };
    },
  );
}

/* =========================================================
   STATIC PARAMS
========================================================= */

export function generateStaticParams() {
  const params: {
    year:
    string;

    month:
    string;
  }[] = [];

  for (
    let year =
      MIN_YEAR;
    year <=
    MAX_YEAR;
    year += 1
  ) {
    for (
      const month of
      MONTH_SLUGS
    ) {
      params.push({
        year:
          String(
            year,
          ),

        month,
      });
    }
  }

  return params;
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: PageProps):
  Promise<Metadata> {
  const {
    year:
    rawYear,

    month:
    rawMonth,
  } = await params;

  const year =
    Number(
      rawYear,
    );

  const month =
    getMonthIndex(
      rawMonth,
    );

  if (
    !isValidYear(
      year,
    ) ||
    month === -1
  ) {
    return {
      title:
        "Calendar Not Found | TimeInOne",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  const monthName =
    getMonthName(
      month,
    );

  const monthSlug =
    getMonthSlug(
      month,
    );

  const path =
    `/calendar/${year}/${monthSlug}`;

  const pageUrl =
    `${SITE_URL}${path}`;

  const title =
    `${monthName} ${year} Calendar | TimeInOne`;

  const description =
    `View the ${monthName} ${year} calendar with all dates and weekdays. See the first and last day of the month, browse nearby months and print the calendar.`;

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

function createMonthJsonLd(
  year:
    number,

  monthIndex:
    number,
): JsonLdObject[] {
  const monthName =
    getMonthName(
      monthIndex,
    );

  const monthSlug =
    getMonthSlug(
      monthIndex,
    );

  const path =
    `/calendar/${year}/${monthSlug}`;

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
      `${monthName} ${year} Calendar`,

    description:
      `Calendar for ${monthName} ${year} with dates and weekdays.`,

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

  const information =
    getMonthInformation(
      year,
      monthIndex,
    );

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

        path:
          `/calendar/${year}`,
      },

      {
        name:
          `${monthName} ${year}`,

        path,
      },
    ]);

  const faq =
    createFaqJsonLd([
      {
        question:
          `How many days are in ${monthName} ${year}?`,

        answer:
          `${monthName} ${year} has ${information.daysInMonth} days.`,
      },

      {
        question:
          `What day does ${monthName} ${year} start?`,

        answer:
          `${monthName} 1, ${year} falls on a ${information.firstWeekday}.`,
      },

      {
        question:
          `What day does ${monthName} ${year} end?`,

        answer:
          `The final day of ${monthName} ${year} falls on a ${information.lastWeekday}.`,
      },
    ]);

  return [
    page,
    breadcrumbs,
    faq,
  ];
}

/* =========================================================
   PAGE
========================================================= */

export default async function CalendarMonthPage({
  params,
}: PageProps) {
  const {
    year:
    rawYear,

    month:
    rawMonth,
  } = await params;

  const normalizedMonth =
    decodeURIComponent(
      rawMonth,
    )
      .trim()
      .toLowerCase();

  const year =
    Number(
      rawYear,
    );

  const month =
    getMonthIndex(
      normalizedMonth,
    );

  if (
    !isValidYear(
      year,
    ) ||
    month === -1
  ) {
    notFound();
  }

  const canonicalMonth =
    getMonthSlug(
      month,
    );

  if (
    normalizedMonth !==
    canonicalMonth
  ) {
    permanentRedirect(
      `/calendar/${year}/${canonicalMonth}`,
    );
  }

  const monthName =
    getMonthName(
      month,
    );

  const calendarMonth =
    createCalendarMonth(
      year,
      month,
    );

  const information =
    getMonthInformation(
      year,
      month,
    );

  const dates =
    createDateList(
      year,
      month,
      information.daysInMonth,
    );

  const previous =
    getPreviousMonth(
      year,
      month,
    );

  const next =
    getNextMonth(
      year,
      month,
    );

  const previousAvailable =
    isValidYear(
      previous.year,
    );

  const nextAvailable =
    isValidYear(
      next.year,
    );

  const previousName =
    getMonthName(
      previous.month,
    );

  const nextName =
    getMonthName(
      next.month,
    );

  const jsonLd =
    createMonthJsonLd(
      year,
      month,
    );

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen bg-background text-text-primary">
        {/* =============================================
            BREADCRUMB
        ============================================= */}

        <div className="mx-auto w-full max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
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

            <Link
              href={
                `/calendar/${year}`
              }
              className="transition hover:text-primary"
            >
              {year} Calendar
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
              {monthName}
            </span>
          </nav>
        </div>

        {/* =============================================
            HERO
        ============================================= */}

        <section className="border-y border-border bg-gradient-to-b from-primary-soft/70 via-background to-background">
          <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <Badge
                  variant="primary"
                  size="sm"
                >
                  Monthly Calendar
                </Badge>

                <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-text-primary sm:text-5xl lg:text-6xl">
                  {
                    monthName
                  }{" "}

                  <span className="text-primary">
                    {
                      year
                    }
                  </span>

                  {" "}Calendar
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-7 text-text-secondary sm:text-lg">
                  View all dates and
                  weekdays for{" "}
                  <strong className="font-semibold text-text-primary">
                    {
                      monthName
                    }{" "}
                    {
                      year
                    }
                  </strong>
                  , with quick navigation
                  to nearby months.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text-secondary shadow-sm">
                  {
                    information.daysInMonth
                  }{" "}
                  days
                </span>

                <span className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text-secondary shadow-sm">
                  Starts{" "}
                  {
                    information.firstWeekday
                  }
                </span>

                <span className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text-secondary shadow-sm">
                  Ends{" "}
                  {
                    information.lastWeekday
                  }
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================
            CONTENT
        ============================================= */}

        <div className="mx-auto w-full max-w-7xl space-y-8 px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* CALENDAR */}

          <Card
            as="section"
            variant="default"
            padding="lg"
          >
            <div className="print:hidden flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge
                  variant="accent"
                  size="sm"
                >
                  {monthName} {year}
                </Badge>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-primary">
                  {monthName} {year} calendar
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/calendar/${year}`}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-text-secondary transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
                >
                  View {year} calendar
                </Link>

                <MonthPrintButton
                  monthName={
                    monthName
                  }
                  year={
                    year
                  }
                />
              </div>
            </div>

            <div
  id="print-month-calendar"
  className="mx-auto mt-7 max-w-2xl"
>
  <CalendarMonth
    month={
      calendarMonth
    }
  />
</div>
          </Card>

          {/* MONTH OVERVIEW */}

          <section className="grid gap-4 sm:grid-cols-3">
            <Card
              as="article"
              variant="default"
              padding="lg"
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                Days
              </p>

              <p className="mt-3 text-3xl font-black text-text-primary">
                {
                  information.daysInMonth
                }
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                Total days in{" "}
                {
                  monthName
                }{" "}
                {
                  year
                }.
              </p>
            </Card>

            <Card
              as="article"
              variant="soft"
              padding="lg"
              className="border-primary-muted bg-primary-soft"
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                First day
              </p>

              <p className="mt-3 text-2xl font-black text-text-primary">
                {
                  information.firstWeekday
                }
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                {
                  monthName
                }{" "}
                1,{" "}
                {
                  year
                }
              </p>
            </Card>

            <Card
              as="article"
              variant="default"
              padding="lg"
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                Last day
              </p>

              <p className="mt-3 text-2xl font-black text-text-primary">
                {
                  information.lastWeekday
                }
              </p>

              <p className="mt-2 text-sm text-text-secondary">
                {
                  monthName
                }{" "}
                {
                  information.daysInMonth
                }
                ,{" "}
                {
                  year
                }
              </p>
            </Card>
          </section>

          {/* PREVIOUS / NEXT */}

          <Card
            as="section"
            variant="soft"
            padding="lg"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {previousAvailable ? (
                <Link
                  href={
                    `/calendar/${previous.year}/${getMonthSlug(
                      previous.month,
                    )}`
                  }
                  className="group rounded-2xl border border-border bg-white p-5 transition hover:border-primary-muted hover:shadow-sm"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                    ← Previous month
                  </p>

                  <p className="mt-2 text-lg font-bold text-text-primary transition group-hover:text-primary">
                    {
                      previousName
                    }{" "}
                    {
                      previous.year
                    }
                  </p>
                </Link>
              ) : (
                <div />
              )}

              {nextAvailable && (
                <Link
                  href={
                    `/calendar/${next.year}/${getMonthSlug(
                      next.month,
                    )}`
                  }
                  className="group rounded-2xl border border-border bg-white p-5 text-left transition hover:border-primary-muted hover:shadow-sm sm:text-right"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-text-muted">
                    Next month →
                  </p>

                  <p className="mt-2 text-lg font-bold text-text-primary transition group-hover:text-primary">
                    {
                      nextName
                    }{" "}
                    {
                      next.year
                    }
                  </p>
                </Link>
              )}
            </div>
          </Card>

          {/* DATE DIRECTORY */}

          <Card
            as="section"
            variant="default"
            padding="lg"
          >
            <Badge
              variant="accent"
              size="sm"
            >
              Date directory
            </Badge>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
              Dates in{" "}
              {
                monthName
              }{" "}
              {
                year
              }
            </h2>

            <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
              Complete list of dates
              and weekdays for{" "}
              {
                monthName
              }{" "}
              {
                year
              }.
            </p>

            <div className="mt-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {dates.map(
                (
                  date,
                ) => (
                  <div
                    key={
                      date.day
                    }
                    className="rounded-xl border border-border bg-surface-soft px-4 py-3 text-sm font-medium text-text-secondary"
                  >
                    {
                      date.label
                    }
                  </div>
                ),
              )}
            </div>
          </Card>

          {/* FAQ */}

          <Card
            as="section"
            variant="default"
            padding="lg"
          >
            <Badge
              variant="accent"
              size="sm"
            >
              Frequently asked questions
            </Badge>

            <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
              {
                monthName
              }{" "}
              {
                year
              }{" "}
              FAQ
            </h2>

            <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border">
              <details className="group bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-text-primary">
                  How many days are in{" "}
                  {
                    monthName
                  }{" "}
                  {
                    year
                  }?
                </summary>

                <p className="mt-3 leading-7 text-text-secondary">
                  {
                    monthName
                  }{" "}
                  {
                    year
                  }{" "}
                  has{" "}
                  <strong>
                    {
                      information.daysInMonth
                    }{" "}
                    days
                  </strong>
                  .
                </p>
              </details>

              <details className="group bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-text-primary">
                  What day does{" "}
                  {
                    monthName
                  }{" "}
                  {
                    year
                  }{" "}
                  start?
                </summary>

                <p className="mt-3 leading-7 text-text-secondary">
                  {
                    monthName
                  }{" "}
                  1,{" "}
                  {
                    year
                  }{" "}
                  falls on a{" "}
                  <strong>
                    {
                      information.firstWeekday
                    }
                  </strong>
                  .
                </p>
              </details>

              <details className="group bg-white p-5">
                <summary className="cursor-pointer list-none font-semibold text-text-primary">
                  What day does{" "}
                  {
                    monthName
                  }{" "}
                  {
                    year
                  }{" "}
                  end?
                </summary>

                <p className="mt-3 leading-7 text-text-secondary">
                  The final day of{" "}
                  {
                    monthName
                  }{" "}
                  {
                    year
                  }{" "}
                  falls on a{" "}
                  <strong>
                    {
                      information.lastWeekday
                    }
                  </strong>
                  .
                </p>
              </details>
            </div>
          </Card>

          {/* OTHER MONTHS */}

          <Card
            as="section"
            variant="soft"
            padding="lg"
          >
            <h2 className="text-xl font-bold text-text-primary">
              Other months in{" "}
              {
                year
              }
            </h2>

            <div className="mt-5 flex flex-wrap gap-2">
              {MONTH_SLUGS.map(
                (
                  slug,
                  index,
                ) => {
                  const active =
                    index ===
                    month;

                  return (
                    <Link
                      key={
                        slug
                      }
                      href={
                        `/calendar/${year}/${slug}`
                      }
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${active
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-text-secondary hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
                        }`}
                    >
                      {
                        getMonthName(
                          index,
                        )
                      }
                    </Link>
                  );
                },
              )}
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}