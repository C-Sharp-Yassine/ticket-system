import express from "express";
import cors from "cors";
import ticketsRouter from "./routes/tickets.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
})
);

app.use(express.json());

app.use("/api/tickets", ticketsRouter);

export default app;