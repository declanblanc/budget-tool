import { Router, Request, Response } from "express";
import { sql } from "../db";
import getWeekId from "../utils/getWeekId";

const weekly_budget = 333;
export const weekRoutes = Router();

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
