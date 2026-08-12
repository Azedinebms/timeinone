import {
  worldClockSitemapRepository,
} from "@/lib/repositories/worldClockSitemapRepository";

import {
  countryRepository,
} from "@/lib/repositories/countryRepository";

import {
  SITE_URL,
} from "@/lib/seo";

const SITEMAP_PAGE_SIZE =
  50_000;

function createCityUrl(
  slug: string,
  countryCode: string,
): string {
  return (
    `${SITE_URL}/world-clock/` +
    `${slug.trim().toLowerCase()}-` +
    `${countryCode.trim().toLowerCase()}`
  );
}

async function main():
  Promise<void> {
  console.log(
    "\nTimeInOne World Clock Sitemap Audit\n",
  );

  const cityCount =
    await worldClockSitemapRepository
      .countCities();

  const sitemapCount =
    Math.max(
      1,
      Math.ceil(
        cityCount /
          SITEMAP_PAGE_SIZE,
      ),
    );

  console.log(
    "Eligible cities:",
    cityCount,
  );

  console.log(
    "Sitemap page size:",
    SITEMAP_PAGE_SIZE,
  );

  console.log(
    "Generated sitemaps:",
    sitemapCount,
  );

  const cityRecords =
    await worldClockSitemapRepository
      .getCities(
        0,
        SITEMAP_PAGE_SIZE,
      );

  const countries =
    await countryRepository
      .getAllCountriesWithCityCounts();

  const urls = [
    `${SITE_URL}/world-clock`,

    `${SITE_URL}/world-clock/countries`,

    ...countries.map(
      (country) =>
        `${SITE_URL}/world-clock/countries/${country.iso2.toLowerCase()}`,
    ),

    ...cityRecords.map(
      (city) =>
        createCityUrl(
          city.slug,
          city.country.iso2,
        ),
    ),
  ];

  console.log(
    "First sitemap entries:",
    urls.length,
  );

  console.log(
    "\nFirst 10 URLs:\n",
  );

  console.table(
    urls
      .slice(
        0,
        10,
      )
      .map(
        (url) => ({
          url,
        }),
      ),
  );

  const uniqueUrls =
    new Set(
      urls,
    );

  const duplicateCount =
    urls.length -
    uniqueUrls.size;

  console.log(
    "\nDuplicate URLs:",
    duplicateCount,
  );

  if (
    duplicateCount > 0
  ) {
    throw new Error(
      "Duplicate sitemap URLs detected.",
    );
  }

  const invalidUrls =
    urls.filter(
      (url) =>
        !url.startsWith(
          `${SITE_URL}/`,
        ),
    );

  if (
    invalidUrls.length > 0
  ) {
    console.table(
      invalidUrls,
    );

    throw new Error(
      "Invalid sitemap URLs detected.",
    );
  }

  console.log(
    "\n✅ World Clock sitemap audit passed.\n",
  );
}

main()
  .catch(
    (error: unknown) => {
      console.error(
        "\n❌ Sitemap audit failed:",
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