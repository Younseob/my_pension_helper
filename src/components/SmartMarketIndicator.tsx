import React from 'react';
import dailyData from '../data/dailyBacktestData.json';

export default function SmartMarketIndicator() {
  const latestData = dailyData[dailyData.length - 1];
  const fgIndex = latestData.fearGreedIndex;
  
  const getStatus = (fg: number) => {
    if (fg >= 75) return { state: 'Extreme Greed (극단적 탐욕)', color: 'text-red-500', signal: '시장이 극단적 탐욕 상태입니다. 신규 매수를 전면 중단하고 주식 비중을 줄여 안전자산으로 리밸런싱하세요.' };
    if (fg >= 55) return { state: 'Greed (탐욕)', color: 'text-orange-400', signal: '주가가 단기 과열 구간에 진입했습니다. 추격 매수를 자제하고 관망하며 [평균형] 포트폴리오 유지를 권장합니다.' };
    if (fg >= 45) return { state: 'Neutral (중립)', color: 'text-slate-300', signal: '시장 변동성이 안정적입니다. 정해진 비율에 따라 일정한 페이스로 분할 매수를 유지하세요.' };
    if (fg >= 25) return { state: 'Fear (공포)', color: 'text-emerald-400', signal: '시장에 공포 심리가 확산되고 있습니다. 안전자산을 일부 매도해 바겐세일 중인 [공격형] 주식 비중을 늘릴 타이밍입니다.' };
    return { state: 'Extreme Fear (극단적 공포)', color: 'text-emerald-500', signal: '극단적 공포 상태! 주식이 헐값에 투매되고 있습니다. 적극적으로 공격형 포트폴리오 비중을 최대로 늘리세요.' };
  };

  const status = getStatus(fgIndex);
  const vix = 13.2;

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🌡️</span>
          <span className="text-sm font-bold text-slate-100">Fear & Greed Index: <span className={`${status.color} font-medium`}>{fgIndex}</span> ({status.state})</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚡</span>
          <span className="text-sm font-bold text-slate-300">VIX: {vix} (안정)</span>
        </div>
      </div>
      <div className="flex items-center space-x-2 bg-slate-900/50 p-3 rounded-lg border border-slate-700 max-w-xl">
        <span className="text-xl">🤖</span>
        <span className={`text-xs font-medium ${status.color}`}>AI 리밸런싱 시그널: {status.signal}</span>
      </div>
    </div>
  );
}
