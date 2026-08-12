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

import PrintableCalendar from "@/features/calendar/components/PrintableCalendar";

import {
  SITE_NAME,
  SITE_URL,
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "@/lib/seo";

/* =========================================================
   METADATA
========================================================= */

const TITLE =
  "Printable Calendar | TimeInOne";

const DESCRIPTION =
  "Print a clean full-year calendar with TimeInOne. Select any year and create a simple print-ready 12-month calendar.";

export const metadata:
  Metadata = {
  title:
    TITLE,

  description:
    DESCRIPTION,

  alternates: {
    canonical:
      "/calendar/printable",
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
      TITLE,

    description:
      DESCRIPTION,

    url:
      `${SITE_URL}/calendar/printable`,

    siteName:
      SITE_NAME,
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      TITLE,

    description:
      DESCRIPTION,
  },
};

/* =========================================================
   JSON-LD
========================================================= */

function createPrintableCalendarJsonLd():
  JsonLdObject[] {
  const path =
    "/calendar/printable";

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
      "Printable Calendar",

    description:
      DESCRIPTION,

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
          "Printable Calendar",

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

export default async function PrintableCalendarPage() {
  /*
   * The default selected year must
   * reflect the real current year
   * at request time.
   */
  await connection();

  const currentYear =
    new Date().getFullYear();

  const jsonLd =
    createPrintableCalendarJsonLd();

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen bg-background text-text-primary print:bg-white">
        {/* =====================================
            HERO
        ====================================== */}

        <section className="border-b border-border bg-gradient-to-b from-primary-soft/70 via-background to-background print:hidden">
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
                Printable Calendar
              </span>
            </nav>

            {/* HERO CONTENT */}

            <Badge
              variant="accent"
              size="sm"
              className="mt-7"
            >
              Print Ready
            </Badge>

            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-text-primary sm:text-5xl">
              Printable{" "}

              <span className="text-primary">
                Calendar
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Choose any year and print
              a clean 12-month calendar
              directly from your browser.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                12 months
              </span>

              <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                A4 landscape
              </span>

              <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text-secondary shadow-sm">
                One-page print
              </span>

              <span className="rounded-full border border-primary-muted bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
                Browser printing
              </span>
            </div>

            {/* QUICK LINKS */}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={
                  `/calendar/${currentYear}`
                }
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md"
              >
                View {currentYear} Calendar
              </Link>

              <Link
                href="/calendar/monthly"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-primary-muted hover:bg-primary-soft hover:text-primary"
              >
                Monthly Calendar
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================
            PRINTABLE TOOL
        ====================================== */}

        <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8 print:max-w-none print:px-0 print:py-0">
          <PrintableCalendar
            initialYear={
              currentYear
            }
          />
        </section>

        {/* =====================================
            PRINT INFORMATION
        ====================================== */}

        <section className="mx-auto w-full max-w-7xl px-5 pb-12 sm:px-6 lg:px-8 print:hidden">
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                Select a year
              </p>

              <h2 className="mt-3 text-lg font-bold text-text-primary">
                Any calendar year
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Choose the year you want
                before opening the browser
                print dialog.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                Print layout
              </p>

              <h2 className="mt-3 text-lg font-bold text-text-primary">
                12 months on one page
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                The print stylesheet is
                optimized for a compact
                full-year landscape layout.
              </p>
            </article>

            <article className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                No download needed
              </p>

              <h2 className="mt-3 text-lg font-bold text-text-primary">
                Print from your browser
              </h2>

              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Print directly or save the
                calendar as a PDF using
                your browser.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}