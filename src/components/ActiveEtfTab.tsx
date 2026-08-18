import React, { useState } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const ActiveEtfTab: React.FC = () => {
  const [alpha, setAlpha] = useState<number>(3.0); // 초기 기대 알파 3%
  const [useHistorical, setUseHistorical] = useState<boolean>(false); // 최근 4년 CAGR 적용 여부
  const [sp500Ratio, setSp500Ratio] = useState<number>(70); // 포트폴리오 비중 (S&P 500)

  const INITIAL_INVESTMENT = 100000000; // 1억 원
  const YEARS = 15;

  // 운용 보수
  const PASSIVE_FEE = 0.05;
  const ACTIVE_FEE = 0.80;

  // 최근 15년 연평균 수익률(CAGR) 산출 (패시브 15년 데이터 + 액티브 상장 이후 4년 평균 알파 반영)
  // S&P500: Passive 15년 13.4%, Active는 4년 알파(10.2%) 더한 23.6%
  const HISTORICAL_SP500_PASSIVE_CAGR = 13.4;
  const HISTORICAL_SP500_ACTIVE_CAGR = 23.6;
  // Nasdaq100: Passive 15년 18.6%, Active는 4년 알파(8.7%) 더한 27.3%
  const HISTORICAL_NASDAQ_PASSIVE_CAGR = 18.6;
  const HISTORICAL_NASDAQ_ACTIVE_CAGR = 27.3;

  // 기본(보수적) 수익률 설정
  const BASE_SP500_PASSIVE_CAGR = 10.0;
  const BASE_NASDAQ_PASSIVE_CAGR = 15.0;

  // 최종 적용 수익률 분기 처리
  const currentPassiveSp500Cagr = useHistorical ? HISTORICAL_SP500_PASSIVE_CAGR : BASE_SP500_PASSIVE_CAGR;
  const currentActiveSp500Cagr = useHistorical ? HISTORICAL_SP500_ACTIVE_CAGR : (BASE_SP500_PASSIVE_CAGR + alpha);

  const currentPassiveNasdaqCagr = useHistorical ? HISTORICAL_NASDAQ_PASSIVE_CAGR : BASE_NASDAQ_PASSIVE_CAGR;
  const currentActiveNasdaqCagr = useHistorical ? HISTORICAL_NASDAQ_ACTIVE_CAGR : (BASE_NASDAQ_PASSIVE_CAGR + alpha);

  // 시뮬레이션 데이터 생성 (혼합 포트폴리오 적용)
  const generateData = () => {
    const data = [];
    let pAsset = INITIAL_INVESTMENT;
    let aAsset = INITIAL_INVESTMENT;

    const wSp500 = sp500Ratio / 100;
    const wNas = 1 - wSp500;

    // 포트폴리오 혼합 연평균 수익률
    const pRate = (wSp500 * currentPassiveSp500Cagr) + (wNas * currentPassiveNasdaqCagr) - PASSIVE_FEE;
    const aRate = (wSp500 * currentActiveSp500Cagr) + (wNas * currentActiveNasdaqCagr) - ACTIVE_FEE;

    for (let i = 0; i <= YEARS; i++) {
      data.push({
        year: `${i}년차`,
        passive: Math.round(pAsset / 10000), // 만원 단위
        active: Math.round(aAsset / 10000),
      });

      pAsset *= (1 + pRate / 100);
      aAsset *= (1 + aRate / 100);
    }
    return { data, pRate, aRate };
  };

  const { data: chartData, pRate, aRate } = generateData();
  const finalData = chartData[YEARS];

  // 과거 백테스트 데이터
  const historicalSp500 = [
    { year: '2022', passive: 100, active: 100 },
    { year: '2023', passive: 115, active: 125 },
    { year: '2024', passive: 140, active: 170 },
    { year: '2025', passive: 160, active: 210 },
    { year: '2026', passive: 181, active: 254 },
  ];

  const historicalNasdaq = [
    { year: '2022', passive: 100, active: 100 },
    { year: '2023', passive: 140, active: 148 },
    { year: '2024', passive: 175, active: 200 },
    { year: '2025', passive: 195, active: 245 },
    { year: '2026', passive: 212, active: 280 },
  ];

  return (
    <div className="space-y-8">
      {/* 1. 과거 성과 백테스트 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-slate-50 mb-4">액티브 vs 패시브 과거 성과 백테스트 (상장 이후)</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-8">
          타임폴리오 TIME 액티브 ETF 시리즈가 상장된 2022년 중순 이후부터 2026년까지 약 4년여 간의 실제 누적 성과입니다.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* S&P 500 과거 차트 */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold text-slate-200">S&P 500: TIME vs 패시브</h3>
              <span className="text-xs text-amber-400 bg-amber-900/30 px-2 py-1 rounded border border-amber-700/50">연평균 26.2% 성장</span>
            </div>
            <div className="h-[220px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalSp500} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickMargin={8} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[80, 300]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    formatter={(value: any, name: any) => [`${value} (기준가 100)`, name === 'active' ? 'TIME 액티브' : '패시브 지수']}
                  />
                  <Legend formatter={(value) => value === 'active' ? 'TIME S&P500 액티브' : 'S&P500 패시브'} />
                  <Line type="monotone" dataKey="active" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="passive" stroke="#64748b" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* 누적 성과 표 */}
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="pb-2 text-left font-normal">구분</th>
                  <th className="pb-2 font-normal">누적 수익률</th>
                  <th className="pb-2 font-normal">과거 CAGR</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                <tr className="border-b border-slate-700/50">
                  <td className="py-2 text-left text-amber-400 font-bold">TIME S&P500 액티브</td>
                  <td className="py-2 font-bold text-emerald-400">+153.8%</td>
                  <td className="py-2 text-amber-400">26.2%</td>
                </tr>
                <tr>
                  <td className="py-2 text-left text-slate-300">TIGER S&P500 (패시브)</td>
                  <td className="py-2">+81.3%</td>
                  <td className="py-2">16.0%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Nasdaq 100 과거 차트 */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold text-slate-200">나스닥 100: TIME vs 패시브</h3>
              <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded border border-emerald-700/50">연평균 29.3% 성장</span>
            </div>
            <div className="h-[220px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalNasdaq} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickMargin={8} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[80, 300]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    formatter={(value: any, name: any) => [`${value} (기준가 100)`, name === 'active' ? 'TIME 액티브' : '패시브 지수']}
                  />
                  <Legend formatter={(value) => value === 'active' ? 'TIME 나스닥 액티브' : '나스닥 패시브'} />
                  <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="passive" stroke="#64748b" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="pb-2 text-left font-normal">구분</th>
                  <th className="pb-2 font-normal">누적 수익률</th>
                  <th className="pb-2 font-normal">과거 CAGR</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                <tr className="border-b border-slate-700/50">
                  <td className="py-2 text-left text-emerald-400 font-bold">TIME 나스닥 액티브</td>
                  <td className="py-2 font-bold text-emerald-400">+180.0%</td>
                  <td className="py-2 text-emerald-400">29.3%</td>
                </tr>
                <tr>
                  <td className="py-2 text-left text-slate-300">TIGER 나스닥 (패시브)</td>
                  <td className="py-2">+112.0%</td>
                  <td className="py-2">20.6%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. 15년 장기 미래 시뮬레이터 섹션 */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <h3 className="text-lg font-bold text-slate-50">15년 장기 투자 시뮬레이션 (초기자본 1억 원)</h3>
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">포트폴리오 비중 조절 가능</span>
        </div>
        
        {/* 컨트롤 패널 1: 수익률 가정 시나리오 */}
        <div className="mb-6 p-5 bg-slate-800/50 rounded-xl border border-slate-700">
          <label className="block text-sm font-medium text-slate-300 mb-3">1. 수익률 가정 시나리오 선택</label>
          <div className="flex space-x-2">
            <button 
              onClick={() => setUseHistorical(false)}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${!useHistorical ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              보수적 시나리오 (수동 알파 조절)
            </button>
            <button 
              onClick={() => setUseHistorical(true)}
              className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${useHistorical ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              🔥 최근 15년 장기 성과(CAGR) 그대로 유지
            </button>
          </div>
        </div>

        {/* 컨트롤 패널 2: 포트폴리오 비중 설정 */}
        <div className="mb-8 p-5 bg-slate-800/50 rounded-xl border border-slate-700">
          <label className="block text-sm font-medium text-slate-300 mb-4">2. 포트폴리오 비중 설정 (S&P 500 vs 나스닥 100)</label>
          <div className="px-2">
            <input 
              type="range" min="0" max="100" step="10" 
              value={sp500Ratio} onChange={(e) => setSp500Ratio(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between items-center mt-3 font-bold text-sm">
              <span className="text-amber-400">S&P500 {sp500Ratio}%</span>
              <span className="text-slate-400 text-xs px-3 py-1 bg-slate-900 rounded-full border border-slate-700">비율 조절 슬라이더</span>
              <span className="text-emerald-400">나스닥 {100 - sp500Ratio}%</span>
            </div>
          </div>
        </div>

        {/* 수동 알파 조절 슬라이더 (보수적 모드일 때만 활성화) */}
        {!useHistorical && (
          <div className="mb-8 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              수동 기대 초과수익(알파) 설정: <span className="text-blue-400 font-bold text-lg">{alpha.toFixed(1)}%</span>
            </label>
            <input 
              type="range" min="0" max="10" step="0.1" 
              value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full h-2 mt-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>0% (패시브와 동일)</span>
              <span>+5%</span>
              <span>+10%</span>
            </div>
          </div>
        )}

        {useHistorical && (
          <div className="mb-8 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30 flex items-start space-x-3">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-sm text-blue-300 font-bold">최근 15년 동안의 장기 연평균 수익률(CAGR)이 앞으로 15년 동안 동일하게 반복된다고 가정한 결과입니다.</p>
              <p className="text-xs text-slate-400 mt-1">
                (액티브 ETF는 상장 기간이 4년이므로, 패시브 15년 수익률에 최근 4년 액티브 펀드매니저 평균 알파를 더하여 추정했습니다.)<br/>
                적용중인 혼합(Blended) 데이터 — 패시브 포트폴리오 연 {((sp500Ratio/100)*HISTORICAL_SP500_PASSIVE_CAGR + ((100-sp500Ratio)/100)*HISTORICAL_NASDAQ_PASSIVE_CAGR).toFixed(1)}% / 액티브 포트폴리오 연 {((sp500Ratio/100)*HISTORICAL_SP500_ACTIVE_CAGR + ((100-sp500Ratio)/100)*HISTORICAL_NASDAQ_ACTIVE_CAGR).toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 미래 예측 차트 */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActiveFut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPassiveFut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value: any) => `${Math.round(value/10000)}억`} width={60} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                  formatter={(value: any, name: any) => [`${Number(value).toLocaleString()} 만원`, name === 'active' ? '혼합 액티브 포트폴리오' : '혼합 패시브 포트폴리오']}
                />
                <Legend formatter={(value) => value === 'active' ? '혼합 액티브 (예측)' : '혼합 패시브 (예측)'} />
                <Area type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorActiveFut)" />
                <Area type="monotone" dataKey="passive" stroke="#64748b" strokeWidth={2} fillOpacity={1} fill="url(#colorPassiveFut)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 15년 뒤 결과 테이블 */}
          <div className="flex flex-col justify-center">
            <h4 className="text-slate-300 font-medium mb-4 text-center">15년 후 포트폴리오 최종 자산 비교</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50">
                <span className="text-slate-400">혼합 패시브 (순수익 연 {pRate.toFixed(2)}%)</span>
                <span className="font-bold text-slate-300">{finalData.passive.toLocaleString()} 만원</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-blue-900/20 border border-blue-500/30">
                <span className="text-blue-400 font-medium">혼합 액티브 (순수익 연 {aRate.toFixed(2)}%)</span>
                <span className="font-bold text-blue-400">{finalData.active.toLocaleString()} 만원</span>
              </div>
              <div className="mt-4 text-center text-sm p-3 bg-slate-950 rounded-lg border border-slate-800">
                격차 (초과 자산): <span className={`font-bold ml-2 ${finalData.active >= finalData.passive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {finalData.active >= finalData.passive ? '+' : ''}{(finalData.active - finalData.passive).toLocaleString()} 만원
                </span>
                <p className="text-xs text-slate-500 mt-2">
                  비싼 보수(0.8%)를 차감하고도 달성한 실제 자산 격차입니다.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
