const fallbackSiteUrl =
  "http://localhost:3000";

const fallbackEmail =
  "contact@example.com";

export const legalConfig = {
  siteName:
    "TimeInOne",

  siteUrl:
    process.env
      .NEXT_PUBLIC_SITE_URL ??
    fallbackSiteUrl,

  contactEmail:
    process.env
      .NEXT_PUBLIC_CONTACT_EMAIL ??
    fallbackEmail,

  operatorName:
    process.env
      .NEXT_PUBLIC_LEGAL_NAME ??
    "[LEGAL NAME TO COMPLETE]",

  operatorType:
    process.env
      .NEXT_PUBLIC_LEGAL_STATUS ??
    "[INDIVIDUAL OR COMPANY STATUS]",

  operatorAddress:
    process.env
      .NEXT_PUBLIC_LEGAL_ADDRESS ??
    "[LEGAL ADDRESS TO COMPLETE]",

  registrationNumber:
    process.env
      .NEXT_PUBLIC_LEGAL_REGISTRATION_NUMBER ??
    "[REGISTRATION NUMBER IF APPLICABLE]",

  taxNumber:
    process.env
      .NEXT_PUBLIC_LEGAL_TAX_NUMBER ??
    "[TAX NUMBER IF APPLICABLE]",

  publicationDirector:
    process.env
      .NEXT_PUBLIC_PUBLICATION_DIRECTOR ??
    "[PUBLICATION DIRECTOR TO COMPLETE]",

  hostingProvider:
    process.env
      .NEXT_PUBLIC_HOSTING_PROVIDER ??
    "[HOSTING PROVIDER TO COMPLETE]",

  hostingAddress:
    process.env
      .NEXT_PUBLIC_HOSTING_ADDRESS ??
    "[HOSTING PROVIDER ADDRESS]",

  hostingWebsite:
    process.env
      .NEXT_PUBLIC_HOSTING_WEBSITE ??
    "[HOSTING PROVIDER WEBSITE]",

  governingCountry:
    process.env
      .NEXT_PUBLIC_GOVERNING_COUNTRY ??
    "Morocco",

  policyUpdatedAt:
    "August 4, 2026",
} as const;

export default legalConfig;