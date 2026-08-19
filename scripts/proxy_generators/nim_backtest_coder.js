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
  const targetFile = 'fetch_daily_backtest_data.cjs';
  const referenceFile = 'update_data_wednesdays.cjs';
  const code = fs.existsSync(referenceFile) ? fs.readFileSync(referenceFile, 'utf-8') : '';

  const systemPrompt = "You are an expert Node.js developer. Return ONLY the fully completed code wrapped in ```javascript and ```. No explanations.";
  const userPrompt = "Here is the reference code of `update_data_wednesdays.cjs`:\n```javascript\n" + code + "\n```\n\nTask:\nCreate a new script named `fetch_daily_backtest_data.cjs` based on the reference code, but with these exact requirements:\n1. Reuse the existing Yahoo Finance and CNN Fear & Greed API logic.\n2. COMPLETELY REMOVE the Wednesday filtering logic (`if (dateObj.getDay() !== 3) continue;`). We need data for ALL available trading days.\n3. Change the date range to fetch exactly 2 years: from '2025-01-01' to '2026-12-31'.\n4. The output JSON file must be saved to `src/data/dailyBacktestData.json`.\n5. The output JSON should ONLY contain these raw fields: { date, sp500Index, nasdaqIndex, fearGreedIndex }. Remove any UI-specific fields like dcaSignal, signalLabel, actionGuidance, or fearGreedLabel.\n6. Make sure to interpolate the data correctly if any values are missing, just like the original script.\n\nOutput the FULL CODE for the new script inside ```javascript and ``` block.";

  console.log("NVIDIA NIM 모델에게 백테스팅용 데이터 수집 스크립트 작성을 요청합니다...");
  
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
      console.log(`✅ NIM Coder successfully created ${targetFile}!`);
    } else {
      console.log("❌ Failed to parse code from NIM output.");
      console.log("Raw output:\n", output);
    }
  } catch(e) {
    console.error("API Error: ", e);
  }
}

runNimCoder().catch(console.error);
