import { Router } from "express";
import crypto from  "node:crypto";

const router = Router();

router.post("/", (req, res) => {
  const ticket = {
    code: crypto.randomUUID(),
    used: false,
  }; 

  res.status(201).json(ticket);
});

export default router;