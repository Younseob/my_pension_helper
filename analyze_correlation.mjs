// analyze_correlation.mjs

import fs from 'fs';
import path from 'path';

// Load data
const dataPath = path.join(process.cwd(), 'src/data/dailyBacktestData.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Ensure data is sorted chronologically
if (new Date(rawData[0].date) > new Date(rawData[rawData.length - 1].date)) {
  rawData.reverse();
}

// Feature Engineering
const engineeredData = rawData.map((day, index) => {
  const { date, fearGreedIndex, nasdaq, sp500 } = day;
  const fg_raw = fearGreedIndex;
  const fg_delta_1 = index > 0 ? fearGreedIndex - rawData[index - 1].fearGreedIndex : null;
  const fg_delta_3 = index > 2 ? fearGreedIndex - rawData[index - 3].fearGreedIndex : null;
  const fg_delta_5 = index > 4 ? fearGreedIndex - rawData[index - 5].fearGreedIndex : null;

  let fg_consecutive_drops = 0;
  let fg_consecutive_rises = 0;
  for (let i = index - 1; i >= 0; i--) {
    if (rawData[i].fearGreedIndex < rawData[i + 1].fearGreedIndex) {
      fg_consecutive_rises++;
      break;
    } else if (rawData[i].fearGreedIndex > rawData[i + 1].fearGreedIndex) {
      fg_consecutive_drops++;
    } else {
      break;
    }
  }

  return {
    date,
    fg_raw,
    fg_delta_1,
    fg_delta_3,
    fg_delta_5,
    fg_consecutive_drops,
    fg_consecutive_rises,
    nasdaq: Number(nasdaq),
    sp500: Number(sp500),
  };
});

// Target Engineering
const targetData = engineeredData.map((day, index) => {
  const { date, nasdaq, sp500 } = day;
  const nasdaq_fwd_1d = index < engineeredData.length - 1 ? (engineeredData[index + 1].nasdaq / nasdaq) - 1 : null;
  const nasdaq_fwd_5d = index < engineeredData.length - 5 ? (engineeredData[index + 5].nasdaq / nasdaq) - 1 : null;
  const sp500_fwd_1d = index < engineeredData.length - 1 ? (engineeredData[index + 1].sp500 / sp500) - 1 : null;
  const sp500_fwd_5d = index < engineeredData.length - 5 ? (engineeredData[index + 5].sp500 / sp500) - 1 : null;

  return {
    date,
    nasdaq_fwd_1d,
    nasdaq_fwd_5d,
    sp500_fwd_1d,
    sp500_fwd_5d,
  };
});

// Pearson Correlation Function
function corr(x, y) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

// Calculate Correlations
const features = ['fg_raw', 'fg_delta_1', 'fg_delta_3', 'fg_delta_5', 'fg_consecutive_drops', 'fg_consecutive_rises'];
const targets = ['nasdaq_fwd_1d', 'nasdaq_fwd_5d', 'sp500_fwd_1d', 'sp500_fwd_5d'];

const correlations = features.reduce((acc, feature) => {
  acc[feature] = targets.reduce((targetAcc, target) => {
    const featureValues = engineeredData.map(day => day[feature]).slice(0, -5);
    const targetValues = targetData.map(day => day[target]).slice(5);
    const validFeatureValues = featureValues.filter((_, i) => featureValues[i] !== null && targetValues[i] !== null && !isNaN(featureValues[i]) && !isNaN(targetValues[i]));
    const validTargetValues = targetValues.filter((_, i) => featureValues[i] !== null && targetValues[i] !== null && !isNaN(featureValues[i]) && !isNaN(targetValues[i]));

    targetAcc[target] = corr(validFeatureValues, validTargetValues);
    return targetAcc;
  }, {});
  return acc;
}, {});

// Generate Markdown Report
let markdownString = `
# Stock Data Correlation Analysis

## Correlations

| Feature                | nasdaq_fwd_1d | nasdaq_fwd_5d | sp500_fwd_1d | sp500_fwd_5d |
|------------------------|---------------|---------------|---------------|---------------|
${features.map(feature => `
| ${feature}             | ${correlations[feature].nasdaq_fwd_1d.toFixed(4)} | ${correlations[feature].nasdaq_fwd_5d.toFixed(4)} | ${correlations[feature].sp500_fwd_1d.toFixed(4)} | ${correlations[feature].sp500_fwd_5d.toFixed(4)} |
`).join('')}
`;

// Find Best Features
const bestFeatures = features.reduce((acc, feature) => {
  const maxCorrelation = Math.max(...Object.values(correlations[feature]));
  const minCorrelation = Math.min(...Object.values(correlations[feature]));
  const bestCorrelation = Math.abs(maxCorrelation) > Math.abs(minCorrelation) ? maxCorrelation : minCorrelation;
  const bestTarget = Object.keys(correlations[feature]).find(target => correlations[feature][target] === bestCorrelation);

  acc[feature] = {
    target: bestTarget,
    correlation: bestCorrelation.toFixed(4),
  };

  return acc;
}, {});

markdownString += `
## Best Features

| Feature                | Best Target   | Correlation   |
|------------------------|---------------|---------------|
${Object.entries(bestFeatures).map(([feature, { target, correlation }]) => `
| ${feature}             | ${target}     | ${correlation}  |
`).join('')}
`;

// Write to File
fs.writeFileSync('correlation_report.md', markdownString);

console.log("Analysis Complete! Check correlation_report.md");