import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, "..", "supabase", "migrations", "20260526120000_fix_schema_drop_success_events.sql");

console.log("Apply this migration in Supabase Dashboard → SQL Editor:\n");
console.log(sqlPath);
console.log("\nOr after `supabase login`:\n  supabase link --project-ref wlijvyqypltvkjcnydtz\n  supabase db push");
console.log("\nThen verify:\n  node scripts/checkDatabase.mjs");
