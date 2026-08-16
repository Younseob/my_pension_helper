import React from 'react';
import { PensionParams, PresetScenario } from '../types/pension';
import { PRESETS, calculatePensionTimeline, formatKRW } from '../utils/pensionMath';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface ScenarioCardsProps {
  selectedPresetId: 'conservative' | 'average' | 'optimistic';
  onSelectPreset: (presetId: 'conservative' | 'average' | 'optimistic') => void;
  baseParams: PensionParams;
}

export default function ScenarioCards({ 
  selectedPresetId, 
  onSelectPreset,
  baseParams 
}: ScenarioCardsProps) {
  const presetKeys: Array<'conservative' | 'average' | 'optimistic'> = ['conservative', 'average', 'optimistic'];

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-slate-50 flex items-center gap-2">
            <span>역사적 수익률 기반 3대 시나리오 비교</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 font-normal border border-slate-700">
              S&P500 70% : 나스닥 30%
            </span>
          </h3>
          <p className="text-xs text-slate-300">시나리오 카드를 클릭하면 해당 조건의 상세 데이터와 시뮬레이션 그래프를 확인하실 수 있습니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {presetKeys.map((key) => {
          const preset: PresetScenario = PRESETS[key];
          const isSelected = selectedPresetId === preset.id;
          
          const result = calculatePensionTimeline({
            ...baseParams,
            sp500Return: preset.sp500Return,
            nasdaqReturn: preset.nasdaqReturn,
            cagrOverride: preset.weightedCagr
          });

          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`relative cursor-pointer rounded-2xl p-5 transition-all duration-300 border ${
                isSelected
                  ? `bg-slate-800/90 ${preset.borderColor} ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-950/40 scale-[1.02]`
                  : `bg-slate-900/80 border-slate-800 hover:bg-slate-850 ${preset.hoverBorder} hover:shadow-lg`
              }`}
            >
              {/* Recommended Badge */}
              {preset.isRecommended && (
                <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-bold shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>역사적 추천 모델</span>
                </div>
              )}

              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-50">{preset.name}</h4>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded font-semibold"
                      style={{ backgroundColor: preset.color + '33', color: preset.color }}
                    >
                      {preset.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{preset.description}</p>
                </div>
                
                {/* Checkbox indicator */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 text-transparent'
                }`}>
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* CAGR Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-1 text-center bg-slate-950/40 rounded-xl p-2">
                <div>
                  <div className="text-[10px] text-slate-400">S&P 500</div>
                  <div className="text-xs font-semibold text-slate-200">{preset.sp500Return}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">NASDAQ 100</div>
                  <div className="text-xs font-semibold text-slate-200">{preset.nasdaqReturn}%</div>
                </div>
                <div className="border-l border-slate-800">
                  <div className="text-[10px] text-emerald-400 font-medium">가중 CAGR</div>
                  <div className="text-xs font-bold text-emerald-400">{preset.weightedCagr}%</div>
                </div>
              </div>

              {/* Main Financial Outputs */}
              <div className="mt-4 space-y-3">
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
                  <div className="text-[11px] text-slate-400">15년 후 은퇴 총 자산</div>
                  <div className="text-xl font-bold text-slate-50 mt-0.5">
                    {formatKRW(result.accumulatedPrincipalAtRetirement)}
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    초기 원금 대비 {result.multiplier}배 자산 증식
                  </div>
                </div>

                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800">
                  <div className="text-[11px] text-slate-400">월 은퇴 연금 (4% 룰 적용)</div>
                  <div className="text-xl font-bold text-purple-300 mt-0.5">
                    월 {formatKRW(result.firstYearMonthlyPension)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    연간 인출: {formatKRW(result.firstYearWithdrawal)}
                  </div>
                </div>
              </div>

              {/* Footer Selection Button */}
              <div className="mt-4 text-center">
                <span className={`inline-block text-xs font-semibold px-4 py-1.5 rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' 
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}>
                  {isSelected ? '선택된 시나리오' : '이 시나리오 선택하기'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
