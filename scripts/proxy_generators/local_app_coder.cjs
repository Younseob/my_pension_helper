const fs = require('fs');

async function runLocalCoder() {
  const appPath = 'src/App.tsx';
  const appCode = fs.readFileSync(appPath, 'utf-8');

  const userPrompt = `
Here is the current code for \`src/App.tsx\`:
\`\`\`tsx
${appCode}
\`\`\`

Task: Refactor \`src/App.tsx\` to a Left Sidebar SPA Dashboard layout.
1. Currently, tabs are handled in the \`<Header>\`. We want to move the tabs to a Left Sidebar.
2. In \`App.tsx\`, change the main layout to a Flex container: \`<div className="flex min-h-screen bg-slate-950 text-slate-100">\`
3. Inside, create a \`<aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">\` for the Sidebar.
4. Move the tab rendering logic into this sidebar. Add a new tab: \`fear_greed_backtest\` ("F&G Backtest AI").
5. The rest of the content (the actual active tab components) should be in \`<main className="flex-1 p-8 overflow-y-auto">\`.
6. Import and render \`<FearGreedBacktestTab />\` when \`activeTab === 'fear_greed_backtest'\`.
7. You don't need to modify the internal code of the tabs themselves, just the layout of \`App.tsx\`. Keep all existing state and imports, just arrange them into a Sidebar layout instead of the Top Header layout. (You can remove \`activeTab\` passing to \`Header\`).

Return ONLY the completely rewritten \`App.tsx\` wrapped in \`\`\`tsx and \`\`\` block. No explanations.
`;

  console.log("로컬 Qwen 모델에게 App.tsx 사이드바 레이아웃 리팩토링을 요청합니다...");

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
    
    const match = output.match(/```(?:tsx|typescript|ts)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(appPath, match[1].trim());
      console.log('✅ Local Coder successfully updated ' + appPath);
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
