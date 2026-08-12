"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  CitySearchErrorResponse,
  CitySearchResponse,
  CitySearchResult,
} from "../types";

const DEFAULT_DEBOUNCE_MS =
  250;

const DEFAULT_RESULT_LIMIT =
  10;

type UseCitySearchOptions = {
  minimumQueryLength?: number;
  debounceMs?: number;
  limit?: number;
};

type UseCitySearchReturn = {
  query: string;

  setQuery: (
    value: string,
  ) => void;

  results:
    CitySearchResult[];

  isLoading: boolean;

  error:
    string | null;

  minimumQueryLength:
    number;

  hasSearched: boolean;
  hasResults: boolean;

  clearSearch: () => void;
};

function normalizeQuery(
  query: string,
): string {
  return query
    .trim()
    .replace(/\s+/g, " ");
}

function normalizePositiveInteger(
  value: number | undefined,
  fallback: number,
): number {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return fallback;
  }

  return Math.floor(
    value,
  );
}

export default function useCitySearch(
  options:
    UseCitySearchOptions = {},
): UseCitySearchReturn {
  const minimumQueryLength =
    normalizePositiveInteger(
      options.minimumQueryLength,
      2,
    );

  const debounceMs =
    normalizePositiveInteger(
      options.debounceMs,
      DEFAULT_DEBOUNCE_MS,
    );

  const limit =
    normalizePositiveInteger(
      options.limit,
      DEFAULT_RESULT_LIMIT,
    );

  const [
    query,
    setQueryState,
  ] = useState("");

  const [
    results,
    setResults,
  ] = useState<
    CitySearchResult[]
  >([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    hasSearched,
    setHasSearched,
  ] = useState(false);

  /*
   * Chaque nouvelle recherche reçoit
   * un identifiant supérieur.
   *
   * Une ancienne réponse est ignorée
   * si une recherche plus récente a
   * été lancée entre-temps.
   */
  const requestIdRef =
    useRef(0);

  const setQuery =
    useCallback(
      (
        value: string,
      ) => {
        setQueryState(
          value,
        );
      },
      [],
    );

  const clearSearch =
    useCallback(() => {
      /*
       * Invalide immédiatement toute
       * requête encore en cours.
       */
      requestIdRef.current += 1;

      setQueryState("");
      setResults([]);
      setError(null);
      setIsLoading(false);
      setHasSearched(false);
    }, []);

  useEffect(() => {
    const normalizedQuery =
      normalizeQuery(
        query,
      );

    if (
      normalizedQuery.length <
      minimumQueryLength
    ) {
      /*
       * React 19 déconseille les mises à
       * jour synchrones dans le corps
       * d'un effet. On les programme donc
       * dans un callback de timer.
       */
      const resetTimer =
        window.setTimeout(
          () => {
            requestIdRef.current += 1;

            setResults([]);
            setError(null);
            setIsLoading(false);
            setHasSearched(false);
          },
          0,
        );

      return () => {
        window.clearTimeout(
          resetTimer,
        );
      };
    }

    const requestId =
      requestIdRef.current +
      1;

    requestIdRef.current =
      requestId;

    let effectIsActive =
      true;

    const searchTimer =
      window.setTimeout(
        async () => {
          /*
           * L'effet peut avoir été nettoyé
           * avant le déclenchement du
           * debounce en mode développement.
           */
          if (
            !effectIsActive
          ) {
            return;
          }

          setIsLoading(true);
          setError(null);

          try {
            const searchParams =
              new URLSearchParams({
                q:
                  normalizedQuery,

                limit:
                  String(limit),
              });

            const response =
              await fetch(
                `/api/cities/search?${searchParams.toString()}`,
                {
                  method:
                    "GET",

                  headers: {
                    Accept:
                      "application/json",
                  },
                },
              );

            const data =
              (await response.json()) as
                | CitySearchResponse
                | CitySearchErrorResponse;

            /*
             * Ignore une réponse si :
             *
             * - le composant ou l'effet a
             *   été nettoyé ;
             * - une recherche plus récente
             *   a déjà été lancée.
             */
            if (
              !effectIsActive ||
              requestId !==
                requestIdRef.current
            ) {
              return;
            }

            if (
              !response.ok
            ) {
              const errorMessage =
                "error" in data
                  ? data.error
                  : "Unable to search cities.";

              throw new Error(
                errorMessage,
              );
            }

            setResults(
              data.results,
            );

            setHasSearched(
              true,
            );
          } catch (
            searchError
          ) {
            if (
              !effectIsActive ||
              requestId !==
                requestIdRef.current
            ) {
              return;
            }

            console.error(
              "[Atlas City Search]",
              searchError,
            );

            setResults([]);

            setError(
              searchError instanceof
                Error
                ? searchError.message
                : "Unable to search cities.",
            );

            setHasSearched(
              true,
            );
          } finally {
            if (
              effectIsActive &&
              requestId ===
                requestIdRef.current
            ) {
              setIsLoading(
                false,
              );
            }
          }
        },
        debounceMs,
      );

    return () => {
      /*
       * Pas de AbortController ici :
       * React peut exécuter ce nettoyage
       * immédiatement en développement.
       *
       * Le requestId et effectIsActive
       * suffisent à neutraliser les réponses
       * devenues obsolètes.
       */
      effectIsActive =
        false;

      window.clearTimeout(
        searchTimer,
      );
    };
  }, [
    debounceMs,
    limit,
    minimumQueryLength,
    query,
  ]);

  return {
    query,
    setQuery,

    results,

    isLoading,
    error,

    minimumQueryLength,

    hasSearched,

    hasResults:
      results.length > 0,

    clearSearch,
  };
}