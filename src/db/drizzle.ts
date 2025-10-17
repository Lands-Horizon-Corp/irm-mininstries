import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import { neon } from "@neondatabase/serverless";

// Load environment variables from .env.local
config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
