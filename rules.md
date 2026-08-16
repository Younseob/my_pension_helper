# 📜 RULES.md - 프로젝트 필수 준수 규칙 (Mandatory Local Agent Rules)

이 파일은 본 프로젝트(`my_pension_helper`)의 코딩 및 개발 작업 시 반드시 이행해야 하는 에이전트 운용 수칙을 정의합니다.

---

## 🚨 제1조 (로컬 에이전트 필수 운용 원칙)
1. **온라인 토큰 절감**: 본 프로젝트의 모든 소스코드 신규 작성, 리팩토링, 버그 수정 및 파일 변경 작업은 온라인 API 토큰을 소비하지 않고, **사용자 PC 로컬 환경의 Ollama LLM (`qwen2.5-coder:14b`) 및 `cline` CLI를 통해 이행하는 것을 필수 원칙**으로 한다.
2. **단독 코드 작성 금지**: 플래너 에이전트(Antigravity)가 로컬 CLI 구동 절차 없이 임의로 소스코드를 직접 작성하는 행위를 금지하며, 반드시 로컬 `cline` CLI 실행 파이프라인을 거쳐야 한다.

---

## ⚙️ 제2조 (로컬 Coder 에이전트 256K 컨텍스트 & Antigravity 정밀 플랜 수칙)
1. **Coder 256K 컨텍스트 용량 활용**: 로컬 Coder 에이전트(`qwen2.5-coder:14b`)의 컨텍스트 용량은 **256K (262,144 토큰)**으로 설정되어 있으므로, Antigravity는 프롬프트 생략 없이 전체 프로젝트 구조, 컴포넌트 스키마, 상세 금융 산식, 예외 처리를 담은 풍부한 명세서를 전달한다.
2. **Antigravity 심층 정밀 분석 (Deep Analysis & Detailed Plan)**:
   - Antigravity는 사용자 요청 수신 시 단순 요약이 아닌, **정밀 요구사항 분석(Deep Requirement Analysis)**을 수행한다.
   - 로컬 Coder가 한 번에 완성도 높은 코드를 작성할 수 있도록 모듈 설계, Props 인터페이스, Tailwind 스타일 가이드, 복리 유틸리티 연동법 및 대상 파일 경로가 작성된 **고정밀 상세 실행 플랜(High-Precision Plan)**을 작성하여 CLI에 전달한다.
3. **터미널 이관 명령어 템플릿**:
   ```bash
   cline --auto-approve true -P ollama -m qwen2.5-coder:14b "<정밀 상세 플랜 프롬프트>"
   ```
4. **자동 승인 옵션**: 로컬 에이전트 실행 시 `--auto-approve true` 옵션을 필수로 포함하여 터미널 파일 입출력을 자율 승인으로 처리한다.

---

## 🔄 제3조 (그래프 엔지니어링 6단계 멀티 에이전트 파이프라인)

```mermaid
graph TD
    User([👤 사용자 요청]) --> Node1["1. 요구사항 정밀 분석 노드<br/>(Antigravity Planner)"]
    Node1 --> Node2["2. 고정밀 업무 분장 & 256K 상세 플랜 명세 노드<br/>(Antigravity Planner)"]
    Node2 --> Node3["3. 로컬 소스코드 구현 노드<br/>(Cline Coder: qwen2.5-coder:14b)"]
    Node3 <-->|코드 수정 & 상호 피드백 검증| Node4["4. 로컬 코드 1차 검증 노드<br/>(Cline Reviewer: qwen2.5-coder:14b)"]
    Node4 -->|1차 검증 완료| Node5["5. 최종 통합 리뷰 & TypeScript Build 검증 노드<br/>(Antigravity Reviewer)"]
    
    Node5 -- "요구사항 불일치 / 타입 에러 (Feedback)" --> Node2
    Node5 -- "최종 승인 (Passed ✅)" --> Node6["6. Git Commit / Push & Render 배포 노드"]
```

1. **[Node 1: 요구사항 정밀 분석 (Antigravity Planner)]**:
   - 사용자 요청의 금융 산식, 화면 구조, 인터랙션 유저 스토리 심층 분석.
2. **[Node 2: 업무 분장 & 256K 플랜 명세화 (Antigravity Planner)]**:
   - 로컬 Coder의 256K 컨텍스트 규격에 맞춰 컴포넌트 단위 업무 분장(Work Breakdown Structure) 및 고정밀 명세서 작성.
3. **[Node 3: 로컬 소스코드 구현 (Cline Coder - `qwen2.5-coder:14b`)]**:
   - 사용자 PC의 로컬 LLM으로 Antigravity의 상세 명세서를 수신하여 소스코드 작성.
4. **[Node 4: 로컬 코드 1차 검증 (Cline Reviewer - `qwen2.5-coder:14b`)]**:
   - 로컬 환경에서 Coder가 작성한 소스코드가 플래너의 명세서 및 256K 컨텍스트 용량에 맞게 작성되었는지 상호 점검 및 교정 피드백.
5. **[Node 5: 최종 통합 리뷰 & TypeScript Build 검증 (Antigravity Reviewer)]**:
   - 플래너(Antigravity)의 최초 지시사항과 Coder/Reviewer(Cline)의 최종 소스코드가 100% 일치하는지 정밀 검토.
   - `npx tsc --noEmit` 타입 검사(0 에러) 및 `npm run build` 프로덕션 빌드 성공 검증. 조건 미달 시 Node 2로 피드백 피봇.
6. **[Node 6: Git 커밋 & 라이브 배포 (Deployer Node)]**:
   - Git Commit, GitHub Push 및 Render 웹 서비스 자동 재배포 트리거.

---

## 📌 제4조 (상태 보존 및 영속성 규칙)
1. **DOM 상주 유지**: 탭 이동 시 사용자가 조절한 슬라이더, 입력값, 시나리오 선택 상태가 초기화되지 않도록 DOM 컴포넌트 언마운트 대신 CSS `block / hidden` 스타일 표시 방식을 고수한다.
2. **상태 동기화**: 포트폴리오 비중(S&P 500 : 나스닥 100) 변경 시 모든 시나리오 카드, 30년 시뮬레이션 그래프, 수치표가 실시간으로 재계산되도록 동적 CAGR 산식을 유지한다.
