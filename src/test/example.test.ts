import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("example", () => {
  it("merges class names", () => {
    const hidden = false as boolean;
    expect(cn("text-sm", hidden && "hidden", "text-lg")).toBe("text-lg");
  });
});
