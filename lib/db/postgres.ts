import "server-only";

import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
  timeinonePgPool?: Pool;
};

export function getPostgres(): Pool {
  if (globalForPg.timeinonePgPool) {
    return globalForPg.timeinonePgPool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("[TimeInOne] DATABASE_URL is missing.");
  }

  const pool = new Pool({
    connectionString,
    max: 5,
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 10000,
  });

  globalForPg.timeinonePgPool = pool;

  return pool;
}