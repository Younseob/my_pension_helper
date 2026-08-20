import React from 'react';
import dailyData from '../data/dailyBacktestData.json';

type Props = {
  riskProfile: string;
  accountType: string;
};

export default function RebalancingRecommender({ riskProfile, accountType }: Props) {
  const latest = dailyData[dailyData.length - 1];
  const fg = latest.fearGreedIndex ?? 0;

  let recommendation = '';
  if (fg >= 55) {
    if (riskProfile === 'aggressive') recommendation = 'KODEX KOFR금리액티브(합성) - 단기 피신용 파킹통장 ETF';
    else if (riskProfile === 'moderate') recommendation = 'TIGER 미국배당+7%프리미엄다우존스 - 차익실현 및 배당 방어';
    else if (riskProfile === 'conservative') recommendation = 'ACE 미국30년국채액티브(H) - 하락장 대비 장기채';
  } else if (fg <= 45) {
    if (riskProfile === 'aggressive') recommendation = 'ACE 미국나스닥100 - 바겐세일 핵심 성장주 저가매수';
    else if (riskProfile === 'moderate') recommendation = 'KODEX 미국AI테크TOP10 - 낙폭 과대 우량 기술주 줍줍';
    else if (riskProfile === 'conservative') recommendation = 'TIGER 미국배당다우존스 - 하락장 배당수익률 극대화';
  } else {
    recommendation = '현재 비중 유지 (정기 적립식 매수) - 추가 대응 필요 없음';
  }

  const [ticker, rationale] = recommendation.includes(' - ') ? recommendation.split(' - ') : [recommendation, ''];

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 w-full flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-emerald-400 mb-1">🔄 AI 리밸런싱 종목 추천</h2>
        <p className="text-sm text-slate-300">현재 시장 지표와 선택하신 성향에 맞춘 추천 교체(스위칭) 종목입니다.</p>
      </div>
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex-1 md:ml-4">
        <p className="text-sm text-slate-400 mb-1">추천 ETF (Ticker)</p>
        <p className="text-lg font-bold text-white mb-2">{ticker}</p>
        <p className="text-sm text-slate-400 mb-1">교체 사유 (Rationale)</p>
        <p className="text-sm font-medium text-amber-400">{rationale}</p>
      </div>
    </div>
  );
}
