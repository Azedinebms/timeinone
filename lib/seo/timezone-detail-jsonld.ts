import {
  SITE_URL,
} from "./constants";

import {
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "./jsonld";

type CreateTimezoneDetailJsonLdInput = {
  slug: string;
  abbreviation: string;
  name: string;
  description: string;
};

function createAbsoluteUrl(
  path: string,
) {
  return new URL(
    path,
    SITE_URL,
  ).toString();
}

export function createTimezoneDetailJsonLd({
  slug,
  abbreviation,
  name,
  description,
}: CreateTimezoneDetailJsonLdInput): JsonLdObject[] {
  const normalizedSlug =
    slug
      .trim()
      .toLowerCase();

  const path =
    `/timezone/${normalizedSlug}`;

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
      `Current ${abbreviation} Time — ${name}`,

    description,

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

    about: {
      "@type":
        "DefinedTerm",

      name,

      alternateName:
        abbreviation,

      description,

      url:
        pageUrl,
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
          "Time Zones",
        path:
          "/timezone",
      },
      {
        name:
          abbreviation,
        path,
      },
    ]);

  return [
    webPage,
    breadcrumbs,
  ];
}