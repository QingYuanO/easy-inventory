import { type Config } from "drizzle-kit";

import { env } from "@/env";

console.log(env.DATABASE_URL);

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["sgl_*"],
} satisfies Config;
