import type {
  Metadata,
} from "next";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";

import {
  LegalCallout,
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
  governingCountry,
  policyUpdatedAt,
} =
  legalConfig;

export const metadata:
  Metadata = {
  title:
    `Terms of Use | ${siteName}`,

  description:
    "Read the conditions that apply when using TimeInOne time-zone, World Clock and Meeting Planner services.",

  alternates: {
    canonical:
      `${siteUrl}/terms-of-use`,
  },

  openGraph: {
    title:
      `Terms of Use | ${siteName}`,

    description:
      "Conditions for using TimeInOne and its global time tools.",

    url:
      `${siteUrl}/terms-of-use`,

    type:
      "website",
  },
};

export default function TermsOfUsePage() {
  return (
    <>
      <Header />

      <LegalDocument
        eyebrow="Terms"
        title="Terms of Use"
        description="These terms establish the conditions for accessing and using TimeInOne and its public global-time tools."
        updatedAt={
          policyUpdatedAt
        }
      >
        <LegalSection
          id="acceptance"
          number="01"
          title="Acceptance of these terms"
        >
          <LegalParagraph>
            By accessing or using
            TimeInOne, you agree to
            these Terms of Use. If you
            do not agree, you should
            stop using the website.
          </LegalParagraph>

          <LegalParagraph>
            The website is operated by
            {` ${operatorName}`}.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="service"
          number="02"
          title="Description of the service"
        >
          <LegalParagraph>
            TimeInOne provides informational
            tools including time-zone
            conversion, current-time
            displays, city and country
            directories, Meeting Planner
            recommendations, shared
            links and calendar exports.
          </LegalParagraph>

          <LegalParagraph>
            Features may be added,
            modified, suspended or
            removed as the platform
            evolves.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="informational-use"
          number="03"
          title="Informational use only"
        >
          <LegalCallout
            title="Confirm critical times independently"
            tone="amber"
          >
            Time-zone rules can change.
            TimeInOne results should not be
            the sole basis for travel,
            legal, medical, financial,
            emergency, transport or
            other mission-critical
            decisions.
          </LegalCallout>

          <LegalParagraph>
            Users remain responsible for
            confirming the final date,
            local time, duration and
            availability directly with
            the relevant participants or
            organizations.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="acceptable-use"
          number="04"
          title="Acceptable use"
        >
          <LegalParagraph>
            You agree not to:
          </LegalParagraph>

          <LegalList>
            <LegalListItem>
              Use TimeInOne for unlawful,
              fraudulent or abusive
              purposes.
            </LegalListItem>

            <LegalListItem>
              Attempt to bypass security,
              rate limits or access
              controls.
            </LegalListItem>

            <LegalListItem>
              Interfere with the website,
              servers, databases or other
              users.
            </LegalListItem>

            <LegalListItem>
              Introduce malicious code,
              automated attacks or
              harmful payloads.
            </LegalListItem>

            <LegalListItem>
              Scrape or extract the
              service at a volume that
              disrupts normal operation
              or violates applicable
              rules.
            </LegalListItem>

            <LegalListItem>
              Misrepresent TimeInOne content
              or use the TimeInOne
              identity without
              authorization.
            </LegalListItem>
          </LegalList>
        </LegalSection>

        <LegalSection
          id="shared-links"
          number="05"
          title="Shared planner links"
        >
          <LegalParagraph>
            Users are responsible for
            the Meeting Planner URLs
            they create and distribute.
            A recipient may be able to
            view the cities and settings
            encoded in the link.
          </LegalParagraph>

          <LegalParagraph>
            Do not include confidential,
            identifying or sensitive
            information in a shared URL.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="calendar-files"
          number="06"
          title="Calendar exports"
        >
          <LegalParagraph>
            ICS calendar files are
            provided for convenience.
            Users must review the event
            date, time, time zone and
            duration before importing or
            distributing an invitation.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="intellectual-property"
          number="07"
          title="Intellectual property"
        >
          <LegalParagraph>
            The TimeInOne name,
            interface, original text,
            visual design and original
            software are protected by
            applicable intellectual
            property rules.
          </LegalParagraph>

          <LegalParagraph>
            Third-party names, standards,
            geographic data and
            time-zone identifiers remain
            subject to their respective
            rights and licences.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="availability"
          number="08"
          title="Availability and changes"
        >
          <LegalParagraph>
            TimeInOne is provided on an
            “as available” basis. The
            operator does not guarantee
            uninterrupted availability,
            permanent retention of
            shared links or error-free
            operation.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="disclaimer"
          number="09"
          title="Disclaimer of warranties"
        >
          <LegalParagraph>
            To the extent permitted by
            applicable law, TimeInOne is
            provided without express or
            implied warranties regarding
            accuracy, availability,
            fitness for a particular
            purpose or non-infringement.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="liability"
          number="10"
          title="Limitation of liability"
        >
          <LegalParagraph>
            To the extent permitted by
            applicable law, the operator
            will not be liable for
            indirect, incidental,
            consequential or special
            losses resulting from use of
            or inability to use TimeInOne.
          </LegalParagraph>

          <LegalParagraph>
            Nothing in these terms
            excludes liability that
            cannot legally be excluded.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="external-services"
          number="11"
          title="External services and links"
        >
          <LegalParagraph>
            TimeInOne may link to or rely on
            third-party infrastructure.
            Those services have their
            own terms and privacy
            practices. TimeInOne does not
            control external websites.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="termination"
          number="12"
          title="Suspension of access"
        >
          <LegalParagraph>
            Access may be restricted or
            blocked when reasonably
            necessary to protect the
            website, comply with law or
            respond to misuse.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="law"
          number="13"
          title="Governing law"
        >
          <LegalParagraph>
            These terms are governed by
            the applicable laws of
            {` ${governingCountry}`},
            subject to mandatory
            consumer protections and
            jurisdictional rules that
            may apply to a user.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="changes"
          number="14"
          title="Changes to these terms"
        >
          <LegalParagraph>
            The terms may be updated to
            reflect new features,
            providers or legal
            requirements. Continued use
            after an updated version is
            published may constitute
            acceptance where permitted
            by law.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="contact"
          number="15"
          title="Contact"
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