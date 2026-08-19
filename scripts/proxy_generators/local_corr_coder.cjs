const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'analyze_correlation.cjs';

  const userPrompt = `
You are an expert Data Scientist.
Create a standalone Node.js script \`${targetFile}\` that performs Feature Engineering and Pearson Correlation analysis on stock data.

Requirements:
1. Load \`src/data/dailyBacktestData.json\`.
2. Ensure data is sorted chronologically (oldest first). If data[0] is newer than data[data.length-1], reverse it.
3. Feature Engineering: For each day, calculate:
   - \`fg_raw\`: fearGreedIndex
   - \`fg_delta_1\`: 1-day change in F&G
   - \`fg_delta_3\`: 3-day change in F&G
   - \`fg_delta_5\`: 5-day change in F&G
   - \`fg_consecutive_drops\`: Number of consecutive days F&G has decreased up to today.
   - \`fg_consecutive_rises\`: Number of consecutive days F&G has increased up to today.
4. Target Engineering: For each day, calculate:
   - \`nasdaq_fwd_1d\`: (Nasdaq index at T+1 / Nasdaq at T) - 1
   - \`nasdaq_fwd_5d\`: (Nasdaq index at T+5 / Nasdaq at T) - 1
   - \`sp500_fwd_1d\`: (S&P500 index at T+1 / S&P500 at T) - 1
   - \`sp500_fwd_5d\`: (S&P500 index at T+5 / S&P500 at T) - 1
5. Pearson Correlation: Write a simple Pearson correlation function \`corr(x, y)\`.
6. Calculate the correlation of each Feature against the 4 Targets (excluding nulls/undefined at boundaries).
7. Generate a beautiful Markdown string summarizing the correlations and finding the "Best Features" (highest absolute correlation).
8. \`fs.writeFileSync('correlation_report.md', markdownString)\`
9. Console.log "Analysis Complete! Check correlation_report.md".

Return ONLY the JavaScript code wrapped in \`\`\`javascript and \`\`\` block. No explanations.
`;

  console.log("로컬 Qwen 모델에게 상관관계 분석(Data Science) 스크립트 작성을 요청합니다...");

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
    
    const match = output.match(/```(?:javascript|js)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(targetFile, match[1].trim());
      console.log('✅ Local Coder successfully created ' + targetFile);
    }
  } catch(e) {}
}

runLocalCoder();
