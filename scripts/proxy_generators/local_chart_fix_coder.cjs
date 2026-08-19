const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/components/FearGreedBacktestTab.tsx';
  const code = fs.readFileSync(targetFile, 'utf-8');

  const userPrompt = `
Here is \`src/components/FearGreedBacktestTab.tsx\`:
\`\`\`tsx
${code}
\`\`\`

The user found two critical issues:
1. The data in \`dailyData\` is newest-first (August -> January). It MUST be reversed chronologically (oldest first) BEFORE running \`runBacktest\` and BEFORE plotting on the chart.
2. They want to see the Buy and Sell signals plotted directly on the Recharts graph.

Task:
1. Sort or reverse \`dailyData\` chronologically before doing anything (e.g. \`const chronologicalData = [...dailyData].reverse();\`). Use \`chronologicalData\` for filtering \`trainData\` and \`testData\`.
2. In the component, create a new array \`chartData\` based on \`testData\`. Loop through \`testData\` (from index 1). Calculate \`deltaFG = currentFG - previousFG\`. 
   If \`deltaFG <= -buyDropThreshold\`, set \`buySignal: testData[i+1]?.nasdaqIndex\` (since execution is T+1).
   If \`deltaFG >= sellRiseThreshold\`, set \`sellSignal: testData[i+1]?.nasdaqIndex\`.
   Include all other properties of \`testData[i]\` in the \`chartData\` items.
3. Pass this \`chartData\` to \`<LineChart>\` instead of the raw data.
4. Add two new series to the \`<LineChart>\` for the signals:
   - \`<Line yAxisId="left" type="monotone" dataKey="buySignal" stroke="none" dot={{ fill: '#10b981', r: 6 }} isAnimationActive={false} name="Buy Signal" />\`
   - \`<Line yAxisId="left" type="monotone" dataKey="sellSignal" stroke="none" dot={{ fill: '#f43f5e', r: 6 }} isAnimationActive={false} name="Sell Signal" />\`
5. Return ONLY the full TypeScript React code wrapped in \`\`\`tsx and \`\`\` block. No explanations.
`;

  console.log("로컬 Qwen 모델에게 차트 데이터 정렬 및 시그널 마커 추가를 요청합니다...");

  const payload = {
    model: "qwen2.5-coder:14b",
    prompt: userPrompt,
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
    const output = data.response;
    
    const match = output.match(/```(?:tsx|typescript|ts)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(targetFile, match[1].trim());
      console.log('✅ Fixed ' + targetFile);
    }
  } catch(e) {}
}

runLocalCoder();
