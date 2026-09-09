import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

test("POST /api/tickets creates a new ticket", async () => {
  const response = await request(app).post("/api/tickets").expect(201);

  assert.ok(response.body.code);
  assert.equal(response.body.used, false);
});

test("GET /api/tickets returns a list of tickets", async () => {
  const response = await request(app).get("/api/tickets").expect(200);

  assert.ok(Array.isArray(response.body));
});

test("POST /api/tickets saves the ticket", async () => {
  const createResponse = await request(app).post("/api/tickets").expect(201);

  const listResponse = await request(app).get("/api/tickets").expect(200);

  const savedTicket = listResponse.body.find(
    (ticket) => ticket.code === createResponse.body.code,
  );

  assert.ok(savedTicket);
});

test("PATCH /api/tickets/use marks a ticket as used", async () => {
  const createResponse = await request(app).post("/api/tickets").expect(201);

  const code = createResponse.body.code;

  const useResponse = await request(app)
    .patch("/api/tickets/use")
    .send({ code })
    .expect(200);

  assert.equal(useResponse.body.code, code);
  assert.equal(useResponse.body.used, true);
  assert.ok(useResponse.body.used_at);
});

test("PATCH /api/tickets/use prevents a ticket from being used twice", async () => {
  const createResponse = await request(app)
    .post("/api/tickets")
    .expect(201);

  const code = createResponse.body.code;

  await request(app)
    .patch("/api/tickets/use")
    .send({ code })
    .expect(200);

  const secondUseResponse = await request(app)
    .patch("/api/tickets/use")
    .send({ code })
    .expect(409);

  assert.equal(secondUseResponse.body.message, "Ticket already used");
});

test("PATCH /api/tickets/use returns 404 for an unknown ticket code", async () => {
  const response = await request(app)
    .patch("/api/tickets/use")
    .send({ code: "UNKNOWN-TICKET-CODE" })
    .expect(404);

  assert.equal(response.body.message, "Ticket not found");
});

test("DELETE /api/tickets/:id deletes an unused ticket", async () => {
  const createResponse = await request(app)
    .post("/api/tickets")
    .expect(201);

    const id = createResponse.body.id;

    await request(app)
    .delete(`/api/tickets/${id}`)
    .expect(204);

    const listResponse = await request(app)
    .get("/api/tickets")
    .expect(200);

    const deletedTicket = listResponse.body.find(
      (ticket) => ticket.id === id,
    );

    assert.equal(deletedTicket, undefined);
});

test("DELETE /api/tickets/:id prevents deletion of a used ticket", async () => {
  const createResponse = await request(app)
    .post("/api/tickets")
    .expect(201);

  const { id, code } = createResponse.body;

  await request(app)
    .patch("/api/tickets/use")
    .send({ code })
    .expect(200);

  const deleteResponse = await request(app)
    .delete(`/api/tickets/${id}`)
    .expect(409);

  assert.equal(deleteResponse.body.message, "Ticket already used");

  const listResponse = await request(app)
    .get("/api/tickets")
    .expect(200);

  const ticket = listResponse.body.find(
    (ticket) => ticket.id === id
  );

  assert.ok(ticket);
  assert.equal(ticket.used, true);
});