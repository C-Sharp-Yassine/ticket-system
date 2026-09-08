import { Router } from "express";
import crypto from "node:crypto";
import db from "../db/db.js";

const router = Router();

router.post("/", (req, res) => {
  const code = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const result = db
    .prepare(
      `
    INSERT INTO tickets (code, created_at)
    VALUES (?, ?)
  `,
    )
    .run(code, createdAt);

  const ticket = db
    .prepare(
      `
    SELECT id, code, created_at, used, used_at
    FROM tickets
    WHERE id = ?
  `,
    )
    .get(result.lastInsertRowid);

  res.status(201).json({
    ...ticket,
    used: Boolean(ticket.used),
  });
});

router.get("/", (req, res) => {
  const tickets = db
    .prepare(
      `
    SELECT id, code, created_at, used, used_at
    FROM tickets
    ORDER BY id ASC
  `,
    )
    .all();

  const formattedTickets = tickets.map((ticket) => ({
    ...ticket,
    used: Boolean(ticket.used),
  }));

  res.status(200).json(formattedTickets);
});

router.patch("/use", (req, res) => {
  const { code } = req.body;

  const ticket = db
    .prepare(
      `
    SELECT id, code, created_at, used, used_at
    FROM tickets
    WHERE code = ?
  `,
    )
    .get(code);

  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  const usedAt = new Date().toISOString();

  db.prepare(
    `
    UPDATE tickets
    SET used = 1, 
used_at = ?
    WHERE code = ?
  `,
  ).run(usedAt, code);

  const updatedTicket = db
    .prepare(
      `
    SELECT id, code, created_at, used, used_at
    FROM tickets
    WHERE code = ?
  `,
    )
    .get(code);

  res.status(200).json({
    ...updatedTicket,
    used: Boolean(updatedTicket.used),
  });
});

export default router;
