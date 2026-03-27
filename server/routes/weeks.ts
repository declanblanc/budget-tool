// TODO(human): Build the week routes
//
// - [x] Import Router, Request, Response from "express"
// - [x] Import { sql } from "../db"
// - [x] Create and export a router: export const weekRoutes = Router()
// - [ ] GET "/api/weeks/current"
//       Calculate current week ID with getISOWeekId(new Date())
//       Query: SELECT * FROM weeks WHERE id = ${weekId}
//       If no row exists, INSERT a new week with a default budget (e.g. 200)
//       Return the week as JSON
// - [ ] GET "/api/weeks"
//       Query: SELECT * FROM weeks ORDER BY id DESC
//       Return the array as JSON
// - [ ] POST "/api/weeks"
//       Read { id, budget } from req.body
//       Query: INSERT INTO weeks (id, budget) VALUES (${id}, ${budget})
//              ON CONFLICT (id) DO UPDATE SET budget = ${budget}
//       Return the upserted week as JSON
//
// Hint for parameterized queries with neon:
//   const rows = await sql`SELECT * FROM weeks WHERE id = ${weekId}`;
//   rows is an array of objects like [{ id: "2026-W13", budget: "200.00" }]
//   Note: budget comes back as a string from Postgres NUMERIC — parse it with Number()

import { Router, Request, Response } from "express";
import { getISOWeek, getISOWeekYear } from "date-fns";
import { sql } from "../db";

const weekly_budget = 333;
export const weekRoutes = Router();
function getWeekId() {
  const today = new Date();
  return (
    getISOWeekYear(today) + "-W" + getISOWeek(today).toString().padStart(2, "0")
  );
}

weekRoutes.get("/api/weeks/current", async (req: Request, res: Response) => {
  const weekId = getWeekId();
  let rows = await sql`SELECT * FROM weeks WHERE id = ${weekId}`;
  if (rows.length === 0) {
    rows =
      await sql`INSERT INTO weeks (id, budget) VALUES (${weekId}, ${weekly_budget}) RETURNING *`;
  }
  res.json(rows);
});
