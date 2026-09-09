import { mount } from "@vue/test-utils";
import { test, expect } from "vitest";
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

