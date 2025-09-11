import { sum } from "@/sum";
import { expect, test } from "vitest";

test("sum", () => {
  expect(sum(1, 2)).toBe(3);
});
