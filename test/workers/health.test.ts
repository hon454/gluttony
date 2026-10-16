import { exports } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

describe("health", () => {
  it("boot-01: GET /health는 200과 ok를 돌려준다", async () => {
    const response = await exports.default.fetch("https://gluttony.test/health");
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("ok");
  });

  it("boot-02: 다른 경로는 404를 돌려준다", async () => {
    const response = await exports.default.fetch("https://gluttony.test/unknown");
    expect(response.status).toBe(404);
  });
});
