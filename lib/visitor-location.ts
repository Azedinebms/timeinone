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

  let ip =
    value
      .split(",")[0]
      ?.trim();

  if (!ip) {
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
    ip =
      ip.replace(
        "::ffff:",
        "",
      );
  }

  /*
   * Localhost
   */
  if (
    ip === "::1" ||
    ip === "127.0.0.1"
  ) {
    return null;
  }

  /*
   * Private IPv4 ranges
   */
  if (
    ip.startsWith("10.") ||
    ip.startsWith("192.168.")
  ) {
    return null;
  }

  /*
   * Private 172.16.0.0 → 172.31.255.255
   */
  const parts =
    ip.split(".");

  if (
    parts.length === 4 &&
    parts[0] === "172"
  ) {
    const secondOctet =
      Number(
        parts[1],
      );

    if (
      Number.isInteger(
        secondOctet,
      ) &&
      secondOctet >= 16 &&
      secondOctet <= 31
    ) {
      return null;
    }
  }

  return ip;
}

function getVisitorIp(
  headersList: Headers,
): string | null {
  /*
   * Railway should expose
   * the real client IP here.
   */
  const realIp =
    headersList.get(
      "x-real-ip",
    );

  /*
   * Reverse proxy fallback.
   */
  const forwardedFor =
    headersList.get(
      "x-forwarded-for",
    );

  /*
   * Possible Envoy proxy fallback.
   */
  const envoyIp =
    headersList.get(
      "x-envoy-external-address",
    );

  return (
    normalizeIp(
      realIp,
    ) ??
    normalizeIp(
      forwardedFor,
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

    /*
     * Temporary debug logs
     */
    console.log(
      "[Geo] Railway X-Real-IP:",
      headersList.get(
        "x-real-ip",
      ),
    );

    console.log(
      "[Geo] X-Forwarded-For:",
      headersList.get(
        "x-forwarded-for",
      ),
    );

    console.log(
      "[Geo] X-Envoy-External-Address:",
      headersList.get(
        "x-envoy-external-address",
      ),
    );

    const ip =
      getVisitorIp(
        headersList,
      );

    console.log(
      "[Geo] Selected IP:",
      ip,
    );

    if (!ip) {
      console.log(
        "[Geo] No usable visitor IP found.",
      );

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

      console.log(
        "[Geo] IPWho HTTP status:",
        response.status,
      );

      if (!response.ok) {
        return null;
      }

      const data =
        (await response.json()) as IpWhoResponse;

      console.log(
        "[Geo] IPWho response:",
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
        console.log(
          "[Geo] Invalid geolocation response.",
        );

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
        console.log(
          "[Geo] Invalid city/country result.",
        );

        return null;
      }

      const location: VisitorLocation =
        {
          city,
          countryCode,
        };

      console.log(
        "[Geo] Final location:",
        location,
      );

      return location;
    } catch (error) {
      console.error(
        "[Geo] Geolocation request failed:",
        error,
      );

      return null;
    } finally {
      clearTimeout(
        timeout,
      );
    }
  } catch (error) {
    console.error(
      "[Geo] Unexpected geolocation error:",
      error,
    );

    return null;
  }
}