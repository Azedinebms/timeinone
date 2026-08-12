import {
  searchAtlasCities,
} from "@/features/city-search/services/citySearchService";

const TEST_QUERIES = [
  "Paris",
  "Sao Paulo",
  "France",
  "FR",
  "Europe/Paris",
  "Casablanca",
] as const;

async function main():
  Promise<void> {
  console.log(
    "\nTimeInOne City Search Audit\n",
  );

  for (
    const query
    of TEST_QUERIES
  ) {
    const results =
      await searchAtlasCities(
        query,
        5,
      );

    console.log(
      `\nSearch: "${query}"`,
    );

    console.table(
      results.map(
        (city) => ({
          city:
            city.name,

          country:
            city.country.name,

          code:
            city.country.iso2,

          timezone:
            city.timezone.name,

          population:
            city.population,

          path:
            city.worldClockPath,
        }),
      ),
    );

    const uniquePaths =
      new Set(
        results.map(
          (city) =>
            city.worldClockPath,
        ),
      );

    if (
      uniquePaths.size !==
      results.length
    ) {
      throw new Error(
        `Duplicate paths detected for "${query}".`,
      );
    }
  }

  console.log(
    "\n✅ TimeInOne City Search audit passed.\n",
  );
}

main()
  .catch(
    (error: unknown) => {
      console.error(
        "\n❌ TimeInOne City Search audit failed:",
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