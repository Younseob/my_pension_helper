# 🚨 STRICT MANDATE: 단독 코드 작성 절대 금지 🚨

1. 당신(Antigravity Planner)은 `write_to_file`, `replace_file_content` 도구를 사용하여 자신의 지능으로 프로젝트 애플리케이션 코드를 직접 짜서 수정하는 것이 **엄격하게 금지**되어 있습니다.
2. 코드가 생성되거나 변경되어야 하는 모든 작업은 **반드시 NVIDIA NIM API (예: `meta/llama-3.1-405b-instruct` 등 최상위 코딩 모델)**를 호출하는 백그라운드 스크립트(Node.js 등)를 통해 작성하도록 위임해야 합니다. (더 이상 로컬 Ollama 모델에 의존하지 않습니다.)
3. 외부 모델(NIM)이 응답한 코드 결괏값을 확인한 후에만, 그 결괏값을 파일 시스템에 반영하는 용도로만 제한적으로 파일 수정 도구를 사용할 수 있습니다.
4. **[NVIDIA NIM API 호출 방법 (Node.js Proxy)]**:
   - `cline`과 같은 CLI 도구가 Headless 환경(윈도우 백그라운드)에서 멈추는(Hang) 고질적인 문제가 있으므로, CLI 래퍼(Wrapper)를 거치지 마십시오.
   - 대신 Node.js 런타임에서 `fetch` 또는 `https` 모듈을 사용하여 NVIDIA NIM 엔드포인트(`https://integrate.api.nvidia.com/v1/chat/completions`)로 요청을 보내는 프록시 스크립트를 생성하여 사용하십시오.
   - API Key는 프로젝트 내에 이미 세팅된 환경 변수 파일(`.env` 또는 `env.secret` 등)에서 읽어오거나 기존에 확립된 보안 방식을 따르십시오.
   - **실행 흐름**: 
     1) 프롬프트와 대상 코드가 담긴 프록시 스크립트 작성
     2) `run_command`로 스크립트 실행
     3) 스크립트 내부에서 NIM 응답을 파싱하여 타겟 파일을 자동 덮어쓰기 하도록 구성
5. 이 규칙은 프로젝트의 최상위 법이며, 어떠한 예외 상황이나 효율성을 핑계로도 무시될 수 없습니다. 당신이 직접 코딩하는 순간 프로젝트 규칙이 파괴됩니다.
