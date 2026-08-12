import type {
  NextConfig,
} from "next";

const securityHeaders = [
  {
    key:
      "X-Content-Type-Options",

    value:
      "nosniff",
  },

  {
    key:
      "X-Frame-Options",

    value:
      "SAMEORIGIN",
  },

  {
    key:
      "Referrer-Policy",

    value:
      "strict-origin-when-cross-origin",
  },

  {
    key:
      "Permissions-Policy",

    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
    ].join(", "),
  },

  {
    key:
      "Cross-Origin-Opener-Policy",

    value:
      "same-origin",
  },
];

const nextConfig:
  NextConfig = {
  poweredByHeader:
    false,

  /*
   * Reduce static-generation pressure
   * on PostgreSQL during the build.
   */
  experimental: {
    staticGenerationRetryCount:
      1,

    staticGenerationMaxConcurrency:
      1,

    staticGenerationMinPagesPerWorker:
      200,
  },

  async headers() {
    return [
      {
        source:
          "/:path*",

        headers:
          securityHeaders,
      },
    ];
  },
};

export default nextConfig;