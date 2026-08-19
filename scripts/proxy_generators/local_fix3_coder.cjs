const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/components/FearGreedBacktestTab.tsx';
  const code = fs.readFileSync(targetFile, 'utf-8');

  const userPrompt = `
Here is \`src/components/FearGreedBacktestTab.tsx\`:
\`\`\`tsx
${code}
\`\`\`

Fix the runtime crash error:
1. \`testResult.strategyResult.totalReturnVsBuyHold\` is undefined because \`totalReturnVsBuyHold\` does not exist on \`BacktestResult\`.
2. Instead of reading it from \`strategyResult\`, calculate it manually:
   \`testTotalReturnVsBuyHold: (testResult.strategyResult.totalReturn - testResult.buyAndHoldResult.totalReturn) * 100\`
   (Or just \`testResult.strategyResult.totalReturn - testResult.buyAndHoldResult.totalReturn\` depending on if it's a percentage).
3. Update the state mapping inside \`useEffect\` where \`setBacktestResults\` is called.
4. Return ONLY the full TypeScript code wrapped in \`\`\`tsx and \`\`\`.
`;

  console.log("로컬 Qwen 모델에게 런타임 크래시 버그 수정을 요청합니다...");

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
