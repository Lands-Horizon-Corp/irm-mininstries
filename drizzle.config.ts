import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgres://postgres:qAbxNt2Dq4clny0@irm-ministries-db.flycast:5432",
  },
  verbose: true,
  strict: true,
})
