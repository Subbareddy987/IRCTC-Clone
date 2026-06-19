import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "../src/config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");

const readSql = (fileName) =>
  fs.readFile(path.join(projectRoot, "database", fileName), "utf8");

try {
  const schemaSql = await readSql("schema.sql");
  const sampleDataSql = await readSql("sample_data.sql");

  await pool.query(schemaSql);
  await pool.query(sampleDataSql);

  console.log("Database setup completed successfully.");
} catch (error) {
  console.error("Database setup failed:");
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
