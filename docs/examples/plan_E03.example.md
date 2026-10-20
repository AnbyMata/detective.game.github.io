# E03 - Query Planner·Policy Engine 연동 및 Retrieval ACL 적용

## 선행 Part
- C01 - Query Planner 입출력 및 질의 분석 기준 설계: [RESULT](../../C-planner/C01/result.md)
- E02 - 벡터 검색 및 Context 구성 구현: [RESULT](../E02/result.md)
- F02 - Policy Engine 구현: [RESULT](../../F-access-control/F02/result.md)

## 구현 계획

1. 선행 모듈 인터페이스 확인
   - Planner·벡터 검색·Policy Engine의 계약 및 연동 지점 파악

2. 검색 단계 접근통제 연동
   - 서버 정책에 따라 Qdrant 검색 필터를 적용하는 흐름 연결

3. 허용된 Context 구성
   - 검색 결과 재검증과 거부·빈 결과 처리를 연결

4. 정상·비인가 검색 검증
   - 공통 test-data 기준 허용·거부·필터 누락 사례 테스트
