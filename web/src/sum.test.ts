import { sum } from "@/sum";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  onTestFinished,
  test,
} from "vitest";

describe("sum", () => {
  beforeEach(() => {
    console.log("beforeEach");
    return () => {
      console.log("afterEach");
    };
  });

  afterEach(() => {
    console.log("afterEach!!!!");
  });

  test("sum", () => {
    onTestFinished(() => {
      console.log("onTestFinished!!");
    });
    expect(sum(1, 2)).toBe(3);
  });

  test.concurrent.for([
    [1, 2, 3],
    [4, 5, 9],
    [7, 8, 15],
  ])("parameterized test", async ([a, b, expected]) => {
    onTestFinished(() => {
      console.log("onTestFinished");
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    expect(sum(a, b)).toBe(expected);
  });
});

//テスト対象
const sayHello = (name: string) => `Hello, ${name}!`;

test("挨拶の文字列が生成される", () => {
  const name = "Makima";
  const result = sayHello(name);
  expect(result).toMatchInlineSnapshot(`"Hello, Makima!"`);
});
