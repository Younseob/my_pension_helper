import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ChartDataset,
  Plugin
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PensionParams } from '../types/pension';
import { PRESETS, calculatePensionTimeline, formatKRWShort, formatKRW } from '../utils/pensionMath';
import { LineChart, BarChart2, PieChart, Info } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
);

interface SimulationChartProps {
  baseParams: PensionParams;
  selectedPresetId: 'conservative' | 'average' | 'optimistic';
}

export default function SimulationChart({ 
  baseParams, 
  selectedPresetId 
}: SimulationChartProps) {
  // Chart view modes: 
  // 'all_scenarios' = Compare Conservative, Average, Optimistic together
  // 'balance_vs_withdrawn' = Selected scenario balance vs cumulative withdrawn cash
  // 'asset_breakdown' = S&P 500 balance vs Nasdaq 100 balance
  const [chartMode, setChartMode] = useState<'all_scenarios' | 'balance_vs_withdrawn' | 'asset_breakdown'>('all_scenarios');

  // Compute dataset results
  const conservativeResult = calculatePensionTimeline({
    ...baseParams,
    sp500Return: PRESETS.conservative.sp500Return,
    nasdaqReturn: PRESETS.conservative.nasdaqReturn,
    cagrOverride: PRESETS.conservative.weightedCagr
  });

  const averageResult = calculatePensionTimeline({
    ...baseParams,
    sp500Return: PRESETS.average.sp500Return,
    nasdaqReturn: PRESETS.average.nasdaqReturn,
    cagrOverride: PRESETS.average.weightedCagr
  });

  const optimisticResult = calculatePensionTimeline({
    ...baseParams,
    sp500Return: PRESETS.optimistic.sp500Return,
    nasdaqReturn: PRESETS.optimistic.nasdaqReturn,
    cagrOverride: PRESETS.optimistic.weightedCagr
  });

  // Selected scenario timeline
  const activePreset = PRESETS[selectedPresetId] || PRESETS.average;
  const activeResult = selectedPresetId === 'conservative' 
    ? conservativeResult 
    : selectedPresetId === 'optimistic' 
    ? optimisticResult 
    : averageResult;

  const totalYears = baseParams.accumulationYears + baseParams.withdrawalYears;
  const labels = Array.from({ length: totalYears + 1 }, (_, i) => `${i}년차`);

  // Build dataset based on chartMode
  let datasets: ChartDataset<'line', number[]>[] = [];

  if (chartMode === 'all_scenarios') {
    datasets = [
      {
        label: '보수적 (CAGR 7.0%)',
        data: conservativeResult.yearlyTimeline.map(d => d.endAsset),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderWidth: selectedPresetId === 'conservative' ? 3.5 : 2,
        pointRadius: 2,
        pointHoverRadius: 6,
        fill: selectedPresetId === 'conservative' ? 'origin' : false,
        tension: 0.2,
      },
      {
        label: '평균적 (CAGR 11.0%)',
        data: averageResult.yearlyTimeline.map(d => d.endAsset),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: selectedPresetId === 'average' ? 3.5 : 2,
        pointRadius: 2,
        pointHoverRadius: 6,
        fill: selectedPresetId === 'average' ? 'origin' : false,
        tension: 0.2,
      },
      {
        label: '희망적 (CAGR 13.8%)',
        data: optimisticResult.yearlyTimeline.map(d => d.endAsset),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        borderWidth: selectedPresetId === 'optimistic' ? 3.5 : 2,
        pointRadius: 2,
        pointHoverRadius: 6,
        fill: selectedPresetId === 'optimistic' ? 'origin' : false,
        tension: 0.2,
      }
    ];
  } else if (chartMode === 'balance_vs_withdrawn') {
    datasets = [
      {
        label: `${activePreset.name} 자산 잔액`,
        data: activeResult.yearlyTimeline.map(d => d.endAsset),
        borderColor: activePreset.color,
        backgroundColor: activePreset.color + '20',
        borderWidth: 3,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.2,
      },
      {
        label: '누적 연금 인출액',
        data: activeResult.yearlyTimeline.map(d => d.totalWithdrawnCumulative),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 2.5,
        borderDash: [5, 5],
        pointRadius: 2,
        pointHoverRadius: 6,
        fill: false,
        tension: 0.2,
      }
    ];
  } else if (chartMode === 'asset_breakdown') {
    datasets = [
      {
        label: `S&P 500 자산 (${baseParams.sp500Ratio}%)`,
        data: activeResult.yearlyTimeline.map(d => d.sp500Asset),
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.15)',
        borderWidth: 2.5,
        pointRadius: 2,
        fill: true,
        tension: 0.2,
      },
      {
        label: `NASDAQ 100 자산 (${baseParams.nasdaqRatio}%)`,
        data: activeResult.yearlyTimeline.map(d => d.nasdaqAsset),
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.15)',
        borderWidth: 2.5,
        pointRadius: 2,
        fill: true,
        tension: 0.2,
      }
    ];
  }

  // Custom background plugin to shade Accumulation vs Withdrawal phases
  const phasePlugin: Plugin<'line'> = {
    id: 'phaseBackground',
    beforeDraw: (chart) => {
      try {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;

        const accYears = baseParams.accumulationYears;
        const ratio = accYears / (totalYears > 0 ? totalYears : 1);
        const xAccEnd = chartArea.left + (chartArea.width * ratio);

        ctx.save();

        // 1. Accumulation Phase Background
        if (xAccEnd > chartArea.left) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
          ctx.fillRect(
            chartArea.left,
            chartArea.top,
            Math.min(xAccEnd, chartArea.right) - chartArea.left,
            chartArea.height
          );
        }

        // 2. Withdrawal Phase Background
        if (xAccEnd < chartArea.right) {
          ctx.fillStyle = 'rgba(139, 92, 246, 0.05)';
          ctx.fillRect(
            Math.max(xAccEnd, chartArea.left),
            chartArea.top,
            chartArea.right - Math.max(xAccEnd, chartArea.left),
            chartArea.height
          );
        }

        // 3. Vertical Dividing Line at Year 15
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.moveTo(xAccEnd, chartArea.top);
        ctx.lineTo(xAccEnd, chartArea.bottom);
        ctx.stroke();

        // Label on vertical line
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(` 은퇴 시점 (${accYears}년차)`, Math.min(xAccEnd + 4, chartArea.right - 90), chartArea.top + 18);

        ctx.restore();
      } catch (e) {
        console.warn('phasePlugin draw error:', e);
      }
    }
  };

  const chartData = {
    labels,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
          font: {
            size: 12,
            family: 'Pretendard',
          },
          usePointStyle: true,
          boxWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: (tooltipItems: any[]) => {
            const yearIndex = tooltipItems[0].dataIndex;
            const phaseText = yearIndex <= baseParams.accumulationYears 
              ? '🌱 자산 적립기 (15년 스노우볼)' 
              : '🌴 연금 인출기 (4% 룰 적용)';
            return `${yearIndex}년차 | ${phaseText}`;
          },
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${formatKRW(value)}`;
          },
          afterBody: (tooltipItems: any[]) => {
            const yearIndex = tooltipItems[0].dataIndex;
            if (yearIndex > baseParams.accumulationYears) {
              const item = activeResult.yearlyTimeline[yearIndex];
              if (item && item.monthlyIncome > 0) {
                return [
                  `──────────────────`,
                  `💡 당해 월 연금 수령: 월 ${formatKRW(item.monthlyIncome)}`,
                  `💡 연간 총 인출액: ${formatKRW(item.annualWithdrawal)}`
                ];
              }
            }
            return [];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#1e293b',
        },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
        }
      },
      y: {
        grid: {
          color: '#1e293b',
        },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: (value: any) => formatKRWShort(typeof value === 'number' ? value : parseFloat(value as string)),
        }
      }
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl mb-8">
      {/* Chart Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-50 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-emerald-400" />
            <span>30년 연금 시뮬레이션 타임라인 그래프</span>
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            0~15년 적립 구간(초록색 영역)과 16~30년 4% 연금 인출 구간(보라색 영역)의 자산 추이를 한눈에 확인해보세요.
          </p>
        </div>

        {/* View mode toggle buttons */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setChartMode('all_scenarios')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartMode === 'all_scenarios'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>3대 시나리오 비교</span>
          </button>

          <button
            onClick={() => setChartMode('balance_vs_withdrawn')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartMode === 'balance_vs_withdrawn'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>잔액 vs 누적 인출액</span>
          </button>

          <button
            onClick={() => setChartMode('asset_breakdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartMode === 'asset_breakdown'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>포트폴리오 비중</span>
          </button>
        </div>
      </div>

      {/* Main Chart Component */}
      <div className="relative h-80 sm:h-96 w-full">
        <Line
          key={`${chartMode}-${selectedPresetId}-${baseParams.accumulationYears}-${baseParams.withdrawalYears}`}
          data={chartData}
          options={chartOptions}
          plugins={[phasePlugin]}
        />
      </div>

      {/* Chart Legend Explanation Banner */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50" />
            <span>0~15년: 복리 적립기 (스노우볼)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500/50" />
            <span>16~30년: 4% 연금 인출기</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-300">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>그래프에 마우스를 올리시면 연도별 상세 금액이 표시됩니다.</span>
        </div>
      </div>
    </div>
  );
}
