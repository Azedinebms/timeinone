import {
  SITE_URL,
} from "./constants";

import {
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "./jsonld";

type CreateTimezoneConverterJsonLdInput = {
  fromSlug: string;
  fromAbbreviation: string;
  fromName: string;
  fromDescription: string;

  toSlug: string;
  toAbbreviation: string;
  toName: string;
  toDescription: string;
};

function createAbsoluteUrl(
  path: string,
) {
  return new URL(
    path,
    SITE_URL,
  ).toString();
}

export function createTimezoneConverterJsonLd({
  fromSlug,
  fromAbbreviation,
  fromName,
  fromDescription,

  toSlug,
  toAbbreviation,
  toName,
  toDescription,
}: CreateTimezoneConverterJsonLdInput): JsonLdObject[] {
  const normalizedFromSlug =
    fromSlug
      .trim()
      .toLowerCase();

  const normalizedToSlug =
    toSlug
      .trim()
      .toLowerCase();

  const path =
    `/timezone/${normalizedFromSlug}-to-${normalizedToSlug}`;

  const pageUrl =
    createAbsoluteUrl(
      path,
    );

  const webPage:
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
      `${fromAbbreviation} to ${toAbbreviation} Time Converter`,

    description:
      `Convert ${fromName} to ${toName}, compare UTC offsets and view a 24-hour conversion table.`,

    inLanguage:
      "en",

    isPartOf: {
      "@id":
        createAbsoluteUrl(
          "/#website",
        ),
    },

    publisher: {
      "@id":
        createAbsoluteUrl(
          "/#organization",
        ),
    },

    about: [
      {
        "@type":
          "DefinedTerm",

        name:
          fromName,

        alternateName:
          fromAbbreviation,

        description:
          fromDescription,
      },

      {
        "@type":
          "DefinedTerm",

        name:
          toName,

        alternateName:
          toAbbreviation,

        description:
          toDescription,
      },
    ],
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
          "Timezone Converter",
        path:
          "/timezone",
      },

      {
        name:
          `${fromAbbreviation} to ${toAbbreviation}`,
        path,
      },
    ]);

  return [
    webPage,
    breadcrumbs,
  ];
}