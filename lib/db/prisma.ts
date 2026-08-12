import "server-only";

import {
  PrismaPg,
} from "@prisma/adapter-pg";

import {
  PrismaClient,
} from "@/lib/generated/prisma/client";

const globalForPrisma =
  globalThis as unknown as {
    prisma?: PrismaClient;
  };

function createPrismaClient():
  PrismaClient {
  const connectionString =
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "[TimeInOne] DATABASE_URL is missing.",
    );
  }

  const adapter =
    new PrismaPg({
      connectionString,
      max: 2,
      connectionTimeoutMillis:
        15_000,
      idleTimeoutMillis:
        10_000,
    });

  return new PrismaClient({
    adapter,
  });
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (
  process.env.NODE_ENV !==
  "production"
) {
  globalForPrisma.prisma =
    prisma;
}

export function getPrisma():
  PrismaClient {
  return prisma;
}

export async function getPrismaAsync():
  Promise<PrismaClient> {
  return prisma;
}

export default prisma;