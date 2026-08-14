import type {
  Metadata,
} from "next";

import Link from "next/link";

import ContactForm from "@/components/contact/ContactForm";

import {
  InstitutionalCard,
  InstitutionalPage,
  InstitutionalSection,
} from "@/components/content/InstitutionalPage";

import Header from "@/components/layout/Header";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const siteUrl =
  (
    process.env
      .NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  ).replace(
    /\/+$/,
    "",
  );

const contactEmail =
  process.env
    .NEXT_PUBLIC_CONTACT_EMAIL ??
  "contact@timeinone.com";

export const metadata:
  Metadata = {
  title:
    "Contact TimeInOne | Support, Feedback & Corrections",

  description:
    "Contact TimeInOne for technical support, time-zone corrections, feature requests, privacy questions and business enquiries.",

  alternates: {
    canonical:
      `${siteUrl}/contact`,
  },

  openGraph: {
    title:
      "Contact TimeInOne",

    description:
      "Get in touch with TimeInOne for support, corrections, product feedback and partnership enquiries.",

    url:
      `${siteUrl}/contact`,

    type:
      "website",
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "Contact TimeInOne",

    description:
      "Contact our team about support, corrections, features, privacy or partnerships.",
  },
};

const contactReasons = [
  {
    icon:
      "◷",

    title:
      "Time-zone corrections",

    description:
      "Report a city, country, time-zone or daylight-saving issue that may require review.",
  },
  {
    icon:
      "◉",

    title:
      "Product support",

    description:
      "Ask for help with the World Clock, converter, Meeting Planner, sharing or calendar export.",
  },
  {
    icon:
      "✦",

    title:
      "Feature requests",

    description:
      "Suggest an improvement that could make global time coordination easier or more useful.",
  },
  {
    icon:
      "◇",

    title:
      "Business enquiries",

    description:
      "Contact us about partnerships, integrations, data usage or other professional opportunities.",
  },
] as const;

export default function ContactPage() {
  const contactPageJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "ContactPage",

    name:
      "Contact TimeInOne",

    url:
      `${siteUrl}/contact`,

    description:
      "Contact TimeInOne for support, corrections, feedback, privacy requests and business enquiries.",

    isPartOf: {
      "@id":
        `${siteUrl}/#website`,
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
          siteUrl,
      },
      {
        "@type":
          "ListItem",

        position:
          2,

        name:
          "Contact",

        item:
          `${siteUrl}/contact`,
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
              contactPageJsonLd,
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
            ).replace(
              /</g,
              "\\u003c",
            ),
        }}
      />

<InstitutionalPage
  eyebrow="Contact"
  title="Talk to TimeInOne"
  description="Contact us about support, corrections, product ideas, privacy questions or professional opportunities."
  badge="We value clear feedback"
  compact
>
        <div className="space-y-16">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
            <ContactForm
              contactEmail={
                contactEmail
              }
            />

            <aside className="space-y-5">
              <Card
                as="section"
                variant="elevated"
                padding="md"
                className="relative overflow-hidden border-primary-muted"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary-soft blur-3xl"
                />

                <div className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-lg text-primary">
                    ✉
                  </span>

                  <h2 className="mt-5 text-xl font-bold text-text-primary">
                    Direct email
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-text-secondary">
                    You may contact
                    TimeInOne directly
                    using the address
                    below.
                  </p>

                  <a
                    href={`mailto:${contactEmail}`}
                    className="mt-5 block break-all rounded-xl border border-border bg-surface-soft px-4 py-3 text-sm font-semibold text-primary outline-none transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary-hover focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {contactEmail}
                  </a>
                </div>
              </Card>

              <Card
                as="section"
                variant="default"
                padding="md"
              >
                <h2 className="text-lg font-semibold text-text-primary">
                  Helpful information
                </h2>

                <ul className="mt-4 space-y-4 text-sm leading-6 text-text-secondary">
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                    <span>
                      Include the page URL
                      when reporting a
                      problem.
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                    <span>
                      For time-zone
                      corrections, mention
                      the city, country and
                      date.
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                    <span>
                      Never send passwords,
                      API keys or sensitive
                      financial data.
                    </span>
                  </li>
                </ul>
              </Card>

              <Card
                as="section"
                variant="default"
                padding="md"
              >
                <h2 className="text-lg font-semibold text-text-primary">
                  Before contacting us
                </h2>

                <p className="mt-3 text-sm leading-7 text-text-secondary">
                  The answer may already
                  be available in our
                  frequently asked
                  questions.
                </p>

                <Button
                  as={Link}
                  href="/faq"
                  variant="ghost"
                  size="sm"
                  className="mt-4 px-0 hover:bg-transparent"
                >
                  Read the FAQ

                  <span
                    aria-hidden="true"
                    className="ml-2"
                  >
                    →
                  </span>
                </Button>
              </Card>
            </aside>
          </div>

          <InstitutionalSection
            eyebrow="Contact topics"
            title="What can you contact us about?"
            description="Clear context helps us understand your message and respond more effectively."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {contactReasons.map(
                (
                  reason,
                ) => (
                  <InstitutionalCard
                    key={
                      reason.title
                    }
                    icon={
                      reason.icon
                    }
                    title={
                      reason.title
                    }
                    description={
                      reason.description
                    }
                  />
                ),
              )}
            </div>
          </InstitutionalSection>

          <Card
            as="section"
            variant="soft"
            padding="lg"
            className="border-warning/25 bg-warning-soft"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-warning/25 bg-surface text-lg text-warning">
                !
              </span>

              <div>
                <h2 className="text-xl font-bold text-text-primary">
                  Important time-zone
                  notice
                </h2>

                <p className="mt-4 text-sm leading-7 text-text-secondary">
                  Governments may change
                  time-zone and
                  daylight-saving rules.
                  For travel, legal,
                  financial, medical or
                  mission-critical
                  scheduling, always
                  confirm the final time
                  directly with the
                  relevant organization
                  or participants.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </InstitutionalPage>
    </>
  );
}