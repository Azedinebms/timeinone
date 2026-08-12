import "server-only";

import {
  PrismaPg,
} from "@prisma/adapter-pg";

import {
  PrismaClient,
} from "@prisma/client";

const globalForPrisma =
  globalThis as unknown as {
    prisma?: PrismaClient;
  };

function createPrisma(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not defined.",
    );
  }

  const adapter =
    new PrismaPg({
      connectionString,
    });

  return new PrismaClient({
    adapter,
  });
}

export const getPrisma =
  (): PrismaClient => {
    if (
      globalForPrisma.prisma
    ) {
      return globalForPrisma.prisma;
    }

    const prisma =
      createPrisma();

    if (
      process.env.NODE_ENV !==
      "production"
    ) {
      globalForPrisma.prisma =
        prisma;
    }

    return prisma;
  };

export const getPrismaAsync =
  async (): Promise<
    PrismaClient
  > => {
    return getPrisma();
  };