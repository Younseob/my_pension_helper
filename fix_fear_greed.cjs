const fs = require('fs');
const http = require('http');

const filePath = 'C:/Users/gosys/orca/my_pension_helper/src/components/ValuationDcaTab.tsx';
const code = fs.readFileSync(filePath, 'utf-8');

const prompt = `You are a senior React developer. In the provided ValuationDcaTab.tsx, the \`fearGreedIndex\` calculation logic is mathematically incorrect and the economic logic is backwards.

Please fix it according to these exact rules:
1. The official CNN Fear and Greed scale is:
   0-25: Extreme Fear (극도의 공포)
   26-45: Fear (공포)
   46-54: Neutral (중립)
   55-75: Greed (탐욕)
   76-100: Extreme Greed (극도의 탐욕)

2. Economic Logic (Momentum):
   - When PER is HIGH (\`sp500Pe > 21.5\` or \`nasdaqPe > 27.0\`), the market is overvalued because investors are buying aggressively. Therefore, the index should be HIGH (random between 65 and 90, labeled 'Greed' or 'Extreme Greed' depending on the number).
   - When PER is LOW (\`sp500Pe < 19.5\` or \`nasdaqPe < 24.5\`), the market has crashed because investors are panicking. Therefore, the index should be LOW (random between 10 and 40, labeled 'Fear' or 'Extreme Fear' depending on the number).
   - Otherwise, the index should be Neutral (random between 46 and 54, labeled 'Neutral (중립)').

3. IMPORTANT: The very last row (Aug 2026) must remain EXACTLY 60 and 'Greed (탐욕)'.

Please rewrite the ENTIRE file with this fixed logic. RETURN ONLY THE FULL UPDATED CODE enclosed in \`\`\`tsx and \`\`\`. Do not include any other text.

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
