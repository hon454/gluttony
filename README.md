# 글러트니 (Gluttony)

[![check](https://github.com/hon454/gluttony/actions/workflows/check.yml/badge.svg)](https://github.com/hon454/gluttony/actions/workflows/check.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Telegram bot that saves links and resurfaces them until you consume them.

"나중에 볼 것"을 텔레그램 봇에 공유하면, 봇이 저장하고 매일 몇 개씩 다시 보여준다.

## 왜 만드나

유튜브, 인스타그램, X, 스레드에서 나중에 볼 자료를 "나중에 보기"나 나에게 보내기로 모은다.
모으기는 쉽지만 다시 볼 계기가 없어서 쌓이기만 한다.
글러트니는 모으는 곳이 아니라 **다시 꺼내 주는 곳**이다. 휴대폰에서 탭 몇 번으로 끝나야 한다.

## 동작 방식

1. **저장**: 공유 버튼 → 텔레그램 → 글러트니. 봇은 👌 반응 하나로 저장을 알린다.
2. **다이제스트**: 매일 21시에 항목 3개를 보낸다. 지금 하나만 보고 싶으면 `/bite`.
3. **처리**: 메시지 버튼으로 ✅ 먹기, ⏰ 미루기, 🔥 우선순위 올리기, 🗑 뱉기. 잘못 누르면 되돌린다.
4. **정리**: 일요일마다 30일 넘게 손대지 않은 항목을 보관할지 묻는다.

용어는 [docs/glossary.md](docs/glossary.md)에 정리했다.

## 상태

개발 중이다. 아직 봇으로 쓸 수 없다.

| 단계             | 내용                            | 상태    |
| ---------------- | ------------------------------- | ------- |
| 0001 bootstrap   | 레포, 검사, 훅, CI              | 진행 중 |
| 0002 capture     | 링크 저장, 중복 처리            | 예정    |
| 0003 digest      | 매일 다이제스트, `/bite`        | 예정    |
| 0004 triage      | 먹기·미루기·뱉기 버튼, 되돌리기 | 예정    |
| 0005 resurfacing | 재노출 점수, 30일 정리          | 예정    |
| 0006 ops         | `/export`, 오류 알림            | 예정    |

## 개발 환경

필요한 것: Node 24 이상. Cloudflare 계정과 봇 토큰은 0002부터 필요하다.

```bash
npm ci          # 의존성 설치
npm run check   # 타입체크, 린트, 포맷 검사, 테스트
npm run dev     # 로컬 Worker 실행 (wrangler dev)
```

## 구조

```
src/            Worker 코드 (core: 순수 로직, adapters: 텔레그램·D1)
test/           workers: Worker 테스트, tooling: 훅·스크립트 테스트
intents/        변경마다 intent, spec, plan
docs/           개발 프로세스, 용어집, ADR
.claude/        Claude Code 훅과 설정
scripts/        CI 스크립트 (등급 검사)
```

## 만드는 방식

구현은 대부분 AI 에이전트(Claude Code)가 맡는다. 사람은 판단하고, 감독하고, 이해한다.

- 변경마다 `intents/`에 intent → spec → (L 등급만) plan을 남긴다.
- 변경을 S / M / L 등급으로 나누고, 등급마다 사람이 확인하는 지점이 다르다.
- 배포, 시크릿 같은 위험한 동작은 Claude Code 훅이 막는다.
- PR은 리뷰 묶음 형식([REVIEW.md](REVIEW.md))을 따르고, CI가 등급 라벨을 검사한다.

자세한 내용은 [docs/process.md](docs/process.md)와 [docs/adr/](docs/adr/)에 있다.

## 기술 스택

TypeScript · [grammY](https://grammy.dev) · Cloudflare Workers · D1 · vitest · ESLint · Prettier · GitHub Actions

## 라이선스

[MIT](LICENSE)
