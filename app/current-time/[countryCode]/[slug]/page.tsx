import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  cache,
} from "react";

import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import HeroSection from "@/components/ui/HeroSection";

import CurrentTimeCityHero from "@/features/current-time/components/CurrentTimeCityHero";


import {
  createCurrentTimeJsonLd,
  createCurrentTimeMetadata,
} from "@/lib/seo";

import {
  findCityBySlugAndCountry,
} from "@/services/city.service";

type CurrentTimePageProps = {
  params: Promise<{
    countryCode: string;
    slug: string;
  }>;
};

const getCurrentTimeCity =
  cache(
    async (
      countryCode: string,
      slug: string,
    ) => {
      return findCityBySlugAndCountry(
        slug,
        countryCode,
      );
    },
  );

export async function generateMetadata({
  params,
}: CurrentTimePageProps): Promise<Metadata> {
  const {
    countryCode,
    slug,
  } =
    await params;

  const city =
    await getCurrentTimeCity(
      countryCode,
      slug,
    );

  if (!city) {
    return {
      title:
        "City Not Found | TimeInOne",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  return createCurrentTimeMetadata({
    city:
      city.city,

    country:
      city.country,

    countryCode:
      city.countryCode,

    slug:
      city.slug,

    timezone:
      city.timezone,
  });
}

export default async function CurrentTimePage({
  params,
}: CurrentTimePageProps) {
  const {
    countryCode,
    slug,
  } =
    await params;

  const city =
    await getCurrentTimeCity(
      countryCode,
      slug,
    );

  if (!city) {
    notFound();
  }

  const canonicalCountryCode =
    city.countryCode.toLowerCase();

  const requestedCountryCode =
    countryCode.toLowerCase();

  if (
    requestedCountryCode !==
    canonicalCountryCode
  ) {
    notFound();
  }

  const converterUrl =
    `/?from=${city.id}`;

  const currentTimePath =
    `/current-time/${canonicalCountryCode}/${city.slug}`;

  const jsonLd =
    createCurrentTimeJsonLd({
      city:
        city.city,

      country:
        city.country,

      countryCode:
        city.countryCode,

      slug:
        city.slug,

      timezone:
        city.timezone,

      latitude:
        city.latitude,

      longitude:
        city.longitude,
    });

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen bg-background text-text-primary">
        <div className="mx-auto max-w-6xl px-5 py-5 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center text-sm text-text-muted"
          >
            <Link
              href="/"
              className="rounded-md outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              Home
            </Link>

            <span
              aria-hidden="true"
              className="mx-2 text-text-subtle"
            >
              /
            </span>

            <Link
  href="/current-time"
  className="rounded-md outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"
>
  Current Time
</Link>

            <span
              aria-hidden="true"
              className="mx-2 text-text-subtle"
            >
              /
            </span>

            <Link
              href={
                currentTimePath
              }
              aria-current="page"
              className="font-medium text-text-secondary"
            >
              {
                city.city
              }
            </Link>
          </nav>
        </div>

        <CurrentTimeCityHero
          city={
            city.city
          }
          country={
            city.country
          }
          countryCode={
            city.countryCode
          }
          timezone={
            city.timezone
          }
          population={
            city.population
          }
        />

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">


          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <Card
              as="article"
              variant="default"
              padding="lg"
              interactive
            >
              <Badge
                variant="info"
                size="sm"
              >
                Local time
              </Badge>

              <h2 className="mt-4 text-xl font-semibold text-text-primary">
                About{" "}
                {
                  city.city
                }{" "}
                time
              </h2>

              <p className="mt-4 leading-7 text-text-secondary">
                {
                  city.city
                }{" "}
                uses the{" "}

                <strong className="font-semibold text-text-primary">
                  {
                    city.timezone
                  }
                </strong>{" "}

                time zone.
                TimeInOne
                automatically
                accounts for the
                current UTC offset
                and seasonal clock
                changes associated
                with this time zone.
              </p>
            </Card>

            <Card
              as="article"
              variant="soft"
              padding="lg"
              interactive
              className="relative overflow-hidden border-primary-muted bg-primary-soft"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-28 -top-32 h-72 w-72 rounded-full bg-primary-muted/60 blur-3xl"
              />

              <div className="relative">
                <Badge
                  variant="primary"
                  size="sm"
                >
                  Time conversion
                </Badge>

                <h2 className="mt-4 text-xl font-semibold text-text-primary">
                  Convert{" "}
                  {
                    city.city
                  }{" "}
                  time
                </h2>

                <p className="mt-4 leading-7 text-text-secondary">
                  Compare{" "}
                  {
                    city.city
                  }{" "}
                  with another city,
                  inspect the hourly
                  time difference and
                  discover overlapping
                  working hours.
                </p>

                <Button
                  as={Link}
                  href={
                    converterUrl
                  }
                  variant="primary"
                  className="mt-6"
                >
                  Open time converter
                </Button>
              </div>
            </Card>
          </section>

          <Card
            as="section"
            variant="default"
            padding="lg"
            className="mt-8"
          >
            <Badge
              variant="accent"
              size="sm"
            >
              Location details
            </Badge>

            <h2 className="mt-4 text-xl font-semibold text-text-primary">
              Location information
            </h2>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface-soft p-4">
                <dt className="text-sm text-text-muted">
                  Country
                </dt>

                <dd className="mt-1 font-medium text-text-primary">
                  {
                    city.country
                  }
                </dd>
              </div>

              <div className="rounded-2xl border border-border bg-surface-soft p-4">
                <dt className="text-sm text-text-muted">
                  Country code
                </dt>

                <dd className="mt-1 font-medium text-text-primary">
                  {
                    city.countryCode
                  }
                </dd>
              </div>

              <div className="rounded-2xl border border-border bg-surface-soft p-4">
                <dt className="text-sm text-text-muted">
                  Time zone
                </dt>

                <dd className="mt-1 break-all font-medium text-text-primary">
                  {
                    city.timezone
                  }
                </dd>
              </div>

              <div className="rounded-2xl border border-border bg-surface-soft p-4">
                <dt className="text-sm text-text-muted">
                  Population
                </dt>

                <dd className="mt-1 font-medium text-text-primary">
                  {city.population
                    ? city.population.toLocaleString(
                      "en-US",
                    )
                    : "Not available"}
                </dd>
              </div>

              <div className="rounded-2xl border border-border bg-surface-soft p-4">
                <dt className="text-sm text-text-muted">
                  Latitude
                </dt>

                <dd className="mt-1 font-medium text-text-primary">
                  {city.latitude ??
                    "Not available"}
                </dd>
              </div>

              <div className="rounded-2xl border border-border bg-surface-soft p-4">
                <dt className="text-sm text-text-muted">
                  Longitude
                </dt>

                <dd className="mt-1 font-medium text-text-primary">
                  {city.longitude ??
                    "Not available"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </main>
    </>
  );
}