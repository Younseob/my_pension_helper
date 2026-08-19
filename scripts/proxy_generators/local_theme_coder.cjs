const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/components/FearGreedBacktestTab.tsx';
  const code = fs.readFileSync(targetFile, 'utf-8');

  const userPrompt = `
Here is \`src/components/FearGreedBacktestTab.tsx\`:
\`\`\`tsx
${code}
\`\`\`

Fix the UI readability (Dark Theme):
1. The component currently uses \`bg-white\` for its cards, which makes it unreadable because the global text is light.
2. Change all \`bg-white\` and \`shadow-md\` to dark theme cards: \`bg-slate-900 border border-slate-800 rounded-xl\`.
3. If there are any \`text-gray-900\` or \`text-gray-X\`, change them to \`text-slate-100\` or \`text-slate-400\`.
4. Make sure the \`<input>\` fields for Thresholds are dark themed: \`bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100\`.
5. Keep all other logic intact.
Return ONLY the full TypeScript code wrapped in \`\`\`tsx and \`\`\`.
`;

  console.log("로컬 Qwen 모델에게 다크 테마 UI 수정을 요청합니다...");

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
    const output = data.response;
    
    const match = output.match(/```(?:tsx|typescript|ts)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(targetFile, match[1].trim());
      console.log('✅ Fixed ' + targetFile);
    }
  } catch(e) {}
}

runLocalCoder();
