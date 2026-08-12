import "dotenv/config";

import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  PrismaClient,
} from "@prisma/client";

const COUNTRY_FILE_PATH = resolve(
  process.cwd(),
  "data/geonames/countryInfo.txt",
);

const CITY_FILE_PATH = resolve(
  process.cwd(),
  "data/geonames/cities15000.txt",
);

const CITY_BATCH_SIZE = 250;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

type ParsedCountry = {
  name: string;
  iso2: string;
  iso3: string | null;
};

type ParsedCity = {
  geonameId: number;
  name: string;
  asciiName: string | null;
  latitude: number;
  longitude: number;
  population: number | null;
  countryIso2: string;
  timezoneName: string;
};

type CountryRecord = {
  id: number;
  iso2: string;
};

type TimezoneRecord = {
  id: number;
  name: string;
};

function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePositiveInteger(
  value: string | undefined,
): number | null {
  if (!value) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
}

function parseCoordinate(
  value: string | undefined,
): number | null {
  if (!value) {
    return null;
  }

  const parsedValue = Number.parseFloat(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : null;
}

async function readCountries(): Promise<ParsedCountry[]> {
  const countries: ParsedCountry[] = [];

  const fileStream = createReadStream(
    COUNTRY_FILE_PATH,
    {
      encoding: "utf8",
    },
  );

  const lines = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const columns = line.split("\t");

    const iso2 = columns[0]?.trim().toUpperCase();
    const iso3 = columns[1]?.trim().toUpperCase();
    const name = columns[4]?.trim();

    if (!iso2 || !name) {
      continue;
    }

    countries.push({
      name,
      iso2,
      iso3: iso3 || null,
    });
  }

  return countries;
}

async function readCities(): Promise<ParsedCity[]> {
  const cities: ParsedCity[] = [];

  const fileStream = createReadStream(
    CITY_FILE_PATH,
    {
      encoding: "utf8",
    },
  );

  const lines = createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    const columns = line.split("\t");

    /*
     * GeoNames main format:
     *
     * 0  geonameid
     * 1  name
     * 2  asciiname
     * 3  alternatenames
     * 4  latitude
     * 5  longitude
     * 6  feature class
     * 7  feature code
     * 8  country code
     * 9  cc2
     * 10 admin1
     * 11 admin2
     * 12 admin3
     * 13 admin4
     * 14 population
     * 15 elevation
     * 16 dem
     * 17 timezone
     * 18 modification date
     */

    const geonameId = Number.parseInt(
      columns[0] ?? "",
      10,
    );

    const name = columns[1]?.trim();
    const asciiName = columns[2]?.trim();
    const latitude = parseCoordinate(columns[4]);
    const longitude = parseCoordinate(columns[5]);
    const countryIso2 = columns[8]
      ?.trim()
      .toUpperCase();
    const population = parsePositiveInteger(
      columns[14],
    );
    const timezoneName = columns[17]?.trim();

    if (
      !Number.isInteger(geonameId) ||
      geonameId <= 0 ||
      !name ||
      latitude === null ||
      longitude === null ||
      !countryIso2 ||
      !timezoneName
    ) {
      continue;
    }

    cities.push({
      geonameId,
      name,
      asciiName: asciiName || null,
      latitude,
      longitude,
      population,
      countryIso2,
      timezoneName,
    });
  }

  return cities;
}

async function importCountries(
  countries: ParsedCountry[],
) {
  console.log(
    `Importing ${countries.length} countries...`,
  );

  for (const country of countries) {
    await prisma.country.upsert({
      where: {
        iso2: country.iso2,
      },
      update: {
        name: country.name,
        iso3: country.iso3,
      },
      create: {
        name: country.name,
        iso2: country.iso2,
        iso3: country.iso3,
      },
    });
  }

  console.log("Countries imported.");
}

async function importTimezones(
  cities: ParsedCity[],
) {
  const timezoneNames = Array.from(
    new Set(
      cities.map((city) => city.timezoneName),
    ),
  );

  console.log(
    `Importing ${timezoneNames.length} timezones...`,
  );

  await prisma.timezone.createMany({
    data: timezoneNames.map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });

  console.log("Timezones imported.");
}

async function getCountryMap() {
  const countries =
    (await prisma.country.findMany({
      select: {
        id: true,
        iso2: true,
      },
    })) as CountryRecord[];

  return new Map(
    countries.map((country) => [
      country.iso2,
      country.id,
    ]),
  );
}

async function getTimezoneMap() {
  const timezones =
    (await prisma.timezone.findMany({
      select: {
        id: true,
        name: true,
      },
    })) as TimezoneRecord[];

  return new Map(
    timezones.map((timezone) => [
      timezone.name,
      timezone.id,
    ]),
  );
}

async function importCityBatch(
  cities: ParsedCity[],
  countryMap: Map<string, number>,
  timezoneMap: Map<string, number>,
) {
  const operations = cities.flatMap((city) => {
    const countryId = countryMap.get(
      city.countryIso2,
    );

    const timezoneId = timezoneMap.get(
      city.timezoneName,
    );

    if (!countryId || !timezoneId) {
      console.warn(
        `Skipped ${city.name}: missing country or timezone relation.`,
      );

      return [];
    }

    const slug =
      createSlug(city.asciiName || city.name) ||
      `city-${city.geonameId}`;

    return [
      prisma.city.upsert({
        where: {
          geonameId: city.geonameId,
        },
        update: {
          name: city.name,
          asciiName: city.asciiName,
          slug,
          latitude: city.latitude,
          longitude: city.longitude,
          population: city.population,
          countryId,
          timezoneId,
        },
        create: {
          geonameId: city.geonameId,
          name: city.name,
          asciiName: city.asciiName,
          slug,
          latitude: city.latitude,
          longitude: city.longitude,
          population: city.population,
          countryId,
          timezoneId,
        },
      }),
    ];
  });

  if (operations.length === 0) {
    return 0;
  }

  await prisma.$transaction(operations);

  return operations.length;
}

async function importCities(
  cities: ParsedCity[],
) {
  const countryMap = await getCountryMap();
  const timezoneMap = await getTimezoneMap();

  console.log(
    `Importing ${cities.length} cities...`,
  );

  let importedCount = 0;

  for (
    let index = 0;
    index < cities.length;
    index += CITY_BATCH_SIZE
  ) {
    const batch = cities.slice(
      index,
      index + CITY_BATCH_SIZE,
    );

    importedCount += await importCityBatch(
      batch,
      countryMap,
      timezoneMap,
    );

    const progress = Math.min(
      index + batch.length,
      cities.length,
    );

    const percentage = (
      (progress / cities.length) *
      100
    ).toFixed(1);

    console.log(
      `Cities: ${progress}/${cities.length} (${percentage}%)`,
    );
  }

  console.log(
    `${importedCount} cities imported or updated.`,
  );
}

async function main() {
  const startedAt = Date.now();

  console.log("");
  console.log("TimeInOne GeoNames import started.");
  console.log("--------------------------------");

  const countries = await readCountries();

  console.log(
    `${countries.length} countries parsed.`,
  );

  const cities = await readCities();

  console.log(`${cities.length} cities parsed.`);

  await importCountries(countries);
  await importTimezones(cities);
  await importCities(cities);

  const totalCities = await prisma.city.count();
  const totalCountries =
    await prisma.country.count();
  const totalTimezones =
    await prisma.timezone.count();

  const durationSeconds = (
    (Date.now() - startedAt) /
    1000
  ).toFixed(1);

  console.log("--------------------------------");
  console.log("TimeInOne GeoNames import completed.");
  console.log(`Countries: ${totalCountries}`);
  console.log(`Timezones: ${totalTimezones}`);
  console.log(`Cities: ${totalCities}`);
  console.log(`Duration: ${durationSeconds}s`);
  console.log("");
}

main()
  .catch((error: unknown) => {
    console.error("");
    console.error(
      "TimeInOne GeoNames import failed:",
      error,
    );

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });