import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { CountButton } from "./CountButton";

describe("CountButton", () => {
  test("should render", async () => {
    render(<CountButton />);
    const button = screen.getByRole("button");
    expect(button).toBeVisible();
    expect(button).toHaveTextContent("count is 0");
    await userEvent.click(button);
    expect(button).toHaveTextContent("count is 1");
  });
});
