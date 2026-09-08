import { Router } from "express";
import crypto from  "node:crypto";
import db from "../db/db.js";

const router = Router();

router.post("/", (req, res) => {
  const code = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const result = db.prepare(`
    INSERT INTO tickets (code, created_at)
    VALUES (?, ?)
  `)
  .run(code, createdAt);

  const ticket = db
.prepare(`
    SELECT id, code, created_at, used, used_at
    FROM tickets
    WHERE id = ?
  `)
  .get(result.lastInsertRowid);

  res.status(201).json({
    ...ticket,
    used: Boolean(ticket.used),
  });
});

router.get("/", (req, res) => {
  const tickets = db.prepare(`
    SELECT id, code, created_at, used, used_at
    FROM tickets
    ORDER BY id ASC
  `)
  .all();

  const formattedTickets = tickets.map((ticket) => ({
    ...ticket,
    used: Boolean(ticket.used),
  }));

  res.status(200).json(formattedTickets);
});


export default router;