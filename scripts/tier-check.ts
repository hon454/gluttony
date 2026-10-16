// PR 등급 검사. CI(tier.yml)에서 npm ci 없이 Node 24로 바로 실행하므로 내장 모듈만 쓴다.
import { execFileSync } from "node:child_process";

export type Tier = "S" | "M" | "L";

// 이 파일을 바꾸면 L 등급이어야 한다. docs/process.md 11절과 함께 고친다.
export const L_PATTERNS = [
  "migrations/**",
  "src/core/callback-data.ts",
  "src/adapters/telegram/commands.ts",
];

const PLAN = /^intents\/[^/]+\/plan\.md$/;

export function matchesPattern(pattern: string, file: string): boolean {
  if (pattern.endsWith("/**")) {
    return file.startsWith(pattern.slice(0, -2));
  }
  return file === pattern;
}

export interface TierResult {
  ok: boolean;
  tier: Tier | null;
  messages: string[];
}

export function checkTier(labels: string[], changedFiles: string[]): TierResult {
  const tiers = labels
    .map((label) => /^tier:([SML])$/.exec(label)?.[1])
    .filter((tier): tier is Tier => tier !== undefined);

  if (tiers.length !== 1) {
    return {
      ok: false,
      tier: null,
      messages: ["tier 라벨을 하나만 달아 주세요: tier:S, tier:M, tier:L 중 하나."],
    };
  }

  const tier = tiers[0] as Tier;
  const messages: string[] = [];
  const lFiles = changedFiles.filter((file) => L_PATTERNS.some((p) => matchesPattern(p, file)));

  if (lFiles.length > 0 && tier !== "L") {
    messages.push(`다음 파일을 바꾸면 L 등급이어야 합니다: ${lFiles.join(", ")}`);
  }
  if ((tier === "L" || lFiles.length > 0) && !changedFiles.some((file) => PLAN.test(file))) {
    messages.push("L 등급 PR에는 intents/NNNN-slug/plan.md가 있어야 합니다.");
  }

  return { ok: messages.length === 0, tier, messages };
}

function changedFilesSince(baseSha: string): string[] {
  const output = execFileSync("git", ["diff", "--name-only", `${baseSha}...HEAD`], {
    encoding: "utf8",
  });
  return output.split("\n").filter(Boolean);
}

if (import.meta.main) {
  const labels = JSON.parse(process.env.TIER_LABELS ?? "[]") as string[];
  const baseSha = process.env.BASE_SHA;
  if (!baseSha) {
    console.error("BASE_SHA가 없다.");
    process.exit(1);
  }
  const result = checkTier(labels, changedFilesSince(baseSha));
  if (result.ok) {
    console.log(`등급 확인: tier:${result.tier}`);
  } else {
    for (const message of result.messages) {
      console.error(message);
    }
    process.exit(1);
  }
}
