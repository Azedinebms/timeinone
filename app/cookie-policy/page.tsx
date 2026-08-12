import type {
  Metadata,
} from "next";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";

import {
  LegalCallout,
  LegalDefinition,
  LegalDocument,
  LegalList,
  LegalListItem,
  LegalParagraph,
  LegalSection,
} from "@/components/legal/LegalDocument";

import legalConfig from "@/lib/legal-config";

const {
  siteName,
  siteUrl,
  contactEmail,
  policyUpdatedAt,
} =
  legalConfig;

export const metadata:
  Metadata = {
  title:
    `Cookie Policy | ${siteName}`,

  description:
    "Learn about cookies, local storage and similar technologies used or potentially used by TimeInOne.",

  alternates: {
    canonical:
      `${siteUrl}/cookie-policy`,
  },

  openGraph: {
    title:
      `Cookie Policy | ${siteName}`,

    description:
      "Information about cookies and browser storage on TimeInOne.",

    url:
      `${siteUrl}/cookie-policy`,

    type:
      "website",
  },
};

export default function CookiePolicyPage() {
  return (
    <>
      <Header />

      <LegalDocument
        eyebrow="Cookies"
        title="Cookie Policy"
        description="This page explains how TimeInOne may use cookies, local storage and similar browser technologies."
        updatedAt={
          policyUpdatedAt
        }
      >
        <LegalSection
          id="definition"
          number="01"
          title="What cookies are"
        >
          <LegalParagraph>
            Cookies are small pieces of
            data stored or read by a
            website through a browser.
            Similar technologies include
            local storage, session
            storage and other device
            identifiers.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="current-use"
          number="02"
          title="Current V1 position"
        >
          <LegalCallout
            title="Limited browser storage"
            tone="emerald"
          >
            The initial public version
            of TimeInOne is designed to
            operate without advertising
            cookies or account-tracking
            cookies. Some requested
            functionality may use URLs
            or local browser state.
          </LegalCallout>

          <LegalParagraph>
            Hosting and security
            providers may nevertheless
            use strictly necessary
            technologies to deliver,
            protect or balance traffic
            to the website.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="categories"
          number="03"
          title="Technology categories"
        >
          <dl className="grid gap-4">
            <LegalDefinition term="Strictly necessary">
              Required to provide a
              requested feature,
              maintain security,
              remember essential
              choices or operate the
              website.
            </LegalDefinition>

            <LegalDefinition term="Preferences">
              Used to remember
              non-essential interface or
              personalization choices.
            </LegalDefinition>

            <LegalDefinition term="Analytics">
              Used to understand visits,
              performance and feature
              usage. These technologies
              are not active merely
              because they are described
              here.
            </LegalDefinition>

            <LegalDefinition term="Advertising">
              Used to measure or
              personalize advertising.
              TimeInOne must update this
              policy and implement any
              required consent controls
              before adding such tools.
            </LegalDefinition>
          </dl>
        </LegalSection>

        <LegalSection
          id="planner"
          number="04"
          title="Meeting Planner state"
        >
          <LegalParagraph>
            Shared Meeting Planner
            configurations may be
            encoded directly in the URL.
            This allows another browser
            to restore the selected
            cities and settings without
            requiring an account.
          </LegalParagraph>

          <LegalParagraph>
            A URL is not a cookie, but
            it can still reveal the
            information written into it
            to recipients, browser
            history, hosting logs or
            referral systems.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="consent"
          number="05"
          title="Consent"
        >
          <LegalParagraph>
            Where applicable law
            requires consent for
            non-essential cookies or
            trace technologies, TimeInOne
            should request that consent
            before activating them.
          </LegalParagraph>

          <LegalParagraph>
            Refusing non-essential
            technologies should not
            prevent access to the core
            public time tools, unless a
            particular technology is
            genuinely necessary for a
            requested feature.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="management"
          number="06"
          title="Managing browser storage"
        >
          <LegalList>
            <LegalListItem>
              Use your browser settings
              to view, block or delete
              cookies.
            </LegalListItem>

            <LegalListItem>
              Clear local and session
              storage through browser
              site-data controls.
            </LegalListItem>

            <LegalListItem>
              Use any TimeInOne consent
              preference tool that may
              be introduced after
              analytics or advertising
              services are installed.
            </LegalListItem>
          </LegalList>

          <LegalParagraph>
            Blocking strictly necessary
            storage may cause some
            requested functions to stop
            working correctly.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="future-services"
          number="07"
          title="Future analytics and advertising"
        >
          <LegalParagraph>
            Before installing analytics,
            advertising or other
            non-essential tracking
            services, TimeInOne must review
            their cookies, purposes,
            retention periods, providers
            and applicable consent
            requirements.
          </LegalParagraph>

          <LegalCallout
            title="Policy update required"
            tone="amber"
          >
            Do not activate Google
            Analytics, advertising,
            heatmaps or similar
            technologies in production
            without first updating this
            page and implementing the
            required consent mechanism.
          </LegalCallout>
        </LegalSection>

        <LegalSection
          id="contact"
          number="08"
          title="Questions"
        >
<Button
  as="a"
  href={`mailto:${contactEmail}`}
  variant="secondary"
  className="break-all"
>
  {contactEmail}
</Button>
        </LegalSection>
      </LegalDocument>
    </>
  );
}