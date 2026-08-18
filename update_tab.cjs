const fs = require('fs');
const http = require('http');

const filePath = 'C:/Users/gosys/orca/my_pension_helper/src/components/ValuationDcaTab.tsx';
const code = fs.readFileSync(filePath, 'utf-8');

const prompt = `You are a senior React developer.
Please update the following React component code to include the "Fear & Greed Index" (공포탐욕지수).
Requirements:
1. In the \`WeeklyValuationRow\` interface, add \`fearGreedIndex: number\` and \`fearGreedLabel: string\`.
2. In the \`generateWeeklyData\` function, generate a realistic \`fearGreedIndex\` (0 to 100) based on market conditions (e.g. if the market drops, index goes down to 20-40 (Fear). If rising, 60-80 (Greed)).
3. IMPORTANT: For the LAST row (August 2026), set the exact \`fearGreedIndex\` to 60 and label to 'Greed (탐욕)' because the current real data for August 2026 is exactly 60.
4. In the Badges Section (Current Key Metric Badges), add a new badge for "현재 공포탐욕지수" showing 60 (Greed).
5. In the weekly Table, add a column "공포탐욕지수" and display the index and label.
6. RETURN ONLY THE FULL UPDATED CODE enclosed in \`\`\`tsx and \`\`\`. Do not include any other explanations.

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
