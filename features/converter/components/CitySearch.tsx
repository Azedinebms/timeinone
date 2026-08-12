"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  CityOption,
} from "@/types/city";

type CitiesApiResponse = {
  data:
    CityOption[];

  meta: {
    query:
      string;

    count:
      number;

    limit:
      number;
  };
};

type CitySearchProps = {
  id:
    string;

  label:
    string;

  value:
    CityOption;

  onChange:
    (
      city:
        CityOption,
    ) => void;
};

function getCityLabel(
  city:
    CityOption,
): string {
  return `${city.city}, ${city.country}`;
}

export default function CitySearch({
  id,
  label,
  value,
  onChange,
}: CitySearchProps) {
  const containerRef =
    useRef<HTMLDivElement>(
      null,
    );

  const requestIdRef =
    useRef(
      0,
    );

  const [
    query,
    setQuery,
  ] =
    useState(
      getCityLabel(
        value,
      ),
    );

  const [
    cities,
    setCities,
  ] =
    useState<
      CityOption[]
    >([]);

  const [
    isOpen,
    setIsOpen,
  ] =
    useState(
      false,
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(
      false,
    );

  const [
    highlightedIndex,
    setHighlightedIndex,
  ] =
    useState(
      -1,
    );

  useEffect(() => {
    const currentRequestId =
      requestIdRef.current +
      1;

    requestIdRef.current =
      currentRequestId;

    const timer =
      window.setTimeout(
        async () => {
          const trimmedQuery =
            query.trim();

          const selectedLabel =
            getCityLabel(
              value,
            );

          const endpoint =
            trimmedQuery ===
              selectedLabel ||
            trimmedQuery.length <
              2
              ? "/api/cities?limit=10"
              : `/api/cities?q=${encodeURIComponent(
                  trimmedQuery,
                )}&limit=10`;

          try {
            setIsLoading(
              true,
            );

            const response =
              await fetch(
                endpoint,
                {
                  cache:
                    "no-store",
                },
              );

            if (
              !response.ok
            ) {
              throw new Error(
                `Cities request failed: ${response.status}`,
              );
            }

            const result =
              (
                await response.json()
              ) as CitiesApiResponse;

            if (
              currentRequestId !==
              requestIdRef.current
            ) {
              return;
            }

            setCities(
              result.data,
            );

            setHighlightedIndex(
              result.data
                .length >
                0
                ? 0
                : -1,
            );
          } catch (
            error
          ) {
            if (
              currentRequestId !==
              requestIdRef.current
            ) {
              return;
            }

            console.error(
              "City search error:",
              error,
            );

            setCities(
              [],
            );

            setHighlightedIndex(
              -1,
            );
          } finally {
            if (
              currentRequestId ===
              requestIdRef.current
            ) {
              setIsLoading(
                false,
              );
            }
          }
        },
        300,
      );

    return () => {
      window.clearTimeout(
        timer,
      );

      if (
        requestIdRef.current ===
        currentRequestId
      ) {
        requestIdRef.current +=
          1;
      }
    };
  }, [
    query,
    value,
  ]);

  useEffect(() => {
    const handleOutsideClick =
      (
        event:
          MouseEvent,
      ) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(
            event.target as Node,
          )
        ) {
          setIsOpen(
            false,
          );

          setQuery(
            getCityLabel(
              value,
            ),
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [
    value,
  ]);

  const selectCity =
    (
      city:
        CityOption,
    ) => {
      onChange(
        city,
      );

      setQuery(
        getCityLabel(
          city,
        ),
      );

      setIsOpen(
        false,
      );

      setHighlightedIndex(
        -1,
      );
    };

  const handleKeyDown =
    (
      event:
        React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (
        !isOpen &&
        event.key ===
          "ArrowDown"
      ) {
        setIsOpen(
          true,
        );

        return;
      }

      if (
        event.key ===
        "ArrowDown"
      ) {
        event.preventDefault();

        setHighlightedIndex(
          (
            currentIndex,
          ) =>
            Math.min(
              currentIndex +
                1,

              cities.length -
                1,
            ),
        );
      }

      if (
        event.key ===
        "ArrowUp"
      ) {
        event.preventDefault();

        setHighlightedIndex(
          (
            currentIndex,
          ) =>
            Math.max(
              currentIndex -
                1,

              0,
            ),
        );
      }

      if (
        event.key ===
          "Enter" &&
        highlightedIndex >=
          0 &&
        cities[
          highlightedIndex
        ]
      ) {
        event.preventDefault();

        selectCity(
          cities[
            highlightedIndex
          ],
        );
      }

      if (
        event.key ===
        "Escape"
      ) {
        setIsOpen(
          false,
        );

        setQuery(
          getCityLabel(
            value,
          ),
        );
      }
    };

  return (
    <div
      ref={
        containerRef
      }
      className="relative"
    >
      <label
        htmlFor={
          id
        }
        className="mb-2 block text-sm font-semibold text-text-primary"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={
            id
          }
          type="text"
          role="combobox"
          aria-haspopup="listbox"
          value={
            query
          }
          autoComplete="off"
          onFocus={() => {
            setIsOpen(
              true,
            );
          }}
          onChange={(
            event,
          ) => {
            setQuery(
              event
                .target
                .value,
            );

            setIsOpen(
              true,
            );
          }}
          onKeyDown={
            handleKeyDown
          }
          className="h-14 w-full rounded-xl border border-border bg-surface px-4 pr-12 text-text-primary shadow-sm outline-none transition placeholder:text-text-subtle hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15"
          placeholder="Search for a city..."
          aria-autocomplete="list"
          aria-expanded={
            isOpen
          }
          aria-controls={
            `${id}-results`
          }
        />

        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-text-muted">
          {isLoading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-border-strong border-t-primary" />
          ) : (
            <span className="text-lg leading-none">
              ⌕
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          id={
            `${id}-results`
          }
          role="listbox"
          className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-border bg-surface p-2 shadow-lg"
        >
          {isLoading &&
          cities.length ===
            0 ? (
            <p className="px-4 py-5 text-sm text-text-secondary">
              Searching
              cities...
            </p>
          ) : cities.length >
            0 ? (
            cities.map(
              (
                city,
                index,
              ) => {
                const isHighlighted =
                  index ===
                  highlightedIndex;

                return (
                  <button
                    key={
                      city.id
                    }
                    type="button"
                    role="option"
                    aria-selected={
                      isHighlighted
                    }
                    onMouseEnter={() => {
                      setHighlightedIndex(
                        index,
                      );
                    }}
                    onClick={() => {
                      selectCity(
                        city,
                      );
                    }}
                    className={[
                      "flex",
                      "w-full",
                      "items-center",
                      "justify-between",
                      "gap-4",
                      "rounded-xl",
                      "px-4",
                      "py-3",
                      "text-left",
                      "outline-none",
                      "transition",

                      isHighlighted
                        ? [
                            "bg-primary-soft",
                            "ring-1",
                            "ring-primary-muted",
                          ].join(
                            " ",
                          )
                        : [
                            "hover:bg-surface-soft",
                          ].join(
                            " ",
                          ),
                    ].join(
                      " ",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-text-primary">
                        {
                          city.city
                        }
                      </p>

                      <p className="mt-1 truncate text-xs text-text-secondary">
                        {
                          city.country
                        }{" "}
                        ·{" "}
                        {
                          city.timezone
                        }
                      </p>
                    </div>

                    <span className="shrink-0 rounded-lg border border-border bg-surface-soft px-2 py-1 text-xs font-semibold text-text-secondary">
                      {
                        city.countryCode
                      }
                    </span>
                  </button>
                );
              },
            )
          ) : (
            <p className="px-4 py-5 text-sm text-text-secondary">
              No city
              found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}