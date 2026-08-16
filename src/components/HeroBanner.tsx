import React from 'react';
import { ShieldCheck, TrendingUp, DollarSign, Clock, HelpCircle } from 'lucide-react';
import { PresetScenario, CalculationResult } from '../types/pension';
import { formatKRW, formatKRWShort } from '../utils/pensionMath';

interface HeroBannerProps {
  activePreset: PresetScenario;
  projectionData: CalculationResult;
  sp500Ratio: number;
  nasdaqRatio: number;
  onOpenGuide: () => void;
}

export default function HeroBanner({ activePreset, projectionData, sp500Ratio, nasdaqRatio, onOpenGuide }: HeroBannerProps) {
  const { 
    initialInvestment, 
    accumulatedPrincipalAtRetirement, 
    firstYearMonthlyPension,
    multiplier,
    cagrPercent
  } = projectionData;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl p-6 sm:p-8 mb-8">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Key Concept Pitch */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>노후 대비 복리 자산 형성 전략</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
            1억 원으로 시작하는 <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              15년 미국 우량주 연금 스노우볼
            </span>
          </h2>

          <p className="text-sm text-slate-200 leading-relaxed">
            미국 시장을 이끄는 <strong className="text-white font-semibold">S&P 500 ({sp500Ratio}%)</strong>과 고성장 <strong className="text-white font-semibold">NASDAQ 100 ({nasdaqRatio}%)</strong>에 15년 동안 장기 투자한 뒤, <strong className="text-emerald-400 font-semibold">4% 룰(Trinity Rule)</strong>에 따라 매년 연금을 수령하는 초보자 맞춤형 노후 솔루션입니다.
          </p>

          {/* Quick Specs Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <div className="text-xs text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                초기 투자금
              </div>
              <div className="text-base font-bold text-slate-50 mt-0.5">{formatKRWShort(initialInvestment)}</div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <div className="text-xs text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                포트폴리오
              </div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">{sp500Ratio} : {nasdaqRatio}</div>
              <div className="text-[10px] text-slate-400">S&P500 : 나스닥</div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <div className="text-xs text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                적립 기간
              </div>
              <div className="text-base font-bold text-slate-50 mt-0.5">15 년</div>
              <div className="text-[10px] text-slate-400">복리 자산 증식</div>
            </div>

            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <div className="text-xs text-slate-300 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                인출 전략
              </div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">연 4.0% 룰</div>
              <div className="text-[10px] text-slate-400">원금 preservation</div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Output Card based on active preset */}
        <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div>
              <span className="text-xs text-slate-400">선택된 시나리오</span>
              <h3 className="text-base font-bold text-slate-50 flex items-center gap-2">
                {activePreset.name}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CAGR {cagrPercent}%
                </span>
              </h3>
            </div>
            <button
              onClick={onOpenGuide}
              className="text-xs text-slate-300 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>원리 보기</span>
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div className="space-y-4">
            <div className="bg-slate-900/90 rounded-xl p-4 border border-emerald-500/30">
              <div className="text-xs text-slate-300">15년 후 은퇴 시점 총 자산</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                {formatKRW(accumulatedPrincipalAtRetirement)}
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <span>원금의</span>
                <span className="text-emerald-300 font-bold">{multiplier}배</span>
                <span>로 증식</span>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-4 border border-purple-500/30">
              <div className="text-xs text-slate-300">16년차부터 예상 월 연금 수령액 (4% 룰)</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 mt-1">
                월 {formatKRW(firstYearMonthlyPension)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                (연간 인출액: {formatKRW(firstYearMonthlyPension * 12)})
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
            💡 <strong className="text-slate-200">핵심 포인트:</strong> 연 4%만 인출하기 때문에 남은 96% 자산이 시장에서 계속 복리로 성장하여 은퇴 후에도 자산이 고갈되지 않고 유지됩니다.
          </div>
        </div>
      </div>
    </div>
  );
}
