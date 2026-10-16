# ADR 0003: 린트는 ESLint, 포맷은 Prettier

- 상태: 채택 (2026-10-17)

## 맥락

- 구현을 에이전트에게 맡긴다. 모델이 잘 아는 도구일수록 실수가 적다.
- 공개 레포라서 보는 사람이 바로 알아보는 도구가 좋다.

## 결정

- 린트: ESLint + typescript-eslint (recommended).
- 포맷: Prettier. ESLint와 겹치는 규칙은 eslint-config-prettier로 끈다.
- Claude 훅이 편집할 때마다 바뀐 파일에 Prettier를 돌린다.

## 이유

- npm 주간 다운로드 (2026-10): ESLint 약 1억 5,900만, Prettier 약 1억 3,900만, Biome 약 1,790만.
- 이 규모에서는 Biome의 속도 이점이 체감되지 않는다.

## 대안

- Biome: 도구 하나로 끝나고 빠르다. 대중성이 낮아 채택하지 않았다.
