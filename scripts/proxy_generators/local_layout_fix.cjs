const fs = require('fs');

async function runLocalCoder() {
  const appPath = 'src/App.tsx';
  const headerPath = 'src/components/Header.tsx';
  
  const appCode = fs.readFileSync(appPath, 'utf-8');
  const headerCode = fs.readFileSync(headerPath, 'utf-8');

  const appPrompt = `
Here is \`src/App.tsx\`:
\`\`\`tsx
${appCode}
\`\`\`
Fix the layout bugs:
1. Currently \`<aside>\`, \`<main>\`, and \`<Footer />\` are all siblings under \`<div className="flex min-h-screen...">\`. This means Footer is pushed to the right side!
2. Wrap \`<main>\` and \`<Footer />\` together inside a \`<div className="flex-1 flex flex-col h-screen overflow-hidden">\`.
3. Ensure \`<main>\` keeps \`className="flex-1 p-8 overflow-y-auto"\`.
Return ONLY the full TypeScript code wrapped in \`\`\`tsx and \`\`\`.
`;

  const headerPrompt = `
Here is \`src/components/Header.tsx\`:
\`\`\`tsx
${headerCode}
\`\`\`
Fix the styling:
1. It is using unstyled classes (\`header-title\`, \`header-actions\`) but \`Header.css\` was deleted. It's now inside a left Sidebar.
2. Replace \`<header className="header">\` with \`<div className="p-4 border-b border-slate-800">\`.
3. Replace the title div with \`<h1 className="text-xl font-bold text-emerald-400 mb-4">연금 도우미</h1>\`.
4. Replace the actions div with \`<div className="flex flex-col space-y-2">\`.
5. Apply this class to all 4 buttons: \`className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition text-left"\`.
Return ONLY the full TypeScript code wrapped in \`\`\`tsx and \`\`\`.
`;

  async function askModel(prompt, targetFile) {
    console.log("Requesting layout fix for " + targetFile);
    const payload = {
      model: "qwen2.5-coder:14b",
      prompt: prompt,
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
      const match = data.response.match(/```(?:tsx|typescript|ts)\n([\s\S]*?)```/);
      if (match && match[1]) {
        fs.writeFileSync(targetFile, match[1].trim());
        console.log('✅ Fixed ' + targetFile);
      }
    } catch(e) {
      console.error(e);
    }
  }

  await askModel(appPrompt, appPath);
  await askModel(headerPrompt, headerPath);
  
  await fetch("http://localhost:11434/api/generate", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: "qwen2.5-coder:14b", keep_alive: 0 })
  });
}

runLocalCoder();
