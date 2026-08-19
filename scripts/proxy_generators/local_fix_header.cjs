const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/components/Header.tsx';
  const code = fs.readFileSync(targetFile, 'utf-8');

  const userPrompt = `
Here is \`src/components/Header.tsx\`:
\`\`\`tsx
${code}
\`\`\`

Fix the build error:
1. Remove the line \`import './Header.css';\` because we are using TailwindCSS and that file does not exist.
2. Return ONLY the full TypeScript code wrapped in \`\`\`tsx and \`\`\`. Do not add any new imports.
`;

  console.log("로컬 Qwen 모델에게 Header.css import 제거를 요청합니다...");

  const payload = {
    model: "qwen2.5-coder:14b",
    prompt: userPrompt,
    stream: false,
    options: { temperature: 0.1, num_predict: 3000 }
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
