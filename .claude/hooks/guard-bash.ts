// PreToolUse(Bash) 훅. 사람이나 GitHub Actions만 해야 하는 wrangler 명령을 막는다.
import { block, readHookInput, stringField } from "./lib.ts";

// 한 명령 안에서만 찾는다. ; & | 줄바꿈을 넘지 않는다.
const SAME_COMMAND = "(?:(?![;&|\\n]).)*";

const RULES: { pattern: RegExp; reason: string }[] = [
  {
    pattern: new RegExp(`\\bwrangler\\b${SAME_COMMAND}\\bdeploy\\b`),
    reason: "배포는 GitHub Actions가 한다. 로컬에서 wrangler deploy를 실행하지 않는다.",
  },
  {
    pattern: new RegExp(`\\bwrangler\\b${SAME_COMMAND}\\brollback\\b`),
    reason: "롤백은 사람이 한다. 필요하면 사람에게 요청한다.",
  },
  {
    pattern: new RegExp(`\\bwrangler\\b${SAME_COMMAND}\\bmigrations\\b${SAME_COMMAND}--remote\\b`),
    reason: "원격 D1 마이그레이션은 GitHub Actions의 L 등급 승인으로만 적용한다.",
  },
  {
    pattern: new RegExp(`\\bwrangler\\b${SAME_COMMAND}\\bsecret\\b`),
    reason: "시크릿은 사람이 wrangler secret으로 직접 넣는다.",
  },
];

export function checkCommand(command: string): string | null {
  for (const rule of RULES) {
    if (rule.pattern.test(command)) {
      return rule.reason;
    }
  }
  return null;
}

if (import.meta.main) {
  const input = await readHookInput();
  const reason = checkCommand(stringField(input, "command") ?? "");
  if (reason) {
    block(`[guard-bash] ${reason}`);
  }
}
