const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/components/FearGreedBacktestTab.tsx';
  const code = fs.readFileSync(targetFile, 'utf-8');

  const userPrompt = `
Here is \`src/components/FearGreedBacktestTab.tsx\`:
\`\`\`tsx
${code}
\`\`\`

The user requested: "I want to see the 2026 backtesting data in a graph at the bottom. Plot S&P500, Nasdaq100, and Fear & Greed index in different colors. The graph MUST be zoomable and readable."

Task:
1. Import \`LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush\` from \`'recharts'\`.
2. Extract the 2026 data array (which you already filter as \`testData\`).
3. Add a new card at the bottom of the UI (after the Insights card) containing a Recharts \`<ResponsiveContainer width="100%" height={400}>\` block.
4. The \`<LineChart data={testData}>\` should have:
   - \`<XAxis dataKey="date" />\`
   - Two \`<YAxis>\`: one on the \`left\` for indices, one on the \`right\` for Fear&Greed (domain \`[0, 100]\`).
   - Three \`<Line>\`s with different distinct colors (e.g., #3b82f6 for S&P, #8b5cf6 for Nasdaq, #ef4444 for FearGreed). Map \`sp500Index\`, \`nasdaqIndex\`, \`fearGreedIndex\`. Assign \`yAxisId\` properly.
   - \`<Tooltip />\` (dark theme styled if possible) and \`<Legend />\`.
   - \`<Brush dataKey="date" height={30} stroke="#8884d8" />\` at the bottom to allow zooming/panning!
5. Ensure the surrounding card has the dark theme \`bg-slate-900 border border-slate-800 rounded-xl p-6\`.
6. Return ONLY the full TypeScript React code wrapped in \`\`\`tsx and \`\`\` block. No explanations.
`;

  console.log("로컬 Qwen 모델에게 Recharts 기반 백테스트 차트 추가를 요청합니다...");

  const payload = {
    model: "qwen2.5-coder:14b",
    prompt: userPrompt,
    stream: false,
    options: { temperature: 0.2, num_predict: 6000 }
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
      console.log('✅ Added Recharts graph to ' + targetFile);
    }
  } catch(e) {}
}

runLocalCoder();
