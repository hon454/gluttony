---
status: approved 2026-10-17
tier: M
decisions: D1=A, D2=A, D3=A, D4=A
---

# 0001 bootstrap — spec

## 결정 필요 (승인: 모두 A)

D1. 배포 워크플로를 넣는 시점

- A. 0002-capture에서 넣는다 ← 추천
  Cloudflare 계정과 봇 토큰이 그때 필요하다. 지금 넣으면 실행할 수 없는 워크플로가 생긴다.
- B. 지금 골격만 넣는다.

D2. 패키지 매니저

- A. npm ← 추천
  Node에 들어 있다. 대중성 기준과 맞는다.
- B. pnpm. 설치가 빠르고 디스크를 덜 쓴다.

D3. 라이선스

- A. MIT ← 추천
  공개 포트폴리오에서 가장 흔하다.
- B. Apache-2.0. 특허 조항이 있다.
- C. 라이선스 없음. 남이 코드를 쓸 수 없다.

D4. L 등급 파일 목록의 시작값

- A. `migrations/**`, `src/core/callback-data.ts`, `src/adapters/telegram/commands.ts` ← 추천
  아직 없는 파일도 미리 적는다. 파일이 생기는 순간부터 검사가 적용된다.
- B. `migrations/**`만. 나머지는 해당 intent에서 추가한다.

## 요구사항

### R1. 레포 골격

- Node 24, TypeScript strict.
- `src/worker.ts`는 `GET /health`에만 응답한다. 웹훅은 0002에서 만든다.
- `wrangler.jsonc`에는 이름과 compatibility_date만 둔다. 계정 ID, D1, Cron은 넣지 않는다.
- `README.md`, `LICENSE`, `.gitignore`, `.gitattributes`.

### R2. 검사 명령

- `npm run check` = `typecheck` + `lint` + `format:check` + `test`.
- 테스트는 vitest + `@cloudflare/vitest-pool-workers`로 Workers 런타임에서 돈다.
- 의존성 버전을 고정한다 (`save-exact`). lockfile을 커밋한다.

### R3. 에이전트 문서

- `CLAUDE.md`: 한 페이지 이하. 명령어, 폴더 규칙, 글쓰기 규칙 요약, 사람만 하는 일.
- `REVIEW.md`: 리뷰 기준과 리뷰 묶음 형식.
- `.github/pull_request_template.md`: 리뷰 묶음 형식.
- `docs/adr/`: `0001-telegram-grammy`, `0002-workers-d1`, `0003-eslint-prettier`.

### R4. 훅 (`.claude/settings.json`)

- 편집 후: 바뀐 파일에 Prettier를 돌린다.
- 차단 (Bash): `wrangler deploy`, `wrangler d1 migrations apply --remote`, `wrangler secret`.
- 차단 (편집): `.dev.vars*`, `.env*` (예시 파일 제외), main에 이미 있는 `migrations/*.sql`.
- 훅 스크립트는 `.claude/hooks/`에 Node로 쓴다. Windows와 macOS에서 똑같이 돈다.

### R5. CI (`.github/workflows/`)

- `check.yml`: PR과 main push에서 `npm ci` 후 `npm run check`.
- `tier.yml`: PR에 `tier:S`, `tier:M`, `tier:L` 중 하나가 있어야 한다. L 파일 목록(D4)을 바꿨는데 `tier:L`이 없거나 `intents/*/plan.md`가 없으면 실패한다.

### R6. 저장소 설정 (사람이 승인한 뒤 gh로 적용)

- 라벨 `tier:S`, `tier:M`, `tier:L`을 만든다.
- main 보호: PR 필수, `check`와 `tier` 통과 필수. 승인 리뷰어 필수는 쓰지 않는다.

### R7. 공개 레포 위생

- fixture에는 실제 개인 링크를 넣지 않는다. 예시 URL만 쓴다.
- 시크릿은 레포에 두지 않는다. `.dev.vars.example`에 키 이름만 적는다.

## 시나리오

| ID      | GIVEN                                             | WHEN                        | THEN                        |
| ------- | ------------------------------------------------- | --------------------------- | --------------------------- |
| boot-01 | Worker가 떠 있다                                  | `GET /health`               | 200, 본문 `ok`              |
| boot-02 | Worker가 떠 있다                                  | 다른 경로로 요청            | 404                         |
| boot-03 | 깨끗한 clone                                      | `npm ci && npm run check`   | 성공                        |
| boot-04 | PR에 tier 라벨이 없다                             | `tier.yml` 실행             | 실패, 라벨을 달라는 메시지  |
| boot-05 | PR이 `migrations/` 파일을 바꾼다, 라벨은 `tier:M` | `tier.yml` 실행             | 실패, L이 필요하다는 메시지 |
| boot-06 | Claude 세션                                       | `wrangler deploy` 실행 시도 | 훅이 막고 이유를 알린다     |
| boot-07 | Claude 세션                                       | `.dev.vars` 편집 시도       | 훅이 막는다                 |
| boot-08 | Claude 세션                                       | `.ts` 파일 편집             | 훅이 Prettier를 돌린다      |

boot-01, 02는 vitest로 검사한다.
boot-04, 05는 tier 검사 스크립트를 함수로 분리해 vitest로 검사한다.
boot-06~08은 훅 스크립트에 입력 JSON을 넣어 vitest로 검사한다.
boot-03은 CI가 검사한다.

## 범위 밖

- 웹훅, D1, Cron, 봇 토큰: 0002 이후.
- 다이어그램 생성 스크립트, 대화 재생: 상태 전이 코드가 생기는 0002에서.
- claude-code-action: 흐름이 안정된 뒤.
