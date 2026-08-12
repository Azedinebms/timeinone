import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "./constants";

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdObject
  | JsonLdValue[];

export type JsonLdObject = {
  [key: string]:
    JsonLdValue;
};

type BreadcrumbItem = {
  name: string;

  path: string;
};

type CurrentTimeJsonLdInput = {
  city: string;

  country: string;

  countryCode: string;

  slug: string;

  timezone: string;

  latitude:
    number | null;

  longitude:
    number | null;
};

function createAbsoluteUrl(
  path: string,
): string {
  return new URL(
    path,
    SITE_URL,
  ).toString();
}

/**
 * Safely serializes JSON-LD before
 * inserting it inside a script tag.
 */
export function serializeJsonLd(
  value:
    | JsonLdObject
    | JsonLdObject[],
): string {
  return JSON.stringify(
    value,
  ).replace(
    /</g,
    "\\u003c",
  );
}

export function createOrganizationJsonLd():
  JsonLdObject {
  return {
    "@context":
      "https://schema.org",

    "@type":
      "Organization",

    "@id":
      createAbsoluteUrl(
        "/#organization",
      ),

    name:
      SITE_NAME,

    url:
      createAbsoluteUrl(
        "/",
      ),

    slogan:
      SITE_TAGLINE,

    description:
      DEFAULT_DESCRIPTION,
  };
}

export function createWebsiteJsonLd():
  JsonLdObject {
  return {
    "@context":
      "https://schema.org",

    "@type":
      "WebSite",

    "@id":
      createAbsoluteUrl(
        "/#website",
      ),

    name:
      SITE_NAME,

    alternateName:
      SITE_TAGLINE,

    url:
      createAbsoluteUrl(
        "/",
      ),

    description:
      DEFAULT_DESCRIPTION,

    inLanguage:
      "en",

    publisher: {
      "@id":
        createAbsoluteUrl(
          "/#organization",
        ),
    },
  };
}

export function createWebApplicationJsonLd():
  JsonLdObject {
  return {
    "@context":
      "https://schema.org",

    "@type":
      "WebApplication",

    "@id":
      createAbsoluteUrl(
        "/#webapplication",
      ),

    name:
      SITE_NAME,

    url:
      createAbsoluteUrl(
        "/",
      ),

    description:
      DEFAULT_DESCRIPTION,

    applicationCategory:
      "UtilitiesApplication",

    applicationSubCategory:
      "Time zone and meeting planning tools",

    operatingSystem:
      "Any",

    browserRequirements:
      "Requires a modern web browser with JavaScript enabled.",

    isAccessibleForFree:
      true,

    inLanguage:
      "en",

    publisher: {
      "@id":
        createAbsoluteUrl(
          "/#organization",
        ),
    },

    offers: {
      "@type":
        "Offer",

      price:
        0,

      priceCurrency:
        "USD",
    },

    featureList: [
      "Time-zone conversion",
      "Live world clocks",
      "City and country time pages",
      "International meeting planning",
      "Working-hour comparison",
      "Meeting comfort scoring",
      "Shareable meeting plans",
      "ICS calendar export",
    ],
  };
}

export function createGlobalJsonLd():
  JsonLdObject[] {
  return [
    createOrganizationJsonLd(),
    createWebsiteJsonLd(),
    createWebApplicationJsonLd(),
  ];
}

export function createBreadcrumbJsonLd(
  items:
    BreadcrumbItem[],
): JsonLdObject {
  return {
    "@context":
      "https://schema.org",

    "@type":
      "BreadcrumbList",

    itemListElement:
      items.map(
        (
          item,
          index,
        ) => ({
          "@type":
            "ListItem",

          position:
            index +
            1,

          name:
            item.name,

          item:
            createAbsoluteUrl(
              item.path,
            ),
        }),
      ),
  };
}

export function createCurrentTimeJsonLd({
  city,
  country,
  countryCode,
  slug,
  timezone,
  latitude,
  longitude,
}: CurrentTimeJsonLdInput):
  JsonLdObject[] {
  const path =
    `/current-time/${countryCode.toLowerCase()}/${slug}`;

  const pageUrl =
    createAbsoluteUrl(
      path,
    );

  const place:
    JsonLdObject = {
    "@type":
      "City",

    name:
      city,

    containedInPlace: {
      "@type":
        "Country",

      name:
        country,

      identifier:
        countryCode,
    },

    ...(
      latitude !==
        null &&
      longitude !==
        null
        ? {
            geo: {
              "@type":
                "GeoCoordinates",

              latitude,

              longitude,
            },
          }
        : {}
    ),
  };

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
      `Current Time in ${city}, ${country}`,

    description:
      `Current local time, date, UTC offset and time-zone information for ${city}, ${country}.`,

    inLanguage:
      "en",

    isPartOf: {
      "@id":
        createAbsoluteUrl(
          "/#website",
        ),
    },

    about:
      place,

    publisher: {
      "@id":
        createAbsoluteUrl(
          "/#organization",
        ),
    },

    mainEntity: {
      ...place,

      additionalProperty: {
        "@type":
          "PropertyValue",

        name:
          "Time zone",

        value:
          timezone,
      },
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
          "Current Time",

        path:
          "/current-time",
      },
      {
        name:
          `${city}, ${country}`,

        path,
      },
    ]);

return [
  webPage,
  breadcrumbs,
];
}