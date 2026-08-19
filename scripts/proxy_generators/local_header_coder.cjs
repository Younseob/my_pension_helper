const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/components/Header.tsx';
  
  const userPrompt = `
Here is the \`${targetFile}\` component.
We are moving to a Left Sidebar layout, so we no longer need the Tab menu inside the Header.
Rewrite the \`<Header>\` component:
1. Remove all props related to tabs (\`activeTab\`, \`onSelectTab\`).
2. Keep only the props \`onOpenGuide\`, \`onOpenTargetCalc\`, \`onResetDefaults\`, \`onExportCSV\`.
3. Remove the entire \`<nav>\` rendering the tab buttons.
4. Keep the Logo/Title ("연금 도우미") and the action buttons (가이드, 역산기, 초기화, CSV).
Return ONLY the TypeScript React code wrapped in \`\`\`tsx and \`\`\` block. No explanations.
`;

  console.log("로컬 Qwen 모델에게 Header.tsx 리팩토링을 요청합니다...");

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
      console.log('✅ Local Coder successfully updated ' + targetFile);
    } else {
      console.log("❌ Failed to parse code.");
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
