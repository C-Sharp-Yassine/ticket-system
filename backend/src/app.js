import express from "express";
import ticketsRouter from "./routes/tickets.js";

const app = express();

app.use(express.json());

app.use("/api/tickets", ticketsRouter);

export default app;