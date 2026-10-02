import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "@/db/schema/index";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("No DATABASE_URL found in env file!");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle({ client: sql, schema: schema });
