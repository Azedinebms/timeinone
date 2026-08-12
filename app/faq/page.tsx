import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  type FaqItem,
} from "@/components/faq/FaqAccordion";

import FaqAccordion from "@/components/faq/FaqAccordion";

import {
  InstitutionalCallout,
  InstitutionalPage,
} from "@/components/content/InstitutionalPage";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

export const metadata:
  Metadata = {
  title:
    "TimeInOne FAQ — Time Zones, World Clock & Meeting Planner",

  description:
    "Find answers about TimeInOne, time-zone calculations, daylight saving time, city data, meeting planning, shared links, privacy and calendar exports.",

  alternates: {
    canonical:
      `${siteUrl}/faq`,
  },

  openGraph: {
    title:
      "TimeInOne FAQ",

    description:
      "Frequently asked questions about TimeInOne time-zone conversion, world clocks and international meeting planning.",

    url:
      `${siteUrl}/faq`,

    type:
      "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "TimeInOne FAQ",

    description:
      "Answers about time zones, world clocks, meeting planning, sharing and privacy.",
  },
};

const faqItems:
  FaqItem[] = [
  {
    id:
      "what-is-project-atlas",

    category:
      "Atlas",

    question:
      "What is TimeInOne?",

    answer:
      "TimeInOne is a time intelligence platform that combines time-zone conversion, world clocks, country and city time pages, and an international Meeting Planner. It is designed to make global time easier to understand and coordinate.",
  },
  {
    id:
      "is-atlas-free",

    category:
      "Atlas",

    question:
      "Is TimeInOne free to use?",

    answer:
      "The public tools included in the initial version of TimeInOne are intended to be available without requiring an account. Future advanced or team-oriented features may have different access conditions.",
  },
  {
    id:
      "how-time-is-calculated",

    category:
      "Time zones",

    question:
      "How does TimeInOne calculate local time?",

    answer:
      "TimeInOne connects each supported city to an IANA time-zone identifier such as Europe/Paris, America/New_York or Africa/Casablanca. The application then calculates local time for the selected date using the time-zone rules available to the platform.",
  },
  {
    id:
      "daylight-saving-time",

    category:
      "Time zones",

    question:
      "Does TimeInOne support daylight saving time?",

    answer:
      "Yes. When a city is linked to a recognized IANA time zone, TimeInOne can reflect daylight-saving and historical offset rules available for that zone. The difference between two cities may therefore change during the year.",
  },
  {
    id:
      "government-rule-changes",

    category:
      "Time zones",

    question:
      "Can governments change a time zone after TimeInOne publishes a page?",

    answer:
      "Yes. Governments can change offsets, daylight-saving rules or effective dates. TimeInOne is designed to use recognized time-zone data, but mission-critical schedules should always be confirmed directly with the relevant organization or participants.",
  },
  {
    id:
      "utc-offset-vs-timezone",

    category:
      "Time zones",

    question:
      "What is the difference between a UTC offset and a time zone?",

    answer:
      "A UTC offset such as UTC+1 represents a fixed difference from Coordinated Universal Time. A named time zone such as Europe/Paris also includes regional rules, including possible daylight-saving changes. Two places may share an offset today but not throughout the year.",
  },
  {
    id:
      "city-not-found",

    category:
      "World Clock",

    question:
      "Why can I not find a particular city?",

    answer:
      "TimeInOne currently focuses on cities available in its imported geographic dataset and connected to a valid country and time zone. Some small localities, renamed places or duplicate city names may require additional review before they appear.",
  },
  {
    id:
      "duplicate-city-names",

    category:
      "World Clock",

    question:
      "How does TimeInOne handle cities with the same name?",

    answer:
      "TimeInOne uses country information and route identifiers to distinguish cities that share a name. Where a generic city slug is used, the most relevant result may be selected according to the available geographic and population data.",
  },
  {
    id:
      "world-clock-live",

    category:
      "World Clock",

    question:
      "Does the World Clock update automatically?",

    answer:
      "Live clock components can update automatically while the page is open. TimeInOne may pause frequent updates when the browser tab is hidden to reduce unnecessary work, then synchronize again when the user returns.",
  },
  {
    id:
      "meeting-planner-method",

    category:
      "Meeting Planner",

    question:
      "How does the Meeting Planner recommend a time?",

    answer:
      "The Meeting Planner compares participant time zones, local dates, configured working hours, meeting duration and comfort levels. TimeInOne then ranks candidate windows according to overlap, participant comfort, fairness and schedule fit.",
  },
  {
    id:
      "meeting-score",

    category:
      "Meeting Planner",

    question:
      "What does the TimeInOne meeting score mean?",

    answer:
      "The score is an explanatory ranking from 0 to 100. A higher score generally indicates stronger working-hour overlap, better participant comfort and a fairer distribution of inconvenience. It is a planning aid rather than a guarantee of availability.",
  },
  {
    id:
      "business-hours",

    category:
      "Meeting Planner",

    question:
      "Can I customize participant working hours?",

    answer:
      "Yes. Each participant city can have its own start hour, end hour and working days. Changing these settings updates the available recommendations, timeline comfort scores and meeting analysis.",
  },
  {
    id:
      "compromise-slots",

    category:
      "Meeting Planner",

    question:
      "What are compromise slots?",

    answer:
      "A compromise slot is a meeting window where not every participant is fully inside the preferred working schedule, but the local time may still be manageable. Users can allow or disable these recommendations depending on their needs.",
  },
  {
    id:
      "share-meeting",

    category:
      "Meeting Planner",

    question:
      "Can I share a Meeting Planner setup?",

    answer:
      "Yes. TimeInOne can generate a shareable URL containing the planner configuration needed to restore participant cities and selected settings. The canonical search-engine URL remains the main Meeting Planner page without the shared query parameters.",
  },
  {
    id:
      "calendar-export",

    category:
      "Meeting Planner",

    question:
      "Can I add a selected meeting to my calendar?",

    answer:
      "Yes. The selected recommendation can be exported as an ICS file. Most calendar applications, including Google Calendar, Apple Calendar and Outlook, can import this standard format.",
  },
  {
    id:
      "no-account",

    category:
      "Privacy",

    question:
      "Do I need an account to use Atlas?",

    answer:
      "The initial public version of TimeInOne does not require an account for its core tools. Meeting Planner state may be stored in the URL or handled locally in the browser depending on the feature being used.",
  },
  {
    id:
      "contact-form-storage",

    category:
      "Privacy",

    question:
      "Does the Contact form store my message on TimeInOne servers?",

    answer:
      "The current V1 Contact form prepares an email locally in the user’s email application. It does not submit the message to an TimeInOne database. This may change if a dedicated contact-delivery service is introduced later.",
  },
  {
    id:
      "cookies",

    category:
      "Privacy",

    question:
      "Does TimeInOne use cookies?",

    answer:
      "TimeInOne may use technically necessary browser storage and, after deployment, may introduce analytics or other optional services. The Cookie Policy will describe the services active on the production website and any available consent choices.",
  },
  {
    id:
      "report-correction",

    category:
      "Support",

    question:
      "How can I report an incorrect city or time-zone result?",

    answer:
      "Use the Contact page and include the page URL, city, country, date and the result you expected. Time-zone corrections are easier to review when the report includes clear context and an authoritative reference.",
  },
  {
    id:
      "feature-request",

    category:
      "Support",

    question:
      "Can I suggest a new feature?",

    answer:
      "Yes. TimeInOne welcomes useful feature suggestions, especially ideas related to global scheduling, time-zone clarity, accessibility, sharing, calendar workflows and international teamwork.",
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "FAQPage",

    mainEntity:
      faqItems.map(
        (item) => ({
          "@type":
            "Question",

          name:
            item.question,

          acceptedAnswer: {
            "@type":
              "Answer",

            text:
              item.answer,
          },
        }),
      ),
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
          siteUrl,
      },
      {
        "@type":
          "ListItem",

        position:
          2,

        name:
          "FAQ",

        item:
          `${siteUrl}/faq`,
      },
    ],
  };

  return (
    <>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
  faqJsonLd,
).replace(
  /</g,
  "\\u003c",
),
        }}
      />

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
        eyebrow="Frequently asked questions"
        title="Answers about TimeInOne"
        description="Find clear answers about time zones, world clocks, meeting recommendations, shared links, privacy and product support."
        badge={`${faqItems.length} helpful answers`}
      >
        <div className="space-y-16">
          <FaqAccordion
            items={
              faqItems
            }
          />

          <InstitutionalCallout
            title="Could not find the answer?"
            description="Send TimeInOne a clear message with the page URL and enough context for us to understand your question."
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
                href="/about"
                variant="secondary"
              >
                About TimeInOne
              </Button>
          </InstitutionalCallout>
        </div>
      </InstitutionalPage>
    </>
  );
}