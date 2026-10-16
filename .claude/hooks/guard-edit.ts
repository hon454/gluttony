// PreToolUse(Edit|Write|MultiEdit|NotebookEdit) 훅. 시크릿 파일과 이미 적용된 마이그레이션을 지킨다.
import { execFileSync } from "node:child_process";
import path from "node:path";
import { block, readHookInput, stringField } from "./lib.ts";

const SECRET_FILES = [/^\.dev\.vars(\..+)?$/, /^\.env(\..+)?$/];
const SECRET_EXAMPLES = new Set([".dev.vars.example", ".env.example"]);
const MIGRATION = /^migrations\/[^/]+\.sql$/;

export interface EditContext {
  projectDir: string;
  // main 브랜치에 이 경로(레포 기준 상대 경로)가 있는지 알려준다.
  isOnMain: (relativePath: string) => boolean;
}

export function checkEditPath(filePath: string, context: EditContext): string | null {
  const absolute = path.resolve(context.projectDir, filePath);
  const relative = path.relative(context.projectDir, absolute).split(path.sep).join("/");
  const name = path.basename(absolute);

  if (SECRET_FILES.some((pattern) => pattern.test(name)) && !SECRET_EXAMPLES.has(name)) {
    return `${name}은 시크릿 파일이다. 사람이 직접 편집한다. 키 이름은 .dev.vars.example에 적는다.`;
  }
  if (MIGRATION.test(relative) && context.isOnMain(relative)) {
    return `${relative}은 이미 main에 있는 마이그레이션이다. 고치지 말고 새 마이그레이션 파일을 만든다.`;
  }
  return null;
}

function gitIsOnMain(projectDir: string, relativePath: string): boolean {
  try {
    execFileSync("git", ["cat-file", "-e", `main:${relativePath}`], {
      cwd: projectDir,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

if (import.meta.main) {
  const input = await readHookInput();
  const filePath = stringField(input, "file_path") ?? stringField(input, "notebook_path");
  if (filePath) {
    const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
    const reason = checkEditPath(filePath, {
      projectDir,
      isOnMain: (relative) => gitIsOnMain(projectDir, relative),
    });
    if (reason) {
      block(`[guard-edit] ${reason}`);
    }
  }
}
