const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/scripts/trainAndTest.ts';
  const code = fs.readFileSync(targetFile, 'utf-8');
  
  const userPrompt = `
Here is the current code of \`${targetFile}\`:
\`\`\`typescript
${code}
\`\`\`

The \`runBacktest\` function is imported from \`../utils/backtestEngine\`, and its signature is:
\`runBacktest(data: DailyData[], initialCapital: number, strategyParams: { buyDropThreshold: number, sellRiseThreshold: number }): { strategyResult: BacktestResult, buyAndHoldResult: BacktestResult, history: any[] }\`
where \`BacktestResult\` has \`cagr, mdd, totalReturn, finalCapital\`.

Fix the script:
1. The \`DailyData\` interface in the script is completely wrong. It should be: \`{ date: string, sp500Index: number, nasdaqIndex: number, fearGreedIndex: number }\`.
2. When calling \`runBacktest\`, pass 100000000 (1억) as \`initialCapital\`, and \`{ buyDropThreshold, sellRiseThreshold }\` as \`strategyParams\`.
3. Destructure \`strategyResult\` and \`buyAndHoldResult\` from the returned object. Use \`strategyResult.totalReturn\` for finding the best params.
4. When testing the best parameters, console log the \`strategyResult\` and \`buyAndHoldResult\` metrics correctly.

Return ONLY the TypeScript code wrapped in \`\`\`typescript and \`\`\` block.
`;

  console.log("로컬 Qwen 모델에게 스크립트 수정을 요청합니다...");

  const payload = {
    model: "qwen2.5-coder:14b",
    prompt: userPrompt,
    stream: false,
    options: { temperature: 0.1, num_predict: 4000 }
  };

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    const output = data.response;
    
    const match = output.match(/```(?:typescript|ts)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(targetFile, match[1].trim());
      console.log(`✅ Local Coder successfully updated ${targetFile}!`);
    } else {
      console.log("❌ Failed to parse code.");
    }
  } catch(e) {
    console.error("API Error: ", e);
  }
}

runLocalCoder();
