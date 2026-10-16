import { describe, expect, it } from "vitest";
import { checkTier, matchesPattern } from "../../scripts/tier-check.ts";

describe("tier-check", () => {
  it("boot-04: tier 라벨이 없으면 실패한다", () => {
    const result = checkTier(["documentation"], ["src/worker.ts"]);
    expect(result.ok).toBe(false);
    expect(result.messages[0]).toContain("tier 라벨");
  });

  it("boot-04: tier 라벨이 둘이면 실패한다", () => {
    expect(checkTier(["tier:S", "tier:M"], []).ok).toBe(false);
  });

  it("boot-05: migrations를 바꿨는데 tier:M이면 실패한다", () => {
    const result = checkTier(["tier:M"], ["migrations/0001_items.sql"]);
    expect(result.ok).toBe(false);
    expect(result.messages.join("\n")).toContain("L 등급이어야");
  });

  it("boot-05: tier:L이어도 plan.md가 없으면 실패한다", () => {
    const result = checkTier(["tier:L"], ["migrations/0001_items.sql"]);
    expect(result.ok).toBe(false);
    expect(result.messages.join("\n")).toContain("plan.md");
  });

  it("tier:L이고 plan.md가 있으면 통과한다", () => {
    const result = checkTier(
      ["tier:L"],
      ["migrations/0001_items.sql", "intents/0002-capture/plan.md"],
    );
    expect(result).toEqual({ ok: true, tier: "L", messages: [] });
  });

  it("L 파일이 없는 tier:M은 통과한다", () => {
    expect(checkTier(["tier:M"], ["src/worker.ts", "docs/process.md"]).ok).toBe(true);
  });

  it("패턴: 디렉터리 /**는 하위 파일만, 나머지는 정확히 일치한다", () => {
    expect(matchesPattern("migrations/**", "migrations/0001.sql")).toBe(true);
    expect(matchesPattern("migrations/**", "migrations-old/0001.sql")).toBe(false);
    expect(matchesPattern("src/core/callback-data.ts", "src/core/callback-data.ts")).toBe(true);
    expect(matchesPattern("src/core/callback-data.ts", "src/core/callback-data.test.ts")).toBe(
      false,
    );
  });
});
