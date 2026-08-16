import Link from "next/link";
import Image from "next/image";

/* =========================================================
   PRODUCT LINKS
========================================================= */

function getProductLinks(
  currentYear: number,
) {
  return [
    {
      label:
        "Time Zone Converter",

      href:
        "/",
    },

        {
      label:
        "Time Difference",

      href:
        "/time-difference",
    },

    {
      label:
        "Time Zones",

      href:
        "/timezone",
    },

    {
      label:
        "World Clock",

      href:
        "/world-clock",
    },

    {
      label:
        "Current Time",

      href:
        "/current-time",
    },

    {
      label:
        "Meeting Planner",

      href:
        "/meeting-planner",
    },

    {
      label:
        "Calendar",

      href:
        `/calendar/${currentYear}`,
    },

    {
      label:
        "Countries",

      href:
        "/world-clock/countries",
    },
  ] as const;
}

/* =========================================================
   RESOURCE LINKS
========================================================= */

const resourceLinks = [
  {
    label:
      "About TimeInOne",

    href:
      "/about",
  },

  {
    label:
      "Contact",

    href:
      "/contact",
  },

  {
    label:
      "Frequently Asked Questions",

    href:
      "/faq",
  },
] as const;

/* =========================================================
   LEGAL LINKS
========================================================= */

const legalLinks = [
  {
    label:
      "Privacy Policy",

    href:
      "/privacy-policy",
  },

  {
    label:
      "Terms of Use",

    href:
      "/terms-of-use",
  },

  {
    label:
      "Cookie Policy",

    href:
      "/cookie-policy",
  },

  {
    label:
      "Legal Notice",

    href:
      "/legal-notice",
  },
] as const;

/* =========================================================
   FOOTER LINK
========================================================= */

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={
        href
      }
      className="rounded-md text-sm text-text-secondary outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
    >
      {
        label
      }
    </Link>
  );
}

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const currentYear =
    new Date().getFullYear();

  const productLinks =
    getProductLinks(
      currentYear,
    );

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        {/* =========================================
            MAIN FOOTER GRID
        ========================================== */}

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
          {/* =====================================
              BRAND
          ====================================== */}

          <div>
<Link
  href="/"
  aria-label="TimeInOne home"
  className="inline-flex items-center rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-primary"
>
  <Image
    src="/images/brand/timeinonelogo.png"
    alt="TimeInOne"
    width={800}
    height={240}
    className="h-auto w-[190px] sm:w-[210px]"
  />
</Link>

            <p className="mt-5 text-sm leading-7 text-text-secondary">
              Compare time zones,
              explore world clocks and
              find better meeting times
              across cities worldwide.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-success/20 bg-success-soft px-3 py-1.5 text-xs font-medium text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-40" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>

              Global time tools available
            </div>
          </div>

          {/* =====================================
              PRODUCT
          ====================================== */}

          <nav
            aria-labelledby="footer-product-title"
          >
            <h2
              id="footer-product-title"
              className="text-sm font-semibold text-text-primary"
            >
              Product
            </h2>

            <ul className="mt-4 space-y-3">
              {productLinks.map(
                (
                  link,
                ) => (
                  <li
                    key={
                      link.href
                    }
                  >
                    <FooterLink
                      href={
                        link.href
                      }
                      label={
                        link.label
                      }
                    />
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* =====================================
              RESOURCES
          ====================================== */}

          <nav
            aria-labelledby="footer-resources-title"
          >
            <h2
              id="footer-resources-title"
              className="text-sm font-semibold text-text-primary"
            >
              Resources
            </h2>

            <ul className="mt-4 space-y-3">
              {resourceLinks.map(
                (
                  link,
                ) => (
                  <li
                    key={
                      link.href
                    }
                  >
                    <FooterLink
                      href={
                        link.href
                      }
                      label={
                        link.label
                      }
                    />
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* =====================================
              LEGAL
          ====================================== */}

          <nav
            aria-labelledby="footer-legal-title"
          >
            <h2
              id="footer-legal-title"
              className="text-sm font-semibold text-text-primary"
            >
              Legal
            </h2>

            <ul className="mt-4 space-y-3">
              {legalLinks.map(
                (
                  link,
                ) => (
                  <li
                    key={
                      link.href
                    }
                  >
                    <FooterLink
                      href={
                        link.href
                      }
                      label={
                        link.label
                      }
                    />
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        {/* =========================================
            BOTTOM FOOTER
        ========================================== */}

        <div className="mt-12 border-t border-border pt-6">
          <div className="flex flex-col gap-4 text-xs leading-5 text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p>
                © {currentYear} TimeInOne.
                All rights reserved.
              </p>

              <p className="mt-1 text-text-subtle">
                Times are calculated
                using IANA time-zone data
                and may change according
                to local daylight-saving
                rules.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href="/privacy-policy"
                className="rounded-md outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
              >
                Privacy
              </Link>

              <Link
                href="/terms-of-use"
                className="rounded-md outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
              >
                Terms
              </Link>

              <Link
                href="/contact"
                className="rounded-md outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}