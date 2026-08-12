import type {
  MetadataRoute,
} from "next";

const SITE_URL =
  (
    process.env
      .NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  ).replace(
    /\/+$/,
    "",
  );

export default function manifest():
  MetadataRoute.Manifest {
  return {
    name:
      "TimeInOne",

    short_name:
      "TimeInOne",

    description:
      "Compare time zones, convert time instantly, schedule international meetings and explore live world clocks.",

    start_url:
      "/",

    scope:
      "/",

    display:
      "standalone",

    orientation:
      "portrait",

    background_color:
      "#020617",

    theme_color:
      "#2563eb",

    categories: [
      "productivity",
      "utilities",
      "business",
      "travel",
    ],

    lang:
      "en",

    icons: [
      {
        src:
          "/favicon.ico",

        sizes:
          "any",

        type:
          "image/x-icon",
      },
    ],

    screenshots: [],

    id:
      SITE_URL,
  };
}