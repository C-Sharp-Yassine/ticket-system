import { mount } from "@vue/test-utils";
import { beforeEach, test, expect, vi } from "vitest";
import App from "./App.vue";

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  });
});

test("displays the Ticket System heading", () => {
  const wrapper = mount(App);
  expect(wrapper.text()).toContain("Ticket System");
});

test("displays a Create Ticket button", () => {
  const wrapper = mount(App);
  const button = wrapper.find("button");
  expect(button.exists()).toBe(true);
  expect(button.text()).toBe("Create Ticket");
});

test("creates a tickets when the Create Ticket is clicked", async () => {
  const mockTicket = {
    id: 1,
    code: "ABC123",
    created_at: "2026-01-01T00:00:00Z",
    used: false,
    used_at: null,
  };

  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockTicket,
    });

  const wrapper = mount(App);

  await wrapper.find("button").trigger("click");

  expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/tickets", {
    method: "POST",
  });
});

test("displays the created ticket code", async () => {
  const mockTicket = {
    id: 1,
    code: "ABC123",
    created_at: "2026-09-10T00:00:00.000Z",
    used: false,
    used_at: null,
  };

  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => mockTicket,
    });

  const wrapper = mount(App);

  await wrapper.find("button").trigger("click");
  await wrapper.vm.$nextTick();

  expect(wrapper.text()).toContain("ABC123");
});

test("displays tickets from the backend", async () => {
  const mockTickets = [
    {
      id: 1,
      code: "ABC123",
      created_at: "2026-09-10T00:00:00.000Z",
      used: false,
      used_at: null,
    },
    {
      id: 2,
      code: "XYZ789",
      created_at: "2026-09-10T00:00:00.000Z",
      used: true,
      used_at: "2026-09-10T00:00:00.000Z",
    },
  ];

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockTickets,
  });

  const wrapper = mount(App);

  await vi.waitFor(() => {
    expect(wrapper.text()).toContain("ABC123");
    expect(wrapper.text()).toContain("XYZ789");
  });
});
