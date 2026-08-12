import type {
  Metadata,
} from "next";

import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";

import PageHero from "@/components/ui/PageHero";

import {
  MeetingPlanner,
} from "@/features/meeting-planner";

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
  "Meeting Planner Across Time Zones | TimeInOne";

const DESCRIPTION =
  "Find the best meeting time across multiple cities and time zones. Compare local working hours and get smart meeting recommendations.";

export const metadata:
  Metadata = {
  title:
    TITLE,

  description:
    DESCRIPTION,

  alternates: {
    canonical:
      `${SITE_URL}/meeting-planner`,
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
      "Plan international meetings across multiple cities and automatically find the best working-hour overlap.",

    url:
      `${SITE_URL}/meeting-planner`,

    siteName:
      SITE_NAME,
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      TITLE,

    description:
      "Plan international meetings across multiple cities and automatically find the best working-hour overlap.",
  },
};

/* =========================================================
   JSON-LD
========================================================= */

function createMeetingPlannerJsonLd():
  JsonLdObject[] {
  const path =
    "/meeting-planner";

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
      "Meeting Planner Across Time Zones",

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
          "Meeting Planner",

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

export default function MeetingPlannerPage() {
  const jsonLd =
    createMeetingPlannerJsonLd();

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
            COMPACT PAGE HEADER
        ========================================== */}

        <PageHero
          badge="Global Meeting Intelligence"
          title="Plan a meeting across"
          highlight="time zones"
          description="Add participant cities, compare local working hours and find the best meeting time for everyone."
          breadcrumbs={[
            {
              label:
                "Home",

              href:
                "/",
            },

            {
              label:
                "Meeting Planner",
            },
          ]}
          tags={[
            "Up to 5 cities",
            "Working-hours analysis",
            "Smart recommendations",
          ]}
        />

        {/* =========================================
            PLANNER
        ========================================== */}

        <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          <MeetingPlanner />
        </section>
      </main>
    </>
  );
}