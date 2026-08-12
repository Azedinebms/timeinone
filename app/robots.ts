import type {
  MetadataRoute,
} from "next";

import {
  SITE_URL,
} from "@/lib/seo";

import {
  getWorldClockSitemapCount,
} from "@/features/world-clock/services/worldClockSitemapService";

import {
  getCurrentTimeSitemapCount,
} from "@/services/current-time-sitemap.service";

/* =========================================================
   HELPERS
========================================================= */

function getBaseUrl():
  string {
  return SITE_URL.replace(
    /\/+$/,
    "",
  );
}

/* =========================================================
   ROBOTS
========================================================= */

export default async function robots():
  Promise<MetadataRoute.Robots> {
  const baseUrl =
    getBaseUrl();

  const [
    worldClockSitemapCount,
    currentTimeSitemapCount,
  ] =
    await Promise.all([
      getWorldClockSitemapCount(),
      getCurrentTimeSitemapCount(),
    ]);

  const worldClockSitemaps =
    Array.from(
      {
        length:
          worldClockSitemapCount,
      },
      (
        _,
        id,
      ) =>
        `${baseUrl}/world-clock/sitemap/${id}.xml`,
    );

  const currentTimeSitemaps =
    Array.from(
      {
        length:
          currentTimeSitemapCount,
      },
      (
        _,
        id,
      ) =>
        `${baseUrl}/current-time/sitemap/${id}.xml`,
    );

  return {
    rules: {
      userAgent:
        "*",

      allow:
        "/",
    },

    sitemap: [
      `${baseUrl}/sitemap.xml`,

      ...worldClockSitemaps,

      ...currentTimeSitemaps,
    ],

    host:
      baseUrl,
  };
}