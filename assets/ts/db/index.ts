import { type DB } from "~/assets/ts/db/schema";
import { Kysely, PostgresDialect } from "kysely";
import PG from "pg";
const { Pool } = PG;

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const dialect = new PostgresDialect({ pool });
export const db = new Kysely<DB>({
    dialect
});