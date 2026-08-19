const fs = require('fs');

async function runLocalCoder() {
  const appPath = 'src/App.tsx';
  const tabPath = 'src/components/FearGreedBacktestTab.tsx';
  
  const appCode = fs.readFileSync(appPath, 'utf-8');
  const tabCode = fs.readFileSync(tabPath, 'utf-8');

  // Fix App.tsx
  const appPrompt = `
Here is \`src/App.tsx\`:
\`\`\`tsx
${appCode}
\`\`\`
Fix TS Error: Type '{ activeTab: "..." }' is not assignable to type 'HeaderProps'.
Remove \`activeTab={activeTab}\` and \`onSelectTab={setActiveTab}\` from the \`<Header />\` tag.
Return ONLY the full TypeScript code wrapped in \`\`\`tsx and \`\`\`.
`;

  // Fix FearGreedBacktestTab.tsx
  const tabPrompt = `
Here is \`src/components/FearGreedBacktestTab.tsx\`:
\`\`\`tsx
${tabCode}
\`\`\`
Fix these TS Errors:
1. Remove \`import { TailwindConfig } from 'tailwindcss'\`.
2. \`runBacktest\` requires an object for params: \`runBacktest(data, 100000000, { buyDropThreshold, sellRiseThreshold })\`. Fix the two calls in useEffect.
3. \`runBacktest\` returns \`{ strategyResult, buyAndHoldResult, history }\`. 
So when setting state, extract the values from \`strategyResult\` (e.g. \`setTrainResult(train.strategyResult)\`, \`setTestResult(test.strategyResult)\`, \`setBuyHoldResult(test.buyAndHoldResult)\`).
Return ONLY the full TypeScript code wrapped in \`\`\`tsx and \`\`\`.
`;

  async function askModel(prompt, targetFile) {
    console.log("Requesting fix for " + targetFile);
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
  await askModel(tabPrompt, tabPath);
  
  await fetch("http://localhost:11434/api/generate", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: "qwen2.5-coder:14b", keep_alive: 0 })
  });
}

runLocalCoder();
