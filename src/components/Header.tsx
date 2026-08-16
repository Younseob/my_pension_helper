import React from 'react';
import { Compass, BookOpen, Target, Download, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onOpenTargetCalc: () => void;
  onResetDefaults: () => void;
  onExportCSV: () => void;
}

export default function Header({
  onOpenGuide,
  onOpenTargetCalc,
  onResetDefaults,
  onExportCSV
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Compass className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-50 tracking-tight">초보자를 위한 연금 나침반</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                15년 스노우볼 & 4% 룰
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">미국 S&P 500 (70%) + NASDAQ 100 (30%) 포트폴리오 연금 시뮬레이터</p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:shadow-md"
            title="S&P500, 나스닥, 4% 룰 이란?"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">초보자 개념 가이드</span>
            <span className="md:hidden">가이드</span>
          </button>

          <button
            onClick={onOpenTargetCalc}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-900/30 transition-all"
            title="원하는 월 연금액으로 역산하기"
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">목표 연금 역산기</span>
            <span className="sm:hidden">목표 역산</span>
          </button>

          <button
            onClick={onExportCSV}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
            title="연도별 내역 Excel/CSV 다운로드"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onResetDefaults}
            className="p-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800 transition-all border border-transparent hover:border-slate-700"
            title="기본 설정으로 초기화 (1억, 15년, 70:30)"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
