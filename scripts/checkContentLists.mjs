import fs from "fs";
import { createClient } from "@supabase/supabase-js";

function loadDotEnv(path = ".env") {
  try {
    fs.readFileSync(path, "utf8")
      .split(/\r?\n/)
      .forEach((line) => {
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

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

const tables = [
  { name: "projects", label: (row) => `${row.name || row.project_name || row.title || "(no name)"} | tech: ${row.technology || (row.tech_stack || []).join(", ")}` },
  { name: "certifications", label: (row) => `${row.course_name || row.name || "(no name)"} | code: ${row.code ?? "—"}` },
  { name: "blog_posts", label: (row) => `${row.title} | published: ${row.published}` },
];

for (const { name, label } of tables) {
  const { data, error, count } = await supabase.from(name).select("*", { count: "exact" }).order("created_at", { ascending: true });
  console.log(`\n=== ${name} ===`);
  if (error) {
    console.log("ERROR:", error.message);
    continue;
  }
  console.log("Count:", count);
  for (const row of data ?? []) {
    console.log("-", label(row));
  }
}
