import React, { useState } from 'react';
import { Target, X } from 'lucide-react';
import { calculateRequiredTargetAsset, formatKRW } from '../utils/pensionMath';

interface TargetReverseCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TargetReverseCalculator({ isOpen, onClose }: TargetReverseCalculatorProps) {
  const [targetMonthlyPension, setTargetMonthlyPension] = useState<number>(3000000); // default 300만원/월
  const [accumulationYears, setAccumulationYears] = useState<number>(15);
  const [expectedCagr, setExpectedCagr] = useState<number>(11.0); // Average preset

  if (!isOpen) return null;

  const result = calculateRequiredTargetAsset(
    targetMonthlyPension,
    accumulationYears,
    expectedCagr,
    4.0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-50">목표 월 연금액 기반 역산 계산기</h3>
              <p className="text-xs text-slate-300">원하는 은퇴 월 생활비를 입력하면 필요한 목표 자산과 지금 준비할 금액을 계산해드립니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Slider & Inputs */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-200">
                은퇴 후 희망하는 월 연금 수령액 (4% 룰 기준)
              </label>
              <span className="text-xl font-extrabold text-emerald-400">
                월 {formatKRW(targetMonthlyPension)}
              </span>
            </div>

            <input
              type="range"
              min={1000000} // 100만원
              max={10000000} // 1,000만원
              step={500000} // 50만원
              value={targetMonthlyPension}
              onChange={(e) => setTargetMonthlyPension(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>월 100만 원</span>
              <span>월 300만 원</span>
              <span>월 500만 원</span>
              <span>월 1,000만 원</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-[11px] text-slate-300">적립 기간:</span>
                <select
                  value={accumulationYears}
                  onChange={(e) => setAccumulationYears(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white p-2"
                >
                  <option value={10}>10년</option>
                  <option value={15}>15년 (권장)</option>
                  <option value={20}>20년</option>
                </select>
              </div>

              <div>
                <span className="text-[11px] text-slate-300">가정 시나리오 CAGR:</span>
                <select
                  value={expectedCagr}
                  onChange={(e) => setExpectedCagr(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white p-2"
                >
                  <option value={7.01}>보수적 (연 7.0%)</option>
                  <option value={11.00}>평균적 (연 11.0%)</option>
                  <option value={13.80}>희망적 (연 13.8%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="space-y-3">
            <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30">
              <div className="text-xs text-slate-300">15년 후 은퇴 시 필요한 총 자산 (4% 룰)</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                {formatKRW(result.requiredAssetAtRetirement)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                (연간 필요 인출액: {formatKRW(result.annualTargetWithdrawal)})
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="text-[11px] text-slate-300">방법 A: 지금 일시납으로 준비 시</div>
                <div className="text-lg font-bold text-cyan-300 mt-1">
                  {formatKRW(result.requiredInitialLumpSum)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  오늘 한번에 투자하고 {accumulationYears}년 불리기
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="text-[11px] text-slate-300">방법 B: 매월 적립식으로 준비 시 (초기금 0원)</div>
                <div className="text-lg font-bold text-purple-300 mt-1">
                  월 {formatKRW(result.requiredMonthlyContribution)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {accumulationYears}년간 매월 꾸준히 모으기
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
          >
            확인 (닫기)
          </button>
        </div>
      </div>
    </div>
  );
}
