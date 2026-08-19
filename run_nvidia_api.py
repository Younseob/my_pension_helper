import os
from openai import OpenAI

# 환경 변수에서 NVIDIA_API_KEY를 가져옵니다. 
# 만약 설정되어 있지 않다면, 두 번째 인자에 직접 키를 문자열로 넣어도 됩니다.
api_key = os.environ.get("NVIDIA_API_KEY")

if not api_key:
    print("Error: NVIDIA_API_KEY 환경 변수가 설정되어 있지 않습니다.")
    print("실행 전에 터미널에서 다음 명령어로 키를 설정해주세요:")
    print("  $env:NVIDIA_API_KEY='여기에_실제_API키_입력'")
    exit(1)

client = OpenAI(
  base_url = "https://integrate.api.nvidia.com/v1",
  api_key = api_key
)

print("NVIDIA API 서버로 요청을 전송합니다...\n")

completion = client.chat.completions.create(
  model="nvidia/nemotron-3.5-lightning-30b-a3b",
  messages=[{"role":"user","content":"Write a limerick about the wonders of GPU computing."}],
  temperature=1,
  top_p=0.95,
  max_tokens=16384,
  extra_body={"chat_template_kwargs":{"enable_thinking":True},"reasoning_budget":16384},
  stream=True
)

for chunk in completion:
  if not chunk.choices:
    continue
    
  # Reasoning(생각 과정) 파트 출력
  reasoning = getattr(chunk.choices[0].delta, "reasoning_content", None)
  if reasoning:
    print(reasoning, end="")
    
  # 실제 답변 콘텐츠 출력
  if chunk.choices[0].delta.content is not None:
    print(chunk.choices[0].delta.content, end="")

print("\n\n완료되었습니다!")
