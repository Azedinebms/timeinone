"use client";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AtlasCitySearch,
} from "@/features/city-search/client";
import Image from "next/image";

/* =========================================================
   TYPES
========================================================= */

type NavigationItem = {
  label: string;
  href: string;
};

type CalendarNavigationItem = {
  label: string;
  description: string;
  href: string;
  icon: "year" | "month" | "print";
};

/* =========================================================
   NAVIGATION
========================================================= */

const navigationItems:
  readonly NavigationItem[] = [
    {
      label:
        "Converter",
      href:
        "/",
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
        "Meeting Planner",
      href:
        "/meeting-planner",
    },
  ] as const;

/* =========================================================
   HELPERS
========================================================= */

function isNavigationItemActive(
  pathname: string,
  href: string,
): boolean {
  if (
    href === "/"
  ) {
    return (
      pathname === "/" ||
      pathname.startsWith(
        "/converter",
      )
    );
  }

  return (
    pathname === href ||
    pathname.startsWith(
      `${href}/`,
    )
  );
}

function CalendarIcon({
  type,
}: {
  type:
    CalendarNavigationItem["icon"];
}) {
  if (
    type === "month"
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="3"
        />

        <path
          d="M8 3v4M16 3v4M3 10h18"
          strokeLinecap="round"
        />

        <path
          d="M8 14h2M14 14h2M8 17h2M14 17h2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (
    type === "print"
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          d="M7 8V3h10v5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <rect
          x="5"
          y="14"
          width="14"
          height="7"
          rx="1"
        />

        <path
          d="M5 17H3V10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7h-2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="17.5"
          cy="11.5"
          r=".7"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
      />

      <path
        d="M8 3v4M16 3v4M3 10h18"
        strokeLinecap="round"
      />

      <path
        d="M7 14h3M14 14h3M7 17h3M14 17h3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   CALENDAR DROPDOWN
========================================================= */

function CalendarDropdown({
  pathname,
}: {
  pathname:
    string;
}) {
  const currentYear =
    new Date().getFullYear();

  const nextYear =
    currentYear + 1;

  const calendarItems:
    readonly CalendarNavigationItem[] = [
      {
        label:
          `Calendar ${currentYear}`,

        description:
          "Full year calendar",

        href:
          `/calendar/${currentYear}`,

        icon:
          "year",
      },

      {
        label:
          `Calendar ${nextYear}`,

        description:
          "Plan the year ahead",

        href:
          `/calendar/${nextYear}`,

        icon:
          "year",
      },

      {
        label:
          "Monthly Calendar",

        description:
          "Browse month by month",

        href:
          "/calendar/monthly",

        icon:
          "month",
      },

      {
        label:
          "Printable Calendar",

        description:
          "Clean print-ready calendar",

        href:
          "/calendar/printable",

        icon:
          "print",
      },
    ];

  const [
    open,
    setOpen,
  ] =
    useState(
      false,
    );

  const containerRef =
    useRef<HTMLDivElement>(
      null,
    );

  const closeTimeoutRef =
    useRef<
      ReturnType<
        typeof setTimeout
      > | null
    >(
      null,
    );

  const calendarActive =
    pathname ===
      "/calendar" ||
    pathname.startsWith(
      "/calendar/",
    );

  function cancelClose() {
    if (
      closeTimeoutRef.current
    ) {
      clearTimeout(
        closeTimeoutRef.current,
      );

      closeTimeoutRef.current =
        null;
    }
  }

  function handleMouseEnter() {
    cancelClose();

    setOpen(
      true,
    );
  }

  function handleMouseLeave() {
    cancelClose();

    closeTimeoutRef.current =
      setTimeout(
        () => {
          setOpen(
            false,
          );
        },
        180,
      );
  }

  useEffect(() => {
    if (
      !open
    ) {
      return;
    }

    function handlePointerDown(
      event:
        MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(
          false,
        );
      }
    }

    function handleKeyDown(
      event:
        KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(
          false,
        );
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      if (
        closeTimeoutRef.current
      ) {
        clearTimeout(
          closeTimeoutRef.current,
        );
      }
    };
  }, [
    open,
  ]);

  return (
    <div
      ref={
        containerRef
      }
      onMouseEnter={
        handleMouseEnter
      }
      onMouseLeave={
        handleMouseLeave
      }
      className="relative"
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={
          open
        }
        onClick={() => {
          setOpen(
            (
              current,
            ) =>
              !current,
          );
        }}
        className={`relative inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 ${
          calendarActive
            ? "bg-primary-soft text-primary"
            : "text-text-secondary hover:bg-primary-soft hover:text-primary"
        }`}
      >
        Calendar

        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`h-4 w-4 transition-transform duration-200 ${
            open
              ? "rotate-180"
              : ""
          }`}
          aria-hidden="true"
        >
          <path
            d="m6 8 4 4 4-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {calendarActive && (
          <span
            aria-hidden="true"
            className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-blue-500"
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-[calc(100%+18px)] z-[100] w-[340px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl shadow-slate-950/10"
        >
          {/* HEADER */}

          <div className="border-b border-border bg-surface-soft px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-primary">
                <CalendarIcon
                  type="year"
                />
              </div>

              <div>
                <p className="font-bold text-text-primary">
                  Calendar
                </p>

                <p className="mt-0.5 text-xs text-text-muted">
                  Dates, months and printable calendars
                </p>
              </div>
            </div>
          </div>

          {/* ITEMS */}

          <div className="p-2">
            {calendarItems.map(
              (
                item,
              ) => {
                const active =
                  pathname ===
                  item.href;

                return (
                  <Link
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    role="menuitem"
                    onClick={() => {
                      setOpen(
                        false,
                      );
                    }}
                    className={`group flex items-center gap-3 rounded-xl p-3 outline-none transition ${
                      active
                        ? "bg-primary-soft"
                        : "hover:bg-surface-soft"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                        active
                          ? "border-primary-muted bg-white text-primary"
                          : "border-border bg-surface-soft text-text-secondary group-hover:border-primary-muted group-hover:bg-primary-soft group-hover:text-primary"
                      }`}
                    >
                      <CalendarIcon
                        type={
                          item.icon
                        }
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-bold ${
                          active
                            ? "text-primary"
                            : "text-text-primary"
                        }`}
                      >
                        {
                          item.label
                        }
                      </span>

                      <span className="mt-0.5 block text-xs text-text-muted">
                        {
                          item.description
                        }
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={`text-lg transition-transform group-hover:translate-x-1 ${
                        active
                          ? "text-primary"
                          : "text-text-muted group-hover:text-primary"
                      }`}
                    >
                      →
                    </span>
                  </Link>
                );
              },
            )}
          </div>

          {/* FOOTER */}

          <div className="border-t border-border bg-surface-soft px-4 py-3">
            <Link
              href={
                `/calendar/${currentYear}`
              }
              onClick={() => {
                setOpen(
                  false,
                );
              }}
              className="flex items-center justify-between rounded-lg text-xs font-semibold text-text-secondary transition hover:text-primary"
            >
              <span>
                Explore the full calendar
              </span>

              <span>
                {currentYear} →
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}


/* =========================================================
   DESKTOP NAVIGATION
========================================================= */

function DesktopNavigation({
  pathname,
}: {
  pathname:
    string;
}) {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 lg:flex"
    >
      {navigationItems.map(
        (
          item,
        ) => {
          const active =
            isNavigationItemActive(
              pathname,
              item.href,
            );

          return (
            <Link
              key={
                item.label
              }
              href={
                item.href
              }
              aria-current={
                active
                  ? "page"
                  : undefined
              }
              className={`relative rounded-xl px-2.5 py-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-blue-500 ${
                active
                  ? "bg-primary-soft text-primary"
                  : "text-text-secondary hover:bg-primary-soft hover:text-primary"
              }`}
            >
              {
                item.label
              }

              {active && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-blue-500"
                />
              )}
            </Link>
          );
        },
      )}

      <CalendarDropdown
        pathname={
          pathname
        }
      />
    </nav>
  );
}

/* =========================================================
   MOBILE CALENDAR
========================================================= */

function MobileCalendarNavigation({
  pathname,
  onNavigate,
}: {
  pathname:
    string;

  onNavigate:
    () => void;
}) {
  const currentYear =
    new Date().getFullYear();

  const nextYear =
    currentYear + 1;

  const [
    open,
    setOpen,
  ] =
    useState(
      pathname.startsWith(
        "/calendar",
      ),
    );

  const active =
    pathname.startsWith(
      "/calendar",
    );

  const items = [
    {
      label:
        `Calendar ${currentYear}`,

      href:
        `/calendar/${currentYear}`,
    },

    {
      label:
        `Calendar ${nextYear}`,

      href:
        `/calendar/${nextYear}`,
    },

    {
      label:
        "Monthly Calendar",

      href:
        "/calendar/monthly",
    },

    {
      label:
        "Printable Calendar",

      href:
        "/calendar/printable",
    },
  ];

  return (
    <div className="rounded-xl">
      <button
        type="button"
        aria-expanded={
          open
        }
        onClick={() => {
          setOpen(
            (
              current,
            ) =>
              !current,
          );
        }}
        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
          active
            ? "border-blue-500/30 bg-primary-soft text-primary"
            : "border-transparent text-text-secondary hover:border-border hover:bg-primary-soft hover:text-primary"
        }`}
      >
        <span className="flex items-center gap-2">
          Calendar

          {active && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          )}
        </span>

        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`h-4 w-4 transition-transform ${
            open
              ? "rotate-180"
              : ""
          }`}
          aria-hidden="true"
        >
          <path
            d="m6 8 4 4 4-4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
          {items.map(
            (
              item,
            ) => {
              const itemActive =
                pathname ===
                item.href;

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  onClick={
                    onNavigate
                  }
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm transition ${
                    itemActive
                      ? "bg-primary-soft font-semibold text-primary"
                      : "text-text-secondary hover:bg-surface-soft hover:text-primary"
                  }`}
                >
                  <span>
                    {
                      item.label
                    }
                  </span>

                  <span
                    aria-hidden="true"
                    className={
                      itemActive
                        ? "text-primary"
                        : "text-text-muted"
                    }
                  >
                    →
                  </span>
                </Link>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function MobileNavigation({
  pathname,
  onNavigate,
}: {
  pathname:
    string;

  onNavigate:
    () => void;
}) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="space-y-1"
    >
      {navigationItems.map(
        (
          item,
        ) => {
          const active =
            isNavigationItemActive(
              pathname,
              item.href,
            );

          return (
            <Link
              key={
                item.label
              }
              href={
                item.href
              }
              onClick={
                onNavigate
              }
              aria-current={
                active
                  ? "page"
                  : undefined
              }
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                active
                  ? "border-blue-500/30 bg-primary-soft text-primary"
                  : "border-transparent text-text-secondary hover:border-border hover:bg-primary-soft hover:text-primary"
              }`}
            >
              <span>
                {
                  item.label
                }
              </span>

              <span
                aria-hidden="true"
                className={
                  active
                    ? "text-blue-400"
                    : "text-text-muted"
                }
              >
                →
              </span>
            </Link>
          );
        },
      )}

      <MobileCalendarNavigation
        pathname={
          pathname
        }
        onNavigate={
          onNavigate
        }
      />
    </nav>
  );
}


/* =========================================================
   HEADER
========================================================= */

type HeaderContentProps = {
  pathname:
    string;
};

function HeaderContent({
  pathname,
}: HeaderContentProps) {
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] =
    useState(
      false,
    );

  useEffect(() => {
    if (
      !mobileMenuOpen
    ) {
      return;
    }

    const handleKeyDown = (
      event:
        KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setMobileMenuOpen(
          false,
        );
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    mobileMenuOpen,
  ]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1500px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:py-1">
        {/* LOGO */}

        <Link
  href="/"
  aria-label="TimeInOne home"
  className="flex shrink-0 items-center rounded-xl outline-none transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
>
  <Image
  src="/images/brand/timeinonelogo.png"
  alt="TimeInOne"
  width={800}
  height={240}
  priority
  className="h-auto w-[145px] sm:w-[165px] lg:w-[225px]"
/>
</Link>

        {/* DESKTOP NAVIGATION */}

        <DesktopNavigation
          pathname={
            pathname
          }
        />

        {/* RIGHT */}

        <div className="flex min-w-0 items-center gap-2">
          <div className="hidden w-[260px] min-w-0 xl:block 2xl:w-[320px]">
            <AtlasCitySearch
              compact
              limit={
                8
              }
              placeholder="Search a city..."
            />
          </div>

          <Link
            href="/world-clock/countries"
            className="hidden h-10 shrink-0 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:inline-flex"
          >
            Explore Cities
          </Link>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={
              mobileMenuOpen
            }
            aria-controls="mobile-navigation"
            onClick={() => {
              setMobileMenuOpen(
                (
                  currentValue,
                ) =>
                  !currentValue,
              );
            }}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary shadow-sm outline-none transition hover:border-primary-muted hover:bg-primary-soft hover:text-primary focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
          >
            <span
              aria-hidden="true"
              className="relative block h-5 w-5"
            >
              <span
                className={`absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-current transition duration-200 ${
                  mobileMenuOpen
                    ? "translate-y-1.5 rotate-45"
                    : ""
                }`}
              />

              <span
                className={`absolute left-0 top-2.5 block h-0.5 w-5 rounded-full bg-current transition duration-200 ${
                  mobileMenuOpen
                    ? "opacity-0"
                    : "opacity-100"
                }`}
              />

              <span
                className={`absolute left-0 top-4 block h-0.5 w-5 rounded-full bg-current transition duration-200 ${
                  mobileMenuOpen
                    ? "-translate-y-1.5 -rotate-45"
                    : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* =================================================
          MOBILE PANEL
      ================================================== */}

      <div
        id="mobile-navigation"
        className={`overflow-visible border-t bg-background transition-[max-height,opacity] duration-300 lg:hidden ${
          mobileMenuOpen
            ? "max-h-[900px] border-border opacity-100"
            : "pointer-events-none max-h-0 overflow-hidden border-transparent opacity-0"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          {/* SEARCH */}

          <div className="mb-4 rounded-2xl border border-border bg-surface p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
              Search TimeInOne
            </p>

            <AtlasCitySearch
              limit={
                8
              }
              placeholder="Search cities, countries or time zones..."
            />
          </div>

          {/* NAVIGATION */}

          <MobileNavigation
            pathname={
              pathname
            }
            onNavigate={() => {
              setMobileMenuOpen(
                false,
              );
            }}
          />

          {/* MOBILE EXPLORE */}

          <div className="mt-4 border-t border-border pt-4 sm:hidden">
            <Link
              href="/world-clock/countries"
              onClick={() => {
                setMobileMenuOpen(
                  false,
                );
              }}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary"
            >
              Explore Cities
            </Link>
          </div>

          {/* SEARCH INFO */}

          <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
              Global Search
            </p>

            <p className="mt-2 text-sm font-medium text-text-primary">
              Search cities, countries and time zones
            </p>

            <p className="mt-1 text-xs leading-5 text-text-secondary">
              Search by city, country,
              country code or IANA time
              zone.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

/* =========================================================
   EXPORT
========================================================= */

export default function Header() {
  const pathname =
    usePathname();

  return (
    <HeaderContent
      key={
        pathname
      }
      pathname={
        pathname
      }
    />
  );
}