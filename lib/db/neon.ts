import "server-only";

import { neon } from "@neondatabase/serverless";

export async function getNeon() {
  let connectionString = process.env.DATABASE_URL;

  try {
    const { getCloudflareContext } = await import(
      "@opennextjs/cloudflare"
    );

    const { env } = getCloudflareContext();

    if (env.DATABASE_URL) {
      connectionString = env.DATABASE_URL;
    }
  } catch {
    // Environnement Node.js local.
  }

  if (!connectionString) {
    throw new Error(
      "[TimeInOne] DATABASE_URL is missing."
    );
  }

  return neon(connectionString);
}