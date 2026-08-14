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
  operatorName,
  policyUpdatedAt,
} =
  legalConfig;

export const metadata:
  Metadata = {
  title:
    `Privacy Policy | ${siteName}`,

  description:
    "Learn how TimeInOne handles personal information, contact messages, technical data, shared meeting links and privacy requests.",

  alternates: {
    canonical:
      `${siteUrl}/privacy-policy`,
  },

  openGraph: {
    title:
      `Privacy Policy | ${siteName}`,

    description:
      "Information about personal-data handling and privacy rights on TimeInOne.",

    url:
      `${siteUrl}/privacy-policy`,

    type:
      "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbJsonLd = {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement: [
      {
        "@type":
          "ListItem",

        position: 1,

        name:
          "Home",

        item:
          siteUrl,
      },
      {
        "@type":
          "ListItem",

        position: 2,

        name:
          "Privacy Policy",

        item:
          `${siteUrl}/privacy-policy`,
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
  ).replace(
    /</g,
    "\\u003c",
  ),
        }}
      />

      <LegalDocument
        eyebrow="Privacy"
        title="Privacy Policy"
        description="This policy explains what information TimeInOne may process, why it is processed, how it is protected and what choices may be available to users."
        updatedAt={
          policyUpdatedAt
        }
      >
        <LegalSection
          id="scope"
          number="01"
          title="Scope of this policy"
        >
          <LegalParagraph>
            This Privacy Policy
            applies to the public
            TimeInOne website,
            including its time-zone
            converter, World Clock,
            Meeting Planner,
            institutional pages and
            contact tools.
          </LegalParagraph>

          <LegalParagraph>
            The data controller or
            website operator is:
          </LegalParagraph>

          <dl className="grid gap-3 sm:grid-cols-2">
            <LegalDefinition term="Operator">
              {operatorName}
            </LegalDefinition>


            <LegalDefinition term="Privacy contact">
              {contactEmail}
            </LegalDefinition>

            <LegalDefinition term="Website">
              {siteUrl}
            </LegalDefinition>
          </dl>
        </LegalSection>

        <LegalSection
          id="information-collected"
          number="02"
          title="Information we may process"
        >
          <LegalParagraph>
            The information processed
            depends on how you use the
            website.
          </LegalParagraph>

          <LegalList>
            <LegalListItem>
              <strong className="text-text-primary">
                Contact information:
              </strong>{" "}
              your name, email address,
              subject and message when
              you choose to contact
              Atlas.
            </LegalListItem>

            <LegalListItem>
              <strong className="text-text-primary">
                Technical information:
              </strong>{" "}
              IP address, browser type,
              device information,
              requested URL, response
              status and timestamps
              that may be present in
              hosting or security logs.
            </LegalListItem>

            <LegalListItem>
              <strong className="text-text-primary">
                Planner configuration:
              </strong>{" "}
              selected cities,
              business-hour settings,
              meeting duration, date
              and other preferences
              included in a shared
              Meeting Planner URL.
            </LegalListItem>

            <LegalListItem>
              <strong className="text-text-primary">
                Local browser data:
              </strong>{" "}
              limited preferences or
              state stored on your
              device when necessary
              for a requested feature.
            </LegalListItem>
          </LegalList>

          <LegalCallout
            title="Current V1 contact form"
            tone="emerald"
          >
            The current Contact form
            prepares a message in your
            own email application. It
            does not intentionally
            upload the form contents
            to an TimeInOne database.
          </LegalCallout>
        </LegalSection>

        <LegalSection
          id="purposes"
          number="03"
          title="Why information is processed"
        >
          <LegalList>
            <LegalListItem>
              To provide the requested
              website pages and tools.
            </LegalListItem>

            <LegalListItem>
              To calculate, restore and
              share Meeting Planner
              configurations.
            </LegalListItem>

            <LegalListItem>
              To answer support,
              correction, privacy or
              business enquiries.
            </LegalListItem>

            <LegalListItem>
              To maintain security,
              prevent abuse and diagnose
              technical problems.
            </LegalListItem>

            <LegalListItem>
              To comply with applicable
              legal obligations and
              respond to lawful
              requests.
            </LegalListItem>

            <LegalListItem>
              To improve the platform
              where this is permitted
              and appropriately
              disclosed.
            </LegalListItem>
          </LegalList>
        </LegalSection>

        <LegalSection
          id="legal-bases"
          number="04"
          title="Legal bases where applicable"
        >
          <LegalParagraph>
            Depending on the user,
            location and activity,
            processing may rely on one
            or more of the following
            grounds:
          </LegalParagraph>

          <LegalList>
            <LegalListItem>
              Performance of a service
              requested by the user.
            </LegalListItem>

            <LegalListItem>
              Legitimate interests in
              operating, securing and
              improving the website,
              provided those interests
              do not override the
              individual’s rights.
            </LegalListItem>

            <LegalListItem>
              Consent, particularly
              where optional cookies,
              analytics or marketing
              technologies require it.
            </LegalListItem>

            <LegalListItem>
              Compliance with a legal
              obligation.
            </LegalListItem>
          </LegalList>
        </LegalSection>

        <LegalSection
          id="shared-links"
          number="05"
          title="Meeting Planner shared links"
        >
          <LegalParagraph>
            A shared Meeting Planner
            URL may contain selected
            cities and meeting
            preferences in its query
            string. Anyone who receives
            that URL may be able to
            read and restore those
            settings.
          </LegalParagraph>

          <LegalCallout
            title="Do not place confidential information in shared URLs"
            tone="amber"
          >
            Shared links should not
            contain names, passwords,
            private notes, health data,
            financial data, access
            tokens or other sensitive
            information.
          </LegalCallout>
        </LegalSection>

        <LegalSection
          id="recipients"
          number="06"
          title="Service providers and recipients"
        >
          <LegalParagraph>
            Information may be handled
            by providers needed to
            operate the website, such
            as hosting, database,
            security, email or
            monitoring providers.
          </LegalParagraph>

          <LegalParagraph>
            TimeInOne does not state that
            it sells personal
            information. If future
            advertising or data-sharing
            practices materially change
            this position, this policy
            and any required user
            controls must be updated
            before those practices are
            introduced.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="retention"
          number="07"
          title="Data retention"
        >
          <LegalParagraph>
            Personal information should
            be retained only for as
            long as reasonably necessary
            for the purpose for which it
            was collected, including
            security, support, legal and
            accounting requirements.
          </LegalParagraph>

          <LegalList>
            <LegalListItem>
              Contact emails may be
              retained while the request
              is being handled and for a
              reasonable follow-up
              period.
            </LegalListItem>

            <LegalListItem>
              Technical logs may be
              retained temporarily for
              security, diagnostics and
              abuse prevention.
            </LegalListItem>

            <LegalListItem>
              Shared planner links
              remain under the control
              of the people who possess
              or distribute the URL.
            </LegalListItem>
          </LegalList>
        </LegalSection>

        <LegalSection
          id="international-transfers"
          number="08"
          title="International processing"
        >
          <LegalParagraph>
            Website providers may
            process information in
            countries different from
            the user’s country.
            Appropriate contractual,
            legal or organizational
            safeguards should be used
            where required.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="rights"
          number="09"
          title="Your privacy rights"
        >
          <LegalParagraph>
            Depending on applicable law
            and your location, you may
            have rights concerning your
            personal information.
          </LegalParagraph>

          <LegalList>
            <LegalListItem>
              Request information about
              processing.
            </LegalListItem>

            <LegalListItem>
              Request access to personal
              data.
            </LegalListItem>

            <LegalListItem>
              Request correction of
              inaccurate information.
            </LegalListItem>

            <LegalListItem>
              Request deletion where the
              legal conditions are met.
            </LegalListItem>

            <LegalListItem>
              Object to or restrict
              certain processing.
            </LegalListItem>

            <LegalListItem>
              Withdraw consent for
              future processing where
              consent is the legal
              basis.
            </LegalListItem>

            <LegalListItem>
              Request portability where
              that right applies.
            </LegalListItem>

            <LegalListItem>
              Lodge a complaint with a
              competent data-protection
              authority.
            </LegalListItem>
          </LegalList>

          <LegalParagraph>
            California residents may
            also have rights to know,
            delete, correct or opt out
            of certain selling or
            sharing activities when the
            relevant California law
            applies to the operator.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="security"
          number="10"
          title="Security"
        >
          <LegalParagraph>
            Reasonable technical and
            organizational measures are
            used to protect the website.
            However, no Internet service
            or storage method can be
            guaranteed to be completely
            secure.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="children"
          number="11"
          title="Children’s privacy"
        >
          <LegalParagraph>
            TimeInOne is a general-purpose
            time utility and is not
            intentionally directed at
            young children. Users should
            not submit personal
            information about children
            through contact messages or
            shared URLs.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="changes"
          number="12"
          title="Changes to this policy"
        >
          <LegalParagraph>
            This policy may be updated
            when TimeInOne adds new
            services, providers,
            analytics, advertising,
            accounts, payments or legal
            requirements. The updated
            date shown above indicates
            the current published
            version.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="contact"
          number="13"
          title="Privacy contact"
        >
          <LegalParagraph>
            Privacy requests may be sent
            to:
          </LegalParagraph>

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