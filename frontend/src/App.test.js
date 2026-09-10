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

test("displays whether tickets are used or unused", async () => {
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
      created_at: "2026-09-10T00:05:00.000Z",
      used: true,
      used_at: "2026-09-10T00:10:00.000Z",
    },
  ];

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockTickets,
  });

  const wrapper = mount(App);

  await vi.waitFor(() => {
    expect(wrapper.text()).toContain("Unused");
    expect(wrapper.text()).toContain("Used");
  });
});

test("displays an input and button for using a ticket", () => {
  const wrapper = mount(App);

  const input = wrapper.find('input[placeholder="Ticket code"]');
  const button = wrapper.find('[data-testid="use-ticket-button"]');

  expect(input.exists()).toBe(true);
  expect(button.exists()).toBe(true);
  expect(button.text()).toBe("Use Ticket");
});

test("uses a ticket when the Use Ticket button is clicked", async () => {
  const usedTicket = {
    id: 1,
    code: "ABC123",
    created_at: "2026-09-10T00:00:00.000Z",
    used: true,
    used_at: "2026-09-10T00:10:00.000Z",
  };

  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => usedTicket,
    });

  const wrapper = mount(App);

  await wrapper.find('input[placeholder="Ticket code"]').setValue("ABC123");
  await wrapper.find('[data-testid="use-ticket-button"]').trigger("click");

  expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/tickets/use", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: "ABC123",
    }),
  });
});

test("updates the ticket status to used after using a ticket", async () => {
  const unusedTicket = {
    id: 1,
    code: "ABC123",
    created_at: "2026-09-10T00:00:00.000Z",
    used: false,
    used_at: null,
  };

  const usedTicket = {
    ...unusedTicket,
    used: true,
    used_at: "2026-09-10T00:10:00.000Z",
  };

  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => [unusedTicket],
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => usedTicket,
    });

  const wrapper = mount(App);

  await vi.waitFor(() => {
    expect(wrapper.text()).toContain("ABC123 - Unused");
  });

  await wrapper.find('input[placeholder="Ticket code"]').setValue("ABC123");
  await wrapper.find('[data-testid="use-ticket-button"]').trigger("click");

  await vi.waitFor(() => {
    expect(wrapper.text()).toContain("ABC123 - Used");
  });
});

test("displays a Delete button for unused tickets only", async () => {
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
      created_at: "2026-09-10T00:05:00.000Z",
      used: true,
      used_at: "2026-09-10T00:10:00.000Z",
    },
  ];

  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockTickets,
  });

  const wrapper = mount(App);

  await vi.waitFor(() => {
    const deleteButtons = wrapper.findAll(
      '[data-testid="delete-ticket-button"]',
    );

    expect(deleteButtons).toHaveLength(1);
    expect(deleteButtons[0].text()).toBe("Delete");
  });
});
