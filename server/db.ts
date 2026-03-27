// TODO(human): Set up the Neon database connection
//
// This file should:
// - [ ] Import the `neon` function from "@neondatabase/serverless"
// - [ ] Read DATABASE_URL from process.env
// - [ ] Create and export a `sql` function by calling neon() with the DATABASE_URL
//
// Hint: neon(connectionString) returns a function you can use as a tagged template
// Example: const sql = neon(databaseUrl);
//          const rows = await sql`SELECT * FROM my_table`;
//

import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();
if (process.env.DATABASE_URL == undefined) {
  throw new Error("DATABASE_URL not found");
}

const sql = neon(process.env.DATABASE_URL);
export { sql };
