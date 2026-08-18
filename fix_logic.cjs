const fs = require('fs');
const http = require('http');

const filePath = 'C:/Users/gosys/orca/my_pension_helper/src/components/ValuationDcaTab.tsx';
const code = fs.readFileSync(filePath, 'utf-8');

const prompt = `You are a senior React developer. The current random generation for the Fear & Greed index causes wild jumps between consecutive weeks (e.g., from 52 to 100) even when the index barely moves.

Please rewrite the \`generateWeeklyData\` function in the provided code to calculate the \`fearGreedIndex\` smoothly based on the S&P 500 PER, rather than using Math.random().

Use this exact logic for the Fear & Greed Index Calculation block:
\`\`\`tsx
    // Fear & Greed Index Calculation (Smooth calculation based on PER)
    // S&P 500 historical average PER is 18.2. We map PER 18.2 -> Index 50 (Neutral)
    // Each 1.0 change in PER moves the index by 12 points.
    let fearGreedIndex = Math.round((sp500Pe - 18.2) * 12 + 50);
    
    // Clamp between 5 and 95
    if (fearGreedIndex < 5) fearGreedIndex = 5;
    if (fearGreedIndex > 95) fearGreedIndex = 95;

    let fearGreedLabel = '';
    if (fearGreedIndex <= 25) {
      fearGreedLabel = 'Extreme Fear (극도의 공포)';
    } else if (fearGreedIndex <= 45) {
      fearGreedLabel = 'Fear (공포)';
    } else if (fearGreedIndex <= 54) {
      fearGreedLabel = 'Neutral (중립)';
    } else if (fearGreedIndex <= 75) {
      fearGreedLabel = 'Greed (탐욕)';
    } else {
      fearGreedLabel = 'Extreme Greed (극도의 탐욕)';
    }
\`\`\`

IMPORTANT: 
- The very last row (Aug 2026) must remain explicitly overwritten to \`last.fearGreedIndex = 60; last.fearGreedLabel = 'Greed (탐욕)';\`
- Return ONLY the full updated code for ValuationDcaTab.tsx enclosed in \`\`\`tsx and \`\`\`. Do not output any explanation.

Code to update:
\`\`\`tsx
${code}
\`\`\`
`;

const payload = JSON.stringify({
  model: 'qwen2.5-coder:14b',
  prompt: prompt,
  stream: false
});

const options = {
  hostname: 'localhost',
  port: 11434,
  path: '/api/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log("Sending request to local Ollama qwen2.5-coder:14b...");
const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      const output = response.response;
      
      const match = output.match(/\`\`\`tsx([\s\S]*?)\`\`\`/);
      if (match && match[1]) {
        fs.writeFileSync(filePath, match[1].trim());
        console.log("File updated successfully by local LLM!");
      } else {
        console.log("Could not find tsx code block in output. Raw output:");
        console.log(output);
      }
    } catch (e) {
      console.error("Error parsing response", e);
    }
  });
});

req.on('error', (e) => {
  console.error("Request error:", e);
});

req.write(payload);
req.end();
