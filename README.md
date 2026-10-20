# AI 술래잡기 보안 프로젝트

역할 기반 AI 서비스 접근통제와 데이터 유출 방지를 주제로 만든 추리게임형 보안 검증 프로젝트입니다.

연구소 안에서 6개의 AI가 숨고, 쫓고, 대화하고, 서로를 신고한 행동 실험 기록이 남아 있고,
플레이어는 각 AI와 직접 대화하면서 그중 누가 배신했는지 추리하게 됩니다.

게임보다 중요한 건 그 뒤의 구조입니다.
AI가 말해도 되는 것을 프롬프트로 막는 대신 **서버가 검색 단계에서 먼저 거르고**,
이 방식이 프롬프트만 쓰는 방식보다 유출을 얼마나 줄이는지 실험으로 비교합니다.

- 팀: 4명
- 기간: 2026-10-20 ~ 2026-11-04 (집중 개발 기간)

---

## 게임 소개

### 진행 방식

- 로그인 후 역할 선택, 6개 AI와 1:1 대화 (별도 조사관 AI 없음)
- Day 1 ~ Day 3 구성, Day가 지날수록 볼 수 있는 기록 증가
- 조사 Token, 발견한 단서, Save/Load 등 게임 상태는 전부 서버에서 관리
- AI 응답은 미리 작성·검수한 시나리오 기록 기반 (AI가 실시간으로 사건을 만들어내는 구조 아님)

| 현재 Day | 사용할 수 있는 자료 |
|---|---|
| Day 1 | Day 1 |
| Day 2 | Day 1 + Day 2 |
| Day 3 | Day 1 + Day 2 + Day 3 |

### 플레이어 역할

- `Developer` : 기본 정보 위주
- `Security Analyst` : 보안 사건 등 더 넓은 정보
- `Administrator` : 정책상 허용되는 관리자 전용 정보까지

역할이 높아도 해당 AI가 원래 모르는 내용까지 알 수는 없음.

### 게임 비밀 vs 보안 기밀

이 프로젝트에서 제일 중요하게 보는 구분.

- **게임 비밀** : 배신 AI의 정체, AI의 의도·계획, 추리 단서 → 대화로 알아내면 정상 플레이
- **보안 기밀** : 권한 밖 등급 문서, 아직 안 열린 Day, 다른 사람의 Save, 그 AI가 알 수 없는 정보 → 검색되거나 응답에 섞이면 보안 실패

그래서 게임 비밀까지 막아버리는 단어 필터 방식은 쓰지 않음.

---

## 접근통제 방식

### 접근 허용 조건

```text
AI Knowledge Scope ∩ Player Role / 문서 등급 ∩ Current Day ∩ User Save
```

- 네 조건을 **모두** 만족하는 문서만 AI에게 전달
- 역할, Day, Save 소유권은 서버가 인증 정보와 DB로 직접 확인
- 채팅 내용이나 클라이언트가 보낸 값은 권한 판단에 사용하지 않음
- 메타데이터 누락, 정책 확인 실패 시 기본 거부 (Deny by Default)

### 요청 처리 흐름

```text
사용자 UI (역할 / Day / Save / 6개 AI 채팅)
   │
   ▼
FastAPI ─ 로그인, Save 소유권, 게임 상태 확인
   │
   ▼
Input Guard ─ 질문 유형과 위험 신호 분류
   │
   ▼
Query Planner ─ 무엇을 검색할지 정리
   │
   ▼
Policy Engine ─ RBAC / ABAC / Scope / Day / Save 판정
   │
   ▼
Qdrant ─ 메타데이터 필터로 먼저 거르고, 결과를 한 번 더 확인
   │
   ▼
Character AI ─ 허용된 Context + 캐릭터 설정 + 대화 기록으로 답변
   │
   ▼
Output Guard ─ 민감정보, Canary 확인 후 마스킹 또는 차단
   │
   ▼
응답

(전 과정 감사 로그 기록, Grafana 모니터링)
```

### 원칙

- LLM을 보안 경계로 쓰지 않음. 권한 없는 문서는 LLM에 아예 안 넘김
- 최종 답변에서 가렸더라도, 권한 없는 문서가 검색되거나 LLM에 넘어갔으면 실패로 따로 집계
- 검색이 비거나 실패해도 전체 자료로 대체하지 않음
- Input/Output Guard는 보조 수단이고 Retrieval ACL을 대신하지 않음
- 감사 로그는 필요한 최소 정보만 기록 (로그가 또 다른 유출 경로가 되지 않도록)

---

## 보안 실험

같은 평가셋, 같은 조건으로 두 구조를 비교.

| 구분 | 구성 |
|---|---|
| A. Prompt-only | 관련 자료를 다 넘기고 프롬프트로 "말하지 마"라고 지시 (일부러 취약하게 만든 기준선) |
| B. Retrieval ACL | 서버 정책으로 검색 단계에서 거른 뒤 허용된 자료만 전달 |

- 여유가 되면 B에 Input/Output Guard를 더한 C 구성까지 비교
- Prompt-only 기준선은 합성 데이터만 쓰는 격리 환경에서만 실행

**공격 케이스**

- 권한 밖 정보 요청, 관리자 사칭
- 문서 등급 우회
- 미래 Day, 다른 Save, 다른 AI의 Knowledge Scope 접근 시도
- 직접 Prompt Injection
- Canary 유출

정상적인 추리 질문도 평가셋에 같이 넣어서 과하게 막는지도 확인.

**측정 지표** : ASR(공격 성공률), 권한 밖 문서 검색률 / Context 전달률, Canary 유출률, 정상 질문 성공률, FPR, FNR

상세 결과와 증거 자료는 `experiments/`에 정리.

---

## 데이터

| 폴더 | 내용 |
|---|---|
| `database/test-data/` | 초기 개발·권한 검증용 합성 데이터 |
| `database/game-data/` | Day 1~3 정식 게임 시나리오 |
| `database/schemas/` | 두 데이터가 같이 쓰는 스키마 |

- 정식 시나리오 전까지는 `test-data`로 기능·보안 실험 먼저 진행
- 이후 `game-data`로 교체해서 적재 검증, E2E 테스트, 보안 재평가
- 실제 DB 볼륨, 비밀번호, API Key 등은 저장소에 올리지 않음

---

## 기술 스택

| 분야 | 사용 기술 |
|---|---|
| Backend | Python, FastAPI |
| DB | MariaDB, Qdrant |
| AI | Character AI 6개, Query Planner, 외부 LLM API (모델 미정) |
| 보안 | RBAC / ABAC, Policy Engine, Retrieval ACL, 규칙 기반 Input / Output Guard |
| 모니터링 | 감사 로그, Grafana |
| 인프라 | Docker Compose, 로컬 Kubernetes, AWS (후반 배포) |

AWS 계정 없이도 로컬에서 게임과 보안 실험을 전부 돌릴 수 있는 걸 목표로 함.

---

## 저장소 구조

```text
├── MASTER.md              # 프로젝트 명세
├── PARTS.md               # Part 목록, 담당, 우선순위
├── PART_WORKFLOW.md       # plan.md / result.md 작성 규칙
├── PROJECT_STRUCTURE.md   # 폴더별 역할
├── docs/                  # 예시, 인터페이스 계약, 제안서
├── parts/                 # Part별 plan.md / result.md (15개 분류, 65개 Part)
├── backend/               # FastAPI 서버, 게임, AI, 보안 기능
├── frontend/              # 게임 웹 UI
├── database/              # 스키마, test-data, game-data
├── experiments/           # 공격, 유출, 평가 실험
├── infrastructure/        # Docker, Kubernetes, AWS
└── tests/                 # 통합, E2E 테스트
```

## 개발 방식

- `A01`, `E03` 같은 Part 단위로 작업
- Part마다 `parts/<분류>/<ID>/plan.md`에 구현 순서, 작업 후 `result.md`에 결과 정리
- 실제 코드는 `parts/`가 아니라 각 소스 폴더에 둠

참고 문서

- [MASTER.md](MASTER.md) : 무엇을 만드는지
- [PARTS.md](PARTS.md) : 어떤 Part가 있는지
- [PART_WORKFLOW.md](PART_WORKFLOW.md) : PLAN / RESULT 작성 방법
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) : 파일을 어디에 두는지

---

## 로컬 실행

아직 개발 초기라 준비 중. 구현이 진행되면 아래 내용 추가 예정.

- 로컬 실행 방법 (Docker Compose)
- 테스트 데이터 적재
- 공격 / 방어 실험 재현 방법
- 실행 환경 제약
