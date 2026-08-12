"use client";

import HeroSection from "@/components/ui/HeroSection";

import type {
  CityOption,
} from "@/types/city";

import ConverterTool from "./ConverterTool";

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
          initialFromCity={
            initialFromCity
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