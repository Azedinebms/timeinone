import { headers } from "next/headers";

/* =========================================================
   TYPES
========================================================= */

export type VisitorLocation = {
  city: string;
  countryCode: string;
} | null;

type IpWhoResponse = {
  success?: boolean;
  city?: string;
  country_code?: string;
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeIp(
  value: string | null,
): string | null {
  if (!value) {
    return null;
  }

  const ip =
    value
      .split(",")[0]
      ?.trim();

  if (!ip) {
    return null;
  }

  /*
   * Local / private IPs
   */
  if (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.")
  ) {
    return null;
  }

  /*
   * IPv4 mapped as IPv6
   */
  if (
    ip.startsWith(
      "::ffff:",
    )
  ) {
    return ip.replace(
      "::ffff:",
      "",
    );
  }

  return ip;
}

function getVisitorIp(
  headersList: Headers,
): string | null {
  /*
   * Railway / reverse proxy
   */
  const forwardedFor =
    headersList.get(
      "x-forwarded-for",
    );

  /*
   * Generic reverse proxies
   */
  const realIp =
    headersList.get(
      "x-real-ip",
    );

  /*
   * Possible proxy / envoy header
   */
  const envoyIp =
    headersList.get(
      "x-envoy-external-address",
    );

  return (
    normalizeIp(
      forwardedFor,
    ) ??
    normalizeIp(
      realIp,
    ) ??
    normalizeIp(
      envoyIp,
    )
  );
}

/* =========================================================
   VISITOR LOCATION
========================================================= */

export async function getVisitorLocation():
  Promise<VisitorLocation> {
  try {
    const headersList =
      await headers();

    const ip =
      getVisitorIp(
        headersList,
      );

      console.log(
  "[TimeInOne Geo] IP detected:",
  ip,
);

    if (!ip) {
      return null;
    }

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => {
          controller.abort();
        },
        1500,
      );

    try {
      const response =
        await fetch(
          `https://ipwho.is/${encodeURIComponent(
            ip,
          )}`,
          {
            signal:
              controller.signal,

            cache:
              "no-store",
          },
        );

      if (!response.ok) {
        return null;
      }

      const data =
        (await response.json()) as IpWhoResponse;

        console.log(
  "[TimeInOne Geo] API response:",
  data,
);

      if (
        data.success !==
          true ||
        typeof data.city !==
          "string" ||
        typeof data.country_code !==
          "string"
      ) {
        return null;
      }

      const city =
        data.city.trim();

      const countryCode =
        data.country_code
          .trim()
          .toUpperCase();

      if (
        !city ||
        countryCode.length !==
          2
      ) {
        return null;
      }

      return {
        city,
        countryCode,
      };
    } finally {
      clearTimeout(
        timeout,
      );
    }
  } catch {
    /*
     * Geolocation must NEVER break
     * the TimeInOne homepage.
     */
    return null;
  }
}