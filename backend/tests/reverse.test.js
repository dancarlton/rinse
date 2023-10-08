import { reverse } from "../utils/forTesting";

// simple tests to ensure jest is working.
describe("reverse", () => {
  test("of a", () => {
    const result = reverse("a");

    expect(result).toBe("a");
  });

  test("of react", () => {
    const result = reverse("react");

    expect(result).toBe("tcaer");
  });

  test("of releveler", () => {
    const result = reverse("releveler");

    expect(result).toBe("releveler");
  });
});
