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
Task: Change the trading logic from Trend/Delta to Absolute Fear & Greed Index values.
1. Change \`strategyParams\` to \`{ buyThreshold: number, sellThreshold: number }\`. (Remove \`trendDays\`, \`buyDropThreshold\`, \`sellRiseThreshold\`).
2. You can start the loop from \`i = 0\` since we don't need previous days. But since execution is T+1, wait, just keep \`i = 1\` and use \`previousFG\` or \`currentFG\` appropriately. Actually, loop from \`i = 0\` to \`data.length - 2\` so we can execute at \`i + 1\`.
3. Logic: 
   \`const currentFG = data[i].fearGreedIndex;\`
   \`const nextDayPrice = data[i+1].nasdaqIndex;\`
   If \`currentFG <= strategyParams.buyThreshold\`, BUY using \`nextDayPrice\`.
   If \`currentFG >= strategyParams.sellThreshold\`, SELL using \`nextDayPrice\`.
4. Return ONLY the full TS code in \`\`\`ts and \`\`\`.
`;

  const tabPrompt = `
Here is \`src/components/FearGreedBacktestTab.tsx\`:
\`\`\`tsx
${tabCode}
\`\`\`
Task: Update UI to match the absolute Fear & Greed threshold logic.
1. Change state variables to \`const [buyThreshold, setBuyThreshold] = useState(20);\` and \`const [sellThreshold, setSellThreshold] = useState(50);\`
2. Remove \`trendDays\` entirely.
3. Update \`runBacktest\` calls to pass \`{ buyThreshold, sellThreshold }\`.
4. Update \`chartData\` generation:
   \`buySignal: data.fearGreedIndex <= buyThreshold ? testData[i + 1]?.nasdaqIndex : undefined\`
   \`sellSignal: data.fearGreedIndex >= sellThreshold ? testData[i + 1]?.nasdaqIndex : undefined\`
5. Update text descriptions in the UI. Explain: "공포탐욕지수가 이 수치 이하로 떨어지면(극심한 공포) 전액 매수합니다." and "공포탐욕지수가 이 수치 이상으로 올라가면(탐욕) 전액 매도합니다."
6. Return ONLY the full TSX code in \`\`\`tsx and \`\`\`.
`;

  async function askModel(prompt, targetFile) {
    console.log("Requesting logic change for " + targetFile);
    const payload = {
      model: "qwen2.5-coder:14b",
      prompt: prompt,
      stream: false,
      options: { temperature: 0.1, num_predict: 6000 }
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
