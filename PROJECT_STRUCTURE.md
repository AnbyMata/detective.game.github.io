# AI 술래잡기 보안 프로젝트 — 프로젝트 파일 구조 v3.1 (MASTER v5.1 / PARTS v5.2 반영)

> **목적:** 팀원 4명이 하나의 Git 저장소에서 개발할 때 공통 문서, Part별 PLAN/RESULT, 실제 구현 코드와 데이터의 저장 위치를 구분한다.
>
> **저장소 배치 파일명:** `PROJECT_STRUCTURE.md` (기존 문서 `프로젝트 파일 구조 v3.0.md`의 후속 버전).
>
> **고정 범위:** `parts/<분류>/<ID>/`, `docs/interfaces/`, `database/schemas/`, `database/test-data/`, `database/game-data/` 및 최상위 공통 문서의 위치. 그 외 기능 폴더의 내부 구현 구조는 담당자가 설계한다.
>
> **기준:** `MASTER.md` v5.1, `PARTS.md` v5.2. 현재 **15개 대분류·65개 Part**이며 `E05` 신설은 미확정이다.

## 1. 전체 디렉터리 구조

```text
ai-hide-and-seek/
│
├── README.md                 # 외부 공개용 소개·로컬 실행 방법
├── MASTER.md                 # 모든 AI가 공유하는 프로젝트 명세
├── PARTS.md                  # 15개 대분류·65개 Part 목록·담당·우선순위
├── AGENTS.md                 # AI 공통 협업·개발 지침
├── PART_WORKFLOW.md          # PLAN·RESULT 작성/참조 세부 규칙
├── PROJECT_STRUCTURE.md      # 현재 문서: 저장소 폴더·파일 역할
├── .gitignore
├── .env.example              # 비밀값을 제외한 환경변수 예시
│
├── docs/                     # 팀 공통 문서
│   ├── examples/             # PLAN 2개 + RESULT 2개 예시
│   ├── interfaces/           # Gate 0부터 합의·커밋할 API·모듈·데이터 계약
│   └── proposal/             # 사람용 프로젝트 제안서
│
├── parts/                    # Part별 개발 계획 및 결과 (15개 분류, 65개 Part)
│   ├── A-game/               # A01 ~ A04
│   │   ├── A01/
│   │   │   ├── plan.md
│   │   │   └── result.md     # 작업 결과가 생길 때 생성 가능
│   │   ├── A02/
│   │   ├── A03/
│   │   └── A04/
│   ├── B-database/           # B01 ~ B05
│   ├── C-planner/            # C01 ~ C03
│   ├── D-character-ai/       # D01 ~ D04
│   ├── E-rag/                # E01 ~ E04
│   ├── F-access-control/     # F01 ~ F04
│   ├── G-guardrails/         # G01 ~ G04
│   ├── H-audit/              # H01 ~ H04
│   ├── I-backend/            # I01 ~ I06
│   ├── J-frontend/           # J01 ~ J03
│   ├── K-infrastructure/     # K01 ~ K04
│   ├── L-attack-tests/       # L01 ~ L05
│   ├── M-leakage-tests/      # M01 ~ M05
│   ├── N-evaluation/         # N01 ~ N07
│   └── O-documentation/      # O01 ~ O03
│
├── backend/                  # FastAPI 및 서버 측 핵심 기능
│   ├── api/                  # 인증·게임·채팅 API
│   ├── game/                 # Day·Save·Token·게임 진행
│   ├── planner/              # Query Planner
│   ├── character_ai/         # 6개 Character AI
│   ├── rag/                  # Qdrant 검색·Context 구성
│   ├── policy/               # RBAC·ABAC·Retrieval ACL
│   ├── guardrails/           # Input Guard·Output Guard
│   ├── audit/                # 감사 로그·보안 이벤트
│   └── common/               # 공통 설정·DB 연결 등
│
├── frontend/                 # 게임 웹 UI
│
├── database/                 # DB 스키마·적재용 데이터 원본
│   ├── schemas/             # 테스트·정식 공통 스키마
│   ├── test-data/           # 개발·보안 검증용 합성 데이터
│   │   ├── mariadb/
│   │   └── qdrant/
│   └── game-data/           # 정식 게임 시나리오 데이터
│       ├── mariadb/
│       └── qdrant/
│
├── experiments/              # L·M·N 보안 실험 실행·분석 자료
│   ├── attacks/             # L: 권한 우회·Prompt Injection
│   ├── leakage/             # M: 정보 유출·Canary 검증
│   └── evaluation/          # N: 방어 성능 비교·재평가
│
├── infrastructure/           # 컨테이너·배포 환경
│   ├── docker/              # 로컬 Docker
│   ├── kubernetes/          # 로컬 Kubernetes
│   └── aws/                 # 후반 AWS 배포
│
└── tests/                    # 공통 통합·E2E 테스트
```

> 위 트리는 **관리 기준을 보여주는 설계안**이다. 아직 만들지 않은 `plan.md`·`result.md` 또는 구현 파일을 미리 채우라는 의미는 아니다. **Part ID 자동 탐색을 위해 65개 Part 디렉터리는 미리 준비하는 것을 권장**하며, Git이 빈 디렉터리를 추적하지 않으므로 `.gitkeep` 등을 사용할 수 있다. `plan.md`는 계획 작성 요청 시, `result.md`는 실제 작업 결과가 발생했을 때 작성한다.
>
> `CLAUDE.md`, `.cursor/rules/` 등 도구별 자동 로딩 파일은 실제 사용하는 개발 도구에 맞게 추가할 수 있다. **공통 규칙의 원본은 `AGENTS.md`와 `PART_WORKFLOW.md`**이며, 도구별 파일은 원본을 참조하도록 간결하게 구성한다. 도구별 파일의 존재를 프로젝트 기능 구현의 전제조건으로 가정하지 않는다.

## 2. Part별 고정 형식

모든 Part는 `parts/<대분류>/<Part ID>/` 구조를 따른다.

```text
parts/
└── E-rag/
    └── E03/
        ├── plan.md           # 선행 Part RESULT 링크 + 구현 순서
        └── result.md         # 실제 작업 후 PLAN 번호별 결과 요약
```

- **선행 Part ID는 PLAN을 요청한 사용자가 직접 지정**한다. `PARTS.md`의 `권장 선행 Part`는 사용자가 참고하는 목록이며 AI가 자동으로 붙이는 목록이 아니다.
- `plan.md`: AI가 **사용자 지정 선행 ID의 실제 폴더를 자동 탐색**하고, 확인한 `result.md`의 상대 경로를 기재한 다음 번호순 구현 계획을 작성한다. 선행을 미지정한 경우 임의로 `없음` 처리하지 않고 확인한다.
- `result.md`: 실제로 수행한 작업 결과를 **PLAN의 번호·작업명과 대응**하여 짧게 요약한다. 작업 번호 `1, 2, 3…`은 순서일 뿐 별도 Part나 우선순위가 아니다.
- PLAN 작성 시 **지정된 선행 Part의 RESULT만 우선 읽는다**. 선행 PLAN이나 전체 RESULT를 일괄 열람하지 않는다. 실제 연동에 필요하면 RESULT에서 안내하는 합의된 계약·코드·테스트를 추가 확인할 수 있다.
- 선행 `result.md`가 아직 없다면 **`RESULT 미생성`**이라고 표시한다. 미생성·미완료 상태를 구현 완료로 가정하지 않으며, 추가 의존성이 의심되면 사용자의 승인을 받기 전에는 선행 목록을 바꾸지 않는다.
- 실제 코드는 `parts/`가 아닌 해당 소스코드 폴더에 저장한다.
- 기록 방식·예시 4개는 `PART_WORKFLOW.md`와 `docs/examples/`를 따른다.

### 선행 RESULT 상대 경로 예시

`parts/E-rag/E03/plan.md`에서 참조하는 경우:

```md
## 선행 Part
- C01 - Query Planner 입출력 및 질의 분석 기준 설계: [RESULT](../../C-planner/C01/result.md)
- E02 - 벡터 검색·Context 구성: [RESULT](../E02/result.md)
- F02 - Policy Engine 구현: [RESULT](../../F-access-control/F02/result.md)
```

위는 사용자가 `E03 PLAN 작성. 선행: C01, E02, F02`라고 지정했을 때의 **상대 경로 예시**다. AI가 선행 목록을 임의로 선정했다는 뜻이 아니다. 상대 경로는 **현재 Part 폴더를 기준**으로 실제 파일 위치를 검사해 계산한다. 미생성 RESULT는 상태를 명시하고, 필요할 때만 실제 코드·인터페이스를 확인한다.

## 3. 폴더별 책임 경계

| 구역 | 저장하는 것 | 저장하지 않는 것 |
|---|---|---|
| `parts/` | 각 Part의 구현 순서·결과 기록 | 실행 소스코드 사본 |
| `docs/` | 공통 예시·인터페이스·제안서 | Part별 진행 일지 |
| `backend/` | 서버 API·게임·AI·보안 기능 | 개발 결과 보고서 |
| `frontend/` | 게임 웹 화면·프론트 로직 | 서버 핵심 접근통제 판단 |
| `database/` | 데이터 스키마·초기 적재 원본 | 실제 DB 데이터 볼륨·비밀정보 |
| `experiments/` | 공격·유출·평가 실행 코드 및 증거 | 일반 기능 테스트의 중복 사본 |
| `infrastructure/` | Docker·K8s·AWS 배포 구성 | 서비스 구현 코드 복사본 |
| `tests/` | 모듈 간 통합·E2E 자동화 검증 | 상세 보안 실험 보고서 |

## 4. 데이터 분리 및 초기 계약 원칙

- `database/test-data/`: 정식 시나리오 완성 전 개발·권한 검증에 사용할 **합성 테스트 데이터**. `fixture`는 개념 설명으로만 사용한다.
- `database/game-data/`: Day 1~3 등 **정식 게임 콘텐츠 데이터**. `scenario`는 개념 설명으로만 사용한다.
- 양쪽 데이터는 **공통 스키마·메타데이터 계약**을 사용한다. 적재 시 환경·DB·Qdrant 컬렉션 또는 데이터셋 식별자를 구분해 혼합을 막는다.
- 두 폴더에는 원본 JSON/SQL/문서 및 적재 리소스를 두며, MariaDB/Qdrant가 실행 중 저장하는 **실제 볼륨과 비밀정보는 Git에 올리지 않는다**.
- **초기 Gate 0 계약:** `docs/interfaces/`에 합의된 주요 API·에러·모듈 입출력 계약을, `database/schemas/`에 공통 데이터 스키마를 실제 파일로 남긴다. 구체적인 필드명·API 경로·오류 응답 형식은 담당 Part 합의로 결정하며, 이 구조 문서가 임의로 확정하지 않는다.
- 초기 계약이 준비되는 동안에도 독립적인 설계·Mock·인프라 준비는 진행할 수 있다. **계약 없는 실제 모듈 연동을 완료로 보고하지 않는다.**
- **개발 순서:** `test-data` 또는 합의된 Mock을 통한 병렬 개발·기본 보안 실험 → `game-data` 제작·적재 → **B05(적재 정합성) → I06(E2E 회귀) → N07(보안 재평가)**로 최종 검증. 정식 시나리오가 없다는 이유만으로 독립 모듈 개발을 멈추지 않는다.

## 5. 팀원 재량으로 남기는 사항

- `backend/` 내부 Python 패키지 계층 및 구체적 파일명
- `frontend/` 컴포넌트·페이지 구조
- DB 스키마 세부 파일 및 적재 스크립트 이름
- 실험·테스트 코드의 세부 하위 디렉터리
- Docker Compose·K8s·AWS 설정 파일의 상세 구성

**단, 공통 API/자료형/스키마처럼 타 Part에 영향을 주는 인터페이스는 담당자끼리 합의하고 `docs/interfaces/`에 공유한다.**

## 6. 공통 문서의 역할

- `MASTER.md`: **무엇을 만드는가?** 프로젝트의 기능·보안 목표·제약.
- `PARTS.md`: **어떤 Part가 존재하는가?** 목표·담당·우선순위·사용자 지정 시 참고할 권장 선행 ID.
- `AGENTS.md`: **어떻게 협업하는가?** 팀 공통 AI 작업 규칙.
- `PART_WORKFLOW.md`: **어떻게 PLAN/RESULT를 작성하고 참고하는가?** 구체적인 문서 작성·참조 규칙.
- `PROJECT_STRUCTURE.md`: **파일을 어디에 보관하는가?** 고정 경로와 폴더별 책임 (현재 문서).
- `README.md`: 외부인이 이해하고 실행할 수 있는 프로젝트 안내.

**운영 주의:** 현재 기준은 **65개 Part(E01~E04)**다. 실험용 `E05` 신설은 팀이 승인하기 전까지 실제 Part 폴더나 선행 관계에 추가하지 않는다. 승인 시 `PARTS.md`, `MASTER.md`, 본 문서의 E 범위 및 관련 예시·선행 링크를 함께 변경한다.

이 구조는 **초기 공통 기준**이며, 개발 과정에서 변경할 수 있다. 단, `parts/` 경로 또는 공통 계약을 바꿀 경우 기존 참조 링크·관련 문서도 함께 수정한다.
