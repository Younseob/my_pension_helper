const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'fetch_daily_backtest_data.cjs';
  const referenceFile = 'update_data_wednesdays.cjs';
  const code = fs.existsSync(referenceFile) ? fs.readFileSync(referenceFile, 'utf-8') : '';

  const userPrompt = `
Here is the reference code of \`${referenceFile}\`:
\`\`\`javascript
${code}
\`\`\`

Task:
Create a new script named \`${targetFile}\` based on the reference code, but with these exact requirements:
1. Reuse the existing Yahoo Finance and CNN Fear & Greed API logic.
2. COMPLETELY REMOVE the Wednesday filtering logic (\`if (dateObj.getDay() !== 3) continue;\`). We need data for ALL available trading days.
3. Change the date range to fetch exactly 2 years: from '2025-01-01' to '2026-12-31'. Update the Yahoo finance options path to fetch 2y range instead of 1y, for example: path: '/v8/finance/chart/^GSPC?interval=1d&range=2y'. Then in the loop, filter the dates to only include those between '2025-01-01' and '2026-12-31'.
4. The output JSON file must be saved to \`src/data/dailyBacktestData.json\`.
5. The output JSON should ONLY contain these raw fields: { date, sp500Index, nasdaqIndex, fearGreedIndex }. Remove any UI-specific fields.
6. Only return the final javascript code wrapped in \`\`\`javascript and \`\`\` block.
`;

  console.log("로컬 Qwen 모델에게 백테스팅용 데이터 수집 스크립트 작성을 요청합니다...");

  const payload = {
    model: "qwen2.5-coder:14b",
    prompt: userPrompt,
    stream: false,
    options: {
      temperature: 0.1,
      num_predict: 4000
    }
  };

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    const output = data.response;
    
    const match = output.match(/```(?:javascript|js)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(targetFile, match[1].trim());
      console.log(`✅ Local Coder successfully created ${targetFile}!`);
    } else {
      console.log("❌ Failed to parse code. Raw output:\n", output);
    }
    
    // Free VRAM
    await fetch("http://localhost:11434/api/generate", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: "qwen2.5-coder:14b", keep_alive: 0 })
    });

  } catch(e) {
    console.error("API Error: ", e);
  }
}

runLocalCoder();
