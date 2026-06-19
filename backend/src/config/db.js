import pg from "pg";
import { getEnv } from "./env.js";

const { Pool } = pg;

const databaseUrl = getEnv("DATABASE_URL");
const isLocalDatabase =
  databaseUrl?.includes("localhost") || databaseUrl?.includes("127.0.0.1");

const poolConfig = databaseUrl
  ? {
      connectionString: databaseUrl,
      ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
    }
  : {
      user: getEnv("PGUSER", "db_user"),
      host: getEnv("PGHOST", "db_host") || "localhost",
      database: getEnv("PGDATABASE", "db_database"),
      password: getEnv("PGPASSWORD", "db_password"),
      port: Number(getEnv("PGPORT", "db_port") || 5432),
    };

const pool = new Pool(poolConfig);

export default pool;
