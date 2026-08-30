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

type VisitorCityApiResponse = {
  city:
    | CityOption
    | null;
};

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
    detectedFromCity,
    setDetectedFromCity,
  ] =
    useState<CityOption>(
      initialFromCity,
    );

  /* =========================================================
     VISITOR CITY DETECTION
  ========================================================= */

  useEffect(() => {
    let cancelled =
      false;

    async function detectVisitorCity() {
      try {
        /*
         * IMPORTANT:
         *
         * If ?from= already exists,
         * the explicit user-selected city
         * must always win.
         */
        const searchParams =
          new URLSearchParams(
            window.location.search,
          );

        if (
          searchParams.has(
            "from",
          )
        ) {
          return;
        }

        /*
         * Optional session cache.
         *
         * Avoid repeating the IP lookup
         * on every page refresh during
         * the same browser session.
         */
        const cached =
          sessionStorage.getItem(
            "timeinoneVisitorCity",
          );

        if (cached) {
          try {
            const cachedCity =
              JSON.parse(
                cached,
              ) as CityOption;

            if (
              cachedCity &&
              cachedCity.id &&
              cachedCity.city
            ) {
              if (
                !cancelled
              ) {
                setDetectedFromCity(
                  cachedCity,
                );
              }

              return;
            }
          } catch {
            sessionStorage.removeItem(
              "timeinoneVisitorCity",
            );
          }
        }

        /*
         * Detect visitor public IP location.
         *
         * No browser geolocation permission
         * popup is required.
         */
        const controller =
          new AbortController();

        const timeout =
          window.setTimeout(
            () => {
              controller.abort();
            },
            2500,
          );

        let geoResponse:
          Response;

        try {
          geoResponse =
            await fetch(
              "https://ipwho.is/",
              {
                signal:
                  controller.signal,

                cache:
                  "no-store",
              },
            );
        } finally {
          window.clearTimeout(
            timeout,
          );
        }

        if (
          !geoResponse.ok
        ) {
          return;
        }

        const geoData =
          (await geoResponse.json()) as IpWhoResponse;

        if (
          geoData.success !==
            true ||
          typeof geoData.city !==
            "string" ||
          typeof geoData.country_code !==
            "string"
        ) {
          return;
        }

        const city =
          geoData.city.trim();

        const countryCode =
          geoData.country_code
            .trim()
            .toUpperCase();

        if (
          !city ||
          countryCode.length !==
            2
        ) {
          return;
        }

        /*
         * Ask TimeInOne to match
         * the detected city against Neon.
         */
        const cityResponse =
          await fetch(
            `/api/visitor-city?city=${encodeURIComponent(
              city,
            )}&countryCode=${encodeURIComponent(
              countryCode,
            )}`,
            {
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
          (await cityResponse.json()) as VisitorCityApiResponse;

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
         * Replace Casablanca
         * with detected visitor city.
         */
        setDetectedFromCity(
          result.city,
        );

        /*
         * Cache only for current
         * browser session.
         */
        sessionStorage.setItem(
          "timeinoneVisitorCity",
          JSON.stringify(
            result.city,
          ),
        );
      } catch {
        /*
         * Silent fallback.
         *
         * Casablanca remains selected.
         */
      }
    }

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
          /*
           * Key forces ConverterTool
           * to reinitialize if visitor
           * city changes after hydration.
           */
          key={
            `${detectedFromCity.id}-${initialToCity.id}`
          }

          initialFromCity={
            detectedFromCity
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