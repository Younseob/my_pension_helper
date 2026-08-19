import * as fs from 'fs';
import { runBacktest } from '../utils/backtestEngine';

interface DailyData {
  date: string;
  sp500Index: number;
  nasdaqIndex: number;
  fearGreedIndex: number;
}

const data: DailyData[] = JSON.parse(fs.readFileSync('src/data/dailyBacktestData.json', 'utf-8'));

const trainData = data.filter(d => new Date(d.date) >= new Date('2025-01-01') && new Date(d.date) <= new Date('2025-12-31'));
const testData = data.filter(d => new Date(d.date) >= new Date('2026-01-01') && new Date(d.date) <= new Date('2026-12-31'));

let bestParams = { buyDropThreshold: 0, sellRiseThreshold: 0 };
let bestTrainCAGR = -Infinity;
let bestTrainMDD = Infinity;

for (let buyDropThreshold = 5; buyDropThreshold <= 20; buyDropThreshold += 5) {
  for (let sellRiseThreshold = 5; sellRiseThreshold <= 20; sellRiseThreshold += 5) {
    const { strategyResult, buyAndHoldResult } = runBacktest(trainData, 100000000, { buyDropThreshold, sellRiseThreshold });
    if (strategyResult.totalReturn > bestTrainCAGR) {
      bestTrainCAGR = strategyResult.cagr;
      bestTrainMDD = strategyResult.mdd;
      bestParams = { buyDropThreshold, sellRiseThreshold };
    }
  }
}

const { strategyResult: testStrategyResult, buyAndHoldResult: testBuyAndHoldResult } = runBacktest(testData, 100000000, bestParams);

console.log(`Best Parameters:`, bestParams);
console.log(`Train CAGR: ${bestTrainCAGR.toFixed(2)}, Train MDD: ${bestTrainMDD.toFixed(2)}`);
console.log(`Test Strategy CAGR: ${testStrategyResult.cagr.toFixed(2)}, Test Strategy MDD: ${testStrategyResult.mdd.toFixed(2)}, Test Strategy Total Return: ${testStrategyResult.totalReturn.toFixed(2)}, Test Strategy Final Capital: ${testStrategyResult.finalCapital.toFixed(2)}`);
console.log(`Test Buy and Hold CAGR: ${testBuyAndHoldResult.cagr.toFixed(2)}, Test Buy and Hold MDD: ${testBuyAndHoldResult.mdd.toFixed(2)}, Test Buy and Hold Total Return: ${testBuyAndHoldResult.totalReturn.toFixed(2)}, Test Buy and Hold Final Capital: ${testBuyAndHoldResult.finalCapital.toFixed(2)}`);