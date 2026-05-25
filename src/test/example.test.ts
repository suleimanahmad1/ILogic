import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("example", () => {
  it("merges class names", () => {
    expect(cn("text-sm", false && "hidden", "text-lg")).toBe("text-lg");
  });
});
