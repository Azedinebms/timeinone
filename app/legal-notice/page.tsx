import type {
  Metadata,
} from "next";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";

import {
  LegalCallout,
  LegalDefinition,
  LegalDocument,
  LegalParagraph,
  LegalSection,
} from "@/components/legal/LegalDocument";

import legalConfig from "@/lib/legal-config";

const {
  siteName,
  siteUrl,
  contactEmail,
  operatorName,
  operatorType,
  operatorAddress,
  registrationNumber,
  taxNumber,
  publicationDirector,
  hostingProvider,
  hostingAddress,
  hostingWebsite,
  governingCountry,
  policyUpdatedAt,
} =
  legalConfig;

export const metadata:
  Metadata = {
  title:
    `Legal Notice | ${siteName}`,

  description:
    "Legal and publisher information for TimeInOne, including operator, hosting and liability details.",

  alternates: {
    canonical:
      `${siteUrl}/legal-notice`,
  },

  openGraph: {
    title:
      `Legal Notice | ${siteName}`,

    description:
      "Publisher and hosting information for TimeInOne.",

    url:
      `${siteUrl}/legal-notice`,

    type:
      "website",
  },
};

export default function LegalNoticePage() {
  return (
    <>
      <Header />

      <LegalDocument
        eyebrow="Legal information"
        title="Legal Notice"
        description="Publisher, hosting, intellectual-property and responsibility information for the TimeInOne website."
        updatedAt={
          policyUpdatedAt
        }
      >
        <LegalSection
          id="publisher"
          number="01"
          title="Website publisher"
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            <LegalDefinition term="Website">
              {siteName}
            </LegalDefinition>

            <LegalDefinition term="Website URL">
              {siteUrl}
            </LegalDefinition>

            <LegalDefinition term="Publisher">
              {operatorName}
            </LegalDefinition>

            <LegalDefinition term="Legal status">
              {operatorType}
            </LegalDefinition>

            <LegalDefinition term="Registered address">
              {operatorAddress}
            </LegalDefinition>

            <LegalDefinition term="Registration number">
              {registrationNumber}
            </LegalDefinition>

            <LegalDefinition term="Tax identifier">
              {taxNumber}
            </LegalDefinition>

            <LegalDefinition term="Contact email">
              {contactEmail}
            </LegalDefinition>
          </dl>
        </LegalSection>

        <LegalSection
          id="director"
          number="02"
          title="Publication director"
        >
          <LegalParagraph>
            {publicationDirector}
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="hosting"
          number="03"
          title="Hosting provider"
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            <LegalDefinition term="Provider">
              {hostingProvider}
            </LegalDefinition>

            <LegalDefinition term="Address">
              {hostingAddress}
            </LegalDefinition>

            <LegalDefinition term="Website">
              {hostingWebsite}
            </LegalDefinition>
          </dl>
        </LegalSection>

        <LegalSection
          id="purpose"
          number="04"
          title="Purpose of the website"
        >
          <LegalParagraph>
            TimeInOne provides
            informational tools for
            time-zone conversion, world
            clocks, city and country
            time information and
            international meeting
            planning.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="accuracy"
          number="05"
          title="Accuracy of time information"
        >
          <LegalCallout
            title="Time rules can change"
            tone="amber"
          >
            Governments and authorities
            may change UTC offsets,
            daylight-saving rules or
            effective dates. Atlas
            cannot guarantee that every
            result will remain accurate
            after an unannounced or
            recently adopted change.
          </LegalCallout>

          <LegalParagraph>
            Users should confirm
            mission-critical times
            directly with the relevant
            organization or
            participants.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="property"
          number="06"
          title="Intellectual property"
        >
          <LegalParagraph>
            Unless otherwise indicated,
            the original interface,
            software, visual identity and
            editorial content of Project
            TimeInOne are owned by or
            licensed to the publisher.
          </LegalParagraph>

          <LegalParagraph>
            Unauthorized reproduction,
            redistribution or commercial
            exploitation may be
            prohibited by applicable
            law.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="data-sources"
          number="07"
          title="Third-party standards and data"
        >
          <LegalParagraph>
            TimeInOne may rely on public or
            licensed geographic data,
            IANA time-zone identifiers,
            browser time-zone
            implementations and other
            third-party standards.
          </LegalParagraph>

          <LegalParagraph>
            Reference to a third-party
            name or standard does not
            imply sponsorship or
            endorsement.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="links"
          number="08"
          title="External links"
        >
          <LegalParagraph>
            The website may include
            links to external services.
            The publisher is not
            responsible for the content,
            security or availability of
            third-party websites.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="liability"
          number="09"
          title="Responsibility"
        >
          <LegalParagraph>
            The publisher makes
            reasonable efforts to
            maintain TimeInOne but does not
            guarantee uninterrupted,
            error-free or permanently
            available operation.
          </LegalParagraph>

          <LegalParagraph>
            Nothing in this Legal Notice
            excludes liability that
            cannot be excluded under
            applicable law.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="law"
          number="10"
          title="Applicable law"
        >
          <LegalParagraph>
            The website is operated
            under the laws applicable in
            {` ${governingCountry}`},
            without limiting mandatory
            rights that may apply to
            users in other
            jurisdictions.
          </LegalParagraph>
        </LegalSection>

        <LegalSection
          id="contact"
          number="11"
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