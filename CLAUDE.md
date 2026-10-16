# 글러트니 — 에이전트 안내

텔레그램 봇. 사용자가 공유한 링크를 저장하고, 다이제스트로 다시 보여준다.
개발 프로세스는 [docs/process.md](docs/process.md), 용어는 [docs/glossary.md](docs/glossary.md)를 따른다.

## 명령

- `npm run check`: 타입체크, 린트, 포맷 검사, 테스트. 통과하기 전에는 "완료"라고 말하지 않는다.
- `npm run test:workers`: Worker 테스트 (workerd). `npm run test:tooling`: 훅·스크립트 테스트 (Node).
- `npm run types`: `wrangler.jsonc`를 바꾼 뒤 `worker-configuration.d.ts`를 다시 만든다.

## 작업 흐름

- intent 하나 = 세션 하나 = 브랜치 하나. 브랜치는 `intent/NNNN-slug`, 작은 수정은 `fix/slug`.
- M·L은 `intents/NNNN-slug/spec.md`가 `status: approved`일 때만 구현한다. L은 `plan.md`도 승인받는다.
- 작업 중에 L 목록(process.md 11절)에 걸리면 멈추고 사람에게 알린다.
- 테스트를 먼저 쓴다. 테스트 이름에 시나리오 ID를 넣는다 (`boot-01: ...`).
- 버그 수정은 실패하는 테스트를 먼저 커밋한다.
- PR 전에 로컬 리뷰를 한다. PR 설명은 템플릿의 리뷰 묶음을 채운다. 라벨은 `tier:S|M|L`.

## 폴더 규칙

- `src/core/`: 순수 TS. `cloudflare:*`나 grammY를 import하지 않는다.
- `src/adapters/`: 텔레그램, D1, oEmbed 같은 바깥 세계 코드.
- `scripts/`: CI가 `npm ci` 없이 실행한다. Node 내장 모듈만 쓴다.
- `.claude/hooks/`: Node 24가 TS를 바로 실행한다. 지울 수 있는 타입 문법만 쓴다.
- fixture에는 실제 개인 링크를 넣지 않는다.

## 글쓰기

- 한 문장에 한 사실. 능동형. 짧게. 용어집의 단어만 쓴다.
- 문서, 커밋 메시지, 코드 주석에 모두 적용한다.

## 하지 않는 것 (훅이 막는다)

- 배포, 롤백, 원격 D1 마이그레이션, `wrangler secret`.
- `.dev.vars`, `.env` 편집. main에 이미 있는 `migrations/*.sql` 수정.

## 사람만 하는 일

BotFather 토큰 발급, Cloudflare 로그인, 시크릿 입력, 레포 설정, PR 머지, L 등급 prod 승인.

## 반복 실수

같은 실수가 두 번 나오면 여기에 한 줄로 추가한다.

- (아직 없음)
