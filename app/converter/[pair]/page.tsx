import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  cache,
} from "react";

import Header from "@/components/layout/Header";
import FaqSection from "@/components/seo/FaqSection";
import JsonLd from "@/components/seo/JsonLd";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHero from "@/components/ui/PageHero";

import AboutCities from "@/features/converter/components/AboutCities";
import ConverterHero from "@/features/converter/components/ConverterHero";
import PopularConversions from "@/features/converter/components/PopularConversions";

import {
  createConverterFaqs,
  createConverterJsonLd,
  createConverterMetadata,
  createFaqJsonLd,
} from "@/lib/seo";

import {
  resolveConverterPair,
} from "@/services/converter-page.service";

import {
  getRelatedConverters,
} from "@/services/related-converters.service";

type ConverterPageProps = {
  params: Promise<{
    pair: string;
  }>;
};

const getConverterPageData =
  cache(
    async (
      pair: string,
    ) => {
      return resolveConverterPair(
        pair,
      );
    },
  );

export async function generateMetadata({
  params,
}: ConverterPageProps): Promise<Metadata> {
  const {
    pair,
  } =
    await params;

  const pageData =
    await getConverterPageData(
      pair,
    );

  if (!pageData) {
    return {
      title:
        "Time Converter Not Found | TimeInOne",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  const {
    fromCity,
    toCity,
  } =
    pageData;

  return createConverterMetadata({
    fromCity:
      fromCity.city,

    fromCountry:
      fromCity.country,

    fromSlug:
      fromCity.slug,

    toCity:
      toCity.city,

    toCountry:
      toCity.country,

    toSlug:
      toCity.slug,
  });
}

export default async function ConverterPage({
  params,
}: ConverterPageProps) {
  const {
    pair,
  } =
    await params;

  const pageData =
    await getConverterPageData(
      pair,
    );

  if (!pageData) {
    notFound();
  }

  const {
    fromCity,
    toCity,
    canonicalPair,
  } =
    pageData;

  const requestedPair =
    decodeURIComponent(
      pair,
    )
      .trim()
      .toLowerCase();

  if (
    requestedPair !==
    canonicalPair
  ) {
    redirect(
      `/converter/${canonicalPair}`,
    );
  }

  const referenceDate =
    new Date();

  const relatedConverters =
    await getRelatedConverters({
      fromCity,
      toCity,
      limit:
        8,
    });

  const reverseConverterUrl =
    `/converter/${toCity.slug}-to-${fromCity.slug}`;

  const fromCurrentTimeUrl =
    `/current-time/${fromCity.countryCode.toLowerCase()}/${fromCity.slug}`;

  const toCurrentTimeUrl =
    `/current-time/${toCity.countryCode.toLowerCase()}/${toCity.slug}`;

  const faqs =
    createConverterFaqs({
      referenceDate,

      fromCity:
        fromCity.city,

      fromCountry:
        fromCity.country,

      fromTimezone:
        fromCity.timezone,

      toCity:
        toCity.city,

      toCountry:
        toCity.country,

      toTimezone:
        toCity.timezone,
    });

  const converterJsonLd =
    createConverterJsonLd({
      fromCity:
        fromCity.city,

      fromCountry:
        fromCity.country,

      fromSlug:
        fromCity.slug,

      fromTimezone:
        fromCity.timezone,

      toCity:
        toCity.city,

      toCountry:
        toCity.country,

      toSlug:
        toCity.slug,

      toTimezone:
        toCity.timezone,
    });

  const faqJsonLd =
    createFaqJsonLd(
      faqs,
    );

  const jsonLd = [
    ...converterJsonLd,
    faqJsonLd,
  ];

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen overflow-x-hidden bg-background text-text-primary">
        {/* UNIVERSAL HERO */}

        <PageHero
          badge="City Time Converter"
          title={`${fromCity.city} to ${toCity.city}`}
          highlight="Time Converter"
          description={`Convert ${fromCity.city}, ${fromCity.country} time to ${toCity.city}, ${toCity.country}. Compare local times, working hours and recommended meeting slots.`}
          breadcrumbs={[
            {
              label:
                "Home",

              href:
                "/",
            },

            {
  label:
    "Converter",

  href:
    "/",
},

            {
              label:
                `${fromCity.city} to ${toCity.city}`,
            },
          ]}
          tags={[
            "Live conversion",
            "DST aware",
            "Meeting intelligence",
          ]}
        />

        {/* CONVERTER TOOL */}

        <section className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 sm:py-10 lg:px-8">
          <ConverterHero
  initialFromCity={
    fromCity
  }
  initialToCity={
    toCity
  }
  showHero={
    false
  }
/>
        </section>

        {/* SEO CONTENT */}

        <section className="border-t border-border bg-background px-5 pb-20 pt-10 sm:px-6 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-2">
              <Card
                as="article"
                variant="default"
                padding="lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-muted bg-primary-soft text-lg font-bold text-primary">
                  ↔
                </div>

                <h2 className="mt-5 text-xl font-semibold text-text-primary">
                  {
                    fromCity.city
                  }{" "}
                  to{" "}
                  {
                    toCity.city
                  }{" "}
                  time
                </h2>

                <p className="mt-4 leading-7 text-text-secondary">
                  Use TimeInOne to
                  convert any local
                  time in{" "}
                  {
                    fromCity.city
                  }
                  ,{" "}
                  {
                    fromCity.country
                  }{" "}
                  to the corresponding
                  time in{" "}
                  {
                    toCity.city
                  }
                  ,{" "}
                  {
                    toCity.country
                  }.
                </p>

                <p className="mt-4 leading-7 text-text-secondary">
                  The conversion uses{" "}

                  <strong className="font-semibold text-text-primary">
                    {
                      fromCity.timezone
                    }
                  </strong>{" "}

                  and{" "}

                  <strong className="font-semibold text-text-primary">
                    {
                      toCity.timezone
                    }
                  </strong>

                  , including
                  date-specific
                  seasonal clock
                  changes.
                </p>
              </Card>

              <Card
                as="article"
                variant="soft"
                padding="lg"
                className="border-primary-muted bg-primary-soft/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-white text-lg font-bold text-primary shadow-sm">
                  ✦
                </div>

                <h2 className="mt-5 text-xl font-semibold text-text-primary">
                  Related time tools
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Continue exploring
                  local times and
                  related conversions.
                </p>

                <div className="mt-5 flex flex-col gap-3">
                  <Button
                    as={
                      Link
                    }
                    href={
                      fromCurrentTimeUrl
                    }
                    variant="secondary"
                    className="justify-between"
                  >
                    <span>
                      Current time in{" "}
                      {
                        fromCity.city
                      }
                    </span>

                    <span aria-hidden="true">
                      →
                    </span>
                  </Button>

                  <Button
                    as={
                      Link
                    }
                    href={
                      toCurrentTimeUrl
                    }
                    variant="secondary"
                    className="justify-between"
                  >
                    <span>
                      Current time in{" "}
                      {
                        toCity.city
                      }
                    </span>

                    <span aria-hidden="true">
                      →
                    </span>
                  </Button>

                  <Button
                    as={
                      Link
                    }
                    href={
                      reverseConverterUrl
                    }
                    variant="secondary"
                    className="justify-between"
                  >
                    <span>
                      {
                        toCity.city
                      }{" "}
                      to{" "}
                      {
                        fromCity.city
                      }{" "}
                      converter
                    </span>

                    <span aria-hidden="true">
                      ↔
                    </span>
                  </Button>

                  <Button
                    as={
                      Link
                    }
                    href="/"
                    variant="outline"
                    className="justify-between"
                  >
                    <span>
                      Global time converter
                    </span>

                    <span aria-hidden="true">
                      →
                    </span>
                  </Button>
                </div>
              </Card>
            </div>

            <AboutCities
              fromCity={
                fromCity
              }
              toCity={
                toCity
              }
            />

            <PopularConversions
              fromCity={
                fromCity.city
              }
              toCity={
                toCity.city
              }
              links={
                relatedConverters
              }
            />

            <FaqSection
              title={`${fromCity.city} to ${toCity.city} time FAQ`}
              description={`Common questions about the time difference, daylight-saving rules and meeting hours between ${fromCity.city} and ${toCity.city}.`}
              items={
                faqs
              }
            />
          </div>
        </section>
      </main>
    </>
  );
}