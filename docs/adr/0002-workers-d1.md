# ADR 0002: 런타임은 Cloudflare Workers, DB는 D1

- 상태: 채택 (2026-10-17)

## 맥락

- 혼자 운영한다. 관리할 서버가 없어야 한다.
- 개인 봇 한 개 규모에서 무료여야 한다.
- 점수 정렬, 30일 방치 같은 조회가 필요하다.

## 결정

- 런타임: Cloudflare Workers. 스케줄은 Cron Trigger 하나 (매일 12:00 UTC).
- DB: D1 (SQLite). 쿼리는 직접 쓴 SQL과 얇은 저장소 계층으로 다룬다.
- 테스트: vitest + `@cloudflare/vitest-plugin` (workerd에서 실행).

## 이유

- Workers 무료 플랜: 하루 10만 요청, 웹훅용 HTTPS 기본 제공, `wrangler rollback`.
- D1은 SQL로 조회하고, wrangler로 마이그레이션을 관리한다. SQLite라 옮기기 쉽다.
- 무료 플랜의 요청당 CPU 10ms는 이 봇의 작업에 충분하다. 네트워크 대기 시간은 포함되지 않는다.

## 대안

- Supabase: 무료 프로젝트는 7일간 활동이 적으면 일시정지된다.
- Deno Deploy + KV: 관계형 조회가 번거롭다.
- 항상 켜둔 서버: 운영 부담이 가장 크다.
- Durable Objects (SQLite): 미루기 만료를 정확한 시각에 처리해야 할 때 다시 검토한다.

## 결과

- Cloudflare 전용 코드는 `src/adapters/`에만 둔다.
- HTML 파싱은 하지 않는다. 메타데이터는 oEmbed(JSON)만 쓴다.

## 의존성 메모 (2026-10-17)

- `@cloudflare/vitest-pool-workers`는 `@cloudflare/vitest-plugin`으로 이름이 바뀌었다. 새 이름을 쓴다.
- wrangler 4.148.0 이하와 그에 묶인 miniflare에 high 등급 취약점이 있다 (sharp, undici).
- 그래서 출시 2주가 안 된 wrangler 4.150.0과 vitest-plugin 1.4.1을 쓴다. 보안 수정이 출시 기간 기준보다 우선한다.
