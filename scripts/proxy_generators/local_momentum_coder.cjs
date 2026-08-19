const fs = require('fs');

async function runLocalCoder() {
  const enginePath = 'src/utils/backtestEngine.ts';
  const tabPath = 'src/components/FearGreedBacktestTab.tsx';

  const engineCode = fs.readFileSync(enginePath, 'utf-8');
  const tabCode = fs.readFileSync(tabPath, 'utf-8');

  const enginePrompt = `
Here is \`src/utils/backtestEngine.ts\`:
\`\`\`ts
${engineCode}
\`\`\`
Task: Change 1-day delta to N-day trend delta.
1. Add \`trendDays: number\` to \`strategyParams\`.
2. Start the loop from \`i = strategyParams.trendDays\`.
3. Calculate \`deltaFG = currentFG - data[i - strategyParams.trendDays].fearGreedIndex\`.
4. Return ONLY the full TS code in \`\`\`ts and \`\`\`.
`;

  const tabPrompt = `
Here is \`src/components/FearGreedBacktestTab.tsx\`:
\`\`\`tsx
${tabCode}
\`\`\`
Task: Update UI to support N-day Trend logic.
1. Add state: \`const [trendDays, setTrendDays] = useState(5);\`
2. Update the calls to \`runBacktest\` to include \`trendDays\` in the params object.
3. In the \`chartData\` generation loop, start from \`i = trendDays\`. Calculate \`deltaFG = data.fearGreedIndex - testData[i - trendDays].fearGreedIndex\`.
4. Add a new Input/Slider for "추세 관찰 기간 (Trend Days)" next to the other inputs (default 5, min 1, max 30).
5. Update the text descriptions to mention "N일 동안의 하락 추세/상승 추세" instead of "하루 만에".
6. Return ONLY the full TSX code in \`\`\`tsx and \`\`\`.
`;

  async function askModel(prompt, targetFile) {
    console.log("Requesting logic change for " + targetFile);
    const payload = {
      model: "qwen2.5-coder:14b",
      prompt: prompt,
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
      const match = data.response.match(/```(?:tsx|typescript|ts)\n([\s\S]*?)```/);
      if (match && match[1]) {
        fs.writeFileSync(targetFile, match[1].trim());
        console.log('✅ Fixed ' + targetFile);
      }
    } catch(e) { console.error(e); }
  }

  await askModel(enginePrompt, enginePath);
  await askModel(tabPrompt, tabPath);
  
  await fetch("http://localhost:11434/api/generate", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: "qwen2.5-coder:14b", keep_alive: 0 })
  });
}

runLocalCoder();
