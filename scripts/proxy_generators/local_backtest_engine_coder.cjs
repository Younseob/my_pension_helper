const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/utils/backtestEngine.ts';

  const userPrompt = `
You are an expert TypeScript financial developer.
Create a new file \`${targetFile}\` for a Fear & Greed trading backtester.

Requirements:
1. Interfaces: Define \`DailyData\` (date: string, sp500Index: number, nasdaqIndex: number, fearGreedIndex: number) and \`BacktestResult\` (cagr: number, mdd: number, totalReturn: number, finalCapital: number).
2. Create an exported function: \`export function runBacktest(data: DailyData[], initialCapital: number, strategyParams: { buyDropThreshold: number, sellRiseThreshold: number })\`.
3. Feature Engineering: Loop through \`data\`. For each day T (starting from index 1), calculate \`deltaFG = currentFG - previousFG\`.
4. Strategy: 
   - BUY signal if \`deltaFG <= -strategyParams.buyDropThreshold\` (sudden fear).
   - SELL signal if \`deltaFG >= strategyParams.sellRiseThreshold\` (sudden greed).
5. T+1 Execution: If signal is generated on day T, execute the trade on day T+1 using \`nasdaqIndex\`.
   - Track \`cash\` and \`holdings\` (number of shares/units).
   - Allow holding max 100% of capital in QQQ (Nasdaq). Buy with all available cash, Sell all holdings.
6. Return an object containing:
   - \`strategyResult\`: BacktestResult
   - \`buyAndHoldResult\`: BacktestResult (using Nasdaq index)
   - \`history\`: Array of { date, portfolioValue }
7. MDD (Maximum Drawdown) and CAGR logic must be accurate. Assume 1 year = 252 trading days.

Return ONLY the TypeScript code wrapped in \`\`\`typescript and \`\`\` block. No explanations.
`;

  console.log("로컬 Qwen 모델에게 백테스트 엔진(backtestEngine.ts) 작성을 요청합니다...");

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
