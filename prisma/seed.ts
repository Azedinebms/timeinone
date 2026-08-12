import "dotenv/config";

import {
  PrismaPg,
} from "@prisma/adapter-pg";

import {
  PrismaClient,
} from "@prisma/client";

type SeedCountryRecord = {
  id: number;
  iso2: string;
};

type SeedTimezoneRecord = {
  id: number;
  name: string;
};

const connectionString =
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is missing.",
  );
}

const adapter =
  new PrismaPg({
    connectionString,
  });

const prisma =
  new PrismaClient({
    adapter,
  });

async function main() {
  const countries = [
    {
      name: "Morocco",
      iso2: "MA",
      iso3: "MAR",
    },
    {
      name: "United States",
      iso2: "US",
      iso3: "USA",
    },
    {
      name: "United Kingdom",
      iso2: "GB",
      iso3: "GBR",
    },
    {
      name: "France",
      iso2: "FR",
      iso3: "FRA",
    },
    {
      name: "Japan",
      iso2: "JP",
      iso3: "JPN",
    },
    {
      name: "Australia",
      iso2: "AU",
      iso3: "AUS",
    },
  ];

  const timezones = [
    "Africa/Casablanca",
    "America/New_York",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];

  for (
    const country
    of countries
  ) {
    await prisma.country.upsert({
      where: {
        iso2:
          country.iso2,
      },

      update:
        country,

      create:
        country,
    });
  }

  for (
    const timezone
    of timezones
  ) {
    await prisma.timezone.upsert({
      where: {
        name:
          timezone,
      },

      update: {},

      create: {
        name:
          timezone,
      },
    });
  }

  const countryRecords =
  await prisma.country.findMany({
    select: {
      id: true,
      iso2: true,
    },
  });

const timezoneRecords =
  await prisma.timezone.findMany({
    select: {
      id: true,
      name: true,
    },
  });

const countryByIso2 =
  new Map<
    string,
    SeedCountryRecord
  >(
    countryRecords.map(
      (
        country:
          SeedCountryRecord,
      ) => [
        country.iso2,
        country,
      ],
    ),
  );

const timezoneByName =
  new Map<
    string,
    SeedTimezoneRecord
  >(
    timezoneRecords.map(
      (
        timezone:
          SeedTimezoneRecord,
      ) => [
        timezone.name,
        timezone,
      ],
    ),
  );

  const cities = [
    {
      geonameId:
        2553604,

      name:
        "Casablanca",

      asciiName:
        "Casablanca",

      slug:
        "casablanca",

      latitude:
        33.57311,

      longitude:
        -7.589843,

      population:
        3359818,

      countryIso2:
        "MA",

      timezoneName:
        "Africa/Casablanca",
    },

    {
      geonameId:
        5128581,

      name:
        "New York",

      asciiName:
        "New York",

      slug:
        "new-york",

      latitude:
        40.712776,

      longitude:
        -74.005974,

      population:
        8804190,

      countryIso2:
        "US",

      timezoneName:
        "America/New_York",
    },

    {
      geonameId:
        2643743,

      name:
        "London",

      asciiName:
        "London",

      slug:
        "london",

      latitude:
        51.507351,

      longitude:
        -0.127758,

      population:
        8799728,

      countryIso2:
        "GB",

      timezoneName:
        "Europe/London",
    },

    {
      geonameId:
        2988507,

      name:
        "Paris",

      asciiName:
        "Paris",

      slug:
        "paris",

      latitude:
        48.856613,

      longitude:
        2.352222,

      population:
        2102650,

      countryIso2:
        "FR",

      timezoneName:
        "Europe/Paris",
    },

    {
      geonameId:
        1850147,

      name:
        "Tokyo",

      asciiName:
        "Tokyo",

      slug:
        "tokyo",

      latitude:
        35.676191,

      longitude:
        139.650311,

      population:
        14094034,

      countryIso2:
        "JP",

      timezoneName:
        "Asia/Tokyo",
    },

    {
      geonameId:
        2147714,

      name:
        "Sydney",

      asciiName:
        "Sydney",

      slug:
        "sydney",

      latitude:
        -33.86882,

      longitude:
        151.20929,

      population:
        5297089,

      countryIso2:
        "AU",

      timezoneName:
        "Australia/Sydney",
    },
  ];

  for (
    const city
    of cities
  ) {
    const country =
      countryByIso2.get(
        city.countryIso2,
      );

    const timezone =
      timezoneByName.get(
        city.timezoneName,
      );

    if (
      !country ||
      !timezone
    ) {
      throw new Error(
        `Missing relation data for ${city.name}.`,
      );
    }

    await prisma.city.upsert({
      where: {
        geonameId:
          city.geonameId,
      },

      update: {
        name:
          city.name,

        asciiName:
          city.asciiName,

        slug:
          city.slug,

        latitude:
          city.latitude,

        longitude:
          city.longitude,

        population:
          city.population,

        countryId:
          country.id,

        timezoneId:
          timezone.id,
      },

      create: {
        geonameId:
          city.geonameId,

        name:
          city.name,

        asciiName:
          city.asciiName,

        slug:
          city.slug,

        latitude:
          city.latitude,

        longitude:
          city.longitude,

        population:
          city.population,

        countryId:
          country.id,

        timezoneId:
          timezone.id,
      },
    });
  }

  console.log(
    "Atlas seed completed successfully.",
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(
      error,
    );

    await prisma.$disconnect();

    process.exit(
      1,
    );
  });