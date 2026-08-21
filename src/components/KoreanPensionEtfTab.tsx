import React, { useState } from 'react';
import SmartMarketIndicator from './SmartMarketIndicator';
import RebalancingRecommender from './RebalancingRecommender';

type Allocation = {
  name: string;
  role: string;
  percent: number;
  performance10y: string;
  dividend: string;
  color: string;
};

type Portfolio = {
  strategy: string;
  score: number;
  note: string;
  allocations: Allocation[];
};

type AccountData = {
  personal: Portfolio;
  irp: Portfolio;
};

type PortfolioData = Record<string, AccountData>;

const portfolioData: PortfolioData = {
  aggressive: {
    personal: {
      strategy: '100% Equity Megatrend',
      score: 95,
      note: '주식 100% 한도 활용',
      allocations: [
        { name: 'S&P500', role: 'Core Equity', percent: 50, performance10y: '12.4%', dividend: '1.5%', color: '#4F46E5' },
        { name: '나스닥100', role: 'Growth Equity', percent: 30, performance10y: '18.7%', dividend: '0.8%', color: '#10B981' },
        { name: '인도니프티50', role: 'Emerging Market', percent: 20, performance10y: '10.2%', dividend: '2.1%', color: '#F59E0B' },
      ],
    },
    irp: {
      strategy: 'Max Aggressive 70/30',
      score: 92,
      note: '위험자산 70% + 안전자산 30% 꽉 채운 공격형',
      allocations: [
        { name: '나스닥100', role: 'Growth Equity', percent: 40, performance10y: '18.7%', dividend: '0.8%', color: '#10B981' },
        { name: 'AI테크TOP10', role: 'Thematic Equity', percent: 30, performance10y: '22.5%', dividend: '0.5%', color: '#EF4444' },
        { name: 'KODEX TRF3070', role: 'Balanced Fund', percent: 30, performance10y: '9.3%', dividend: '2.8%', color: '#8B5CF6' },
      ],
    },
  },
  moderate: {
    personal: {
      strategy: 'Growth & Dividend Balanced',
      score: 98,
      note: '',
      allocations: [
        { name: 'S&P500', role: 'Core Equity', percent: 40, performance10y: '12.4%', dividend: '1.5%', color: '#4F46E5' },
        { name: '미국배당+7%프리미엄다우존스', role: 'High Dividend', percent: 40, performance10y: '11.0%', dividend: '4.2%', color: '#10B981' },
        { name: '미국배당다우존스', role: 'Dividend Equity', percent: 20, performance10y: '10.5%', dividend: '3.8%', color: '#F59E0B' },
      ],
    },
    irp: {
      strategy: 'Core-Satellite with Bond Buffer',
      score: 96,
      note: '',
      allocations: [
        { name: 'S&P500', role: 'Core Equity', percent: 40, performance10y: '12.4%', dividend: '1.5%', color: '#4F46E5' },
        { name: '배당+7%다우존스', role: 'High Dividend', percent: 30, performance10y: '11.0%', dividend: '4.2%', color: '#10B981' },
        { name: 'TIGER 테슬라채권혼합Fn', role: 'Bond Hybrid', percent: 30, performance10y: '7.8%', dividend: '2.5%', color: '#8B5CF6' },
      ],
    },
  },
  conservative: {
    personal: {
      strategy: 'Low Volatility Income',
      score: 94,
      note: '',
      allocations: [
        { name: '미국배당다우존스', role: 'Dividend Equity', percent: 50, performance10y: '10.5%', dividend: '3.8%', color: '#F59E0B' },
        { name: '나스닥100채권혼합액티브', role: 'Equity-Bond Hybrid', percent: 30, performance10y: '9.0%', dividend: '1.2%', color: '#10B981' },
        { name: '단기통안채', role: 'Short-Term Bond', percent: 20, performance10y: '4.5%', dividend: '3.0%', color: '#8B5CF6' },
      ],
    },
    irp: {
      strategy: 'All-Weather Capital Preservation',
      score: 99,
      note: '',
      allocations: [
        { name: 'KODEX TRF3070', role: 'Balanced Fund', percent: 50, performance10y: '9.3%', dividend: '2.8%', color: '#8B5CF6' },
        { name: '나스닥100채권혼합액티브', role: 'Equity-Bond Hybrid', percent: 30, performance10y: '9.0%', dividend: '1.2%', color: '#10B981' },
        { name: 'KODEX 단기채권', role: 'Short-Term Bond', percent: 20, performance10y: '4.2%', dividend: '2.9%', color: '#4F46E5' },
      ],
    },
  },
};

export default function KoreanPensionEtfTab() {
  const [riskProfile, setRiskProfile] = useState<'aggressive' | 'moderate' | 'conservative'>('aggressive');
  const [accountType, setAccountType] = useState<'personal' | 'irp'>('personal');

  const data = portfolioData[riskProfile][accountType];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <SmartMarketIndicator />
      <h1 className="text-2xl font-bold mb-6">한국 연금 ETF 포트폴리오</h1>

      {/* Level 1: Risk Profile */}
      <div className="flex flex-wrap gap-4 mb-6">
        {['aggressive', 'moderate', 'conservative'].map((profile) => (
          <button
            key={profile}
            onClick={() => setRiskProfile(profile as any)}
            className={`flex-1 min-w-[100px] py-3 px-4 text-center rounded ${
              riskProfile === profile
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500'
                : 'bg-slate-800/50 hover:bg-slate-700'
            }`}
          >
            {profile === 'aggressive' ? '공격형' : profile === 'moderate' ? '중립형' : '보수형'}
          </button>
        ))}
      </div>

      {/* Level 2: Account Type */}
      <div className="flex flex-wrap gap-4 mb-6">
        {['personal', 'irp'].map((type) => (
          <button
            key={type}
            onClick={() => setAccountType(type as any)}
            className={`flex-1 min-w-[120px] py-3 px-4 text-center rounded ${
              accountType === type ? 'bg-blue-500 text-white' : 'bg-slate-800/50 hover:bg-slate-700'
            }`}
          >
            {type === 'personal' ? '연금저축펀드' : '퇴직연금 IRP/DC'}
          </button>
        ))}
      </div>

      {/* Portfolio Detail */}
      <div className="bg-slate-800/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{data.strategy}</h2>
        <div className="flex items-baseline mb-4">
          <span className="text-3xl font-bold">{data.score}</span>
          <span className="ml-2 text-sm text-slate-400">/100</span>
        </div>
        <p className="text-sm text-slate-400 mb-4">{data.note}</p>

        {/* Allocation Bars */}
        <div className="space-y-4 mb-6">
          {data.allocations.map((alloc: Allocation) => (
            <div key={alloc.name} className="flex items-center space-x-3">
              <div className="w-20">{alloc.name}</div>
              <div className="flex-1 bg-slate-700 h-2.5 rounded">
                <div className="bg-emerald-400 h-full rounded" style={{ width: `${alloc.percent}%` }}></div>
              </div>
              <div className="w-16 text-right">{alloc.percent}%</div>
            </div>
          ))}
        </div>

        {/* ETF Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.allocations.map((alloc: Allocation) => (
            <div key={alloc.name} className="bg-slate-700/50 rounded-lg p-4">
              <h3 className="font-medium">{alloc.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{alloc.role}</p>
              <p className="mt-2 font-semibold">{alloc.percent}%</p>
              <div className="mt-2 space-y-1 text-xs text-slate-300">
                <span>최근 10년 성과: {alloc.performance10y}</span>
                <span>배당금: {alloc.dividend}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <RebalancingRecommender riskProfile={riskProfile} accountType={accountType} currentAllocations={data.allocations} />
        </div>
      </div>
    </div>
  );
}
