const fs = require('fs');
const http = require('http');

const filePath = 'C:/Users/gosys/orca/my_pension_helper/src/components/ValuationDcaTab.tsx';
const code = fs.readFileSync(filePath, 'utf-8');

const prompt = `You are a senior React developer. The code you just generated has a TypeScript error because you subtracted Date objects directly.

Error: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.

Change this line:
\`const currentWeek = Math.floor((currentDate - new Date('2025-01-01T12:00:00Z')) / (7 * 24 * 60 * 60 * 1000));\`

To this:
\`const currentWeek = Math.floor((currentDate.getTime() - new Date('2025-01-01T12:00:00Z').getTime()) / (7 * 24 * 60 * 60 * 1000));\`

Return ONLY the FULL UPDATED CODE for ValuationDcaTab.tsx enclosed in \`\`\`tsx and \`\`\`. Do not include any explanations.

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
