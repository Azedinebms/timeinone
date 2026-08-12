import Link from "next/link";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import type {
  CityOption,
} from "@/types/city";

type AboutCitiesProps = {
  fromCity:
    CityOption;

  toCity:
    CityOption;
};

function formatPopulation(
  population:
    number | null,
) {
  if (
    !population
  ) {
    return "Not available";
  }

  return population.toLocaleString(
    "en-US",
  );
}

function formatCoordinate(
  value:
    number | null,

  positiveDirection:
    string,

  negativeDirection:
    string,
) {
  if (
    value ===
    null
  ) {
    return "Not available";
  }

  const direction =
    value >= 0
      ? positiveDirection
      : negativeDirection;

  return `${Math.abs(
    value,
  ).toFixed(
    4,
  )}° ${direction}`;
}

function getCurrentTimeUrl(
  city:
    CityOption,
) {
  return `/current-time/${city.countryCode.toLowerCase()}/${city.slug}`;
}

function CityCard({
  city,
  accent = false,
}: {
  city:
    CityOption;

  accent?:
    boolean;
}) {
  const currentTimeUrl =
    getCurrentTimeUrl(
      city,
    );

  return (
    <Card
      as="article"
      variant={
        accent
          ? "soft"
          : "default"
      }
      padding="none"
      className={[
        "overflow-hidden",

        accent
          ? "border-primary-muted bg-primary-soft"
          : "",
      ]
        .filter(
          Boolean,
        )
        .join(
          " ",
        )}
    >
      <div className="border-b border-border p-6">
        <Badge
          variant={
            accent
              ? "primary"
              : "neutral"
          }
          size="sm"
        >
          City information
        </Badge>

        <h3 className="mt-4 text-2xl font-bold text-text-primary">
          {
            city.city
          }
        </h3>

        <p className="mt-1 text-sm text-text-secondary">
          {
            city.country
          }
        </p>
      </div>

      <dl className="grid gap-px bg-border sm:grid-cols-2">
        <div className="bg-surface p-5">
          <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Country
          </dt>

          <dd className="mt-2 font-medium text-text-primary">
            {
              city.country
            }
          </dd>

          <dd className="mt-1 text-sm text-text-muted">
            {
              city.countryCode
            }
          </dd>
        </div>

        <div className="bg-surface p-5">
          <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Population
          </dt>

          <dd className="mt-2 font-medium text-text-primary">
            {formatPopulation(
              city.population,
            )}
          </dd>
        </div>

        <div className="bg-surface p-5">
          <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Time zone
          </dt>

          <dd className="mt-2 break-all font-medium text-text-primary">
            {
              city.timezone
            }
          </dd>
        </div>

        <div className="bg-surface p-5">
          <dt className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Coordinates
          </dt>

          <dd className="mt-2 font-medium text-text-primary">
            {formatCoordinate(
              city.latitude,
              "N",
              "S",
            )}
          </dd>

          <dd className="mt-1 text-sm text-text-secondary">
            {formatCoordinate(
              city.longitude,
              "E",
              "W",
            )}
          </dd>
        </div>
      </dl>

      <div className="p-5">
        <Button
          as={Link}
          href={
            currentTimeUrl
          }
          variant={
            accent
              ? "primary"
              : "secondary"
          }
          className="w-full"
        >
          Current time in{" "}
          {
            city.city
          }
        </Button>
      </div>
    </Card>
  );
}

export default function AboutCities({
  fromCity,
  toCity,
}: AboutCitiesProps) {
  const reverseConverterUrl =
    `/converter/${toCity.slug}-to-${fromCity.slug}`;

  return (
    <Card
      as="section"
      variant="default"
      padding="lg"
      className="mt-8"
    >
      <div>
        <Badge
          variant="accent"
          size="sm"
        >
          Locations
        </Badge>

        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
          About{" "}
          {
            fromCity.city
          }{" "}
          and{" "}
          {
            toCity.city
          }
        </h2>

        <p className="mt-2 max-w-3xl leading-7 text-text-secondary">
          Compare location details,
          time zones, populations and
          coordinates for both cities.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <CityCard
          city={
            fromCity
          }
        />

        <CityCard
          city={
            toCity
          }
          accent
        />
      </div>

      <Card
        variant="soft"
        padding="md"
        className="mt-5 sm:flex sm:items-center sm:justify-between"
      >
        <div>
          <p className="font-semibold text-text-primary">
            Need the reverse
            conversion?
          </p>

          <p className="mt-1 text-sm text-text-secondary">
            Convert{" "}
            {
              toCity.city
            }{" "}
            time back to{" "}
            {
              fromCity.city
            }.
          </p>
        </div>

        <Button
          as={Link}
          href={
            reverseConverterUrl
          }
          variant="secondary"
          className="mt-4 sm:mt-0"
        >
          {
            toCity.city
          }{" "}
          to{" "}
          {
            fromCity.city
          }
        </Button>
      </Card>
    </Card>
  );
}