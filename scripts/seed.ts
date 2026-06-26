import "dotenv/config";
import { readFileSync } from "node:fs";
import { createServerClient } from "../src/lib/supabase/server";

async function main() {
  const sql = readFileSync("supabase/seed.sql", "utf8");
  const supabase = createServerClient();
  const { error } = await supabase.rpc("exec_sql", { sql });
  if (error) throw error;
  console.log("seed สำเร็จ");
}

main();
