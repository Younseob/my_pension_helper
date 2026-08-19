const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'analyze_correlation.mjs';
  const code = fs.readFileSync(targetFile, 'utf-8');

  const userPrompt = `
Here is \`analyze_correlation.mjs\`:
\`\`\`javascript
${code}
\`\`\`

The output produced \`NaN\` for all correlations!
Fix the script:
1. When mapping data, ensure all index values are converted to numbers: \`Number(d.nasdaqIndex)\`.
2. In the \`corr(x, y)\` function, filter out any pairs where x or y is \`NaN\`, \`undefined\`, or \`null\`.
3. If the standard deviation is 0 or denominator is 0, return 0 instead of NaN.
4. When calculating T+1 and T+5, ensure that \`T+5\` actually exists in the array (length bounds check). If it doesn't exist, push \`null\`.
5. Return ONLY the full JavaScript code wrapped in \`\`\`javascript and \`\`\` block. No explanations.
`;

  console.log("로컬 Qwen 모델에게 통계 계산 오류(NaN) 수정을 요청합니다...");

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
    const match = data.response.match(/```(?:javascript|js)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(targetFile, match[1].trim());
      console.log('✅ Fixed ' + targetFile);
    }
  } catch(e) {}
}

runLocalCoder();
