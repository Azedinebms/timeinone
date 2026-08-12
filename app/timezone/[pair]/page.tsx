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

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import TimezoneConverter from "@/features/timezone/components/TimezoneConverter";
import TimezoneDetailHero from "@/features/timezone/components/TimezoneDetailHero";
import TimezonePairHero from "@/features/timezone/components/TimezonePairHero";
import TimezoneLinkCard from "@/features/timezone/components/TimezoneLinkCard";
import TimezoneSection from "@/features/timezone/components/TimezoneSection";

import {
  formatDateTimeInput,
} from "@/lib/time-engine";

import {
  createFaqJsonLd,
  createTimezoneConverterFaqs,
  createTimezoneConverterJsonLd,
  createTimezoneConverterMetadata,
  createTimezoneDetailFaqs,
  createTimezoneDetailJsonLd,
  createTimezoneDetailMetadata,
} from "@/lib/seo";

import {
  getAllTimezones,
  getSelectedOffsetTimezones,
  resolveTimezone,
  type TimezoneDefinition,
} from "@/lib/timezones";

import {
  resolveTimezonePair,
} from "@/services/timezone-page.service";

type TimezonePageProps = {
  params: Promise<{
    pair: string;
  }>;
};

type TimezoneDetailPageProps = {
  timezone:
    TimezoneDefinition;
};

type TimezonePairPageProps = {
  fromTimezone:
    TimezoneDefinition;

  toTimezone:
    TimezoneDefinition;
};

const MINUTE_IN_MILLISECONDS =
  60 * 1000;

const getTimezoneRouteData =
  cache(
    async (
      value: string,
    ) => {
      const pair =
        resolveTimezonePair(
          value,
        );

      if (pair) {
        return {
          type:
            "pair" as const,

          pair,
        };
      }

      const timezone =
        resolveTimezone(
          value,
        );

      if (timezone) {
        return {
          type:
            "detail" as const,

          timezone,
        };
      }

      return null;
    },
  );

function normalizeRouteValue(
  value: string,
) {
  return decodeURIComponent(
    value,
  )
    .trim()
    .toLowerCase()
    .replace(
      /[_\s]+/g,
      "-",
    )
    .replace(
      /-+/g,
      "-",
    )
    .replace(
      /^-|-$/g,
      "",
    );
}

function padNumber(
  value: number,
) {
  return value
    .toString()
    .padStart(
      2,
      "0",
    );
}

function formatFixedDateTimeInput(
  instant: Date,
  offsetMinutes: number,
) {
  const shiftedDate =
    new Date(
      instant.getTime() +
        offsetMinutes *
          MINUTE_IN_MILLISECONDS,
    );

  return (
    `${shiftedDate.getUTCFullYear()}-` +
    `${padNumber(
      shiftedDate.getUTCMonth() +
        1,
    )}-` +
    `${padNumber(
      shiftedDate.getUTCDate(),
    )}T` +
    `${padNumber(
      shiftedDate.getUTCHours(),
    )}:` +
    `${padNumber(
      shiftedDate.getUTCMinutes(),
    )}`
  );
}

function getInitialDateTime(
  timezone:
    TimezoneDefinition,

  instant:
    Date,
) {
  if (
    timezone.kind ===
      "iana" &&
    timezone.ianaTimezone
  ) {
    return formatDateTimeInput(
      instant,
      timezone.ianaTimezone,
    );
  }

  return formatFixedDateTimeInput(
    instant,
    timezone.offsetMinutes ??
      0,
  );
}

function getUniqueTimezones(
  timezones:
    TimezoneDefinition[],
) {
  return timezones.filter(
    (
      timezone,
      index,
      collection,
    ) =>
      collection.findIndex(
        (
          candidate,
        ) =>
          candidate.slug ===
          timezone.slug,
      ) ===
      index,
  );
}

function getRelatedTimezones(
  timezone:
    TimezoneDefinition,
) {
  const predefinedTimezones =
    getAllTimezones();

  const selectedOffsets =
    getSelectedOffsetTimezones();

  const isDynamicOffset =
    timezone.name.endsWith(
      "Fixed Offset",
    );

  const preferredSlugs = [
    "utc",
    "gmt",
    "pst",
    "est",
    "pacific-time",
    "eastern-time",
    "cet",
    "jst",
    "ist-india",
    "aest",
  ];

  const preferredTimezones =
    preferredSlugs
      .map(
        (
          slug,
        ) =>
          resolveTimezone(
            slug,
          ),
      )
      .filter(
        (
          item,
        ): item is TimezoneDefinition =>
          item !==
          null,
      );

  let candidates:
    TimezoneDefinition[];

  if (
    isDynamicOffset
  ) {
    const currentOffset =
      timezone.offsetMinutes ??
      0;

    const nearbyOffsets =
      selectedOffsets
        .filter(
          (
            item,
          ) =>
            item.slug !==
            timezone.slug,
        )
        .sort(
          (
            first,
            second,
          ) => {
            const firstDistance =
              Math.abs(
                (
                  first.offsetMinutes ??
                  0
                ) -
                  currentOffset,
              );

            const secondDistance =
              Math.abs(
                (
                  second.offsetMinutes ??
                  0
                ) -
                  currentOffset,
              );

            return (
              firstDistance -
              secondDistance
            );
          },
        )
        .slice(
          0,
          4,
        );

    candidates = [
      ...preferredTimezones,
      ...nearbyOffsets,
      ...predefinedTimezones,
    ];
  } else {
    candidates = [
      ...preferredTimezones,
      ...predefinedTimezones,
    ];
  }

  return getUniqueTimezones(
    candidates,
  )
    .filter(
      (
        item,
      ) =>
        item.slug !==
        timezone.slug,
    )
    .slice(
      0,
      8,
    );
}

export async function generateMetadata({
  params,
}: TimezonePageProps): Promise<Metadata> {
  const {
    pair,
  } =
    await params;

  const routeData =
    await getTimezoneRouteData(
      pair,
    );

  if (!routeData) {
    return {
      title:
        "Time Zone Not Found | TimeInOne",

      robots: {
        index:
          false,

        follow:
          false,
      },
    };
  }

  if (
    routeData.type ===
    "detail"
  ) {
    const timezone =
      routeData.timezone;

    return createTimezoneDetailMetadata({
      slug:
        timezone.slug,

      abbreviation:
        timezone.abbreviation,

      name:
        timezone.name,
    });
  }

  const {
    fromTimezone,
    toTimezone,
  } =
    routeData.pair;

  return createTimezoneConverterMetadata({
    fromSlug:
      fromTimezone.slug,

    fromAbbreviation:
      fromTimezone.abbreviation,

    fromName:
      fromTimezone.name,

    toSlug:
      toTimezone.slug,

    toAbbreviation:
      toTimezone.abbreviation,

    toName:
      toTimezone.name,
  });
}

export default async function TimezonePage({
  params,
}: TimezonePageProps) {
  const {
    pair,
  } =
    await params;

  const routeData =
    await getTimezoneRouteData(
      pair,
    );

  if (!routeData) {
    notFound();
  }

  const requestedValue =
    normalizeRouteValue(
      pair,
    );

  if (
    routeData.type ===
    "detail"
  ) {
    const timezone =
      routeData.timezone;

    if (
      requestedValue !==
      timezone.slug
    ) {
      redirect(
        `/timezone/${timezone.slug}`,
      );
    }

    return (
      <TimezoneDetailPage
        timezone={
          timezone
        }
      />
    );
  }

  const {
    fromTimezone,
    toTimezone,
    canonicalPair,
  } =
    routeData.pair;

  if (
    requestedValue !==
    canonicalPair
  ) {
    redirect(
      `/timezone/${canonicalPair}`,
    );
  }

  return (
    <TimezonePairPage
      fromTimezone={
        fromTimezone
      }
      toTimezone={
        toTimezone
      }
    />
  );
}

function TimezoneDetailPage({
  timezone,
}: TimezoneDetailPageProps) {
  const referenceDate =
    new Date();

  const faqs =
    createTimezoneDetailFaqs({
      timezone,
      referenceDate,
    });

  const detailJsonLd =
    createTimezoneDetailJsonLd({
      slug:
        timezone.slug,

      abbreviation:
        timezone.abbreviation,

      name:
        timezone.name,

      description:
        timezone.description,
    });

  const jsonLd = [
    ...detailJsonLd,
    createFaqJsonLd(
      faqs,
    ),
  ];

  const relatedTimezones =
    getRelatedTimezones(
      timezone,
    );

  return (
    <>
      <JsonLd
        data={
          jsonLd
        }
      />

      <Header />

      <main className="min-h-screen overflow-x-hidden bg-background text-text-primary">
        <TimezoneDetailHero
          timezone={
            timezone
          }
        />

        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <section className="grid gap-6 lg:grid-cols-2">
            <Card
              as="article"
              variant="default"
              padding="lg"
            >
              <Badge
                variant="accent"
                size="sm"
              >
                Overview
              </Badge>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
                What is{" "}
                {
                  timezone.abbreviation
                }
                ?
              </h2>

              <p className="mt-4 leading-7 text-text-secondary">
                {
                  timezone.description
                }
              </p>

              <dl className="mt-7 grid gap-3">
                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <dt className="text-sm text-text-muted">
                    Full name
                  </dt>

                  <dd className="mt-1 font-semibold text-text-primary">
                    {
                      timezone.name
                    }
                  </dd>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <dt className="text-sm text-text-muted">
                    Abbreviation
                  </dt>

                  <dd className="mt-1 font-semibold text-text-primary">
                    {
                      timezone.abbreviation
                    }
                  </dd>
                </div>

                <div className="rounded-2xl border border-border bg-surface-soft p-4">
                  <dt className="text-sm text-text-muted">
                    Definition type
                  </dt>

                  <dd className="mt-1 font-semibold text-text-primary">
                    {timezone.kind ===
                    "fixed"
                      ? "Fixed UTC offset"
                      : "Seasonal IANA time zone"}
                  </dd>
                </div>

                {typeof timezone.offsetMinutes ===
                  "number" && (
                  <div className="rounded-2xl border border-border bg-surface-soft p-4">
                    <dt className="text-sm text-text-muted">
                      Offset in minutes
                    </dt>

                    <dd className="mt-1 font-semibold text-text-primary">
                      {
                        timezone.offsetMinutes
                      }{" "}
                      minutes
                    </dd>
                  </div>
                )}

                {timezone.ianaTimezone && (
                  <div className="rounded-2xl border border-border bg-surface-soft p-4">
                    <dt className="text-sm text-text-muted">
                      IANA time zone
                    </dt>

                    <dd className="mt-1 break-all font-semibold text-text-primary">
                      {
                        timezone.ianaTimezone
                      }
                    </dd>
                  </div>
                )}
              </dl>
            </Card>

            <Card
              as="article"
              variant="soft"
              padding="lg"
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
                  Coverage
                </Badge>

                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
                  Where is{" "}
                  {
                    timezone.abbreviation
                  }{" "}
                  used?
                </h2>

                <p className="mt-4 leading-7 text-text-secondary">
                  This definition is
                  associated with the
                  following countries
                  or regions:
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {timezone.regions.map(
                    (
                      region,
                    ) => (
                      <Badge
                        key={
                          region
                        }
                        variant="primary"
                        size="md"
                      >
                        {
                          region
                        }
                      </Badge>
                    ),
                  )}
                </div>

                <Card
                  variant="default"
                  padding="md"
                  className="mt-8"
                >
                  <p className="font-semibold text-text-primary">
                    Daylight-saving
                    behavior
                  </p>

                  <p className="mt-2 leading-7 text-text-secondary">
                    {timezone.observesDst
                      ? `${timezone.name} follows seasonal clock rules. Its active offset is calculated for the selected date.`
                      : `${timezone.name} is represented as a fixed offset and does not automatically change for daylight-saving time.`}
                  </p>
                </Card>
              </div>
            </Card>
          </section>

          <TimezoneSection
            badge="Converters"
            badgeVariant="info"
            title={`Popular ${timezone.abbreviation} conversions`}
            description={`Convert ${timezone.abbreviation} to other popular time-zone definitions and fixed offsets.`}
            className="mt-8"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedTimezones.map(
                (
                  targetTimezone,
                ) => (
                  <TimezoneLinkCard
                    key={
                      targetTimezone.slug
                    }
                    href={`/timezone/${timezone.slug}-to-${targetTimezone.slug}`}
                    title={`${timezone.abbreviation} to ${targetTimezone.abbreviation}`}
                    description={
                      targetTimezone.name
                    }
                  />
                ),
              )}
            </div>
          </TimezoneSection>

          <FaqSection
            title={`${timezone.abbreviation} time FAQ`}
            description={`Common questions about ${timezone.name}, its UTC offset, regions and daylight-saving behavior.`}
            items={
              faqs
            }
          />
        </div>
      </main>
    </>
  );
}

function TimezonePairPage({
  fromTimezone,
  toTimezone,
}: TimezonePairPageProps) {
  const referenceDate =
    new Date();

  const initialDateTime =
    getInitialDateTime(
      fromTimezone,
      referenceDate,
    );

  const reverseUrl =
    `/timezone/${toTimezone.slug}-to-${fromTimezone.slug}`;

  const faqs =
    createTimezoneConverterFaqs({
      referenceDate,
      fromTimezone,
      toTimezone,
    });

  const pairJsonLd =
    createTimezoneConverterJsonLd({
      fromSlug:
        fromTimezone.slug,

      fromAbbreviation:
        fromTimezone.abbreviation,

      fromName:
        fromTimezone.name,

      fromDescription:
        fromTimezone.description,

      toSlug:
        toTimezone.slug,

      toAbbreviation:
        toTimezone.abbreviation,

      toName:
        toTimezone.name,

      toDescription:
        toTimezone.description,
    });

  const jsonLd = [
    ...pairJsonLd,
    createFaqJsonLd(
      faqs,
    ),
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
        <TimezonePairHero
          fromTimezone={
            fromTimezone
          }
          toTimezone={
            toTimezone
          }
        />

        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
          <TimezoneConverter
            initialFromTimezone={
              fromTimezone
            }
            initialToTimezone={
              toTimezone
            }
            initialDateTime={
              initialDateTime
            }
          />

          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <Card
              as="article"
              variant="default"
              padding="lg"
            >
              <Badge
                variant="neutral"
                size="sm"
              >
                Source time zone
              </Badge>

              <h2 className="mt-4 text-xl font-semibold text-text-primary">
                About{" "}
                {
                  fromTimezone.abbreviation
                }
              </h2>

              <p className="mt-4 leading-7 text-text-secondary">
                {
                  fromTimezone.description
                }
              </p>

              <dl className="mt-6 space-y-3">
                <div className="rounded-xl border border-border bg-surface-soft p-4">
                  <dt className="text-sm text-text-muted">
                    Full name
                  </dt>

                  <dd className="mt-1 font-medium text-text-primary">
                    {
                      fromTimezone.name
                    }
                  </dd>
                </div>

                <div className="rounded-xl border border-border bg-surface-soft p-4">
                  <dt className="text-sm text-text-muted">
                    Type
                  </dt>

                  <dd className="mt-1 font-medium text-text-primary">
                    {fromTimezone.kind ===
                    "fixed"
                      ? "Fixed UTC offset"
                      : "Seasonal IANA time zone"}
                  </dd>
                </div>

                <div className="rounded-xl border border-border bg-surface-soft p-4">
                  <dt className="text-sm text-text-muted">
                    Regions
                  </dt>

                  <dd className="mt-1 font-medium text-text-primary">
                    {fromTimezone.regions.join(
                      ", ",
                    )}
                  </dd>
                </div>
              </dl>

              <Button
                as={Link}
                href={`/timezone/${fromTimezone.slug}`}
                variant="secondary"
                className="mt-6"
              >
                View{" "}
                {
                  fromTimezone.abbreviation
                }{" "}
                details
              </Button>
            </Card>

            <Card
              as="article"
              variant="soft"
              padding="lg"
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
                  Target time zone
                </Badge>

                <h2 className="mt-4 text-xl font-semibold text-text-primary">
                  About{" "}
                  {
                    toTimezone.abbreviation
                  }
                </h2>

                <p className="mt-4 leading-7 text-text-secondary">
                  {
                    toTimezone.description
                  }
                </p>

                <dl className="mt-6 space-y-3">
                  <div className="rounded-xl border border-primary-muted bg-surface/70 p-4">
                    <dt className="text-sm text-text-muted">
                      Full name
                    </dt>

                    <dd className="mt-1 font-medium text-text-primary">
                      {
                        toTimezone.name
                      }
                    </dd>
                  </div>

                  <div className="rounded-xl border border-primary-muted bg-surface/70 p-4">
                    <dt className="text-sm text-text-muted">
                      Type
                    </dt>

                    <dd className="mt-1 font-medium text-text-primary">
                      {toTimezone.kind ===
                      "fixed"
                        ? "Fixed UTC offset"
                        : "Seasonal IANA time zone"}
                    </dd>
                  </div>

                  <div className="rounded-xl border border-primary-muted bg-surface/70 p-4">
                    <dt className="text-sm text-text-muted">
                      Regions
                    </dt>

                    <dd className="mt-1 font-medium text-text-primary">
                      {toTimezone.regions.join(
                        ", ",
                      )}
                    </dd>
                  </div>
                </dl>

                <Button
                  as={Link}
                  href={`/timezone/${toTimezone.slug}`}
                  variant="primary"
                  className="mt-6"
                >
                  View{" "}
                  {
                    toTimezone.abbreviation
                  }{" "}
                  details
                </Button>
              </div>
            </Card>
          </section>

          <Card
            as="section"
            variant="soft"
            padding="md"
            className="mt-8 sm:flex sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Reverse this
                conversion
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                Convert{" "}
                {
                  toTimezone.abbreviation
                }{" "}
                back to{" "}
                {
                  fromTimezone.abbreviation
                }
                .
              </p>
            </div>

            <Button
              as={Link}
              href={
                reverseUrl
              }
              variant="secondary"
              className="mt-5 sm:mt-0"
            >
              {
                toTimezone.abbreviation
              }{" "}
              to{" "}
              {
                fromTimezone.abbreviation
              }
            </Button>
          </Card>

          <FaqSection
            title={`${fromTimezone.abbreviation} to ${toTimezone.abbreviation} time FAQ`}
            description={`Common questions about converting ${fromTimezone.name} to ${toTimezone.name}, their UTC offsets and daylight-saving behavior.`}
            items={
              faqs
            }
          />
        </div>
      </main>
    </>
  );
}