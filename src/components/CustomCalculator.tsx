import React from 'react';
import { Sliders, RotateCcw, DollarSign, Calendar, Percent, TrendingUp } from 'lucide-react';
import { PensionParams } from '../types/pension';
import { formatKRW } from '../utils/pensionMath';

interface CustomCalculatorProps {
  params: PensionParams;
  onChangeParams: (newParams: PensionParams) => void;
  onResetDefaults: () => void;
}

export default function CustomCalculator({ 
  params, 
  onChangeParams, 
  onResetDefaults 
}: CustomCalculatorProps) {
  const handleSp500RatioChange = (val: string | number) => {
    const sp = Math.min(100, Math.max(0, Number(val)));
    onChangeParams({
      ...params,
      sp500Ratio: sp,
      nasdaqRatio: 100 - sp
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-50">커스텀 맞춤 연금 계산기</h3>
            <p className="text-xs text-slate-300">투자금액, 자산비중, 기간, 연간 기대수익률을 자유롭게 조절하여 나만의 시뮬레이션을 돌려보세요.</p>
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>기본값으로 초기화</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Initial Investment (초기 투자금) */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>초기 투자금</span>
            </label>
            <span className="text-sm font-extrabold text-emerald-400">
              {formatKRW(params.initialInvestment)}
            </span>
          </div>

          <input
            type="range"
            min={10000000} // 1,000만원
            max={1000000000} // 10억원
            step={10000000} // 1,000만원 단위
            value={params.initialInvestment}
            onChange={(e) => onChangeParams({ ...params, initialInvestment: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>1,000만 원</span>
            <span>1억 원</span>
            <span>5억 원</span>
            <span>10억 원</span>
          </div>
        </div>

        {/* 2. Monthly Contribution (월 추가 적립금) */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>월 추가 적립금</span>
            </label>
            <span className="text-sm font-extrabold text-teal-300">
              {params.monthlyContribution > 0 ? formatKRW(params.monthlyContribution) : '0원 (일시납)'}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={5000000} // 500만원
            step={100000} // 10만원 단위
            value={params.monthlyContribution}
            onChange={(e) => onChangeParams({ ...params, monthlyContribution: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0원</span>
            <span>50만 원</span>
            <span>100만 원</span>
            <span>500만 원</span>
          </div>
        </div>

        {/* 3. Portfolio Allocation Slider (70:30) */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-cyan-400" />
              <span>포트폴리오 비중 (S&P : 나스닥)</span>
            </label>
            <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              {params.sp500Ratio} : {params.nasdaqRatio}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={params.sp500Ratio}
            onChange={(e) => handleSp500RatioChange(e.target.value)}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>나스닥 100%</span>
            <span className="text-emerald-400 font-bold">권장 70:30</span>
            <span>S&P500 100%</span>
          </div>
        </div>

        {/* 4. Accumulation Period (적립 기간) */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>적립 기간 (스노우볼)</span>
            </label>
            <span className="text-sm font-extrabold text-blue-400">
              {params.accumulationYears}년
            </span>
          </div>

          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={params.accumulationYears}
            onChange={(e) => onChangeParams({ ...params, accumulationYears: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>5년</span>
            <span>10년</span>
            <span className="text-blue-400 font-bold">15년</span>
            <span>30년</span>
          </div>
        </div>

        {/* 5. Withdrawal Period (인출 기간) */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>인출 기간 (노후 수령)</span>
            </label>
            <span className="text-sm font-extrabold text-purple-300">
              {params.withdrawalYears}년
            </span>
          </div>

          <input
            type="range"
            min={10}
            max={40}
            step={1}
            value={params.withdrawalYears}
            onChange={(e) => onChangeParams({ ...params, withdrawalYears: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>10년</span>
            <span>15년</span>
            <span>25년</span>
            <span>40년</span>
          </div>
        </div>

        {/* 6. Withdrawal Rate % (인출 비율 4% 룰) */}
        <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-amber-400" />
              <span>연간 인출 비율 (%)</span>
            </label>
            <span className="text-sm font-extrabold text-amber-400">
              {params.withdrawalRate.toFixed(1)}%
            </span>
          </div>

          <input
            type="range"
            min={2.0}
            max={7.0}
            step={0.5}
            value={params.withdrawalRate}
            onChange={(e) => onChangeParams({ ...params, withdrawalRate: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>2.0% (초보수적)</span>
            <span className="text-amber-400 font-bold">4.0% (표준 룰)</span>
            <span>7.0% (고인출)</span>
          </div>
        </div>
      </div>

      {/* Return Rate Custom Tweaks */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-300">S&P 500 연 수익률:</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="0.1"
              value={params.sp500Return}
              onChange={(e) => onChangeParams({ ...params, sp500Return: Number(e.target.value) })}
              className="w-16 bg-slate-900 border border-slate-700 rounded text-right text-xs font-bold text-emerald-400 p-1"
            />
            <span className="text-xs text-slate-400">%</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-300">NASDAQ 100 연 수익률:</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="0.1"
              value={params.nasdaqReturn}
              onChange={(e) => onChangeParams({ ...params, nasdaqReturn: Number(e.target.value) })}
              className="w-16 bg-slate-900 border border-slate-700 rounded text-right text-xs font-bold text-cyan-400 p-1"
            />
            <span className="text-xs text-slate-400">%</span>
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 sm:col-span-2 lg:col-span-1">
          <span className="text-xs text-slate-300">물가상승률 (연금 인출액 증액):</span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="0.5"
              min="0"
              max="10"
              value={params.inflationRate}
              onChange={(e) => onChangeParams({ ...params, inflationRate: Number(e.target.value) })}
              className="w-16 bg-slate-900 border border-slate-700 rounded text-right text-xs font-bold text-purple-300 p-1"
            />
            <span className="text-xs text-slate-400">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
