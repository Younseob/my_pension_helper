const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'analyze_correlation.mjs';
  const code = fs.readFileSync(targetFile, 'utf-8');

  const userPrompt = `
Here is \`analyze_correlation.mjs\`:
\`\`\`javascript
${code}
\`\`\`

Fix the JS error:
1. \`markdownString\` is declared as \`const\` but you append to it using \`+=\`. Change \`const markdownString\` to \`let markdownString\`.
Return ONLY the full JavaScript code wrapped in \`\`\`javascript and \`\`\` block.
`;

  console.log("로컬 Qwen 모델에게 const 할당 에러 수정을 요청합니다...");

  const payload = {
    model: "qwen2.5-coder:14b",
    prompt: userPrompt,
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
    const match = data.response.match(/```(?:javascript|js)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(targetFile, match[1].trim());
      console.log('✅ Fixed ' + targetFile);
    }
  } catch(e) {}
}

runLocalCoder();
