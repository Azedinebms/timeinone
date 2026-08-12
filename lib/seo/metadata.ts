import type { Metadata } from "next";

import {
  COMPANY_NAME,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
} from "./constants";

import type { SeoInput } from "./types";

export function createMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  keywords = [],
  openGraphType = "website",
}: SeoInput): Metadata {
  const canonical =
    new URL(path, SITE_URL).toString();

  const imageUrl =
    new URL(image, SITE_URL).toString();

  return {
    title,

    description,

    keywords: [
      ...DEFAULT_KEYWORDS,
      ...keywords,
    ],

    applicationName:
      SITE_NAME,

    category:
      "Technology",

    creator:
      COMPANY_NAME,

    publisher:
      COMPANY_NAME,

    metadataBase:
      new URL(SITE_URL),

    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },

    alternates: {
      canonical,
    },

    openGraph: {
      type: openGraphType,

      url: canonical,

      siteName: SITE_NAME,

      title,

      description,

      locale: "en_US",

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      creator: TWITTER_HANDLE,

      title,

      description,

      images: [imageUrl],
    },
  };
}

export function createDefaultMetadata(): Metadata {
  return createMetadata({
    title:
      DEFAULT_TITLE,

    description:
      DEFAULT_DESCRIPTION,
  });
}