const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/scripts/trainAndTest.ts';

  const userPrompt = `
You are an expert TypeScript quant developer.
Create a script \`${targetFile}\` that:
1. Loads \`src/data/dailyBacktestData.json\` (Array of DailyData).
2. Imports \`runBacktest\` from \`../utils/backtestEngine\`.
3. Splits data into Train (2025-01-01 to 2025-12-31) and Test (2026-01-01 to 2026-12-31).
4. Training Phase: Loop over possible \`buyDropThreshold\` (from 5 to 20, step 5) and \`sellRiseThreshold\` (from 5 to 20, step 5).
   - Run \`runBacktest\` on the Train data for each combination.
   - Find the combination that yields the highest \`totalReturn\`.
5. Testing Phase: Run \`runBacktest\` on the Test data using the best parameters found in Training.
6. Console.log the best parameters, Train CAGR/MDD, and Test CAGR/MDD (compared to Buy&Hold).
7. Ensure the script can be executed via \`npx ts-node src/scripts/trainAndTest.ts\`.

Return ONLY the TypeScript code wrapped in \`\`\`typescript and \`\`\` block. No explanations.
`;

  console.log("로컬 Qwen 모델에게 파라미터 최적화(Train) 및 검증(Test) 스크립트 작성을 요청합니다...");

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
    
    const match = output.match(/```(?:typescript|ts)\n([\s\S]*?)```/);
    if (match && match[1]) {
      // Create folder if not exists
      if (!fs.existsSync('src/scripts')) fs.mkdirSync('src/scripts');
      fs.writeFileSync(targetFile, match[1].trim());
      console.log(`✅ Local Coder successfully created ${targetFile}!`);
    } else {
      console.log("❌ Failed to parse code. Raw output:\n", output);
    }
    
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
