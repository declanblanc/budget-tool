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

weekRoutes.get("/api/weeks", async (req: Request, res: Response) => {
  const rows = await sql`SELECT * FROM weeks ORDER BY id DESC`;
  res.json(rows);
});

// - [ ] POST "/api/weeks"
//       Read { id, budget } from req.body
//       Query: INSERT INTO weeks (id, budget) VALUES (${id}, ${budget})
//              ON CONFLICT (id) DO UPDATE SET budget = ${budget}
//       Return the upserted week as JSON
weekRoutes.post("/api/weeks", async (req: Request, res: Response) => {
  console.log(`POST: /api/weeks ${JSON.stringify(req.body)}`);
  const { id, budget } = req.body;
  if (!id || !budget) {
    return res.status(400).json({ error: "Budget and weekId are required" });
  }

  const rows =
    await sql`INSERT INTO weeks (id, budget) VALUES (${id}, ${budget}) ON CONFLICT (id) DO UPDATE SET budget = ${budget} RETURNING *`;
  res.json(rows);
  return;
});
