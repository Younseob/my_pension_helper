import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';
import { formatKRW } from '../utils/pensionMath';

interface MonthlyValuationRow {
  month: string;
  sp500Index: number;
  sp500Eps: number;
  sp500Pe: number;
  sp500PeVs10yAvg: string; // e.g. +18.7%
  nasdaqIndex: number;
  nasdaqEps: number;
  nasdaqPe: number;
  nasdaqPeVs10yAvg: string;
  dcaSignal: 'aggressive' | 'regular' | 'conservative';
  signalLabel: string;
  actionGuidance: string;
}

const HISTORICAL_VALUATION_DATA: MonthlyValuationRow[] = [
  {
    month: '2026-01',
    sp500Index: 6050,
    sp500Eps: 278.5,
    sp500Pe: 21.7,
    sp500PeVs10yAvg: '+19.2%',
    nasdaqIndex: 21800,
    nasdaqEps: 792.0,
    nasdaqPe: 27.5,
    nasdaqPeVs10yAvg: '+8.3%',
    dcaSignal: 'conservative',
    signalLabel: '보수적 정액 분할',
    actionGuidance: '고평가 구간. 기본 월 정액 매수 유지 (무리한 일시 매수 지양)'
  },
  {
    month: '2026-02',
    sp500Index: 5920,
    sp500Eps: 281.0,
    sp500Pe: 21.1,
    sp500PeVs10yAvg: '+15.9%',
    nasdaqIndex: 21250,
    nasdaqEps: 801.5,
    nasdaqPe: 26.5,
    nasdaqPeVs10yAvg: '+4.3%',
    dcaSignal: 'regular',
    signalLabel: '통상 정액 분할',
    actionGuidance: '단기 숨고르기 조정. 계획된 월 적립금 100% 정상 매수'
  },
  {
    month: '2026-03',
    sp500Index: 5810,
    sp500Eps: 284.2,
    sp500Pe: 20.4,
    sp500PeVs10yAvg: '+12.1%',
    nasdaqIndex: 20700,
    nasdaqEps: 812.0,
    nasdaqPe: 25.5,
    nasdaqPeVs10yAvg: '+0.4%',
    dcaSignal: 'regular',
    signalLabel: '통상 정액 분할',
    actionGuidance: '나스닥 역사적 평균 수준 근접. 정액 매수 지속'
  },
  {
    month: '2026-04',
    sp500Index: 5690,
    sp500Eps: 287.5,
    sp500Pe: 19.8,
    sp500PeVs10yAvg: '+8.8%',
    nasdaqIndex: 20150,
    nasdaqEps: 822.5,
    nasdaqPe: 24.5,
    nasdaqPeVs10yAvg: '-3.5%',
    dcaSignal: 'aggressive',
    signalLabel: '가중 적극 매수',
    actionGuidance: 'PER 20배 하회 및 나스닥 저평가 전환. 월 적립금 1.3배 가중 매수'
  },
  {
    month: '2026-05',
    sp500Index: 5780,
    sp500Eps: 290.8,
    sp500Pe: 19.9,
    sp500PeVs10yAvg: '+9.3%',
    nasdaqIndex: 20600,
    nasdaqEps: 835.0,
    nasdaqPe: 24.7,
    nasdaqPeVs10yAvg: '-2.8%',
    dcaSignal: 'aggressive',
    signalLabel: '가중 적극 매수',
    actionGuidance: '실적 상향 기반 반등 구간. 정액 + 추가 여유 자금 투입'
  },
  {
    month: '2026-06',
    sp500Index: 5950,
    sp500Eps: 294.0,
    sp500Pe: 20.2,
    sp500PeVs10yAvg: '+11.0%',
    nasdaqIndex: 21300,
    nasdaqEps: 846.0,
    nasdaqPe: 25.2,
    nasdaqPeVs10yAvg: '-0.8%',
    dcaSignal: 'regular',
    signalLabel: '통상 정액 분할',
    actionGuidance: 'EPS 성장 동반 회복세. 계획된 정액 분할 매수'
  },
  {
    month: '2026-07',
    sp500Index: 6120,
    sp500Eps: 298.5,
    sp500Pe: 20.5,
    sp500PeVs10yAvg: '+12.6%',
    nasdaqIndex: 22100,
    nasdaqEps: 860.0,
    nasdaqPe: 25.7,
    nasdaqPeVs10yAvg: '+1.2%',
    dcaSignal: 'regular',
    signalLabel: '통상 정액 분할',
    actionGuidance: '빅테크 호실적 발표. 규칙적인 기계적 분할 매수'
  },
  {
    month: '2026-08',
    sp500Index: 6240,
    sp500Eps: 302.0,
    sp500Pe: 20.7,
    sp500PeVs10yAvg: '+13.7%',
    nasdaqIndex: 22650,
    nasdaqEps: 872.0,
    nasdaqPe: 26.0,
    nasdaqPeVs10yAvg: '+2.4%',
    dcaSignal: 'regular',
    signalLabel: '통상 정액 분할',
    actionGuidance: '현재 구간: EPS $300 돌파. 안정적인 정액 분할 매수 지속'
  }
];

export default function ValuationDcaTab() {
  const [monthlyBudget, setMonthlyBudget] = useState<number>(1000000); // 월 100만 원 투자

  // Latest stats (August 2026)
  const currentStat = HISTORICAL_VALUATION_DATA[HISTORICAL_VALUATION_DATA.length - 1];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>2026 실제 밸류에이션(PER/EPS) 기반 스마트 분할매수 신호등</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
            월가 실전 지표로 보는 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400">
              S&P 500 & 나스닥 100 최적 분할 매수 타이밍
            </span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            무작정 고점에 한 번에 사기 불안할 때, **기업 주당순이익(12M Forward EPS)**과 **주가수익비율(Forward P/E)**을 추적하면 
            지금이 <strong className="text-emerald-400">적극적으로 많이 사야 할 바겐세일 구간</strong>인지, 
            <strong className="text-indigo-300">정액 분할을 지켜야 할 구간</strong>인지 객관적으로 파악할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 2. Current August 2026 Key Metric Badges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400">S&P 500 선행 PER</div>
          <div className="text-2xl font-extrabold text-slate-50">{currentStat.sp500Pe}배</div>
          <div className="text-[11px] text-amber-400">10년 평균(18.2배) 대비 {currentStat.sp500PeVs10yAvg}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400">S&P 500 선행 EPS</div>
          <div className="text-2xl font-extrabold text-emerald-400">${currentStat.sp500Eps}</div>
          <div className="text-[11px] text-emerald-300">1월 대비 +8.4% 이익 성장 중 📈</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="text-xs text-slate-400">나스닥 100 선행 PER</div>
          <div className="text-2xl font-extrabold text-slate-50">{currentStat.nasdaqPe}배</div>
          <div className="text-[11px] text-blue-400">10년 평균(25.4배) 대비 +2.4% (적정 수준)</div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 space-y-1 bg-gradient-to-br from-emerald-950/40 to-slate-900">
          <div className="text-xs text-emerald-400 font-bold">현재 분할매수 신호등</div>
          <div className="text-xl font-extrabold text-emerald-300 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentStat.signalLabel}</span>
          </div>
          <div className="text-[11px] text-slate-300">EPS 견조 상승, 월 정액 매수 권장</div>
        </div>
      </div>

      {/* 3. Monthly Historical Valuation Table (Jan ~ Aug 2026) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-50">2026년 월별 실제 지수 & 밸류에이션(PER/EPS) 추이표</h3>
              <p className="text-xs text-slate-400">월별 지수 변동과 기업 이익(EPS) 성장에 따른 밸류에이션 및 최적 매수 타이밍 신호</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                <th className="py-3 px-3 font-semibold">기준월</th>
                <th className="py-3 px-3 font-semibold text-right">S&P 500 지수</th>
                <th className="py-3 px-3 font-semibold text-right text-emerald-400">S&P EPS</th>
                <th className="py-3 px-3 font-semibold text-right">S&P PER</th>
                <th className="py-3 px-3 font-semibold text-right">나스닥 지수</th>
                <th className="py-3 px-3 font-semibold text-right text-cyan-400">나스닥 EPS</th>
                <th className="py-3 px-3 font-semibold text-right">나스닥 PER</th>
                <th className="py-3 px-3 font-semibold text-center">분할매수 신호</th>
                <th className="py-3 px-4 font-semibold">월가 매수 전략 가이드</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {HISTORICAL_VALUATION_DATA.map((row, idx) => (
                <tr 
                  key={row.month} 
                  className={`hover:bg-slate-800/40 transition-colors ${
                    idx === HISTORICAL_VALUATION_DATA.length - 1 ? 'bg-indigo-950/20 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-medium text-slate-200">
                    {row.month} {idx === HISTORICAL_VALUATION_DATA.length - 1 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">현재</span>}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-100">{row.sp500Index.toLocaleString()} pt</td>
                  <td className="py-3 px-3 text-right text-emerald-400 font-bold">${row.sp500Eps.toFixed(1)}</td>
                  <td className="py-3 px-3 text-right text-slate-200">{row.sp500Pe.toFixed(1)}배</td>
                  <td className="py-3 px-3 text-right text-slate-100">{row.nasdaqIndex.toLocaleString()} pt</td>
                  <td className="py-3 px-3 text-right text-cyan-400 font-bold">${row.nasdaqEps.toFixed(1)}</td>
                  <td className="py-3 px-3 text-right text-slate-200">{row.nasdaqPe.toFixed(1)}배</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      row.dcaSignal === 'aggressive'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : row.dcaSignal === 'regular'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {row.signalLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-[11px]">{row.actionGuidance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Smart DCA Budget Allocation Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-50">밸류에이션 연동 스마트 분할 매수 실행기</h3>
            <p className="text-xs text-slate-400">내 월 투자 예산에 맞춰 밸류에이션 구간별 자동 권장 매수액을 계산합니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-200">월 투자 예산 (또는 분할 금액)</label>
                <span className="text-base font-extrabold text-emerald-400">
                  {formatKRW(monthlyBudget)}
                </span>
              </div>

              <input
                type="range"
                min={300000}
                max={10000000}
                step={100000}
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>30만 원</span>
                <span>100만 원</span>
                <span>500만 원</span>
                <span>1,000만 원</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>현재 구간 권장 실행 룰:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                현재 S&P500 선행 PER은 20.7배로 역사적 평균(18.2배)보다 다소 높으나, **EPS가 $302로 8% 이상 견조하게 우상향** 중입니다. 
                따라서 일시 몰빵은 피하고 **정액 100% 매수({formatKRW(monthlyBudget)})를 기계적으로 집행**하는 것이 가장 안전합니다.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-blue-500/30 space-y-2">
              <div className="text-xs text-blue-400 font-bold">🇺🇸 S&P 500 (70% 배분)</div>
              <div className="text-2xl font-extrabold text-blue-300">
                {formatKRW(monthlyBudget * 0.7)}
              </div>
              <div className="text-[11px] text-slate-400">
                추천: TIGER/ACE 미국S&P500 TR 매수
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-cyan-500/30 space-y-2">
              <div className="text-xs text-cyan-400 font-bold">🚀 NASDAQ 100 (30% 배분)</div>
              <div className="text-2xl font-extrabold text-cyan-300">
                {formatKRW(monthlyBudget * 0.3)}
              </div>
              <div className="text-[11px] text-slate-400">
                추천: TIGER/KODEX 미국나스닥100TR 매수
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 3 Golden Rules for Timing DCA */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>월가 밸류에이션 기반 분할 매수 3대 핵심 원칙</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-amber-300">1. PER 22배 초과 고평가 구간</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              지수가 과열되었을 때는 절대 추격 매수나 일시 몰빵을 하지 말고, 정해진 월 정액 분할만 기계적으로 매수합니다.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-emerald-300">2. PER 19배 이하 하락 조정 구간</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              시장 공포로 지수가 급락할 때는 평소 정액 매수금액의 1.3배~1.5배로 매수 규모를 늘려 평단가를 대폭 낮춥니다.
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-cyan-300">3. EPS가 우상향하면 하락은 기회</div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              기업들의 주당순이익(EPS)이 계속 늘어나고 있다면 단기 주가 하락은 15년 스노우볼을 위한 최고의 바겐세일입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
