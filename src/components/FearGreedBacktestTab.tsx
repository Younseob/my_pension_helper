import React, { useState, useEffect } from 'react';
import { runBacktest } from '../utils/backtestEngine';
import dailyData from '../data/dailyBacktestData.json';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from 'recharts';

const FearGreedBacktestTab: React.FC = () => {
  const [buyThreshold, setBuyThreshold] = useState(20);
  const [sellThreshold, setSellThreshold] = useState(50);
  const [backtestResults, setBacktestResults] = useState({
    trainCagr: 0,
    testCagr: 0,
    testMdd: 0,
    testTotalReturnVsBuyHold: 0,
  });

  const chronologicalData = [...dailyData].reverse();
  const trainData = chronologicalData.filter((data) => data.date < '2026-01-01');
  const testData = chronologicalData.filter((data) => data.date >= '2026-01-01');

  useEffect(() => {
    const trainResult = runBacktest(trainData, 100000000, { buyThreshold, sellThreshold });
    const testResult = runBacktest(testData, 100000000, { buyThreshold, sellThreshold });

    const testTotalReturnVsBuyHold =
      (testResult.strategyResult.totalReturn - testResult.buyAndHoldResult.totalReturn) * 100;

    setBacktestResults({
      trainCagr: trainResult.strategyResult.cagr,
      testCagr: testResult.strategyResult.cagr,
      testMdd: testResult.strategyResult.mdd,
      testTotalReturnVsBuyHold,
    });
  }, [buyThreshold, sellThreshold]);

  const chartData = testData.map((data, i) => {
    return {
      ...data,
      buySignal: data.fearGreedIndex <= buyThreshold ? testData[i + 1]?.nasdaqIndex : undefined,
      sellSignal: data.fearGreedIndex >= sellThreshold ? testData[i + 1]?.nasdaqIndex : undefined,
    };
  });

  return (
    <div className="p-6 space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-md p-4 mb-4">
        <h2 className="text-xl font-medium text-slate-100">
          Backtest AI 설명
        </h2>
        <p className="text-sm font-medium text-slate-400">
          대중이 패닉에 빠질 때 줍고, 환희에 찰 때 파는(역발상) 단기 트레이딩 전략이 단순히 계속 들고 있는 것(존버)보다 안전하고 수익이 좋은지 검증합니다.
        </p>
      </div>

      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-slate-400">Buy Threshold</label>
          <input
            type="number"
            value={buyThreshold}
            onChange={(e) => setBuyThreshold(Number(e.target.value))}
            className="mt-1 block w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
          />
          <p className="text-sm font-medium text-slate-400 mt-1">
            공포탐욕지수가 이 수치 이하로 떨어지면(극심한 공포) 전액 매수합니다.
          </p>
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-slate-400">Sell Threshold</label>
          <input
            type="number"
            value={sellThreshold}
            onChange={(e) => setSellThreshold(Number(e.target.value))}
            className="mt-1 block w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100"
          />
          <p className="text-sm font-medium text-slate-400 mt-1">
            공포탐욕지수가 이 수치 이상으로 올라가면(탐욕) 전액 매도합니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-slate-100">Train Metrics</h3>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-400">CAGR (연평균 수익률)</p>
            <p className="text-xl font-semibold">
              {backtestResults.trainCagr.toFixed(2)}%
              <span className={backtestResults.trainCagr > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {' '}
                {backtestResults.trainCagr > 0 ? '↑' : '↓'}
              </span>
            </p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-md">
          <h3 className="text-lg font-medium text-slate-100">Test Metrics</h3>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-400">CAGR (연평균 수익률)</p>
            <p className="text-xl font-semibold">
              {backtestResults.testCagr.toFixed(2)}%
              <span className={backtestResults.testCagr > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {' '}
                {backtestResults.testCagr > 0 ? '↑' : '↓'}
              </span>
            </p>
            <p className="mt-2 text-sm font-medium text-slate-400">MDD (최대 손실폭)</p>
            <p className="text-xl font-semibold">
              {backtestResults.testMdd.toFixed(2)}%
              <span className={backtestResults.testMdd < 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {' '}
                {backtestResults.testMdd < 0 ? '↓' : '↑'}
              </span>
            </p>
            <p className="mt-2 text-sm font-medium text-slate-400">Total Return vs Buy&Hold (전략 수익 vs 존버 수익)</p>
            <p className="text-xl font-semibold">
              {backtestResults.testTotalReturnVsBuyHold.toFixed(2)}%
              <span
                className={
                  backtestResults.testTotalReturnVsBuyHold > 0 ? 'text-emerald-400' : 'text-rose-400'
                }
              >
                {' '}
                {backtestResults.testTotalReturnVsBuyHold > 0 ? '↑' : '↓'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-md p-4 mt-4">
        <h3 className="text-lg font-medium text-slate-100">So What? (결론 및 인사이트)</h3>
        <p className="text-sm font-medium text-slate-400">
          단순히 지수를 계속 들고 있는(Buy & Hold) 전략은 2026년 하락장에서 큰 손실(MDD)을 입지만, 이 전략은 현금을 보유하다가 극단적인 공포가 왔을 때만 시장에 진입하므로 원금을 방어하면서 초과 수익을 달성할 수 있습니다.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-md p-6 mt-4">
        <h3 className="text-lg font-medium text-slate-100">2026 Backtesting Data</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" domain={[0, 'dataMax']} />
            <YAxis yAxisId="right" domain={[0, 100]} orientation="right" />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sp500Index"
              stroke="#3b82f6"
              activeDot={{ r: 8 }}
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="nasdaqIndex"
              stroke="#8b5cf6"
              activeDot={{ r: 8 }}
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="fearGreedIndex"
              stroke="#ef4444"
              activeDot={{ r: 8 }}
              yAxisId="right"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="buySignal"
              stroke="none"
              dot={{ fill: '#10b981', r: 6 }}
              isAnimationActive={false}
              name="Buy Signal"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sellSignal"
              stroke="none"
              dot={{ fill: '#f43f5e', r: 6 }}
              isAnimationActive={false}
              name="Sell Signal"
            />
            <Brush dataKey="date" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FearGreedBacktestTab;