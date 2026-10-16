import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { checkCommand } from "../../.claude/hooks/guard-bash.ts";
import { checkEditPath } from "../../.claude/hooks/guard-edit.ts";
import { formatFile, shouldFormat } from "../../.claude/hooks/format.ts";

describe("guard-bash", () => {
  it.each([
    "wrangler deploy",
    "npx wrangler deploy --env production",
    "npx wrangler versions deploy",
    "npx wrangler d1 migrations apply gluttony --remote",
    "wrangler secret put TELEGRAM_BOT_TOKEN",
    "npx wrangler rollback",
    "npm run check && npx wrangler deploy",
  ])("boot-06: '%s'을 막는다", (command) => {
    expect(checkCommand(command)).not.toBeNull();
  });

  it.each([
    "npx wrangler dev",
    "npx wrangler types",
    "npx wrangler d1 migrations apply gluttony --local",
    "npm run check",
    "git log --oneline -- wrangler.jsonc; echo deploy",
  ])("'%s'은 허용한다", (command) => {
    expect(checkCommand(command)).toBeNull();
  });
});

describe("guard-edit", () => {
  const projectDir = path.resolve("/repo");
  const onMain = new Set(["migrations/0001_items.sql"]);
  const context = { projectDir, isOnMain: (relative: string) => onMain.has(relative) };

  it.each([".dev.vars", ".dev.vars.production", ".env", ".env.local"])(
    "boot-07: %s 편집을 막는다",
    (name) => {
      expect(checkEditPath(path.join(projectDir, name), context)).not.toBeNull();
    },
  );

  it("예시 파일은 편집할 수 있다", () => {
    expect(checkEditPath(path.join(projectDir, ".dev.vars.example"), context)).toBeNull();
  });

  it("main에 있는 마이그레이션은 막고, 새 마이그레이션은 허용한다", () => {
    expect(checkEditPath("migrations/0001_items.sql", context)).not.toBeNull();
    expect(checkEditPath("migrations/0002_undo.sql", context)).toBeNull();
  });

  it("일반 소스 파일은 허용한다", () => {
    expect(checkEditPath(path.join(projectDir, "src", "worker.ts"), context)).toBeNull();
  });
});

describe("format", () => {
  let dir: string | undefined;

  afterEach(async () => {
    if (dir) {
      await rm(dir, { recursive: true, force: true });
      dir = undefined;
    }
  });

  it("boot-08: .ts 파일을 Prettier로 정리한다", async () => {
    dir = await mkdtemp(path.join(tmpdir(), "gluttony-format-"));
    const file = path.join(dir, "sample.ts");
    await writeFile(file, "const  answer={value:42}\n", "utf8");

    expect(await formatFile(file)).toBe(true);
    expect(await readFile(file, "utf8")).toBe("const answer = { value: 42 };\n");
  });

  it("포맷 대상이 아닌 확장자는 건너뛴다", () => {
    expect(shouldFormat("migrations/0001_items.sql")).toBe(false);
    expect(shouldFormat("docs/process.md")).toBe(true);
  });
});
