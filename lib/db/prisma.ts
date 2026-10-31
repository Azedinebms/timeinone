
import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

// Réutiliser le client Prisma entre les requêtes.
const globalForPrisma = globalThis as unknown as {
  timeinonePrisma?: PrismaClient;
  timeinonePrismaUrl?: string;
};

function resolveConnectionString(): string {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "[TimeInOne] DATABASE_URL is missing."
    );
  }

  return url;
}

export async function getPrismaAsync(): Promise<PrismaClient> {
  const connectionString = resolveConnectionString();

  if (
    globalForPrisma.timeinonePrisma &&
    globalForPrisma.timeinonePrismaUrl === connectionString
  ) {
    return globalForPrisma.timeinonePrisma;
  }

  const adapter = new PrismaPg({
    connectionString,
    max: 2,
    connectionTimeoutMillis: 15_000,
    idleTimeoutMillis: 10_000,
  });

  const client = new PrismaClient({ adapter });

  globalForPrisma.timeinonePrisma = client;
  globalForPrisma.timeinonePrismaUrl = connectionString;

  return client;
}
