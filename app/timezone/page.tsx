import type {
  Metadata,
} from "next";

import Link from "next/link";

import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHero from "@/components/ui/PageHero";

import TimezoneCard from "@/features/timezone/components/TimezoneCard";
import TimezoneLinkCard from "@/features/timezone/components/TimezoneLinkCard";
import TimezoneSection from "@/features/timezone/components/TimezoneSection";

import {
  SITE_NAME,
  SITE_URL,
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "@/lib/seo";

import {
  getAllTimezones,
  getSelectedUtcOffsets,
  resolveTimezone,
  type TimezoneDefinition,
} from "@/lib/timezones";

export const metadata:
  Metadata = {
  title:
    "Time Zone Converter, UTC Offsets and Current Times | TimeInOne",

  description:
    "Explore current time-zone information, UTC and GMT offsets, daylight-saving rules and popular time conversions including PST to EST and UTC to GMT.",

  alternates: {
    canonical:
      `${SITE_URL}/timezone`,
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
      "Time Zone Converter and UTC Offset Guide | TimeInOne",

    description:
      "Browse global time zones, fixed UTC offsets and popular time-zone conversions.",

    url:
      `${SITE_URL}/timezone`,

    siteName:
      SITE_NAME,
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Time Zone Converter and UTC Offset Guide | TimeInOne",

    description:
      "Browse global time zones, fixed UTC offsets and popular time-zone conversions.",
  },
};

type PopularConversion = {
  from:
    TimezoneDefinition;

  to:
    TimezoneDefinition;
};

const POPULAR_CONVERSION_PAIRS = [
  [
    "pst",
    "est",
  ],
  [
    "est",
    "pst",
  ],
  [
    "utc",
    "gmt",
  ],
  [
    "gmt",
    "utc",
  ],
  [
    "pacific-time",
    "eastern-time",
  ],
  [
    "cet",
    "jst",
  ],
  [
    "utc",
    "est",
  ],
  [
    "utc",
    "pst",
  ],
  [
    "ist-india",
    "est",
  ],
  [
    "aest",
    "pst",
  ],
] as const;

function getPopularConversions():
  PopularConversion[] {
  const conversions:
    PopularConversion[] =
    [];

  for (
    const [
      fromSlug,
      toSlug,
    ] of
    POPULAR_CONVERSION_PAIRS
  ) {
    const from =
      resolveTimezone(
        fromSlug,
      );

    const to =
      resolveTimezone(
        toSlug,
      );

    if (
      !from ||
      !to
    ) {
      continue;
    }

    conversions.push({
      from,
      to,
    });
  }

  return conversions;
}

function createTimezoneIndexJsonLd():
  JsonLdObject[] {
  const pageUrl =
    `${SITE_URL}/timezone`;

  const webPage:
    JsonLdObject = {
    "@context":
      "https://schema.org",

    "@type":
      "CollectionPage",

    "@id":
      `${pageUrl}#webpage`,

    url:
      pageUrl,

    name:
      "Time Zone Converter and UTC Offset Guide",

    description:
      "Explore global time zones, UTC offsets, current local times and popular time-zone conversions.",

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
          "Time Zones",

        path:
          "/timezone",
      },
    ]);

  return [
    webPage,
    breadcrumbs,
  ];
}

export default function TimezoneIndexPage() {
  const predefinedTimezones =
    getAllTimezones();

  const utcOffsets =
    getSelectedUtcOffsets();

  const popularConversions =
    getPopularConversions();

  const jsonLd =
    createTimezoneIndexJsonLd();

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen overflow-x-hidden bg-background text-text-primary">
        {/* =========================================
            UNIVERSAL TIMEINONE HERO
        ========================================== */}

        <PageHero
          badge="Global Time Zone Directory"
          title="Explore global"
          highlight="time zones"
          description="Browse current local times, UTC offsets, daylight-saving behavior and popular time-zone conversions from one global directory."
          breadcrumbs={[
            {
              label:
                "Home",

              href:
                "/",
            },

            {
              label:
                "Time Zones",
            },
          ]}
          tags={[
            `${predefinedTimezones.length} time-zone definitions`,
            `${utcOffsets.length} UTC offsets`,
            "DST aware",
          ]}
        />

        {/* =========================================
            PAGE CONTENT
        ========================================== */}

        <div className="mx-auto w-full max-w-7xl space-y-8 px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* =====================================
              QUICK NAVIGATION
          ====================================== */}

          <section className="grid gap-4 sm:grid-cols-2">
            <a
              href="#popular-timezones"
              className="group flex items-center justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-muted hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-lg text-blue-600">
                  ◷
                </span>

                <div className="min-w-0">
                  <p className="font-semibold text-text-primary">
                    Browse time zones
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    Current times,
                    offsets and regions.
                  </p>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="ml-4 shrink-0 text-lg text-text-muted transition group-hover:translate-x-1 group-hover:text-primary"
              >
                →
              </span>
            </a>

            <a
              href="#popular-conversions"
              className="group flex items-center justify-between rounded-2xl border border-primary-muted bg-primary-soft/60 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-white text-lg text-violet-600 shadow-sm">
                  ⇄
                </span>

                <div className="min-w-0">
                  <p className="font-semibold text-text-primary">
                    Popular conversions
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    PST, EST, UTC,
                    GMT and more.
                  </p>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="ml-4 shrink-0 text-lg text-text-muted transition group-hover:translate-x-1 group-hover:text-primary"
              >
                →
              </span>
            </a>
          </section>

          {/* =====================================
              POPULAR TIME ZONES
          ====================================== */}

          <TimezoneSection
            badge="Time-zone definitions"
            badgeVariant="accent"
            title="Popular time zones"
            description="View current times, active UTC offsets, regions and seasonal clock behavior."
            className="scroll-mt-24"
          >
            <div
              id="popular-timezones"
              className="scroll-mt-32 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {predefinedTimezones.map(
                (
                  timezone,
                ) => (
                  <TimezoneCard
                    key={
                      timezone.slug
                    }
                    timezone={
                      timezone
                    }
                  />
                ),
              )}
            </div>
          </TimezoneSection>

          {/* =====================================
              UTC OFFSETS
          ====================================== */}

          <TimezoneSection
            badge="Fixed offsets"
            badgeVariant="info"
            title="UTC offsets used around the world"
            description="Browse fixed offsets from UTC−12:00 through UTC+14:00, including half-hour and quarter-hour offsets."
          >
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {utcOffsets.map(
                (
                  timezone,
                ) => (
                  <TimezoneLinkCard
                    key={
                      timezone.slug
                    }
                    href={
                      `/timezone/${timezone.slug}`
                    }
                    title={
                      timezone.abbreviation
                    }
                    description="Fixed UTC offset"
                    compact
                  />
                ),
              )}
            </div>
          </TimezoneSection>

          {/* =====================================
              POPULAR CONVERSIONS
          ====================================== */}

          <TimezoneSection
            badge="Popular converters"
            badgeVariant="success"
            title="Popular time-zone conversions"
            description="Convert common fixed and seasonal time-zone definitions using any date and local time."
            className="scroll-mt-24"
          >
            <div
              id="popular-conversions"
              className="scroll-mt-32 grid gap-4 sm:grid-cols-2"
            >
              {popularConversions.map(
                ({
                  from,
                  to,
                }) => (
                  <TimezoneLinkCard
                    key={
                      `${from.slug}-to-${to.slug}`
                    }
                    href={
                      `/timezone/${from.slug}-to-${to.slug}`
                    }
                    title={
                      `${from.abbreviation} to ${to.abbreviation}`
                    }
                    description={
                      `${from.name} to ${to.name}`
                    }
                  />
                ),
              )}
            </div>
          </TimezoneSection>

          {/* =====================================
              EDUCATIONAL SECTION
          ====================================== */}

          <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
            <div className="max-w-3xl">
              <Badge
                variant="primary"
                size="sm"
              >
                Time-zone basics
              </Badge>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">
                Understand how time zones work
              </h2>

              <p className="mt-3 leading-7 text-text-secondary">
                TimeInOne supports both
                fixed UTC offsets and
                seasonal IANA time zones.
                Understanding the
                difference helps you make
                accurate conversions
                throughout the year.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {/* FIXED */}

              <Card
                as="article"
                variant="default"
                padding="lg"
                interactive
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-50 text-lg font-bold text-cyan-700">
                    UTC
                  </span>

                  <Badge
                    variant="info"
                    size="sm"
                  >
                    Fixed
                  </Badge>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-text-primary">
                  Fixed UTC offsets
                </h3>

                <p className="mt-3 leading-7 text-text-secondary">
                  Definitions such as
                  UTC+01:00,
                  UTC+05:30 and fixed
                  standard-time zones keep
                  the same numerical
                  offset regardless of
                  the date.
                </p>

                <div className="mt-5 rounded-xl border border-border bg-surface-soft p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                    Example
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-semibold text-text-primary">
                      UTC
                    </span>

                    <span className="font-mono text-sm font-bold text-primary">
                      +00:00
                    </span>
                  </div>
                </div>

                <Button
                  as={
                    Link
                  }
                  href="/timezone/utc"
                  variant="secondary"
                  className="mt-6"
                >
                  Explore UTC
                </Button>
              </Card>

              {/* SEASONAL */}

              <Card
                as="article"
                variant="soft"
                padding="lg"
                interactive
                className="relative overflow-hidden border-primary-muted bg-primary-soft/70"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-muted/50 blur-3xl"
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-200 bg-white text-lg font-bold text-violet-600 shadow-sm">
                      DST
                    </span>

                    <Badge
                      variant="primary"
                      size="sm"
                    >
                      Seasonal
                    </Badge>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-text-primary">
                    Seasonal IANA zones
                  </h3>

                  <p className="mt-3 leading-7 text-text-secondary">
                    Definitions such as
                    Pacific Time and
                    Eastern Time use IANA
                    time-zone rules and
                    automatically adapt
                    to daylight-saving
                    changes for the
                    selected date.
                  </p>

                  <div className="mt-5 rounded-xl border border-primary-muted bg-white/80 p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                      Automatic behavior
                    </p>

                    <p className="mt-3 text-sm font-medium leading-6 text-text-secondary">
                      TimeInOne resolves
                      the active UTC
                      offset for the
                      selected date
                      automatically.
                    </p>
                  </div>

                  <Button
                    as={
                      Link
                    }
                    href="/timezone/pacific-time-to-eastern-time"
                    variant="primary"
                    className="mt-6"
                  >
                    Convert PT to ET
                  </Button>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}