import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

/**
 * Global cache for postgres client to avoid exhausting connections in development HMR.
 */
declare global {
  var __postgresClient: ReturnType<typeof postgres> | undefined;
}

const client =
  globalThis.__postgresClient ||
  postgres(connectionString, {
    prepare: false, // Recommended for Supabase transaction pooler (port 6543)
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__postgresClient = client;
}

export const db = drizzle(client, { schema });
export type Database = typeof db;
