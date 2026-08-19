const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/components/FearGreedBacktestTab.tsx';

  const userPrompt = `
You are an expert React TypeScript developer.
Create a new React component \`${targetFile}\` that implements a Fear & Greed trading backtest dashboard.

Requirements:
1. Import \`runBacktest\` from \`../utils/backtestEngine\`.
2. Load data from \`../data/dailyBacktestData.json\` (Import it directly: \`import dailyData from '../data/dailyBacktestData.json'\`).
3. Define state for \`buyDropThreshold\` (default 10) and \`sellRiseThreshold\` (default 10).
4. Define state for the backtest results (Train Result, Test Result, etc).
5. In a \`useEffect\`, split the \`dailyData\` into Train (2025) and Test (2026), and run the backtest for both periods using the current thresholds.
6. Render a beautiful, modern UI using Tailwind CSS classes:
   - A control panel to adjust the \`buyDropThreshold\` and \`sellRiseThreshold\` (number inputs).
   - Metrics cards showing Train CAGR, Test CAGR, Test MDD, Test Total Return vs Buy&Hold.
   - Use standard tailwind colors like text-emerald-400 for positive, text-rose-400 for negative.
7. Return ONLY the TypeScript React code wrapped in \`\`\`tsx and \`\`\` block. No explanations.
`;

  console.log("로컬 Qwen 모델에게 FearGreedBacktestTab.tsx 컴포넌트 작성을 요청합니다...");

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
    
    const match = output.match(/```(?:tsx|typescript|ts)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(targetFile, match[1].trim());
      console.log(`✅ Local Coder successfully created ${targetFile}!`);
    } else {
      console.log("❌ Failed to parse code.");
      console.log(output);
    }
  } catch(e) {
    console.error("API Error: ", e);
  }
}

runLocalCoder();
