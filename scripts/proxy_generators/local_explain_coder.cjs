const fs = require('fs');

async function runLocalCoder() {
  const targetFile = 'src/components/FearGreedBacktestTab.tsx';
  const code = fs.readFileSync(targetFile, 'utf-8');

  const userPrompt = `
Here is \`src/components/FearGreedBacktestTab.tsx\`:
\`\`\`tsx
${code}
\`\`\`

The user requested: "The explanation is too lacking. So what? Show more detailed explanations for beginners so they know what means what."

Task: Update the React component to add beginner-friendly Korean descriptions (like a tutorial or "So what?" insights) throughout the UI.
1. Add a top banner/header explanation explaining what this Backtest AI does (e.g. "대중이 패닉에 빠질 때 줍고, 환희에 찰 때 파는(역발상) 단기 트레이딩 전략이 단순히 계속 들고 있는 것(존버)보다 안전하고 수익이 좋은지 검증합니다.")
2. Under "Buy Drop Threshold", add a small descriptive text: "하루 만에 공포탐욕지수가 이 수치 이상 떡락(▼)하면, 시장이 패닉에 빠졌다고 판단하여 나스닥(QQQ)을 전액 매수합니다."
3. Under "Sell Rise Threshold", add: "하루 만에 공포탐욕지수가 이 수치 이상 급등(▲)하면, 대중이 단기적 탐욕에 빠졌다고 판단하여 전액 매도하고 현금을 확보합니다."
4. Next to or under "CAGR" and "MDD", add short labels like "(연평균 수익률)", "(최대 손실폭 - 이 수치가 0%에 가까울수록 안전함)".
5. At the bottom (or in a new card), add a "So What? (결론 및 인사이트)" section that explains why this strategy works: "단순히 지수를 계속 들고 있는(Buy & Hold) 전략은 2026년 하락장에서 큰 손실(MDD)을 입지만, 이 전략은 현금을 보유하다가 극단적인 공포가 왔을 때만 시장에 진입하므로 원금을 방어하면서 초과 수익을 달성할 수 있습니다."
6. Ensure the styling remains dark theme (\`bg-slate-900\`, \`text-slate-400\` for sub-text, etc.) and layout is clean.

Return ONLY the full TypeScript code wrapped in \`\`\`tsx and \`\`\`. Do not write anything outside the block.
`;

  console.log("로컬 Qwen 모델에게 초보자용 친절한 UI 가이드 텍스트 추가를 요청합니다...");

  const payload = {
    model: "qwen2.5-coder:14b",
    prompt: userPrompt,
    stream: false,
    options: { temperature: 0.2, num_predict: 6000 }
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
      console.log('✅ Added beginner explanations to ' + targetFile);
    }
  } catch(e) {}
}

runLocalCoder();
