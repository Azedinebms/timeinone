"use client";

import {
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import useCitySearch from "../hooks/useCitySearch";

import type {
  CitySearchResult,
} from "../types";

type AtlasCitySearchProps = {
  placeholder?: string;

  limit?: number;

  autoFocus?: boolean;

  compact?: boolean;

  className?: string;

  resetKey?: number;

  onSelect?: (
    city: CitySearchResult,
  ) => void;
};

function formatPopulation(
  population:
    number | null,
): string | null {
  if (
    population === null ||
    population <= 0
  ) {
    return null;
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      notation:
        "compact",

      maximumFractionDigits:
        1,
    },
  ).format(
    population,
  );
}

function SearchIcon({
  className =
    "h-5 w-5",
}: {
  className?:
    string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={
        className
      }
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path
        d="m20 20-3.5-3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18"
        strokeLinecap="round"
      />

      <path
        d="M18 6L6 18"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        strokeLinecap="round"
      />

      <path
        d="M14 7L19 12L14 17"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M20 10C20 15 12 21 12 21C12 21 4 15 4 10C4 5.58 7.58 2 12 2C16.42 2 20 5.58 20 10Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="10"
        r="2.5"
      />
    </svg>
  );
}

export default function AtlasCitySearch({
  placeholder =
    "Search cities, countries or time zones...",

  limit = 10,

  autoFocus =
    false,

  compact =
    false,

  className =
    "",

  resetKey =
    0,

  onSelect,
}: AtlasCitySearchProps) {
  const router =
    useRouter();

  const inputId =
    useId();

  const listboxId =
    `${inputId}-listbox`;

  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const {
    query,
    setQuery,

    results,

    isLoading,
    error,

    minimumQueryLength,

    hasSearched,

    clearSearch,
  } = useCitySearch({
    limit,
    debounceMs:
      250,
  });

  const [
    isOpen,
    setIsOpen,
  ] =
    useState(
      false,
    );

  const [
    activeIndex,
    setActiveIndex,
  ] =
    useState(
      -1,
    );

  useEffect(() => {
    const handlePointerDown = (
      event:
        MouseEvent,
    ) => {
      const target =
        event.target as Node;

      if (
        containerRef.current &&
        !containerRef.current.contains(
          target,
        )
      ) {
        setIsOpen(
          false,
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );
    };
  }, []);

  useEffect(() => {
    const updateTimer =
      window.setTimeout(
        () => {
          if (
            query
              .trim()
              .length >=
            minimumQueryLength
          ) {
            setIsOpen(
              true,
            );
          }

          setActiveIndex(
            -1,
          );
        },
        0,
      );

    return () => {
      window.clearTimeout(
        updateTimer,
      );
    };
  }, [
    minimumQueryLength,
    query,
    results,
  ]);

  useEffect(() => {
    if (
      resetKey === 0
    ) {
      return;
    }

    const resetTimer =
      window.setTimeout(
        () => {
          clearSearch();

          setIsOpen(
            false,
          );

          setActiveIndex(
            -1,
          );

          inputRef.current
            ?.focus();
        },
        0,
      );

    return () => {
      window.clearTimeout(
        resetTimer,
      );
    };
  }, [
    clearSearch,
    resetKey,
  ]);

  function selectCity(
    city:
      CitySearchResult,
  ) {
    setIsOpen(
      false,
    );

    setActiveIndex(
      -1,
    );

    if (
      onSelect
    ) {
      onSelect(
        city,
      );

      return;
    }

    router.push(
      city.worldClockPath,
    );
  }

  function handleKeyDown(
    event:
      React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key ===
      "Escape"
    ) {
      event.preventDefault();

      setIsOpen(
        false,
      );

      setActiveIndex(
        -1,
      );

      inputRef.current
        ?.blur();

      return;
    }

    if (
      !isOpen ||
      results.length ===
        0
    ) {
      if (
        event.key ===
          "ArrowDown" &&
        results.length >
          0
      ) {
        event.preventDefault();

        setIsOpen(
          true,
        );

        setActiveIndex(
          0,
        );
      }

      return;
    }

    if (
      event.key ===
      "ArrowDown"
    ) {
      event.preventDefault();

      setActiveIndex(
        (
          currentIndex,
        ) =>
          currentIndex >=
          results.length -
            1
            ? 0
            : currentIndex +
              1,
      );

      return;
    }

    if (
      event.key ===
      "ArrowUp"
    ) {
      event.preventDefault();

      setActiveIndex(
        (
          currentIndex,
        ) =>
          currentIndex <=
          0
            ? results.length -
              1
            : currentIndex -
              1,
      );

      return;
    }

    if (
      event.key ===
      "Enter"
    ) {
      if (
        activeIndex <
          0 ||
        activeIndex >=
          results.length
      ) {
        return;
      }

      event.preventDefault();

      selectCity(
        results[
          activeIndex
        ],
      );
    }
  }

  const normalizedQueryLength =
    query
      .trim()
      .length;

  const showMinimumMessage =
    normalizedQueryLength >
      0 &&
    normalizedQueryLength <
      minimumQueryLength;

  const showEmptyMessage =
    isOpen &&
    hasSearched &&
    !isLoading &&
    !error &&
    results.length ===
      0;

  const activeDescendant =
    activeIndex >=
    0
      ? `${listboxId}-option-${activeIndex}`
      : undefined;

  return (
    <div
      ref={
        containerRef
      }
      className={`relative w-full min-w-0 ${className}`}
    >
      <label
        htmlFor={
          inputId
        }
        className="sr-only"
      >
        Search TimeInOne cities
      </label>

      {/* ==============================
          SEARCH INPUT
      =============================== */}

      <div
        className={[
          "relative",
          "transition-all",
          "duration-200",

          isOpen
            ? "z-[101]"
            : "",
        ].join(
          " ",
        )}
      >
        <span
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "absolute",
            "inset-y-0",
            "z-10",
            "flex",
            "items-center",
            "text-slate-400",

            compact
              ? "left-4"
              : "left-5",
          ].join(
            " ",
          )}
        >
          <SearchIcon
            className={
              compact
                ? "h-[18px] w-[18px]"
                : "h-5 w-5"
            }
          />
        </span>

        <input
          ref={
            inputRef
          }
          id={
            inputId
          }
          type="search"
          role="combobox"
          autoFocus={
            autoFocus
          }
          autoComplete="off"
          spellCheck={
            false
          }
          value={
            query
          }
          placeholder={
            placeholder
          }
          aria-expanded={
            isOpen
          }
          aria-controls={
            listboxId
          }
          aria-autocomplete="list"
          aria-activedescendant={
            activeDescendant
          }
          onFocus={() => {
            if (
              normalizedQueryLength >=
              minimumQueryLength
            ) {
              setIsOpen(
                true,
              );
            }
          }}
          onChange={(
            event,
          ) => {
            setQuery(
              event.target.value,
            );
          }}
          onKeyDown={
            handleKeyDown
          }
          className={[
            "w-full",
            "min-w-0",
            "border",
            "border-slate-200",
            "bg-white",
            "font-medium",
            "text-slate-950",
            "shadow-sm",
            "outline-none",
            "transition-all",
            "duration-200",
            "placeholder:font-normal",
            "placeholder:text-slate-400",
            "hover:border-slate-300",
            "focus:border-blue-500",
            "focus:ring-4",
            "focus:ring-blue-500/10",

            compact
              ? [
                  "h-11",
                  "rounded-full",
                  "pl-11",
                  "pr-11",
                  "text-sm",
                ].join(
                  " ",
                )
              : [
                  "h-14",
                  "rounded-2xl",
                  "pl-12",
                  "pr-12",
                  "text-base",
                ].join(
                  " ",
                ),
          ].join(
            " ",
          )}
        />

        {/* LOADER */}

        {isLoading ? (
          <span className="absolute inset-y-0 right-4 flex items-center">
            <span
              aria-label="Searching"
              className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
            />
          </span>
        ) : query.length >
          0 ? (
          <button
            type="button"
            aria-label="Clear city search"
            onClick={() => {
              clearSearch();

              setIsOpen(
                false,
              );

              setActiveIndex(
                -1,
              );

              inputRef.current
                ?.focus();
            }}
            className="absolute inset-y-0 right-2.5 my-auto flex h-8 w-8 items-center justify-center rounded-full text-slate-400 outline-none transition hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500/20"
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>

      {/* ==============================
          MINIMUM QUERY
      =============================== */}

      {showMinimumMessage && (
        <p className="mt-2 pl-1 text-xs font-medium text-slate-500">
          Enter at least{" "}
          {
            minimumQueryLength
          }{" "}
          characters.
        </p>
      )}

      {/* ==============================
          AUTOCOMPLETE
      =============================== */}

      {isOpen &&
        normalizedQueryLength >=
          minimumQueryLength && (
          <div
            className={[
              "absolute",
              "z-[100]",
              "mt-2",
              "overflow-hidden",
              "rounded-2xl",
              "border",
              "border-slate-200",
              "bg-white",
              "shadow-2xl",
              "shadow-slate-900/15",
              "ring-1",
              "ring-slate-900/5",

              compact
                ? [
                    "right-0",
                    "w-[min(620px,calc(100vw-2rem))]",
                  ].join(
                    " ",
                  )
                : [
                    "left-0",
                    "right-0",
                    "min-w-0",
                  ].join(
                    " ",
                  ),
            ].join(
              " ",
            )}
          >
            {/* TOP ACCENT */}

            <div
              aria-hidden="true"
              className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
            />

            {/* ==============================
                ERROR
            =============================== */}

            {error && (
              <div className="p-5">
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <p className="font-semibold text-rose-800">
                    Search unavailable
                  </p>

                  <p className="mt-1 text-sm leading-6 text-rose-700">
                    {
                      error
                    }
                  </p>
                </div>
              </div>
            )}

            {/* ==============================
                EMPTY
            =============================== */}

            {showEmptyMessage && (
              <div className="p-8 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                  <SearchIcon />
                </div>

                <p className="mt-4 font-semibold text-slate-950">
                  No cities found
                </p>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Try another city,
                  country or time-zone
                  name.
                </p>
              </div>
            )}

            {/* ==============================
                RESULTS
            =============================== */}

            {results.length >
              0 && (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600">
                      <LocationIcon />
                    </span>

                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600">
                      City results
                    </span>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500 shadow-sm">
                    {
                      results.length
                    }{" "}
                    result
                    {results.length ===
                    1
                      ? ""
                      : "s"}
                  </span>
                </div>

                <ul
                  id={
                    listboxId
                  }
                  role="listbox"
                  aria-label="City search results"
                  className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto overscroll-contain [scrollbar-color:rgba(148,163,184,0.8)_transparent] [scrollbar-width:thin]"
                >
                  {results.map(
                    (
                      city,
                      index,
                    ) => {
                      const active =
                        index ===
                        activeIndex;

                      const population =
                        formatPopulation(
                          city.population,
                        );

                      return (
                        <li
                          key={
                            city.routeSlug
                          }
                          id={`${listboxId}-option-${index}`}
                          role="option"
                          aria-selected={
                            active
                          }
                        >
                          <button
                            type="button"
                            onMouseEnter={() => {
                              setActiveIndex(
                                index,
                              );
                            }}
                            onMouseDown={(
                              event,
                            ) => {
                              event.preventDefault();
                            }}
                            onClick={() => {
                              selectCity(
                                city,
                              );
                            }}
                            className={[
                              "group",
                              "relative",
                              "flex",
                              "w-full",
                              "min-w-0",
                              "items-center",
                              "justify-between",
                              "gap-3",
                              "px-4",
                              "py-3.5",
                              "text-left",
                              "outline-none",
                              "transition-all",
                              "duration-150",

                              active
                                ? "bg-blue-50"
                                : "bg-white hover:bg-slate-50",
                            ].join(
                              " ",
                            )}
                          >
                            {/* ACTIVE INDICATOR */}

                            {active && (
                              <span
                                aria-hidden="true"
                                className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-blue-600"
                              />
                            )}

                            {/* LEFT */}

                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <span
                                className={[
                                  "flex",
                                  "h-10",
                                  "w-10",
                                  "shrink-0",
                                  "items-center",
                                  "justify-center",
                                  "rounded-xl",
                                  "border",
                                  "text-xs",
                                  "font-black",
                                  "uppercase",
                                  "transition",

                                  active
                                    ? "border-blue-200 bg-blue-100 text-blue-700"
                                    : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600",
                                ].join(
                                  " ",
                                )}
                              >
                                {
                                  city.country.iso2
                                }
                              </span>

                              {/* CITY */}

                              <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-center gap-2">
                                  <span className="truncate text-sm font-bold text-slate-950 sm:text-base">
                                    {
                                      city.name
                                    }
                                  </span>

                                  <span className="shrink-0 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500 shadow-sm">
                                    {
                                      city.country.iso2
                                    }
                                  </span>
                                </div>

                                {/* COUNTRY + TIMEZONE */}

                                <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm">
                                  <span className="truncate">
                                    {
                                      city.country.name
                                    }
                                  </span>

                                  <span
                                    aria-hidden="true"
                                    className="shrink-0 text-slate-300"
                                  >
                                    •
                                  </span>

                                  <span className="min-w-0 truncate font-mono text-[11px] text-slate-400 sm:text-xs">
                                    {
                                      city.timezone.name
                                    }
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT */}

                            <div className="flex shrink-0 items-center gap-3">
                              {population && (
                                <div className="hidden min-w-[74px] text-right sm:block">
                                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                                    Population
                                  </p>

                                  <p className="mt-0.5 text-xs font-bold tabular-nums text-slate-700">
                                    {
                                      population
                                    }
                                  </p>
                                </div>
                              )}

                              <span
                                aria-hidden="true"
                                className={[
                                  "flex",
                                  "h-9",
                                  "w-9",
                                  "shrink-0",
                                  "items-center",
                                  "justify-center",
                                  "rounded-xl",
                                  "border",
                                  "transition-all",
                                  "duration-150",

                                  active
                                    ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "border-slate-200 bg-white text-slate-400 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600",
                                ].join(
                                  " ",
                                )}
                              >
                                <ArrowIcon />
                              </span>
                            </div>
                          </button>
                        </li>
                      );
                    },
                  )}
                </ul>

                {/* ==============================
                    KEYBOARD FOOTER
                =============================== */}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/90 px-4 py-3">
                  <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-[10px] font-bold text-slate-600 shadow-sm">
                        ↑
                      </kbd>

                      <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-[10px] font-bold text-slate-600 shadow-sm">
                        ↓
                      </kbd>

                      Navigate
                    </span>

                    <span className="hidden items-center gap-1.5 sm:inline-flex">
                      <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-[10px] font-bold text-slate-600 shadow-sm">
                        Enter
                      </kbd>

                      Select
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-[10px] font-bold text-slate-600 shadow-sm">
                      Esc
                    </kbd>

                    Close
                  </span>
                </div>
              </>
            )}
          </div>
        )}
    </div>
  );
}