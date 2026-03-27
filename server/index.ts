import express, { Request, Response } from "express";
import { weekRoutes } from "./routes/weeks";

const app = express();
app.use(express.json());
app.use(weekRoutes);
const port = 3001;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
