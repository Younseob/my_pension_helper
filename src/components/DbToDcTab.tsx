import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle, 
  Award, 
  Sparkles,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { PRESETS, formatKRW, formatKRWShort } from '../utils/pensionMath';

export default function DbToDcTab() {
  // Input parameters
  const [monthlySalary, setMonthlySalary] = useState<number>(4000000); // 400만원
  const [currentYears, setCurrentYears] = useState<number>(7); // 근속 7년
  const [remainingYears, setRemainingYears] = useState<number>(15); // 남은 근속 15년
  const [salaryIncreaseRate, setSalaryIncreaseRate] = useState<number>(3.0); // 연 임금상승률 3%
  const [sp500Ratio, setSp500Ratio] = useState<number>(70);
  const [selectedPreset, setSelectedPreset] = useState<'conservative' | 'average' | 'optimistic'>('average');

  const nasdaqRatio = 100 - sp500Ratio;
  const presetInfo = PRESETS[selectedPreset];

  // Dynamic Investment CAGR
  const investmentCagr = Math.round(((sp500Ratio / 100) * presetInfo.sp500Return + (nasdaqRatio / 100) * presetInfo.nasdaqReturn) * 10) / 10;
  const r = investmentCagr / 100;
  const g = salaryIncreaseRate / 100;

  // 1. Initial DC Transfer Amount (현재 근속연수 * 현재 월급)
  const initialDcTransfer = currentYears * monthlySalary;

  // 2. Initial Monthly DC Deposit by employer (월급 / 12)
  const initialMonthlyDcDeposit = monthlySalary / 12;

  // 3. DB Maintained Payout Calculation (은퇴 시점 월급 * 총 근속연수)
  const totalWorkYears = currentYears + remainingYears;
  const finalMonthlySalaryDb = monthlySalary * Math.pow(1 + g, remainingYears);
  const dbFinalPayout = totalWorkYears * finalMonthlySalaryDb;

  // 4. DC Converted Payout Calculation
  // A. Initial Lump Sum Compound Growth
  const initialLumpSumGrowth = initialDcTransfer * Math.pow(1 + r, remainingYears);

  // B. Future Monthly Deposits Growth considering annual salary increases
  let dcMonthlyDepositsGrowth = 0;
  for (let y = 1; y <= remainingYears; y++) {
    // Employer annual contribution for year y = (monthlySalary * (1+g)^(y-1))
    const annualEmployerDeposit = monthlySalary * Math.pow(1 + g, y - 1);
    // Compounded from year y to end of retirement (remainingYears - y + 0.5 years compounding)
    const yearsToCompound = remainingYears - y + 0.5;
    dcMonthlyDepositsGrowth += annualEmployerDeposit * Math.pow(1 + r, yearsToCompound);
  }

  const dcFinalPayout = initialLumpSumGrowth + dcMonthlyDepositsGrowth;
  const dcGainVsDb = dcFinalPayout - dbFinalPayout;

  // 4% Rule Monthly Pension from DC Final Payout
  const dcAnnualPension = dcFinalPayout * 0.04;
  const dcMonthlyPension = dcAnnualPension / 12;

  const dbAnnualPension = dbFinalPayout * 0.04;
  const dbMonthlyPension = dbAnnualPension / 12;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/50 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>퇴직연금 DB ➔ DC 전환 가치 시뮬레이터</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
            내 퇴직금, DB로 그냥 둘까? <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">
              DC로 전환해서 S&P 500·나스닥에 굴릴까?
            </span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            DB형(회사 전담 운용)은 임금상승률만큼만 자산이 늘어나지만, <strong className="text-blue-300">DC형(개인 직접 운용)으로 전환</strong>하면 지금까지 쌓인 퇴직금을 즉시 내 연금 계좌로 받아 미국 대표 지수 ETF에 재투자할 수 있습니다. 
            나의 현재 월급 기준으로 전환 시 자금 규모와 미래 연금을 비교해보세요.
          </p>
        </div>
      </div>

      {/* 2. Interactive Calculator Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-50">현재 월급 기반 DB ➔ DC 전환 정보 입력</h3>
            <p className="text-xs text-slate-400">현재 월급과 근속연수를 입력하시면 전환 시 입금액과 매월 불입액이 자동 산출됩니다.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* A. Current Monthly Salary */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>현재 세전 월급</span>
              </label>
              <span className="text-sm font-extrabold text-emerald-400">
                {formatKRW(monthlySalary)}
              </span>
            </div>

            <input
              type="range"
              min={2000000}
              max={15000000}
              step={500000}
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>200만 원</span>
              <span>400만 원</span>
              <span>800만 원</span>
              <span>1,500만 원</span>
            </div>
          </div>

          {/* B. Current Work Years */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>현재 근속연수</span>
              </label>
              <span className="text-sm font-extrabold text-blue-400">
                {currentYears}년
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={currentYears}
              onChange={(e) => setCurrentYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1년</span>
              <span>7년</span>
              <span>15년</span>
              <span>25년</span>
            </div>
          </div>

          {/* C. Remaining Years until Retirement */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>은퇴까지 남은 기간</span>
              </label>
              <span className="text-sm font-extrabold text-purple-300">
                {remainingYears}년
              </span>
            </div>

            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={remainingYears}
              onChange={(e) => setRemainingYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5년</span>
              <span>15년 (권장)</span>
              <span>30년</span>
            </div>
          </div>

          {/* D. Expected Salary Increase Rate % */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>예상 연 임금상승률 (%)</span>
              </label>
              <span className="text-sm font-extrabold text-amber-400">
                {salaryIncreaseRate.toFixed(1)}%
              </span>
            </div>

            <input
              type="range"
              min={1.0}
              max={7.0}
              step={0.5}
              value={salaryIncreaseRate}
              onChange={(e) => setSalaryIncreaseRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1.0%</span>
              <span>3.0% (일반 평균)</span>
              <span>7.0%</span>
            </div>
          </div>

          {/* E. ETF Portfolio Allocation (S&P : Nasdaq) */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>DC ETF 비중 (S&P : 나스닥)</span>
              </label>
              <span className="text-xs font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                {sp500Ratio} : {nasdaqRatio}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={sp500Ratio}
              onChange={(e) => setSp500Ratio(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />

            <div className="flex justify-between text-[10px] text-slate-400">
              <span>나스닥 100%</span>
              <span className="text-emerald-400 font-bold">권장 70:30</span>
              <span>S&P500 100%</span>
            </div>
          </div>

          {/* F. Preset Return Scenario */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-200 block">
              DC 수익률 가정 시나리오
            </label>

            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                onClick={() => setSelectedPreset('conservative')}
                className={`p-2 rounded-xl border text-center font-bold transition-all ${
                  selectedPreset === 'conservative'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                보수적
                <span className="block text-[10px] font-normal text-slate-400 mt-0.5">연 7.0%</span>
              </button>

              <button
                onClick={() => setSelectedPreset('average')}
                className={`p-2 rounded-xl border text-center font-bold transition-all ${
                  selectedPreset === 'average'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                평균적
                <span className="block text-[10px] font-normal text-slate-400 mt-0.5">연 11.0%</span>
              </button>

              <button
                onClick={() => setSelectedPreset('optimistic')}
                className={`p-2 rounded-xl border text-center font-bold transition-all ${
                  selectedPreset === 'optimistic'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                희망적
                <span className="block text-[10px] font-normal text-slate-400 mt-0.5">연 13.8%</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Immediate Transfer & Monthly Deposit Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Immediate Transfer Lump Sum */}
        <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
              ⚡ DC 전환 시 즉시 입금액
            </span>
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>

          <div className="text-xs text-slate-300">현재 근속연수 ({currentYears}년) 동안 이미 쌓인 퇴직금 일시 입금</div>
          <div className="text-3xl font-extrabold text-blue-400">
            {formatKRW(initialDcTransfer)}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
            DC형으로 전환 버튼을 누르면 이 금액이 회사의 관리 손을 떠나 <strong className="text-slate-200">나의 개인 DC 연금 계좌로 즉시 입금</strong>되어 오늘부터 S&P 500 / 나스닥 ETF로 굴러갑니다.
          </p>
        </div>

        {/* Card 2: Monthly Deposit by Employer */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
              💵 매월/매년 회사가 넣어주는 불입금
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="text-xs text-slate-300">회사가 내 DC 계좌로 넣어주는 월/연간 불입금</div>
          <div className="text-3xl font-extrabold text-emerald-400">
            월 {formatKRW(initialMonthlyDcDeposit)}
            <span className="text-sm font-normal text-slate-300 ml-2">(연 {formatKRW(monthlySalary)})</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
            회사는 매년 <strong className="text-slate-200">연간 총급여의 1/12 (약 월급 1개월치)</strong>를 추가로 내 DC 계좌에 불입해주며, 임금상승률({salaryIncreaseRate}%)만큼 매년 불입액이 늘어납니다.
          </p>
        </div>
      </div>

      {/* 4. DB vs DC 15-Year Future Retirement Comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-50">
              {remainingYears}년 후 은퇴 시점: DB 유적 vs DC 전환 복리 시뮬레이션 비교
            </h3>
            <p className="text-xs text-slate-400">임금상승률({salaryIncreaseRate}%)과 DC 주식 포트폴리오({investmentCagr}%)의 격차로 인한 자산 차이</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DB Maintained Box */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-bold text-slate-300">🏢 DB형 유지 시 (회사 운용)</h4>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400">
                연 임금상승률 {salaryIncreaseRate}%
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-400">{remainingYears}년 후 예상 퇴직금 총액</div>
                <div className="text-2xl font-bold text-slate-200 mt-0.5">
                  {formatKRW(dbFinalPayout)}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <div className="text-xs text-slate-400">4% 룰 적용 시 월 연금 수령액</div>
                <div className="text-lg font-bold text-slate-300 mt-0.5">
                  월 {formatKRW(dbMonthlyPension)}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800/80">
              DB형은 은퇴 직전 월급({formatKRW(finalMonthlySalaryDb)}) × 총 근속연수({totalWorkYears}년)로 고정 계산됩니다.
            </div>
          </div>

          {/* DC Converted Box */}
          <div className="bg-gradient-to-br from-emerald-950/60 via-slate-950 to-slate-950 p-6 rounded-2xl border border-emerald-500/40 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-base font-bold text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>🚀 DC형 전환 시 (S&P500·나스닥)</span>
              </h4>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                DC 투자 CAGR {investmentCagr}%
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-emerald-400/90 font-medium">{remainingYears}년 후 예상 총 퇴직연금 자산</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-0.5">
                  {formatKRW(dcFinalPayout)}
                </div>
                <div className="text-xs text-emerald-300 font-bold mt-1">
                  DB 대비 +{formatKRW(dcGainVsDb)} 더 많음! (약 {(dcFinalPayout / (dbFinalPayout || 1)).toFixed(1)}배 증식)
                </div>
              </div>

              <div className="border-t border-emerald-500/20 pt-3">
                <div className="text-xs text-purple-300 font-medium">16년차부터 월 연금 수령액 (4% 룰)</div>
                <div className="text-xl font-extrabold text-purple-300 mt-0.5">
                  월 {formatKRW(dcMonthlyPension)}
                </div>
                <div className="text-[11px] text-slate-400">
                  (DB 대비 월 +{formatKRW(dcMonthlyPension - dbMonthlyPension)} 연금 이득)
                </div>
              </div>
            </div>

            <div className="text-[11px] text-emerald-200 bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/30">
              💡 초기 전환금 {formatKRWShort(initialDcTransfer)}이 {remainingYears}년 동안 스노우볼로 팽창하고, 매년 들어오는 회사 불입금이 복리로 더해진 결과입니다!
            </div>
          </div>
        </div>

        {/* Strategic Tips Banner */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>DB ➔ DC 전환 성공을 위한 3대 체크리스트</span>
          </h4>
          <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">1.</span>
              <span><strong>임금상승률 vs 주식 수익률 비교</strong>: 본인의 향후 임금상승률(예: 2~3%)보다 미국 S&P 500/나스닥 100 장기 수익률(7~13%)이 높다고 판단되면 DC 전환이 월등히 유리합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">2.</span>
              <span><strong>DC 계좌 내 30% 안전자산 규칙 활용</strong>: IRP/DC 계좌는 위험자산(순수 주식 ETF) 70% 제한이 있습니다. 남은 30%는 `SOL 미국S&P500채권혼합50` 등 채권혼합 ETF를 매수하면 실질 미국 주식 노출도를 85% 이상으로 극대화할 수 있습니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">3.</span>
              <span><strong>중도 원금 인출 금지 및 장기 보유</strong>: DC로 전환한 퇴직금은 55세 연금 개시 시점까지 절대로 인출하거나 원금을 인출하지 않고, TR(Total Return) ETF로 자동 복리 재투자하는 것이 핵심입니다.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
