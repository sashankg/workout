import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./src/drizzle",
  schema: "./src/schema/schema.ts",
  dialect: "sqlite",
});
