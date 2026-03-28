import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();
if (process.env.DATABASE_URL == undefined) {
  throw new Error("DATABASE_URL not found");
}

const sql = neon(process.env.DATABASE_URL);
export { sql };
