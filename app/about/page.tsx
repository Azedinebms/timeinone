import type {
  Metadata,
} from "next";

import Link from "next/link";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";

import {
  InstitutionalCallout,
  InstitutionalCard,
  InstitutionalLinkCard,
  InstitutionalPage,
  InstitutionalSection,
} from "@/components/content/InstitutionalPage";

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

export const metadata:
  Metadata = {
  title:
    "About TimeInOne | The All-in-One Time Platform",

  description:
    "Learn about TimeInOne, our mission and the tools we build to simplify time-zone conversion, world clocks and international meeting planning.",

  alternates: {
    canonical:
      `${siteUrl}/about`,
  },

  openGraph: {
    title:
      "About TimeInOne | The All-in-One Time Platform",

    description:
      "Discover the mission behind TimeInOne and how our global time tools help people coordinate across cities and time zones.",

    url:
      `${siteUrl}/about`,

    type:
      "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "About TimeInOne",

    description:
      "A time intelligence platform for global time-zone conversion, world clocks and international meeting planning.",
  },
};

const corePrinciples = [
  {
    icon: "◎",

    title:
      "Clarity first",

    description:
      "Global time should be easy to understand. TimeInOne transforms complex time-zone and daylight-saving information into clear, practical interfaces.",
  },
  {
    icon: "◷",

    title:
      "Accurate time data",

    description:
      "TimeInOne relies on recognized IANA time-zone identifiers so local times can adapt to regional rules and daylight-saving changes.",
  },
  {
    icon: "✦",

    title:
      "Useful intelligence",

    description:
      "We go beyond displaying clocks by helping users compare schedules, evaluate comfort and identify better international meeting times.",
  },
  {
    icon: "◇",

    title:
      "Respectful design",

    description:
      "The platform is designed to be fast, accessible and useful without unnecessary distractions or complicated workflows.",
  },
] as const;

const capabilities = [
  {
    icon: "↔",

    title:
      "Time-zone conversion",

    description:
      "Compare times between cities, named time zones and UTC offsets with daylight-saving adjustments.",
  },
  {
    icon: "🌍",

    title:
      "Global world clock",

    description:
      "Explore current local times across countries and cities through structured world-clock pages.",
  },
  {
    icon: "◉",

    title:
      "Meeting planning",

    description:
      "Compare participant schedules, business hours and local comfort across multiple locations.",
  },
  {
    icon: "▦",

    title:
      "Interactive timeline",

    description:
      "Visualize an entire day with live clocks, comfort scores, recommendations and selected meeting windows.",
  },
  {
    icon: "✓",

    title:
      "Calendar-ready results",

    description:
      "Share a meeting plan, copy its details or export the selected time as an ICS calendar event.",
  },
  {
    icon: "⌁",

    title:
      "Structured city data",

    description:
      "TimeInOne connects cities, countries and IANA time zones to generate useful and navigable time information.",
  },
] as const;

export default function AboutPage() {

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
          siteUrl,
      },
      {
        "@type":
          "ListItem",

        position:
          2,

        name:
          "About",

        item:
          `${siteUrl}/about`,
      },
    ],
  };

  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbJsonLd,
            ),
        }}
      />

      <InstitutionalPage
        eyebrow="About us"
        title="Helping the world coordinate time"
        description="TimeInOne is a time intelligence platform built to make global time-zone conversion, world clocks and international meeting planning clearer and more useful."
        badge="The All-in-One Time Platform"
      >
        <div className="space-y-20">
          <InstitutionalSection
            eyebrow="Our mission"
            title="Make global time easier to understand"
            description="Coordinating people across cities should not require manual calculations, confusing offset tables or repeated searches. TimeInOne brings the most useful global-time tools into one coherent platform."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <InstitutionalCard
                icon="🌍"
                title="Built for a connected world"
                description="Teams, families, travelers and online communities increasingly coordinate across countries. TimeInOne helps them understand what a particular moment means in every participant’s local time."
              />

              <InstitutionalCard
                icon="◷"
                title="More than a clock"
                description="TimeInOne combines time-zone data with business hours, comfort analysis, interactive comparisons and practical scheduling recommendations."
              />
            </div>
          </InstitutionalSection>

          <InstitutionalSection
            eyebrow="Our principles"
            title="How we build TimeInOne"
            description="Every TimeInOne feature is guided by a small number of principles that keep the platform accurate, understandable and useful."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {corePrinciples.map(
                (principle) => (
                  <InstitutionalCard
                    key={
                      principle.title
                    }
                    icon={
                      principle.icon
                    }
                    title={
                      principle.title
                    }
                    description={
                      principle.description
                    }
                  />
                ),
              )}
            </div>
          </InstitutionalSection>

          <InstitutionalSection
            eyebrow="The platform"
            title="What TimeInOne can do"
            description="The first version of TimeInOne provides a complete foundation for understanding and coordinating time across the world."
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map(
                (capability) => (
                  <InstitutionalCard
                    key={
                      capability.title
                    }
                    icon={
                      capability.icon
                    }
                    title={
                      capability.title
                    }
                    description={
                      capability.description
                    }
                  />
                ),
              )}
            </div>
          </InstitutionalSection>

          <InstitutionalSection
            eyebrow="Time-zone accuracy"
            title="Designed around recognized global time zones"
            description="TimeInOne uses IANA time-zone identifiers such as Europe/Paris, America/New_York and Africa/Casablanca. These identifiers allow local times to reflect regional daylight-saving and offset rules."
          >
            <div className="rounded-3xl border border-primary-muted bg-primary-soft/50 p-6 shadow-sm sm:p-8">
  <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-lg text-primary">
          ◎
        </div>

        <p className="text-sm font-bold text-text-primary">
          Location
        </p>
      </div>

      <p className="mt-4 text-sm leading-7 text-text-secondary">
        A city is connected to its country and recognized
        time-zone identifier.
      </p>
    </div>

    <div
      aria-hidden="true"
      className="hidden h-10 w-10 items-center justify-center rounded-full border border-primary-muted bg-white text-xl font-bold text-primary shadow-sm lg:flex"
    >
      →
    </div>

    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-lg text-primary">
          ◷
        </div>

        <p className="text-sm font-bold text-text-primary">
          Local time
        </p>
      </div>

      <p className="mt-4 text-sm leading-7 text-text-secondary">
        TimeInOne calculates the appropriate local time for
        the selected date and location.
      </p>
    </div>
  </div>

  <div className="mt-6 border-t border-primary-muted pt-5">
    <p className="text-xs leading-6 text-text-muted">
      Governments can change local time-zone rules.
      TimeInOne is designed to follow the time-zone data
      available to the application, but users should confirm
      mission-critical schedules with the relevant
      participants.
    </p>
  </div>
</div>
          </InstitutionalSection>

          <InstitutionalSection
            eyebrow="Explore TimeInOne"
            title="Start with the tool you need"
            description="Every part of TimeInOne is connected, so you can move naturally from finding a city to comparing times and planning a meeting."
          >
            <div className="grid gap-5 md:grid-cols-3">
              <InstitutionalLinkCard
                href="/timezone"
                icon="↔"
                title="Compare time zones"
                description="Explore time-zone pairs and understand differences between global regions."
                linkLabel="Explore time zones"
              />

              <InstitutionalLinkCard
                href="/world-clock"
                icon="🌍"
                title="Explore world clocks"
                description="Find current local times and city information across the world."
                linkLabel="Open world clock"
              />

              <InstitutionalLinkCard
                href="/meeting-planner"
                icon="◉"
                title="Plan a meeting"
                description="Compare cities, business hours and comfort to find a stronger meeting window."
                linkLabel="Open meeting planner"
              />
            </div>
          </InstitutionalSection>

          <InstitutionalCallout
            title="Have a question or an idea for TimeInOne?"
            description="We welcome product feedback, corrections and suggestions that can make global time coordination easier."
          >
          <Button
            as={Link}
            href="/contact"
            variant="primary"
          >
            Contact TimeInOne
          </Button>

          <Button
            as={Link}
            href="/faq"
            variant="secondary"
          >
            Read the FAQ
          </Button>
          </InstitutionalCallout>
        </div>
      </InstitutionalPage>
    </>
  );
}