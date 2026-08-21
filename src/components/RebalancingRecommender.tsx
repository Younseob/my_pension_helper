import React from 'react';
import dailyData from '../data/dailyBacktestData.json';

type Allocation = {
  name: string;
  role: string;
  percent: number;
  performance10y: string;
  dividend: string;
  color: string;
};

type Props = {
  riskProfile: string;
  accountType: string;
  currentAllocations: Allocation[];
};

const RebalancingRecommender: React.FC<Props> = ({
  riskProfile,
  accountType,
  currentAllocations,
}) => {
  const fearGreedIndex = dailyData[dailyData.length - 1].fearGreedIndex;

  let sellTarget: string | null = null;
  let buyTarget: string | null = null;
  let expectedReturnRationale = '';

  if (fearGreedIndex >= 55) {
    // Greed
    sellTarget = currentAllocations
      .filter((alloc) => alloc.name !== 'KODEX TRF3070' && alloc.name !== '채권')
      .sort((a, b) => b.percent - a.percent)[0].name;
    buyTarget =
      accountType === 'personal'
        ? 'KODEX KOFR금리액티브(파킹통장)'
        : 'KODEX TRF3070(안전자산)';
    expectedReturnRationale =
      '시장이 과열(Greed) 상태입니다. 주식 비중을 10% 축소하여 차익을 실현하고, 하락장에 대비해 현금/안전자산을 늘려 변동성을 방어합니다. 기대수익률(CAGR)은 약간 낮아지지만 MDD(최대낙폭)를 크게 개선할 수 있습니다.';
  } else if (fearGreedIndex <= 45) {
    // Fear
    const safeAsset = currentAllocations.find(
      (alloc) => alloc.name === 'KODEX TRF3070' || alloc.name === '국채' || alloc.name === '배당'
    );
    sellTarget = safeAsset ? safeAsset.name : currentAllocations.sort((a, b) => a.percent - b.percent)[0].name;
    buyTarget = '나스닥100';
    expectedReturnRationale =
      '시장이 공포(Fear)에 빠져 주식이 바겐세일 중입니다! 안전자산을 10% 매도하여 핵심 우량 기술주를 저가 매수합니다. 단기 변동성은 크지만 향후 시장 반등 시 +15% 이상의 초과 수익(Alpha)을 기대할 수 있습니다.';
  } else {
    // Neutral
    sellTarget = 'N/A';
    buyTarget = 'N/A';
    expectedReturnRationale =
      '현재 시장은 중립(Neutral) 상태입니다. 포트폴리오 비중을 그대로 유지하며 정해진 원칙대로 정기 적립식 매수를 진행하세요.';
  }

  const finalAllocations = currentAllocations.map((alloc) => {
    if (alloc.name === sellTarget) {
      return { ...alloc, percent: alloc.percent - 10 };
    } else if (alloc.name === buyTarget) {
      return { ...alloc, percent: alloc.percent + 10 };
    } else {
      return alloc;
    }
  });

  if (buyTarget && !finalAllocations.find((alloc) => alloc.name === buyTarget)) {
    finalAllocations.push({ name: buyTarget, percent: 10, role: '', performance10y: '', dividend: '', color: '' });
  }

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
      <div className="text-lg font-bold mb-2">{expectedReturnRationale}</div>
      <div className="flex justify-between mb-4">
        {sellTarget !== 'N/A' && (
          <div className="text-red-500">
            매도(Sell): {sellTarget} 10% 🔻
          </div>
        )}
        {buyTarget !== 'N/A' && (
          <div className="text-blue-500">
            매수(Buy): {buyTarget} 10% 🔺
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center mb-4">
        {finalAllocations.map((alloc, index) => (
          <div key={index} className="w-1/2 md:w-1/4 lg:w-1/6 xl:w-1/12 p-2">
            <div className="bg-slate-700 p-2 rounded-lg shadow-lg">
              <div className="text-lg font-bold">{alloc.name}</div>
              <div className="text-sm">{alloc.percent}%</div>
              <div className="h-2 bg-slate-600 rounded-lg" style={{ width: `${alloc.percent}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RebalancingRecommender;
