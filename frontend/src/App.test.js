import { mount } from "@vue/test-utils";
import { test, expect, vi } from "vitest";
import App from "./App.vue";

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

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockTicket,
  });

  const wrapper = mount(App);
  await wrapper.find("button").trigger("click");

  expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/tickets", {
    method: "POST",
  });
});
