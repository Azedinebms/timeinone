import {
  SITE_URL,
} from "./constants";

import {
  createBreadcrumbJsonLd,
  type JsonLdObject,
} from "./jsonld";

type ConverterJsonLdInput = {
  fromCity: string;
  fromCountry: string;
  fromSlug: string;
  fromTimezone: string;

  toCity: string;
  toCountry: string;
  toSlug: string;
  toTimezone: string;
};

function createAbsoluteUrl(
  path: string,
) {
  return new URL(
    path,
    SITE_URL,
  ).toString();
}

export function createConverterJsonLd({
  fromCity,
  fromCountry,
  fromSlug,
  fromTimezone,

  toCity,
  toCountry,
  toSlug,
  toTimezone,
}: ConverterJsonLdInput): JsonLdObject[] {
  const normalizedFromSlug =
    fromSlug
      .trim()
      .toLowerCase();

  const normalizedToSlug =
    toSlug
      .trim()
      .toLowerCase();

  const path =
    `/converter/${normalizedFromSlug}-to-${normalizedToSlug}`;

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
      `${fromCity} to ${toCity} Time Converter`,

    description:
      `Convert ${fromCity}, ${fromCountry} time to ${toCity}, ${toCountry} time and compare working hours and meeting times.`,

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
          "City",

        name:
          fromCity,

        containedInPlace: {
          "@type":
            "Country",

          name:
            fromCountry,
        },

        additionalProperty: {
          "@type":
            "PropertyValue",

          name:
            "Time zone",

          value:
            fromTimezone,
        },
      },

      {
        "@type":
          "City",

        name:
          toCity,

        containedInPlace: {
          "@type":
            "Country",

          name:
            toCountry,
        },

        additionalProperty: {
          "@type":
            "PropertyValue",

          name:
            "Time zone",

          value:
            toTimezone,
        },
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
          "Time Converter",

        path:
          "/converter",
      },

      {
        name:
          `${fromCity} to ${toCity}`,

        path,
      },
    ]);

  return [
    webPage,
    breadcrumbs,
  ];
}