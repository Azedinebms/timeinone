import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

// Do not initialize a database connection at module import time: Next.js
// imports server modules during compilation and static rendering as well.
const globalForPrisma = globalThis as unknown as {
  timeinonePrisma?: PrismaClient;
  timeinonePrismaUrl?: string;
};

async function resolveConnectionString(): Promise<string> {
  // In a Cloudflare request, use Hyperdrive's connection string.
  // OpenNext supplies the request context; outside Workers (local builds,
  // scripts, Railway) fall back to DATABASE_URL.
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    if (env.HYPERDRIVE?.connectionString) {
      return env.HYPERDRIVE.connectionString;
    }
  } catch {
    // No Cloudflare request context (e.g. local Next.js build).
  }
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("[TimeInOne] DATABASE_URL or HYPERDRIVE binding is missing.");
  return url;
}

export async function getPrismaAsync(): Promise<PrismaClient> {
  const connectionString = await resolveConnectionString();
  if (globalForPrisma.timeinonePrisma && globalForPrisma.timeinonePrismaUrl === connectionString) {
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

// Existing application repositories use getPrismaAsync().
// Avoid exporting an eagerly initialized client.
