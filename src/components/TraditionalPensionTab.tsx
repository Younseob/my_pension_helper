import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  TrendingUp, 
  Award, 
  HelpCircle, 
  Scale, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { formatKRW, formatKRWShort } from '../utils/pensionMath';

export default function TraditionalPensionTab() {
  // Initial capital & investment period
  const [initialInvestment, setInitialInvestment] = useState<number>(100000000); // 1억 원
  const [years, setYears] = useState<number>(15); // 15년

  // Traditional product annual returns
  const bankReturn = 2.5; // 은행 연금적금 2.5%
  const insuranceReturn = 3.5; // 보험사 연금보험 3.5%
  const bondReturn = 3.8; // 국내 채권형 연금 3.8%
  const stockSnowballReturn = 11.0; // 미국 S&P500 70% + 나스닥 30% 11.0%

  // Asset calculations after N years
  const bankAsset = initialInvestment * Math.pow(1 + bankReturn / 100, years);
  const insuranceAsset = initialInvestment * Math.pow(1 + insuranceReturn / 100, years);
  const bondAsset = initialInvestment * Math.pow(1 + bondReturn / 100, years);
  const stockAsset = initialInvestment * Math.pow(1 + stockSnowballReturn / 100, years);

  // 4% Rule Monthly Pensions
  const bankMonthlyPension = (bankAsset * 0.04) / 12;
  const insuranceMonthlyPension = (insuranceAsset * 0.04) / 12;
  const bondMonthlyPension = (bondAsset * 0.04) / 12;
  const stockMonthlyPension = (stockAsset * 0.04) / 12;

  // Asset & Pension Gaps (Stock vs Bank)
  const assetGapVsBank = stockAsset - bankAsset;
  const monthlyPensionGapVsBank = stockMonthlyPension - bankMonthlyPension;
  const assetMultiplierVsBank = (stockAsset / (bankAsset || 1)).toFixed(1);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>전통 금융상품 vs 미국 주식 스노우볼 성과 비교</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
            일반적인 원금보장형 연금 상품, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-teal-300 to-emerald-400">
              과연 내 노후 생활비를 지켜줄 수 있을까?
            </span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            시중 은행의 연금저축적금(연 2.5%)이나 보험사 연금보험(연 3.5%)은 원금 손실 걱정은 적지만, 
            <strong className="text-amber-300"> 물가상승률을 차감하면 실질 자산 증식 효과가 거의 없습니다.</strong> 
            미국 우량주 포트폴리오(S&P 500 70% + 나스닥 30%)와 15년 후 형성되는 자산 규모 차이를 직접 비교해보세요.
          </p>
        </div>
      </div>

      {/* 2. Interactive Input Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-50">비교 시뮬레이션 금액 및 기간 설정</h3>
            <p className="text-xs text-slate-400">투자금과 거치 기간을 조절하면 전통 상품과 주식 포트폴리오의 격차가 실시간 계산됩니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Capital Slider */}
          <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-200">초기 거치 자산 (투자금)</label>
              <span className="text-base font-extrabold text-emerald-400">
                {formatKRW(initialInvestment)}
              </span>
            </div>

            <input
              type="range"
              min={10000000}
              max={500000000}
              step={10000000}
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1,000만 원</span>
              <span className="text-emerald-400 font-bold">1억 원</span>
              <span>3억 원</span>
              <span>5억 원</span>
            </div>
          </div>

          {/* Period Slider */}
          <div className="bg-slate-950/60 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-200">거치 및 적립 기간</label>
              <span className="text-base font-extrabold text-blue-400">
                {years}년
              </span>
            </div>

            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5년</span>
              <span>10년</span>
              <span className="text-blue-400 font-bold">15년 (권장)</span>
              <span>30년</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Product Comparison Grid (4 Cards) */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-50 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>상품별 {years}년 후 자산 형성 & 4% 룰 월 연금액 성과 비교</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Product 1: Bank Pension */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold">
                  원금보장형
                </span>
                <Building2 className="w-5 h-5 text-slate-400" />
              </div>

              <h4 className="text-base font-bold text-slate-100">은행 연금저축적금</h4>
              <p className="text-xs text-slate-400">시중은행 정기예금 금리 연동형 상품 (연 2.5% 가정)</p>

              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div>
                  <div className="text-[11px] text-slate-400">{years}년 후 예상 총 자산</div>
                  <div className="text-lg font-bold text-slate-200 mt-0.5">{formatKRW(bankAsset)}</div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">월 연금 수령액 (4% 룰)</div>
                  <div className="text-base font-bold text-slate-300 mt-0.5">월 {formatKRW(bankMonthlyPension)}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>물가상승률(2.5%) 감안 시 실질 자산 증가 제로</span>
            </div>
          </div>

          {/* Product 2: Insurance Pension */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold">
                  공시이율형
                </span>
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              </div>

              <h4 className="text-base font-bold text-slate-100">보험사 연금보험</h4>
              <p className="text-xs text-slate-400">초기 사업비 7~10% 차감 후 공시이율 적용 (연 3.5% 가정)</p>

              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div>
                  <div className="text-[11px] text-slate-400">{years}년 후 예상 총 자산</div>
                  <div className="text-lg font-bold text-slate-200 mt-0.5">{formatKRW(insuranceAsset)}</div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">월 연금 수령액 (4% 룰)</div>
                  <div className="text-base font-bold text-slate-300 mt-0.5">월 {formatKRW(insuranceMonthlyPension)}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>사업비 차감으로 10년 미만 해지 시 원금 손실</span>
            </div>
          </div>

          {/* Product 3: Bond Pension */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold">
                  채권안정형
                </span>
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>

              <h4 className="text-base font-bold text-slate-100">국내 채권형 연금</h4>
              <p className="text-xs text-slate-400">국고채 3년/10년물 금리 기반 안정형 운용 (연 3.8% 가정)</p>

              <div className="border-t border-slate-800 pt-3 space-y-2">
                <div>
                  <div className="text-[11px] text-slate-400">{years}년 후 예상 총 자산</div>
                  <div className="text-lg font-bold text-slate-200 mt-0.5">{formatKRW(bondAsset)}</div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400">월 연금 수령액 (4% 룰)</div>
                  <div className="text-base font-bold text-slate-300 mt-0.5">월 {formatKRW(bondMonthlyPension)}</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>원금 안정성은 뛰어나나 복리 팽창력 한계</span>
            </div>
          </div>

          {/* Product 4: US Stock Snowball (Winner) */}
          <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/50 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xl shadow-emerald-950/40 relative scale-[1.02]">
            <div className="absolute -top-3 left-4 px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-bold shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>추천 스노우볼</span>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  미국주식 포트폴리오
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-50">S&P500 70% : 나스닥 30%</h4>
              <p className="text-xs text-slate-300">미국 대표 우량주 15년 스노우볼 (역사적 평균 연 11.0% 가정)</p>

              <div className="border-t border-emerald-500/30 pt-3 space-y-2">
                <div>
                  <div className="text-[11px] text-emerald-400/90 font-medium">{years}년 후 예상 총 자산</div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-0.5">{formatKRW(stockAsset)}</div>
                </div>

                <div>
                  <div className="text-[11px] text-purple-300 font-medium">월 연금 수령액 (4% 룰)</div>
                  <div className="text-lg font-extrabold text-purple-300 mt-0.5">월 {formatKRW(stockMonthlyPension)}</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40 text-[11px] text-emerald-200 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>은행 대비 자산 {assetMultiplierVsBank}배 증식!</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Highlight Banner: The Massive Asset & Pension Gap */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/50 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-extrabold text-slate-50">
              {years}년 동안 벌어지는 자산 격차: <span className="text-emerald-400">+{formatKRW(assetGapVsBank)}</span> 더 많음!
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              은행 연금적금({formatKRWShort(bankAsset)})에 둔 사람과 미국 주식 포트폴리오({formatKRWShort(stockAsset)})에 둔 사람의 은퇴 월 연금 차이는 <strong className="text-purple-300">매월 +{formatKRW(monthlyPensionGapVsBank)}</strong>입니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400">은행 예금적금 (2.5%)</div>
            <div className="text-lg font-bold text-slate-300 mt-1">{years}년 후 {formatKRW(bankAsset)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">월 연금 {formatKRW(bankMonthlyPension)}</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400">보험사 연금보험 (3.5%)</div>
            <div className="text-lg font-bold text-slate-300 mt-1">{years}년 후 {formatKRW(insuranceAsset)}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">월 연금 {formatKRW(insuranceMonthlyPension)}</div>
          </div>

          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/40">
            <div className="text-xs text-emerald-400 font-bold">미국주식 스노우볼 (11.0%)</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">{years}년 후 {formatKRW(stockAsset)}</div>
            <div className="text-[11px] text-purple-300 font-bold mt-0.5">월 연금 {formatKRW(stockMonthlyPension)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
