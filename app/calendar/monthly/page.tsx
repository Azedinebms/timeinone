import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  connection,
} from "next/server";

import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";

import MonthlyCalendar from "@/features/calendar/components/MonthlyCalendar";

import {
  SITE_NAME,
  SITE_URL,
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "@/lib/seo";

/* =========================================================
   METADATA
========================================================= */

export const metadata:
  Metadata = {
  title:
    "Monthly Calendar | TimeInOne",

  description:
    "Browse any month and year with the TimeInOne monthly calendar. Navigate between months, jump to today and explore dates instantly.",

  alternates: {
    canonical:
      "/calendar/monthly",
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

    title:
      "Monthly Calendar | TimeInOne",

    description:
      "Browse any month and year with the TimeInOne monthly calendar. Navigate between months, jump to today and explore dates instantly.",

    url:
      `${SITE_URL}/calendar/monthly`,

    siteName:
      SITE_NAME,
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Monthly Calendar | TimeInOne",

    description:
      "Browse any month and year with the TimeInOne monthly calendar. Navigate between months, jump to today and explore dates instantly.",
  },
};

/* =========================================================
   JSON-LD
========================================================= */

function createMonthlyCalendarJsonLd():
  JsonLdObject[] {
  const path =
    "/calendar/monthly";

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
      "Monthly Calendar",

    description:
      "Browse any month and year with the TimeInOne monthly calendar.",

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
          "Monthly Calendar",

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

export default async function MonthlyCalendarPage() {
  /*
   * We intentionally want the current
   * month/year at request time.
   */
  await connection();

  const now =
    new Date();

  const currentYear =
    now.getFullYear();

  const currentMonth =
    now.getMonth();

  const jsonLd =
    createMonthlyCalendarJsonLd();

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen bg-background text-text-primary">
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
                Monthly Calendar
              </span>
            </nav>

            {/* HERO CONTENT */}

            <div className="mt-7">
              <Badge
                variant="primary"
                size="sm"
              >
                Monthly Calendar
              </Badge>

              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-text-primary sm:text-5xl">
                Browse any{" "}

                <span className="text-primary">
                  month
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
                Navigate month by month,
                jump to today and select
                any year instantly.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                  Month navigation
                </span>

                <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                  Jump to today
                </span>

                <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                  1900–2100
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================
            MONTHLY TOOL
        ====================================== */}

        <section className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          <MonthlyCalendar
            initialYear={
              currentYear
            }
            initialMonth={
              currentMonth
            }
          />

          {/* =====================================
              MORE CALENDAR VIEWS
          ====================================== */}

          <Card
            as="section"
            variant="soft"
            padding="lg"
            className="mt-8 border-primary-muted bg-primary-soft/60"
          >
            <Badge
              variant="accent"
              size="sm"
            >
              More calendar views
            </Badge>

            <h2 className="mt-4 text-xl font-bold text-text-primary">
              Explore more calendars
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
              Open the complete annual
              calendar or generate a
              print-ready calendar.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href={
                  `/calendar/${currentYear}`
                }
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover"
              >
                Full {currentYear} Calendar
              </Link>

              <Link
                href="/calendar/printable"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-text-primary transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
              >
                Printable Calendar
              </Link>
            </div>
          </Card>
        </section>
      </main>
    </>
  );
}