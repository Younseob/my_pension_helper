import React, { useState } from 'react';
import { 
  ShieldCheck, 
  PiggyBank, 
  Wallet, 
  Receipt, 
  TrendingUp, 
  Repeat, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Award,
  HelpCircle,
  Coins
} from 'lucide-react';

export default function TaxGuideTab() {
  const [userSalary, setUserSalary] = useState<'under' | 'over'>('under'); // under 5500만원, over 5500만원
  const [annualContribution, setAnnualContribution] = useState<number>(9000000); // default 900만원

  // Tax refund calculation
  const taxRate = userSalary === 'under' ? 0.165 : 0.132;
  const eligibleAmount = Math.min(annualContribution, 9000000);
  const estimatedRefund = eligibleAmount * taxRate;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Top Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>수익률 & 절세 극대화 시크릿</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
            3대 절세 계좌(ISA·연금저축·IRP) & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              TR ETF 배당 자동 재투자 전략
            </span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            미국 S&P 500과 나스닥 100 ETF를 일반 계좌에서 사면 배당소득세(15.4%)와 매매차익 과세로 수익이 깎입니다. 
            <strong className="text-emerald-300"> 절세 계좌 3종 세트</strong>와 <strong className="text-emerald-300">TR(Total Return) ETF</strong>를 활용하여 연말정산 환급금까지 복리로 굴리는 실전 운용법을 알아보세요.
          </p>
        </div>
      </div>

      {/* 2. Interactive Year-End Tax Refund Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-50">연말정산 세액공제 환급금 계산기</h3>
            <p className="text-xs text-slate-400">연금저축과 IRP에 납입 시 매년 13월의 월급으로 얼마를 환급받는지 확인해보세요.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-5 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">1. 총급여 (소득 기준 선택)</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setUserSalary('under')}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    userSalary === 'under'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  총급여 5,500만 원 이하 (16.5% 공제)
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">종합소득 4,500만 원 이하</span>
                </button>

                <button
                  onClick={() => setUserSalary('over')}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                    userSalary === 'over'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  총급여 5,500만 원 초과 (13.2% 공제)
                  <span className="block text-[10px] text-slate-400 font-normal mt-0.5">종합소득 4,500만 원 초과</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-300">2. 연간 연금저축 + IRP 총 납입액</label>
                <span className="text-sm font-extrabold text-emerald-400">
                  {(annualContribution / 10000).toLocaleString()}만 원
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={12000000}
                step={500000}
                value={annualContribution}
                onChange={(e) => setAnnualContribution(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>100만 원</span>
                <span>연금저축 한도 600만 원</span>
                <span className="text-emerald-400 font-bold">최대 세액공제 한도 900만 원</span>
                <span>1,200만 원</span>
              </div>
            </div>
          </div>

          {/* Refund Result KPI */}
          <div className="bg-gradient-to-br from-emerald-950/60 to-slate-950 p-6 rounded-2xl border border-emerald-500/30 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">매년 13월의 월급 환급액</div>
              <div className="text-3xl font-extrabold text-white mt-1">
                {Math.round(estimatedRefund).toLocaleString()}원
              </div>
              <div className="text-xs text-slate-300 mt-2">
                공제율: <strong className="text-emerald-400">{(taxRate * 100).toFixed(1)}%</strong> (최대 900만 원 한도 적용)
              </div>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-bold text-emerald-400 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                <span>환급금 재투자 꿀팁</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                매년 환급받는 <strong className="text-white">{Math.round(estimatedRefund / 10000)}만 원</strong>을 쓰지 않고 S&P 500 ETF에 그대로 재투자하면 15년 후 <strong className="text-emerald-300">약 3,500만 원 이상의 추가 자산</strong>이 쌓입니다!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Three Tax-Saving Accounts Breakdown (ISA, Pension, IRP) */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-50 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>3대 절세 계좌 핵심 비교 (ISA · 연금저축 · IRP)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Account 1: Pension Savings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 relative flex flex-col justify-between hover:border-emerald-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  1순위 필수 계좌
                </span>
                <PiggyBank className="w-6 h-6 text-emerald-400" />
              </div>

              <h4 className="text-lg font-bold text-slate-50">연금저축펀드</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                해외 ETF를 100% 자율 매수할 수 있고, 필요 시 중도 인출이 가장 유연한 국민 연금 계좌.
              </p>

              <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>세액공제 한도</strong>: 연 600만 원</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>투자 제한</strong>: 위험자산(S&P500/나스닥) 100% 매수 가능</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>배당소득세</strong>: 15.4% 징수 안 함 (과세이연 ➜ 55세 이후 3.3~5.5% 연금소득세)</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 font-medium">
              💡 팁: 초보자는 연금저축 계좌부터 개설하여 연 600만 원(월 50만 원)을 채우는 것이 기본!
            </div>
          </div>

          {/* Account 2: IRP */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 relative flex flex-col justify-between hover:border-purple-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-bold">
                  2순위 세액공제 추가
                </span>
                <Wallet className="w-6 h-6 text-purple-400" />
              </div>

              <h4 className="text-lg font-bold text-slate-50">IRP (개인형 퇴직연금)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                연금저축 한도(600만)를 넘어 추가 300만 원 세액공제를 더 받아 총 900만 원을 채우는 계좌.
              </p>

              <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>세액공제 한도</strong>: 연금저축 포함 통합 연 900만 원</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>안전자산 규제</strong>: 30% 의무 보유 (채권혼합/미국달러채 ETF 활용)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>퇴직금 수령</strong>: 퇴직금 이체 시 퇴직소득세 30~40% 감면</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-[11px] text-purple-200 font-medium">
              💡 IRP 안전자산 30% 꿀팁: SOL 미국S&P500채권혼합50 등 채권혼합 ETF로 채우면 실질 미국주식 비중 85% 이상 유지!
            </div>
          </div>

          {/* Account 3: ISA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 relative flex flex-col justify-between hover:border-cyan-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-bold">
                  3년 주기 만능 만기 계좌
                </span>
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>

              <h4 className="text-lg font-bold text-slate-50">중개형 ISA 계좌</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                3년 만기 후 비과세 혜택을 받고, 만기 자금을 연금저축으로 넘겨 추가 세액공제 10%를 챙기는 만능 계좌.
              </p>

              <ul className="text-xs text-slate-300 space-y-2 border-t border-slate-800 pt-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>납입 한도</strong>: 연 2,000만 원 (최대 1억 원 이월 가능)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>비과세 혜택</strong>: 순수익 200만 원(서민형 400만 원) 비과세, 초과분 9.9% 분리과세</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>연금 이전 혜택</strong>: 만기금 연금 이전 시 10%(최대 300만) 추가 세액공제</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-[11px] text-cyan-200 font-medium">
              💡 팁: 3년 마다 만기 해지 ➜ 연금저축 이전 프로세스를 반복하면 세액공제 테크트리 극대화!
            </div>
          </div>
        </div>
      </div>

      {/* 4. TR (Total Return) ETF Automatic Dividend Reinvestment Strategy */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-50">TR (Total Return) ETF 배당 자동 재투자 수익률 극대화</h3>
            <p className="text-xs text-slate-400">배당금을 현금으로 받지 않고, 발생 즉시 지수에 자동 재투자하는 스노우볼 전략</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PR vs TR Comparison */}
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>PR(Price Return) vs TR(Total Return) 차이점</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="font-bold text-slate-300 mb-1">일반 PR ETF (예: TIGER 미국S&P500)</div>
                <p className="text-slate-400 leading-relaxed">
                  분기별로 배당금(분배금)이 계좌에 현금으로 들어옵니다. 초보자가 수동으로 다시 ETF를 매수해야 하며, 놀고 있는 예수금이 생길 수 있습니다.
                </p>
              </div>

              <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/30">
                <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>TR ETF (예: KODEX 미국S&P500TR) ★ 추천</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  배당금이 나오는 즉시 ETF 주가 자산에 **자동으로 복리 재투자**됩니다. 현금 수동 재주문 번거로움이 없고 배당 차감 없이 100% 자산이 팽창합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Domestic TR ETF Products */}
          <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>국내 상장 대표 TR ETF 추천 종목</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-100">KODEX 미국S&P500TR</div>
                  <div className="text-[10px] text-slate-400">삼성자산운용 | S&P 500 배당 자동 재투자</div>
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">
                  S&P500 70% 추천
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-100">KODEX 미국나스닥100TR</div>
                  <div className="text-[10px] text-slate-400">삼성자산운용 | 나스닥 100 배당 자동 재투자</div>
                </div>
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded border border-cyan-500/20">
                  나스닥 30% 추천
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-100">TIGER 미국S&P500TR</div>
                  <div className="text-[10px] text-slate-400">미래에셋자산운용 | 풍부한 거래량 & 낮은 보수</div>
                </div>
                <span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded">
                  대안 종목
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recommended Step-by-Step Account Operating Road Map */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-50 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>초보자를 위한 실전 계좌 운용 4단계 로드맵</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-extrabold text-sm">STEP 1. 연금저축 개설</div>
            <p className="text-slate-300">
              증권사(키움, 미래에셋, 한국투자 등) 앱에서 **연금저축펀드** 계좌를 만들고 연 600만 원(월 50만 원) 매수를 시작합니다.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-purple-400 font-extrabold text-sm">STEP 2. IRP 개설 (300만)</div>
            <p className="text-slate-300">
              **IRP 계좌**를 추가 개설하여 연 300만 원을 매수합니다. 900만 원을 채워 16.5%(148.5만 원) 환급금을 만듭니다.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-extrabold text-sm">STEP 3. ISA 계좌 활용</div>
            <p className="text-slate-300">
              여유 자금이 있다면 **중개형 ISA** 계좌에서 S&P500/나스닥 TR ETF를 모아 3년 비과세 혜택을 챙깁니다.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-amber-400 font-extrabold text-sm">STEP 4. 15년 스노우볼</div>
            <p className="text-slate-300">
              매년 연말정산 환급금과 TR ETF 배당 자동 재투자로 15년간 자산을 불린 후 55세부터 연 4% 인출 연금을 개시합니다!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
