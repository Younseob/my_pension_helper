import React, { useState } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import ScenarioCards from './components/ScenarioCards';
import SimulationChart from './components/SimulationChart';
import CustomCalculator from './components/CustomCalculator';
import YearlyScheduleTable from './components/YearlyScheduleTable';
import EducationalGuide from './components/EducationalGuide';
import TargetReverseCalculator from './components/TargetReverseCalculator';
import TaxGuideTab from './components/TaxGuideTab';
import DbToDcTab from './components/DbToDcTab';
import TraditionalPensionTab from './components/TraditionalPensionTab';
import Footer from './components/Footer';
import { PensionParams } from './types/pension';
import { PRESETS, calculatePensionTimeline } from './utils/pensionMath';

export default function App() {
  // Main Tab State: 'simulator' | 'tax_guide' | 'db_to_dc' | 'traditional_vs_stock'
  const [activeTab, setActiveTab] = useState<'simulator' | 'tax_guide' | 'db_to_dc' | 'traditional_vs_stock'>('simulator');

  // Preset selection state: 'conservative', 'average', 'optimistic'
  const [selectedPresetId, setSelectedPresetId] = useState<'conservative' | 'average' | 'optimistic'>('average');

  // Custom calculator parameter state
  const [params, setParams] = useState<PensionParams>({
    initialInvestment: 100000000, // 100,000,000 KRW
    sp500Ratio: 70,
    nasdaqRatio: 30,
    sp500Return: PRESETS.average.sp500Return,
    nasdaqReturn: PRESETS.average.nasdaqReturn,
    accumulationYears: 15,
    withdrawalYears: 15,
    withdrawalRate: 4.0,
    monthlyContribution: 0,
    inflationRate: 0,
  });

  // Modal open states
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isTargetCalcOpen, setIsTargetCalcOpen] = useState<boolean>(false);

  // When user selects a preset card
  const handleSelectPreset = (presetId: 'conservative' | 'average' | 'optimistic') => {
    setSelectedPresetId(presetId);
    const preset = PRESETS[presetId];
    setParams((prev) => ({
      ...prev,
      sp500Return: preset.sp500Return,
      nasdaqReturn: preset.nasdaqReturn,
    }));
  };

  // Reset to initial defaults (1억 원, 70:30, 15년, 평균적 시나리오)
  const handleResetDefaults = () => {
    setSelectedPresetId('average');
    setParams({
      initialInvestment: 100000000,
      sp500Ratio: 70,
      nasdaqRatio: 30,
      sp500Return: PRESETS.average.sp500Return,
      nasdaqReturn: PRESETS.average.nasdaqReturn,
      accumulationYears: 15,
      withdrawalYears: 15,
      withdrawalRate: 4.0,
      monthlyContribution: 0,
      inflationRate: 0,
    });
  };

  // Active scenario calculation result
  const activePreset = PRESETS[selectedPresetId] || PRESETS.average;
  const projectionData = calculatePensionTimeline({
    ...params,
    sp500Return: params.sp500Return,
    nasdaqReturn: params.nasdaqReturn,
    cagrOverride: null // Dynamically calculate based on current sp500Ratio & nasdaqRatio
  });

  // Export full 30-year simulation table as CSV file
  const handleExportCSV = () => {
    const headers = ['연차', '구분', '기초자산(원)', '당해수익금(원)', '연간인출액(원)', '월연금수령액(원)', '기말자산(원)'];
    const rows = projectionData.yearlyTimeline.map(row => [
      row.year,
      row.phaseLabel,
      Math.round(row.startAsset),
      Math.round(row.gain),
      Math.round(row.annualWithdrawal),
      Math.round(row.monthlyIncome),
      Math.round(row.endAsset)
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `연금나침반_30년시뮬레이션_${activePreset.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenTargetCalc={() => setIsTargetCalcOpen(true)}
        onResetDefaults={handleResetDefaults}
        onExportCSV={handleExportCSV}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 1. Simulator Tab Content */}
        <div className={activeTab === 'simulator' ? 'block space-y-8' : 'hidden'}>
          <HeroBanner
            activePreset={activePreset}
            projectionData={projectionData}
            sp500Ratio={params.sp500Ratio}
            nasdaqRatio={params.nasdaqRatio}
            onOpenGuide={() => setIsGuideOpen(true)}
          />

          <ScenarioCards
            selectedPresetId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
            baseParams={params}
          />

          <SimulationChart
            baseParams={params}
            selectedPresetId={selectedPresetId}
          />

          <CustomCalculator
            params={params}
            onChangeParams={setParams}
            onResetDefaults={handleResetDefaults}
          />

          <YearlyScheduleTable
            projectionData={{
              ...projectionData,
              activePresetName: activePreset.name
            }}
            onExportCSV={handleExportCSV}
          />
        </div>

        {/* 2. Tax & ETF Strategy Guide Tab Content */}
        <div className={activeTab === 'tax_guide' ? 'block' : 'hidden'}>
          <TaxGuideTab />
        </div>

        {/* 3. DB to DC Conversion Calculator Tab Content */}
        <div className={activeTab === 'db_to_dc' ? 'block' : 'hidden'}>
          <DbToDcTab />
        </div>

        {/* 4. Traditional Conservative Pension vs US Stock Snowball Comparison Tab Content */}
        <div className={activeTab === 'traditional_vs_stock' ? 'block' : 'hidden'}>
          <TraditionalPensionTab />
        </div>
      </main>

      {/* Educational Concept Guide Modal */}
      <EducationalGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Reverse Target Calculator Modal */}
      <TargetReverseCalculator
        isOpen={isTargetCalcOpen}
        onClose={() => setIsTargetCalcOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
