# 글러트니 (Gluttony)

> Telegram bot that saves links and resurfaces them until you consume them.

유튜브, 인스타그램, X, 스레드에서 "나중에 볼 것"을 텔레그램 봇에 공유한다.
봇은 링크를 저장하고, 매일 몇 개씩 다시 보여준다.
버튼 하나로 먹기(소비), 미루기, 뱉기를 한다.

## 상태

개발 중. 지금은 레포 골격(0001-bootstrap) 단계다.

| intent           | 내용                            |
| ---------------- | ------------------------------- |
| 0001 bootstrap   | 레포, 툴링, CI, 훅              |
| 0002 capture     | 링크 저장, 중복 처리            |
| 0003 digest      | 매일 다이제스트, `/bite`        |
| 0004 triage      | 먹기·미루기·뱉기 버튼, 되돌리기 |
| 0005 resurfacing | 재노출 점수, 30일 정리          |
| 0006 ops         | `/export`, 오류 알림            |

## 만드는 방식

이 레포는 구현을 대부분 AI 에이전트(Claude Code)에게 맡긴다. 사람은 판단하고, 감독하고, 이해한다.

- 변경마다 `intents/NNNN-slug/`에 intent → spec → (L 등급만) plan을 남긴다.
- 변경 크기에 따라 S / M / L 등급을 매기고, 등급마다 사람이 확인하는 지점이 다르다.
- 위험한 동작(배포, 시크릿)은 Claude Code 훅이 막는다.

자세한 내용: [docs/process.md](docs/process.md), [docs/glossary.md](docs/glossary.md), [docs/adr/](docs/adr/)

## 기술 스택

TypeScript · grammY · Cloudflare Workers · D1 · vitest · ESLint · Prettier · GitHub Actions

## 개발

Node 24가 필요하다.

```bash
npm ci
npm run check
npm run dev
```

## 라이선스

[MIT](LICENSE)
