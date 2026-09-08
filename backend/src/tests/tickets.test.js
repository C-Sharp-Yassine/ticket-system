import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

test("POST /api/tickets creates a new ticket", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .expect(201);

  assert.ok(response.body.code);
  assert.equal(response.body.used, false);
});