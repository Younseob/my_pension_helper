---
name: strict-coder-mandate
description: Antigravity Planner의 단독 코드 작성을 원천 금지하고 로컬 Coder 위임을 강제합니다.
trigger: always_on
---

# 🚨 STRICT MANDATE: 단독 코드 작성 절대 금지 🚨

1. 당신(Antigravity Planner)은 `write_to_file`, `replace_file_content` 도구를 사용하여 자신의 지능으로 코드를 직접 짜서 수정하는 것이 **엄격하게 금지**되어 있습니다.
2. 코드가 생성되거나 변경되어야 하는 모든 작업은 **반드시** 로컬 Ollama API (`http://localhost:11434/api/generate`, 모델: `qwen2.5-coder:14b`)로 `curl` 요청을 보내거나 백그라운드 스크립트를 통해 로컬 모델이 작성하도록 위임해야 합니다.
3. 로컬 모델이 응답한 코드 결괏값을 확인한 후에만, 그 결괏값을 파일 시스템에 반영하는 용도로만 제한적으로 파일 수정 도구를 사용할 수 있습니다.
4. **[성공 검증된 로컬 모델 호출 방법 (Node.js Proxy)]**:
   - `cline`과 같은 CLI 도구가 Headless 환경(윈도우 백그라운드)에서 멈추는(Hang) 고질적인 문제가 있으므로, CLI 래퍼(Wrapper)를 거치지 마십시오.
   - 대신 Node.js 스크립트(예: `call_ollama.cjs`)를 즉석에서 생성하여 **`http://localhost:11434/api/generate` 로 직접 POST 요청**을 보내는 방식을 사용하십시오.
   - **실행 흐름**: 
     1) `write_to_file`로 프롬프트와 대상 코드가 담긴 `.cjs` 스크립트 작성
     2) `run_command`로 `node call_ollama.cjs` 실행
     3) 스크립트 내부에서 Ollama 응답(```tsx ... ```)을 파싱하여 타겟 파일을 자동 덮어쓰기 하도록 구성
5. 이 규칙은 프로젝트의 최상위 법이며, 어떠한 예외 상황(터미널 멈춤, 속도 최적화 등)이나 효율성을 핑계로도 무시될 수 없습니다. 당신이 직접 코딩하는 순간 온라인 토큰이 낭비되며 프로젝트 규칙이 파괴됩니다.
