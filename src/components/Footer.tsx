import React from 'react';
import { ShieldAlert, Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 py-10 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">초보자를 위한 연금 나침반</span>
              <p className="text-[11px] text-slate-300">S&P 500 (70%) + NASDAQ 100 (30%) 15년 스노우볼 & 4% 룰 시뮬레이터</p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-slate-300">
            <span>S&P 500 (70%)</span>
            <span>NASDAQ 100 (30%)</span>
            <span>Trinity 4% Rule</span>
          </div>
        </div>

        {/* Disclaimer Notice Box */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>투자 참고 및 유의사항 안내</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            본 시뮬레이터는 미국 S&P 500 및 NASDAQ 100 지수의 역사적 수익률 통계 데이터를 기반으로 계산된 가상의 투자 예측 시뮬레이션입니다. 과거의 시장 수익률이 미래의 수익을 보장하지 않으며, 실제 투자 결과는 환율 변동성, 세금, 수수료 및 개별 시장 상황에 따라 달라질 수 있습니다. 본 사이트는 금융투자 권유 목적이 아닌 정보 제공 목적으로 작성되었습니다.
          </p>
        </div>

        <div className="text-center text-slate-400 text-[11px] pt-2">
          © {new Date().getFullYear()} My Pension Helper. Created for beginner pension investors.
        </div>
      </div>
    </footer>
  );
}
