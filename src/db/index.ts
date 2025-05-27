import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// import * as schema from "./schema";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/postgres";

const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "./schema";

// const connectionString =
//   process.env.DATABASE_URL ||
//   "postgres://postgres:postgres@localhost:5432/postgres";

// // ✅ Fix: Add SSL for Supabase
// const client = postgres(connectionString, {
//   ssl: { rejectUnauthorized: false },
// });

// export const db = drizzle(client, { schema });
