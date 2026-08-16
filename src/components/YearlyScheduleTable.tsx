import React, { useState } from 'react';
import { Table, Download } from 'lucide-react';
import { CalculationResult } from '../types/pension';
import { formatKRW } from '../utils/pensionMath';

interface YearlyScheduleTableProps {
  projectionData: CalculationResult;
  onExportCSV: () => void;
}

export default function YearlyScheduleTable({ 
  projectionData, 
  onExportCSV 
}: YearlyScheduleTableProps) {
  const [filterPhase, setFilterPhase] = useState<'all' | 'accumulation' | 'withdrawal'>('all');

  const { yearlyTimeline } = projectionData;

  const filteredTimeline = yearlyTimeline.filter(item => {
    if (item.year === 0) return true; // always include year 0
    if (filterPhase === 'accumulation') return item.phase === 'accumulation';
    if (filterPhase === 'withdrawal') return item.phase === 'withdrawal';
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-50">연도별 자산 & 4% 인출 상세 스케줄</h3>
            <p className="text-xs text-slate-300">1년차부터 30년차까지 매년 자산 형성 및 은퇴 연금 수령 내역입니다.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Phase Filter Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterPhase('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterPhase === 'all' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              전체 (0~30년)
            </button>
            <button
              onClick={() => setFilterPhase('accumulation')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterPhase === 'accumulation' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              적립기 (1~15년)
            </button>
            <button
              onClick={() => setFilterPhase('withdrawal')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                filterPhase === 'withdrawal' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              인출기 (16~30년)
            </button>
          </div>

          <button
            onClick={onExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700"
            title="Excel / CSV 파일로 다운로드"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Excel/CSV 내보내기</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-300 border-b border-slate-800 uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-3.5 text-center w-16">연차</th>
              <th className="p-3.5 text-center">구분</th>
              <th className="p-3.5 text-right">기초 자산</th>
              <th className="p-3.5 text-right">당해 수익금</th>
              <th className="p-3.5 text-right">연간 인출액 (4%)</th>
              <th className="p-3.5 text-right text-purple-300">월 연금 수령액</th>
              <th className="p-3.5 text-right text-emerald-400">기말 자산</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {filteredTimeline.map((row) => {
              const isStart = row.year === 0;
              const isRetirementYear = row.year === 15;
              const isAccumulation = row.phase === 'accumulation';
              const isWithdrawal = row.phase === 'withdrawal';

              return (
                <tr
                  key={row.year}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    isRetirementYear ? 'bg-amber-950/20 border-y-2 border-amber-500/40 font-bold' : ''
                  }`}
                >
                  {/* 연차 */}
                  <td className="p-3 text-center font-bold text-slate-200">
                    {isStart ? '초기 0년차' : `${row.year}년차`}
                  </td>

                  {/* 구분 Badge */}
                  <td className="p-3 text-center">
                    {isStart && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        투자 시작
                      </span>
                    )}
                    {isAccumulation && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        🌱 적립기
                      </span>
                    )}
                    {isWithdrawal && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        🌴 연금 인출기
                      </span>
                    )}
                  </td>

                  {/* 기초 자산 */}
                  <td className="p-3 text-right text-slate-200 font-mono">
                    {formatKRW(row.startAsset)}
                  </td>

                  {/* 당해 수익금 */}
                  <td className="p-3 text-right text-emerald-400/90 font-mono">
                    {row.gain > 0 ? `+${formatKRW(row.gain)}` : '-'}
                  </td>

                  {/* 연간 인출액 */}
                  <td className="p-3 text-right text-amber-400 font-mono font-medium">
                    {row.annualWithdrawal > 0 ? `-${formatKRW(row.annualWithdrawal)}` : '-'}
                  </td>

                  {/* 월 연금 수령액 */}
                  <td className="p-3 text-right font-bold text-purple-300 font-mono">
                    {row.monthlyIncome > 0 ? `월 ${formatKRW(row.monthlyIncome)}` : '-'}
                  </td>

                  {/* 기말 자산 */}
                  <td className="p-3 text-right font-bold text-emerald-400 font-mono">
                    {formatKRW(row.endAsset)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-[11px] text-slate-400 flex items-center justify-between">
        <span>* 연간 수익 및 인출은 복리 기말 평가액 기준입니다.</span>
        <span>총 {filteredTimeline.length}개 연차 데이터 표시 중</span>
      </div>
    </div>
  );
}
