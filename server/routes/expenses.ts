/*Phase 3: Expense
  A new Router file with CRUD endpoints, but this time for expenses.
*/
import { Router, Request, Response } from "express";
import { sql } from "../db";
import getWeekId from "../utils/getWeekId";

export const expenseRoutes = Router();

expenseRoutes.get(
  "/api/expenses/:week_id",
  async (req: Request, res: Response) => {
    const { week_id } = req.params;
    try {
      const rows = await sql`SELECT * FROM expenses WHERE week_id = ${week_id}`;
      if (rows.length == 0) {
        throw new Error();
      }
      let totalSpend = 0;
      for (let i = 0; i < rows.length; i++) {
        totalSpend += parseInt(rows[i].amount);
      }
      return res.status(200).json({
        success: true,
        expenseCount: rows.length,
        week_id,
        totalSpend,
      });
    } catch (error) {
      return res.status(400).json({
        error: `Failed to get expenses for week_id ${week_id}`,
        message: `${error.message}`,
      });
    }
  },
);

expenseRoutes.post("/api/expenses/add", async (req: Request, res, Response) => {
  const { title, amount, description } = req.body;

  console.log("POST: /api/expenses/add");
  console.log(title);
  console.log(amount);
  console.log(description);

  const currentWeekId = getWeekId();
  try {
    const rows =
      await sql`INSERT INTO EXPENSES (week_id, date, name, amount, description) VALUES(${currentWeekId}, ${new Date()}, ${title}, ${amount}, ${description}) RETURNING *`;
    console.log("Successfully inserted:");
    console.log(rows);
  } catch (error) {
    return res.status(400).json({
      error: "Failed to log expense",
      message: error.message,
    });
  }
  return res.status(201).json({
    success: true,
    data: {
      title: title,
      amount: amount,
      description: description,
    },
  });
});

expenseRoutes.put(
  "/api/expenses/:expenseId",
  async (req: Request, res: Response) => {
    const { expenseId } = req.params;
    const { week_id, date, name, amount, description } = req.body;

    try {
      const rows =
        await sql`UPDATE expenses SET week_id = ${week_id}, date = ${date}, name = ${name}, amount = ${amount}, description = ${description} WHERE id = ${expenseId} RETURNING *`;
      if (rows.length == 0) {
        throw new Error("Couldn't find row with that ID");
      }
      return res.status(201).json({
        success: true,
        data: rows,
      });
    } catch (error) {
      return res.status(400).json({
        error: "Failed to update expense",
        message: error.message,
      });
    }
  },
);

expenseRoutes.delete(
  "/api/expenses/:expenseId",
  async (req: Request, res: Response) => {
    const { expenseId } = req.params;
    console.log(`Attempting to delete expense where id = ${expenseId}`);
    try {
      const rows =
        await sql`DELETE FROM expenses WHERE id = ${expenseId} RETURNING *`;
      if (rows.length == 0) {
        throw new Error("Unable to find expense with that ID");
      }
      console.log(`Successfully deleted expense id=${expenseId}`);
      return res.status(204).json({
        success: true,
        data: rows,
      });
    } catch (error) {
      console.log(`Failed to delete expense id=${expenseId}`);
      return res.status(400).json({
        error: "Failed to delete expense",
        message: error.message,
      });
    }
  },
);
