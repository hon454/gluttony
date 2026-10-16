// Claude Code 훅 공통 함수. 훅은 stdin으로 JSON을 받는다.

export interface HookInput {
  tool_name?: string;
  tool_input?: Record<string, unknown>;
}

export async function readHookInput(): Promise<HookInput> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  const text = Buffer.concat(chunks).toString("utf8").trim();
  return text ? (JSON.parse(text) as HookInput) : {};
}

// 종료 코드 2는 도구 실행을 막고, stderr 내용을 Claude에게 보여준다.
export function block(reason: string): never {
  process.stderr.write(`${reason}\n`);
  process.exit(2);
}

export function stringField(input: HookInput, key: string): string | undefined {
  const value = input.tool_input?.[key];
  return typeof value === "string" ? value : undefined;
}
