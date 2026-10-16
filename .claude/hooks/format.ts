// PostToolUse(Edit|Write|MultiEdit) 훅. 바뀐 파일에 Prettier를 돌린다.
// 실패해도 작업을 막지 않는다. npm run check가 최종 검사다.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import * as prettier from "prettier";
import { readHookInput, stringField } from "./lib.ts";

const FORMATTABLE = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".jsonc",
  ".md",
  ".yml",
  ".yaml",
  ".css",
  ".html",
]);

export function shouldFormat(filePath: string): boolean {
  return FORMATTABLE.has(path.extname(filePath).toLowerCase());
}

// 포맷했으면 true, 건너뛰었거나 바뀐 것이 없으면 false.
export async function formatFile(filePath: string, ignorePath?: string): Promise<boolean> {
  if (!shouldFormat(filePath)) {
    return false;
  }
  const info = await prettier.getFileInfo(filePath, ignorePath ? { ignorePath } : {});
  if (info.ignored || !info.inferredParser) {
    return false;
  }
  const source = await readFile(filePath, "utf8");
  const options = (await prettier.resolveConfig(filePath)) ?? {};
  const formatted = await prettier.format(source, { ...options, filepath: filePath });
  if (formatted === source) {
    return false;
  }
  await writeFile(filePath, formatted, "utf8");
  return true;
}

if (import.meta.main) {
  try {
    const input = await readHookInput();
    const filePath = stringField(input, "file_path");
    if (filePath) {
      const projectDir = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
      await formatFile(
        path.resolve(projectDir, filePath),
        path.join(projectDir, ".prettierignore"),
      );
    }
  } catch (error) {
    process.stderr.write(`[format] Prettier를 건너뛰었다: ${String(error)}\n`);
  }
}
