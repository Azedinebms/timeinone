import "server-only";

import {
    unstable_cache,
} from "next/cache";

import {
    worldClockSitemapRepository,
} from "@/lib/repositories/worldClockSitemapRepository";

import {
    SITE_URL,
} from "@/lib/seo";

/* =========================================================
   CONFIG
========================================================= */

export const CURRENT_TIME_SITEMAP_PAGE_SIZE =
    50_000;

const SITEMAP_COUNT_CACHE_SECONDS =
    60 * 60 * 24;

export const CURRENT_TIME_SITEMAP_CACHE_TAGS = {
    sitemaps:
        "atlas:current-time:sitemaps",

    sitemapCount:
        "atlas:current-time:sitemap-count",

    sitemapEntries:
        "atlas:current-time:sitemap-entries",
} as const;

/* =========================================================
   TYPES
========================================================= */

export type CurrentTimeSitemapEntry = {
    url: string;

    lastModified:
    Date;

    changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";

    priority:
    number;
};

/* =========================================================
   HELPERS
========================================================= */

function normalizeCountryCode(
    countryCode:
        string,
): string {
    return countryCode
        .trim()
        .toLowerCase();
}

function normalizeCitySlug(
    slug:
        string,
): string {
    return slug
        .trim()
        .toLowerCase();
}

function normalizeSitemapId(
    sitemapId:
        number,
): number {
    if (
        !Number.isInteger(
            sitemapId,
        ) ||
        sitemapId < 0
    ) {
        return 0;
    }

    return sitemapId;
}

function createCurrentTimePath(
    slug:
        string,

    countryCode:
        string,
): string {
    return (
        `/current-time/` +
        `${normalizeCountryCode(
            countryCode,
        )}/` +
        `${normalizeCitySlug(
            slug,
        )}`
    );
}

/* =========================================================
   COUNT
========================================================= */

async function loadCurrentTimeSitemapCount():
    Promise<number> {
    const cityCount =
        await worldClockSitemapRepository
            .countCities();

    return Math.max(
        1,
        Math.ceil(
            cityCount /
            CURRENT_TIME_SITEMAP_PAGE_SIZE,
        ),
    );
}

const getCachedCurrentTimeSitemapCount =
    unstable_cache(
        loadCurrentTimeSitemapCount,

        [
            "atlas",
            "current-time",
            "sitemap-count",
        ],

        {
            revalidate:
                SITEMAP_COUNT_CACHE_SECONDS,

            tags: [
                CURRENT_TIME_SITEMAP_CACHE_TAGS
                    .sitemaps,

                CURRENT_TIME_SITEMAP_CACHE_TAGS
                    .sitemapCount,
            ],
        },
    );

export async function getCurrentTimeSitemapCount():
    Promise<number> {
    return getCachedCurrentTimeSitemapCount();
}

/* =========================================================
   ENTRIES
========================================================= */

async function loadCurrentTimeSitemapEntries(
    sitemapId:
        number,
): Promise<
    CurrentTimeSitemapEntry[]
> {
    const records =
        await worldClockSitemapRepository
            .getCities(
                sitemapId,
                CURRENT_TIME_SITEMAP_PAGE_SIZE,
            );

    return records.map(
        (
            city,
        ) => ({
            url:
                `${SITE_URL}${createCurrentTimePath(
                    city.slug,
                    city.country.iso2,
                )}`,

            lastModified:
                city.updatedAt,

            changeFrequency:
                "daily",

            priority:
                0.8,
        }),
    );
}



export async function getCurrentTimeSitemapEntries(
    sitemapId:
        number,
): Promise<
    CurrentTimeSitemapEntry[]
> {
    const normalizedSitemapId =
        normalizeSitemapId(
            sitemapId,
        );

    return loadCurrentTimeSitemapEntries(
        normalizedSitemapId,
    );
}

/* =========================================================
   SERVICE
========================================================= */

export const currentTimeSitemapService = {
    getSitemapCount:
        getCurrentTimeSitemapCount,

    getEntries:
        getCurrentTimeSitemapEntries,
};

export default currentTimeSitemapService;