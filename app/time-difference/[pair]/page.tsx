import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  cache,
} from "react";

import Header from "@/components/layout/Header";

import FaqSection from "@/components/seo/FaqSection";
import JsonLd from "@/components/seo/JsonLd";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHero from "@/components/ui/PageHero";

import BestTimeToCall from "@/features/time-difference/components/BestTimeToCall";
import TimeDifferenceTable from "@/features/time-difference/components/TimeDifferenceTable";

import {
  createFaqJsonLd,
} from "@/lib/seo";

import {
  resolveTimeDifferencePair,
} from "@/services/time-difference-page.service";

/* =========================================================
   TYPES
========================================================= */

type TimeDifferencePageProps = {
  params: Promise<{
    pair: string;
  }>;
};

type WorkingOverlap = {
  exists: boolean;

  fromStart?: string;

  fromEnd?: string;

  toStart?: string;

  toEnd?: string;
};

/* =========================================================
   CONFIG
========================================================= */

const SITE_URL =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "https://www.timeinone.com";

const WORKING_START_MINUTES =
  9 * 60;

const WORKING_END_MINUTES =
  18 * 60;

/* =========================================================
   DATA CACHE
========================================================= */

const getTimeDifferencePageData =
  cache(
    async (
      pair: string,
    ) => {
      return resolveTimeDifferencePair(
        pair,
      );
    },
  );

/* =========================================================
   FORMATTERS
========================================================= */

function formatDifference(
  differenceHours: number,
): string {
  const absoluteMinutes =
    Math.round(
      Math.abs(
        differenceHours,
      ) * 60,
    );

  const hours =
    Math.floor(
      absoluteMinutes / 60,
    );

  const minutes =
    absoluteMinutes % 60;

  if (
    hours === 0 &&
    minutes === 0
  ) {
    return "Same time";
  }

  if (minutes === 0) {
    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    }`;
  }

  if (hours === 0) {
    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    }`;
  }

  return `${hours}h ${minutes}m`;
}

function formatMinuteDifference(
  differenceHours: number,
): string {
  const absoluteMinutes =
    Math.round(
      Math.abs(
        differenceHours,
      ) * 60,
    );

  const hours =
    Math.floor(
      absoluteMinutes / 60,
    );

  const minutes =
    absoluteMinutes % 60;

  if (
    hours === 0 &&
    minutes === 0
  ) {
    return "no time difference";
  }

  if (
    hours > 0 &&
    minutes === 0
  ) {
    return `${hours} ${
      hours === 1
        ? "hour"
        : "hours"
    }`;
  }

  if (hours === 0) {
    return `${minutes} ${
      minutes === 1
        ? "minute"
        : "minutes"
    }`;
  }

  return `${hours} ${
    hours === 1
      ? "hour"
      : "hours"
  } and ${minutes} ${
    minutes === 1
      ? "minute"
      : "minutes"
  }`;
}

function getCurrentCityTime(
  timezone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        timezone,

      hour:
        "numeric",

      minute:
        "2-digit",

      hour12:
        true,
    },
  ).format(
    new Date(),
  );
}

function getCurrentCityDate(
  timezone: string,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone:
        timezone,

      weekday:
        "short",

      month:
        "short",

      day:
        "numeric",
    },
  ).format(
    new Date(),
  );
}

function getOffsetLabel(
  timezone: string,
): string {
  try {
    const parts =
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone:
            timezone,

          timeZoneName:
            "shortOffset",
        },
      ).formatToParts(
        new Date(),
      );

    const offset =
      parts.find(
        (
          part,
        ) =>
          part.type ===
          "timeZoneName",
      )?.value;

    if (!offset) {
      return timezone;
    }

    return offset.replace(
      "GMT",
      "UTC",
    );
  } catch {
    return timezone;
  }
}

function normalizeMinutes(
  minutes: number,
): {
  minutes: number;

  dayOffset: number;
} {
  const dayOffset =
    Math.floor(
      minutes /
        1440,
    );

  const normalized =
    (
      (
        minutes %
        1440
      ) +
      1440
    ) %
    1440;

  return {
    minutes:
      normalized,

    dayOffset,
  };
}

function formatClockMinutes(
  totalMinutes: number,
): string {
  const {
    minutes,
  } =
    normalizeMinutes(
      totalMinutes,
    );

  const hour24 =
    Math.floor(
      minutes / 60,
    );

  const minute =
    minutes % 60;

  const suffix =
    hour24 >= 12
      ? "PM"
      : "AM";

  const hour12 =
    hour24 % 12 ||
    12;

  return `${hour12}:${String(
    minute,
  ).padStart(
    2,
    "0",
  )} ${suffix}`;
}

function getDayLabel(
  totalMinutes: number,
): string {
  const {
    dayOffset,
  } =
    normalizeMinutes(
      totalMinutes,
    );

  if (dayOffset > 0) {
    return " the next day";
  }

  if (dayOffset < 0) {
    return " the previous day";
  }

  return "";
}

/* =========================================================
   WORKING HOURS
========================================================= */

function calculateWorkingOverlap(
  differenceHours: number,
): WorkingOverlap {
  const differenceMinutes =
    Math.round(
      differenceHours *
        60,
    );

  /*
   * Destination working hours represented
   * in the source city's local clock.
   */
  const destinationStartInSource =
    WORKING_START_MINUTES -
    differenceMinutes;

  const destinationEndInSource =
    WORKING_END_MINUTES -
    differenceMinutes;

  const fromStart =
    Math.max(
      WORKING_START_MINUTES,
      destinationStartInSource,
    );

  const fromEnd =
    Math.min(
      WORKING_END_MINUTES,
      destinationEndInSource,
    );

  if (
    fromEnd <=
    fromStart
  ) {
    return {
      exists:
        false,
    };
  }

  const toStart =
    fromStart +
    differenceMinutes;

  const toEnd =
    fromEnd +
    differenceMinutes;

  return {
    exists:
      true,

    fromStart:
      formatClockMinutes(
        fromStart,
      ),

    fromEnd:
      formatClockMinutes(
        fromEnd,
      ),

    toStart:
      formatClockMinutes(
        toStart,
      ),

    toEnd:
      formatClockMinutes(
        toEnd,
      ),
  };
}

/* =========================================================
   FAQ
========================================================= */

function createTimeDifferenceFaqs({
  fromCity,
  toCity,
  differenceHours,
  differenceLabel,
  workingOverlap,
}: {
  fromCity: {
    city: string;

    country: string;

    timezone: string;
  };

  toCity: {
    city: string;

    country: string;

    timezone: string;
  };

  differenceHours: number;

  differenceLabel: string;

  workingOverlap: WorkingOverlap;
}) {
  const differenceText =
    formatMinuteDifference(
      differenceHours,
    );

  const exampleFromMinutes =
    9 * 60;

  const exampleToMinutes =
    exampleFromMinutes +
    Math.round(
      differenceHours *
        60,
    );

  const exampleToTime =
    formatClockMinutes(
      exampleToMinutes,
    );

  const exampleDayLabel =
    getDayLabel(
      exampleToMinutes,
    );

  const directionAnswer =
    differenceHours === 0
      ? `${fromCity.city} and ${toCity.city} currently have the same local time.`
      : differenceHours > 0
        ? `${toCity.city} is currently ${differenceText} ahead of ${fromCity.city}.`
        : `${toCity.city} is currently ${differenceText} behind ${fromCity.city}.`;

  const overlapAnswer =
    workingOverlap.exists
      ? `Typical 9:00 AM–6:00 PM business hours overlap between ${workingOverlap.fromStart} and ${workingOverlap.fromEnd} in ${fromCity.city}. This corresponds to ${workingOverlap.toStart}–${workingOverlap.toEnd} in ${toCity.city}.`
      : `Typical 9:00 AM–6:00 PM business hours do not directly overlap between ${fromCity.city} and ${toCity.city}. An early-morning or evening call may be more practical.`;

  return [
    {
      question:
        `What is the time difference between ${fromCity.city} and ${toCity.city}?`,

      answer:
        differenceHours === 0
          ? `${fromCity.city}, ${fromCity.country} and ${toCity.city}, ${toCity.country} currently have the same local time.`
          : `The current time difference between ${fromCity.city} and ${toCity.city} is ${differenceLabel}. ${directionAnswer}`,
    },

    {
      question:
        `Is ${toCity.city} ahead of or behind ${fromCity.city}?`,

      answer:
        directionAnswer,
    },

    {
      question:
        `What time is it in ${toCity.city} when it is 9:00 AM in ${fromCity.city}?`,

      answer:
        `Using the current UTC offsets, 9:00 AM in ${fromCity.city} corresponds to ${exampleToTime}${exampleDayLabel} in ${toCity.city}. The exact difference can change when daylight-saving rules change.`,
    },

    {
      question:
        `What is the best time to call ${toCity.city} from ${fromCity.city}?`,

      answer:
        overlapAnswer,
    },

    {
      question:
        `Can the time difference between ${fromCity.city} and ${toCity.city} change?`,

      answer:
        `Yes. The time difference can change if ${fromCity.city} or ${toCity.city} changes its UTC offset because of daylight-saving or other local time-zone rules. TimeInOne uses the IANA zones ${fromCity.timezone} and ${toCity.timezone} for date-aware calculations.`,
    },
  ];
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
  params,
}: TimeDifferencePageProps): Promise<Metadata> {
  const {
    pair,
  } =
    await params;

  const pageData =
    await getTimeDifferencePageData(
      pair,
    );

  if (!pageData) {
    return {
      title:
        "Time Difference Not Found | TimeInOne",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  const {
    fromCity,
    toCity,
    canonicalPair,
  } =
    pageData;

  const title =
    `${fromCity.city} to ${toCity.city} Time Difference | TimeInOne`;

  const description =
    `Check the current time difference between ${fromCity.city}, ${fromCity.country} and ${toCity.city}, ${toCity.country}. Compare local times, UTC offsets, working hours and the best time to call.`;

  const canonical =
    `${SITE_URL}/time-difference/${canonicalPair}`;

  return {
    title,

    description,

    alternates: {
      canonical,
    },

    robots: {
      index:
        true,

      follow:
        true,
    },

    openGraph: {
      title,

      description,

      url:
        canonical,

      type:
        "website",

      siteName:
        "TimeInOne",
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
   PAGE
========================================================= */

export default async function TimeDifferencePage({
  params,
}: TimeDifferencePageProps) {
  const {
    pair,
  } =
    await params;

  const pageData =
    await getTimeDifferencePageData(
      pair,
    );

  if (!pageData) {
    notFound();
  }

  const {
    fromCity,
    toCity,
    canonicalPair,
    differenceHours,
    summary,
  } =
    pageData;

  const requestedPair =
    decodeURIComponent(
      pair,
    )
      .trim()
      .toLowerCase();

  if (
    requestedPair !==
    canonicalPair
  ) {
    redirect(
      `/time-difference/${canonicalPair}`,
    );
  }

  /* =========================================================
     CURRENT DATA
  ========================================================= */

  const fromTime =
    getCurrentCityTime(
      fromCity.timezone,
    );

  const toTime =
    getCurrentCityTime(
      toCity.timezone,
    );

  const fromDate =
    getCurrentCityDate(
      fromCity.timezone,
    );

  const toDate =
    getCurrentCityDate(
      toCity.timezone,
    );

  const fromOffset =
    getOffsetLabel(
      fromCity.timezone,
    );

  const toOffset =
    getOffsetLabel(
      toCity.timezone,
    );

  const differenceLabel =
    formatDifference(
      differenceHours,
    );

  const differenceText =
    formatMinuteDifference(
      differenceHours,
    );

  /* =========================================================
     LINKS
  ========================================================= */

  const pageUrl =
    `${SITE_URL}/time-difference/${canonicalPair}`;

  const reverseUrl =
    `/time-difference/${toCity.slug}-to-${fromCity.slug}`;

  const converterUrl =
    `/converter/${fromCity.slug}-to-${toCity.slug}`;

  const fromCurrentTimeUrl =
    `/current-time/${fromCity.countryCode.toLowerCase()}/${fromCity.slug}`;

  const toCurrentTimeUrl =
    `/current-time/${toCity.countryCode.toLowerCase()}/${toCity.slug}`;

  /* =========================================================
     INTELLIGENCE
  ========================================================= */

  const workingOverlap =
    calculateWorkingOverlap(
      differenceHours,
    );

  const faqs =
    createTimeDifferenceFaqs({
      fromCity,

      toCity,

      differenceHours,

      differenceLabel,

      workingOverlap,
    });

  /* =========================================================
     JSON-LD
  ========================================================= */

  const webPageJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "WebPage",

    "@id":
      `${pageUrl}#webpage`,

    name:
      `${fromCity.city} to ${toCity.city} Time Difference`,

    description:
      summary,

    url:
      pageUrl,

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}/#website`,

      name:
        "TimeInOne",

      url:
        SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [
      {
        "@type":
          "ListItem",

        position:
          1,

        name:
          "Home",

        item:
          SITE_URL,
      },

      {
        "@type":
          "ListItem",

        position:
          2,

        name:
          "Time Difference",

        item:
          `${SITE_URL}/time-difference`,
      },

      {
        "@type":
          "ListItem",

        position:
          3,

        name:
          `${fromCity.city} vs ${toCity.city}`,

        item:
          pageUrl,
      },
    ],
  };

  const faqJsonLd =
    createFaqJsonLd(
      faqs,
    );

  const jsonLd = [
    webPageJsonLd,
    breadcrumbJsonLd,
    faqJsonLd,
  ];

  /* =========================================================
     GEO COPY
  ========================================================= */

  const directionSentence =
    differenceHours === 0
      ? `${fromCity.city} and ${toCity.city} currently share the same local time.`
      : differenceHours > 0
        ? `${toCity.city} is currently ${differenceText} ahead of ${fromCity.city}.`
        : `${toCity.city} is currently ${differenceText} behind ${fromCity.city}.`;

  const workingHoursSentence =
    workingOverlap.exists
      ? `For a typical 9:00 AM–6:00 PM workday, the cities overlap from ${workingOverlap.fromStart} to ${workingOverlap.fromEnd} in ${fromCity.city}, corresponding to ${workingOverlap.toStart}–${workingOverlap.toEnd} in ${toCity.city}.`
      : `Typical 9:00 AM–6:00 PM business hours do not directly overlap, so calls may require an early-morning or evening schedule.`;

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen overflow-x-hidden bg-background text-text-primary">
        {/* =====================================================
            HERO
        ====================================================== */}

        <PageHero
          badge="Time Difference"
          title={`${fromCity.city} vs ${toCity.city}`}
          highlight="Time Difference"
          description={`Compare the current local time in ${fromCity.city}, ${fromCity.country} and ${toCity.city}, ${toCity.country}.`}
          breadcrumbs={[
            {
              label:
                "Home",

              href:
                "/",
            },

            {
              label:
                "Time Difference",

              href:
                "/time-difference",
            },

            {
              label:
                `${fromCity.city} vs ${toCity.city}`,
            },
          ]}
          tags={[
            "Live local time",
            "DST aware",
            "UTC offsets",
          ]}
        />

        <section className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          {/* ===================================================
              CURRENT CLOCKS
          ==================================================== */}

          <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
            <Card
              as="article"
              variant="elevated"
              padding="lg"
              className="relative overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-primary-muted to-transparent"
              />

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                From
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                {fromCity.city}
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                {fromCity.country}
              </p>

              <p className="mt-7 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                {fromTime}
              </p>

              <p className="mt-3 text-sm font-medium text-text-secondary">
                {fromDate}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-surface-soft px-3 py-1.5 text-xs font-semibold text-text-secondary">
                  {fromOffset}
                </span>

                <span className="rounded-full border border-border bg-surface-soft px-3 py-1.5 text-xs font-semibold text-text-secondary">
                  {
                    fromCity.timezone
                  }
                </span>
              </div>
            </Card>

            <div className="flex items-center justify-center py-1 lg:w-40 lg:py-0">
              <div className="w-full rounded-2xl border border-primary-muted bg-primary-soft px-4 py-5 text-center shadow-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Difference
                </p>

                <p className="mt-2 text-xl font-bold text-text-primary">
                  {differenceLabel}
                </p>

                <Link
                  href={
                    reverseUrl
                  }
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary transition hover:text-primary-hover"
                >
                  Swap

                  <span aria-hidden="true">
                    ↔
                  </span>
                </Link>
              </div>
            </div>

            <Card
              as="article"
              variant="elevated"
              padding="lg"
              className="relative overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-primary-muted to-transparent"
              />

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                To
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                {toCity.city}
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                {toCity.country}
              </p>

              <p className="mt-7 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
                {toTime}
              </p>

              <p className="mt-3 text-sm font-medium text-text-secondary">
                {toDate}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border bg-surface-soft px-3 py-1.5 text-xs font-semibold text-text-secondary">
                  {toOffset}
                </span>

                <span className="rounded-full border border-border bg-surface-soft px-3 py-1.5 text-xs font-semibold text-text-secondary">
                  {
                    toCity.timezone
                  }
                </span>
              </div>
            </Card>
          </div>

          {/* ===================================================
              CURRENT DIFFERENCE
          ==================================================== */}

          <Card
            as="section"
            variant="soft"
            padding="lg"
            className="mt-6 border-primary-muted bg-primary-soft/50 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Current difference
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {summary}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
              This difference is calculated
              using the current UTC offsets
              for both locations and
              automatically reflects
              daylight-saving changes.
            </p>
          </Card>

          {/* ===================================================
              24-HOUR TABLE
          ==================================================== */}

          <TimeDifferenceTable
            fromCity={
              fromCity.city
            }
            fromCountry={
              fromCity.country
            }
            fromTimezone={
              fromCity.timezone
            }
            toCity={
              toCity.city
            }
            toCountry={
              toCity.country
            }
            toTimezone={
              toCity.timezone
            }
          />

          {/* ===================================================
              BEST TIME TO CALL
          ==================================================== */}

          <BestTimeToCall
            fromCity={
              fromCity.city
            }
            fromCountry={
              fromCity.country
            }
            fromTimezone={
              fromCity.timezone
            }
            toCity={
              toCity.city
            }
            toCountry={
              toCity.country
            }
            toTimezone={
              toCity.timezone
            }
          />

          {/* ===================================================
              GEO / EXPLANATION
          ==================================================== */}

          <section className="mt-10">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Time difference explained
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                {fromCity.city} and{" "}
                {toCity.city} time
                difference explained
              </h2>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Card
                as="article"
                variant="default"
                padding="lg"
              >
                <h3 className="text-lg font-semibold text-text-primary">
                  Current local-time relationship
                </h3>

                <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base">
                  {
                    directionSentence
                  }
                </p>

                <p className="mt-4 text-sm leading-7 text-text-secondary">
                  {fromCity.city} uses{" "}
                  <strong className="font-semibold text-text-primary">
                    {
                      fromCity.timezone
                    }
                  </strong>{" "}
                  and currently has an
                  offset of{" "}
                  <strong className="font-semibold text-text-primary">
                    {fromOffset}
                  </strong>
                  . {toCity.city} uses{" "}
                  <strong className="font-semibold text-text-primary">
                    {
                      toCity.timezone
                    }
                  </strong>{" "}
                  and currently has an
                  offset of{" "}
                  <strong className="font-semibold text-text-primary">
                    {toOffset}
                  </strong>
                  .
                </p>
              </Card>

              <Card
                as="article"
                variant="soft"
                padding="lg"
                className="border-primary-muted bg-primary-soft/40"
              >
                <h3 className="text-lg font-semibold text-text-primary">
                  Working-hours overlap
                </h3>

                <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base">
                  {
                    workingHoursSentence
                  }
                </p>

                <p className="mt-4 text-sm leading-7 text-text-secondary">
                  Because UTC offsets can
                  change during the year,
                  always check the selected
                  date when planning an
                  important international
                  call or meeting.
                </p>
              </Card>
            </div>
          </section>

          {/* ===================================================
              RELATED TOOLS
          ==================================================== */}

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <Card
              as="section"
              variant="default"
              padding="lg"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Convert a specific time
              </p>

              <h2 className="mt-3 text-xl font-semibold text-text-primary">
                Need more than the current difference?
              </h2>

              <p className="mt-3 text-sm leading-7 text-text-secondary">
                Convert a specific date and
                local time between{" "}
                {fromCity.city} and{" "}
                {toCity.city}.
              </p>

              <Button
                as={
                  Link
                }
                href={
                  converterUrl
                }
                variant="primary"
                className="mt-5"
              >
                Open time converter
              </Button>
            </Card>

            <Card
              as="section"
              variant="default"
              padding="lg"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Local clocks
              </p>

              <h2 className="mt-3 text-xl font-semibold text-text-primary">
                Explore each city
              </h2>

              <div className="mt-5 flex flex-col gap-3">
                <Button
                  as={
                    Link
                  }
                  href={
                    fromCurrentTimeUrl
                  }
                  variant="secondary"
                  className="justify-between"
                >
                  <span>
                    Current time in{" "}
                    {fromCity.city}
                  </span>

                  <span aria-hidden="true">
                    →
                  </span>
                </Button>

                <Button
                  as={
                    Link
                  }
                  href={
                    toCurrentTimeUrl
                  }
                  variant="secondary"
                  className="justify-between"
                >
                  <span>
                    Current time in{" "}
                    {toCity.city}
                  </span>

                  <span aria-hidden="true">
                    →
                  </span>
                </Button>
              </div>
            </Card>
          </div>

          {/* ===================================================
              FAQ
          ==================================================== */}

          <div className="mt-12">
            <FaqSection
              title={`${fromCity.city} to ${toCity.city} time difference FAQ`}
              description={`Common questions about the current time difference, UTC offsets, daylight-saving changes and practical calling hours between ${fromCity.city} and ${toCity.city}.`}
              items={
                faqs
              }
            />
          </div>
        </section>
      </main>
    </>
  );
}