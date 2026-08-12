import {
  cityRepository,
} from "@/lib/repositories/cityRepository";

async function main():
  Promise<void> {
  console.log(
    "\nTimeInOne City Repository Audit\n",
  );

  const paris =
    await cityRepository
      .getCityBySlug(
        "paris",
      );

  console.log(
    "City repository — Paris:",
  );

  console.dir(
    paris,
    {
      depth: null,
    },
  );

  const popularCities =
    await cityRepository
      .getPopularCities(
        10,
      );

  console.log(
    "\nTop 10 cities:",
  );

  console.table(
    popularCities.map(
      (city) => ({
        id:
          city.id,

        city:
          city.name,

        country:
          city.country.iso2,

        slug:
          city.slug,

        timezone:
          city.timezone.name,

        population:
          city.population,
      }),
    ),
  );

  const searchResults =
    await cityRepository
      .searchCities(
        "casablanca",
        5,
      );

  console.log(
    "\nSearch — Casablanca:",
  );

  console.table(
    searchResults.map(
      (city) => ({
        city:
          city.name,

        country:
          city.country.name,

        slug:
          city.slug,

        timezone:
          city.timezone.name,
      }),
    ),
  );

  if (!paris) {
    throw new Error(
      "Paris could not be resolved.",
    );
  }

  if (
    popularCities.length === 0
  ) {
    throw new Error(
      "No popular cities were returned.",
    );
  }

  console.log(
    "\n✅ City repository audit passed.\n",
  );
}

main()
  .catch(
    (error: unknown) => {
      console.error(
        "\n❌ City repository audit failed:",
      );

      console.error(
        error,
      );

      process.exitCode = 1;
    },
  )
  .finally(
    async () => {
      const {
        prisma,
      } = await import(
        "./_prisma"
      );

      await prisma.$disconnect();
    },
  );