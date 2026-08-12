import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "[TimeInOne] DATABASE_URL is missing. Configure DATABASE_URL before starting the application.",
    );
  }

  const adapter = new PrismaPg({
    connectionString,
    max: 2,
    connectionTimeoutMillis: 15_000,
    idleTimeoutMillis: 10_000,
  });

  return new PrismaClient({
    adapter,
  });
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Compatibility helper.
 *
 * Existing repositories can continue using:
 *
 * const prisma = await getPrismaAsync();
 *
 * This avoids having to modify all repositories immediately.
 */
export async function getPrismaAsync(): Promise<PrismaClient> {
  return prisma;
}

/**
 * Compatibility helper for code that previously
 * used the synchronous Cloudflare helper.
 */
export function getPrisma(): PrismaClient {
  return prisma;
}

export default prisma;