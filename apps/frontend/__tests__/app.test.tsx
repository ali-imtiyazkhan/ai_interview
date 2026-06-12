import { describe, expect, test } from "bun:test";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../src/App";

describe("App", () => {
  test("renders the form on /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("Start Your Interview")).toBeTruthy();
    expect(screen.getByPlaceholderText("https://github.com/username")).toBeTruthy();
    expect(screen.getByPlaceholderText("https://linkedin.com/in/username")).toBeTruthy();
  });

  test("renders the result page on /result", () => {
    render(
      <MemoryRouter initialEntries={["/result?id=test-id"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("Results")).toBeTruthy();
  });

  test("redirects unknown routes to /", () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("Start Your Interview")).toBeTruthy();
  });
});
