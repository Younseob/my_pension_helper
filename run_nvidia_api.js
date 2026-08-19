import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: 'env.secret' });

const apiKey = process.env.NVIDIA_API_KEY;

if (!apiKey) {
  console.error("Error: NVIDIA_API_KEY 환경 변수가 설정되어 있지 않습니다.");
  console.log("실행 전에 터미널에서 다음 명령어로 키를 설정해주세요:");
  console.log("  $env:NVIDIA_API_KEY='여기에_실제_API키_입력'");
  process.exit(1);
}

const client = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: apiKey,
});

async function main() {
  console.log("NVIDIA API 서버로 요청을 전송합니다...\\n");

  const stream = await client.chat.completions.create({
    model: "nvidia/nemotron-3.5-lightning-30b-a3b",
    messages: [{ role: "user", content: "Write a limerick about the wonders of GPU computing." }],
    temperature: 1,
    top_p: 0.95,
    max_tokens: 16384,
    stream: true,
    // Node.js SDK에서는 extra_body 래퍼 없이 최상위(Root) 레벨에 바로 주입합니다.
    chat_template_kwargs: { enable_thinking: true },
    reasoning_budget: 16384
  });

  for await (const chunk of stream) {
    if (!chunk.choices || chunk.choices.length === 0) continue;
    
    // Some models/SDKs expose reasoning_content inside delta or as a separate property
    const delta = chunk.choices[0].delta;
    
    if (delta.reasoning_content) {
      process.stdout.write(delta.reasoning_content);
    }
    
    if (delta.content !== null && delta.content !== undefined) {
      process.stdout.write(delta.content);
    }
  }

  console.log("\\n\\n완료되었습니다!");
}

main().catch(console.error);
