const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/components/FearGreedBacktestTab.tsx';
  const code = fs.readFileSync(targetFile, 'utf-8');

  const userPrompt = `
Here is \`src/components/FearGreedBacktestTab.tsx\`:
\`\`\`tsx
${code}
\`\`\`

Fix the TS compilation errors:
1. \`testData\` is not defined because it is declared inside \`useEffect\` but used outside for \`chartData\`.
2. \`dailyData\` is static, so move the declaration of \`chronologicalData\`, \`trainData\`, and \`testData\` completely OUTSIDE of the \`useEffect\` (put them directly inside the component body, before \`useEffect\`).
3. Make sure to type \`data\` and \`i\` correctly in \`testData.map((data: any, i: number) => ...)\` if needed, though TS can infer it if \`testData\` is typed.
4. Keep all other logic exactly the same.
Return ONLY the full TypeScript React code wrapped in \`\`\`tsx and \`\`\` block. No explanations.
`;

  console.log("로컬 Qwen 모델에게 TS 컴파일 에러(변수 스코프 문제) 수정을 요청합니다...");

  const payload = {
    model: "qwen2.5-coder:14b",
    prompt: userPrompt,
    stream: false,
    options: { temperature: 0.1, num_predict: 5000 }
  };

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    const output = data.response;
    
    const match = output.match(/```(?:tsx|typescript|ts)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(targetFile, match[1].trim());
      console.log('✅ Fixed ' + targetFile);
    }
  } catch(e) {}
}

runLocalCoder();
