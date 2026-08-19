import fs from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ path: 'env.secret' });

const apiKey = process.env.NVIDIA_API_KEY;
if (!apiKey) {
  console.error("NVIDIA_API_KEY is missing in env.secret");
  process.exit(1);
}

const client = new OpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: apiKey,
});

async function runNimCoder() {
  const targetFile = 'update_data_wednesdays.cjs';
  const code = fs.readFileSync(targetFile, 'utf-8');

  const systemPrompt = "You are an expert Node.js developer. You must modify the provided code according to the user's instructions. Return ONLY the fully updated code wrapped in ```javascript and ```. No explanations.";
const userPrompt = "Here is the current code of `update_data_wednesdays.cjs`:\n```javascript\n" + code + "\n```\n\nBug to fix:\nCurrently, the date string hardcodes ' (수)' regardless of the actual day of the week:\n`const isoDateStr = dateObj.toISOString().split('T')[0] + ' (수)';`\n\nEven though we are filtering for Wednesdays (`getDay() === 3`), the user wants the script to dynamically output the correct Korean day of the week (일, 월, 화, 수, 목, 금, 토) based on `dateObj.getDay()` instead of hardcoding ' (수)'. (In case we later change the filter, the day should adapt automatically).\n\nModify the script to dynamically compute the correct Korean day string and append it.\nOutput the FULL UPDATED CODE inside ```javascript and ``` block.";

  console.log("NVIDIA NIM (nemotron-3.5-lightning) 모델에게 코드 수정을 요청합니다...");
  
  try {
    const response = await client.chat.completions.create({
      model: "nvidia/nemotron-3.5-lightning-30b-a3b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    const output = response.choices[0].message.content;
    
    // Extract code
    const match = output.match(/```(?:javascript|js)\n([\s\S]*?)```/);
    if (match && match[1]) {
      fs.writeFileSync(targetFile, match[1].trim());
      console.log(`✅ NIM Coder successfully updated ${targetFile}!`);
    } else {
      console.log("❌ Failed to parse code from NIM output.");
      console.log("Raw output:\n", output);
    }
  } catch(e) {
    console.error("API Error: ", e);
  }
}

runNimCoder().catch(console.error);
