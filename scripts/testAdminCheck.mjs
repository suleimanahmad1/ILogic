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

const email = process.argv[2] || "suleimanahmed1222@gmail.com";
const password = process.argv[3];

if (!password) {
  console.error("Usage: node scripts/testAdminCheck.mjs email password");
  process.exit(1);
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

const run = async () => {
  const signIn = await supabase.auth.signInWithPassword({ email, password });
  if (signIn.error) {
    console.error("Sign in failed:", signIn.error.message);
    process.exit(1);
  }

  const user = signIn.data.user;
  console.log("Signed in as:", user.email, user.id);

  const rolesSelect = await supabase.from("user_roles").select("role").eq("user_id", user.id);
  console.log("user_roles SELECT:", rolesSelect.error?.message ?? "ok", rolesSelect.data);

  const rpc = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
  console.log("has_role RPC:", rpc.error?.message ?? "ok", rpc.data);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
