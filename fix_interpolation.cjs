const fs = require('fs');
const http = require('http');

const filePath = 'C:/Users/gosys/orca/my_pension_helper/src/components/ValuationDcaTab.tsx';
const code = fs.readFileSync(filePath, 'utf-8');

const prompt = `You are a senior React developer. The user complained that the index jumps suddenly from 5365 to 6240 on the last week, and the Fear & Greed Index drops from 69 to 60 despite the index going up. This is because the random walk didn't reach the hardcoded final target, and the formulas didn't match the hardcoded 60.

We must fix this by using LINEAR INTERPOLATION with slight noise to ensure the start values smoothly arrive EXACTLY at the final target values over the 85 weeks.

Rewrite the \`generateWeeklyData\` function with this exact logic:
1. The total weeks from 2025-01-01 to 2026-08-19 is 85.
2. Start values (week 0): spIndex = 4800, spEps = 240, nasIndex = 16500, nasEps = 650.
3. End values (week 85): spIndex = 6240, spEps = 302, nasIndex = 22650, nasEps = 872.
4. Weekly step = (End - Start) / 85.
5. In the loop, use \`baseSpIndex = 4800 + (step * currentWeek) + randomNoise\`. The randomNoise should be between -30 and +30. As currentWeek approaches 85, reduce the noise so it hits the exact target.
6. For the Fear & Greed Index, use this EXACT formula so that PER 20.7 exactly equals 60:
   \`let fearGreedIndex = Math.round((sp500Pe - 18.2) * 4 + 50);\`
   Clamp it between 5 and 95.
7. Remove the hardcoded override block for the last row at the end of the loop, because the interpolation formula will naturally arrive at the exact final numbers (6240, 302, 22650, 872, PER 20.7, F&G 60).

Return ONLY the full updated \`ValuationDcaTab.tsx\` code enclosed in \`\`\`tsx and \`\`\`. Do not output any explanation.

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
