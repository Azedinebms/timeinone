"use client";

import {
  useEffect,
  useState,
} from "react";

import HeroSection from "@/components/ui/HeroSection";

import type {
  CityOption,
} from "@/types/city";

import ConverterTool from "./ConverterTool";

/* =========================================================
   TYPES
========================================================= */

type ConverterHeroProps = {
  initialFromCity:
    CityOption;

  initialToCity:
    CityOption;

  initialDateTime?:
    string;

  showHero?:
    boolean;

  badge?:
    string;

  title?:
    string;

  highlightedTitle?:
    string;

  description?:
    string;
};

type IpWhoResponse = {
  success?: boolean;
  city?: string;
  country_code?: string;
};

type VisitorCityResponse = {
  city:
    | CityOption
    | null;
};

/* =========================================================
   CACHE
========================================================= */

const VISITOR_CITY_CACHE_KEY =
  "timeinone:visitor-city";

/* =========================================================
   COMPONENT
========================================================= */

export default function ConverterHero({
  initialFromCity,
  initialToCity,
  initialDateTime = "",

  showHero = true,

  badge =
    "Global Time Intelligence",

  title =
    "Convert time zones. ",

  highlightedTitle =
    "Plan smarter meetings.",

  description =
    "Search cities and convert any date and time instantly.",
}: ConverterHeroProps) {
  const [
    resolvedFromCity,
    setResolvedFromCity,
  ] =
    useState<CityOption>(
      initialFromCity,
    );

  /* =========================================================
     VISITOR CITY
  ========================================================= */

  useEffect(() => {
    let cancelled =
      false;

    const detectVisitorCity =
      async () => {
        try {
          /*
           * IMPORTANT:
           * Never replace a city explicitly
           * supplied through ?from=
           */
          const urlParams =
            new URLSearchParams(
              window.location.search,
            );

          if (
            urlParams.has(
              "from",
            )
          ) {
            return;
          }

          /*
           * Try session cache first.
           */
          const cachedValue =
            window.sessionStorage.getItem(
              VISITOR_CITY_CACHE_KEY,
            );

          if (cachedValue) {
            try {
              const cachedCity =
                JSON.parse(
                  cachedValue,
                ) as CityOption;

              if (
                cachedCity &&
                typeof cachedCity.id ===
                  "number" &&
                cachedCity.id > 0 &&
                typeof cachedCity.city ===
                  "string" &&
                typeof cachedCity.timezone ===
                  "string"
              ) {
                if (!cancelled) {
                  setResolvedFromCity(
                    cachedCity,
                  );
                }

                return;
              }
            } catch {
              window.sessionStorage.removeItem(
                VISITOR_CITY_CACHE_KEY,
              );
            }
          }

          /*
           * Browser performs the request.
           *
           * ipwho.is therefore sees the
           * VISITOR public IP, not Railway.
           */
          const controller =
            new AbortController();

          const timeoutId =
            window.setTimeout(
              () => {
                controller.abort();
              },
              4000,
            );

          let geoResponse:
            Response;

          try {
            geoResponse =
              await fetch(
                "https://ipwho.is/",
                {
                  method:
                    "GET",

                  signal:
                    controller.signal,

                  cache:
                    "no-store",
                },
              );
          } finally {
            window.clearTimeout(
              timeoutId,
            );
          }

          if (
            !geoResponse.ok
          ) {
            return;
          }

          const geo =
            (await geoResponse.json()) as IpWhoResponse;

          if (
            geo.success !== true ||
            typeof geo.city !==
              "string" ||
            typeof geo.country_code !==
              "string"
          ) {
            return;
          }

          const detectedCity =
            geo.city.trim();

          const detectedCountryCode =
            geo.country_code
              .trim()
              .toUpperCase();

          if (
            !detectedCity ||
            detectedCountryCode.length !==
              2
          ) {
            return;
          }

          /*
           * Match the detected city against
           * our own Neon database.
           */
          const matchUrl =
            new URL(
              "/api/visitor-city",
              window.location.origin,
            );

          matchUrl.searchParams.set(
            "city",
            detectedCity,
          );

          matchUrl.searchParams.set(
            "countryCode",
            detectedCountryCode,
          );

          const cityResponse =
            await fetch(
              matchUrl.toString(),
              {
                method:
                  "GET",

                cache:
                  "no-store",
              },
            );

          if (
            !cityResponse.ok
          ) {
            return;
          }

          const result =
            (await cityResponse.json()) as VisitorCityResponse;

          if (
            !result.city
          ) {
            return;
          }

          if (
            cancelled
          ) {
            return;
          }

          /*
           * Replace Casablanca.
           */
          setResolvedFromCity(
            result.city,
          );

          /*
           * Avoid repeating geolocation
           * during this browser session.
           */
          window.sessionStorage.setItem(
            VISITOR_CITY_CACHE_KEY,
            JSON.stringify(
              result.city,
            ),
          );
        } catch {
          /*
           * Silent fallback:
           * initialFromCity remains active.
           */
        }
      };

    void detectVisitorCity();

    return () => {
      cancelled =
        true;
    };
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="bg-background">
      {showHero && (
        <HeroSection
          badge={
            badge
          }
          title={
            <>
              {
                title
              }

              <span className="block text-primary">
                {
                  highlightedTitle
                }
              </span>
            </>
          }
          description={
            description
          }
        />
      )}

      <div
        className={[
          "mx-auto",
          "w-full",
          "max-w-7xl",
          "px-5",
          "sm:px-6",
          "lg:px-8",

          showHero
            ? "pb-16"
            : "",
        ].join(
          " ",
        )}
      >
        <ConverterTool
          key={[
            resolvedFromCity.id,
            initialToCity.id,
            initialDateTime,
          ].join("-")}
          initialFromCity={
            resolvedFromCity
          }
          initialToCity={
            initialToCity
          }
          initialDateTime={
            initialDateTime
          }
        />
      </div>
    </section>
  );
}