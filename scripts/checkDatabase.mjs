import fs from "fs";
import { createClient } from "@supabase/supabase-js";

function loadDotEnv(path = ".env") {
  try {
    const raw = fs.readFileSync(path, "utf8");
    raw.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const idx = trimmed.indexOf("=");
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    });
  } catch {
    /* ignore */
  }
}

loadDotEnv();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

const PUBLIC_TABLES = [
  "contact_info",
  "education",
  "skills_categories",
  "skills_items",
  "certifications",
  "projects",
  "success_stories",
  "portfolio_content",
  "skills",
  "contact_messages",
  "page_views",
  "user_roles",
];

async function checkTable(name) {
  const { data, error, count } = await supabase.from(name).select("*", { count: "exact", head: false }).limit(5);
  if (error) {
    return { name, ok: false, count: null, error: error.message, code: error.code, sample: null };
  }
  return { name, ok: true, count: count ?? data?.length ?? 0, error: null, sample: data?.slice(0, 2) ?? [] };
}

async function checkStorage() {
  const buckets = ["website-images", "resumes"];
  const results = [];
  for (const bucket of buckets) {
    const { data, error } = await supabase.storage.from(bucket).list("", { limit: 5 });
    results.push({
      bucket,
      ok: !error,
      error: error?.message ?? null,
      fileCount: data?.length ?? 0,
      sample: data?.slice(0, 3).map((f) => f.name) ?? [],
    });
  }
  return results;
}

async function checkAuth() {
  const { data, error } = await supabase.auth.getSession();
  return { ok: !error, error: error?.message ?? null, session: data.session ? "active" : "none (anon)" };
}

async function run() {
  const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? "unknown";
  console.log("=== Supabase database check (anon key — same as app) ===\n");
  console.log(`Project URL: ${url}`);
  console.log(`Project ref: ${projectRef}`);
  console.log(`Config.toml project_id: wjgdtwrkdgpotmxsukav (may differ if re-linked)\n`);

  const auth = await checkAuth();
  console.log("Auth:", auth.ok ? "OK" : "FAIL", auth.error ?? auth.session);

  console.log("\n--- Tables ---");
  const tableResults = [];
  for (const table of PUBLIC_TABLES) {
    tableResults.push(await checkTable(table));
  }

  for (const r of tableResults) {
    const status = r.ok ? `OK (${r.count} rows)` : `FAIL [${r.code}] ${r.error}`;
    console.log(`  ${r.name.padEnd(20)} ${status}`);
  }

  console.log("\n--- Storage buckets ---");
  const storage = await checkStorage();
  for (const s of storage) {
    const status = s.ok ? `OK (${s.fileCount} objects at root)` : `FAIL: ${s.error}`;
    console.log(`  ${s.bucket.padEnd(20)} ${status}`);
    if (s.sample.length) console.log(`    sample: ${s.sample.join(", ")}`);
  }

  const failures = tableResults.filter((r) => !r.ok);
  const emptyCritical = tableResults.filter(
    (r) => r.ok && r.count === 0 && ["contact_info", "projects", "skills_categories"].includes(r.name),
  );

  console.log("\n--- Summary ---");
  if (failures.length) {
    console.log(`  ${failures.length} table(s) failed (RLS, missing table, or bad key).`);
    failures.forEach((f) => console.log(`    - ${f.name}: ${f.error}`));
  } else {
    console.log("  All tables reachable with anon key.");
  }
  if (emptyCritical.length) {
    console.log("  Empty but used by app:");
    emptyCritical.forEach((e) => console.log(`    - ${e.name}`));
  }

  const okTables = tableResults.filter((r) => r.ok);
  console.log("\n--- Sample row counts (app-facing) ---");
  const appTables = ["projects", "education", "skills_categories", "skills_items", "certifications", "success_stories", "contact_info"];
  for (const name of appTables) {
    const row = okTables.find((r) => r.name === name);
    if (row?.ok) console.log(`  ${name}: ${row.count}`);
  }

  console.log("\n--- Write tests (anon) ---");
  const pv = await supabase.from("page_views").insert({
    path: "/db-health-check",
    referrer: null,
    user_agent: "checkDatabase.mjs",
  });
  console.log(`  page_views INSERT: ${pv.error ? `FAIL — ${pv.error.message}` : "OK"}`);

  const cm = await supabase.from("contact_messages").insert({
    name: "DB Health Check",
    email: "healthcheck@example.com",
    message: "Automated connectivity test — safe to delete",
  });
  console.log(`  contact_messages INSERT: ${cm.error ? `FAIL — ${cm.error.message}` : "OK"}`);

  const pc = await supabase.from("portfolio_content").select("key");
  if (!pc.error && pc.data?.length) {
    console.log(`  portfolio_content keys: ${pc.data.map((r) => r.key).join(", ")}`);
  }

  process.exit(failures.length ? 1 : 0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
