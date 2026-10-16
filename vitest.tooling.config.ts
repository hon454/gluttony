import { defineConfig } from "vitest/config";

// 개발 도구 테스트는 Node에서 돈다.
export default defineConfig({
  test: {
    environment: "node",
    include: ["test/tooling/**/*.test.ts"],
  },
});
