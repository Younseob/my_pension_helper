export interface PensionParams {
  initialInvestment: number;
  sp500Ratio: number;
  nasdaqRatio: number;
  sp500Return: number;
  nasdaqReturn: number;
  cagrOverride?: number | null;
  accumulationYears: number;
  withdrawalYears: number;
  withdrawalRate: number;
  monthlyContribution: number;
  inflationRate: number;
  withdrawalMode?: 'fixed_inflation' | 'dynamic_percent';
}

export interface PresetScenario {
  id: 'conservative' | 'average' | 'optimistic';
  name: string;
  badge: string;
  description: string;
  sp500Return: number;
  nasdaqReturn: number;
  weightedCagr: number;
  color: string;
  bgGradient: string;
  borderColor: string;
  hoverBorder: string;
  isRecommended?: boolean;
}

export interface YearlyTimelineRow {
  year: number;
  phase: 'start' | 'accumulation' | 'withdrawal';
  phaseLabel: string;
  startAsset: number;
  annualContribution: number;
  gain: number;
  annualWithdrawal: number;
  monthlyIncome: number;
  endAsset: number;
  sp500Asset: number;
  nasdaqAsset: number;
  totalWithdrawnCumulative: number;
}

export interface CalculationResult {
  initialInvestment: number;
  accumulatedPrincipalAtRetirement: number;
  firstYearWithdrawal: number;
  firstYearMonthlyPension: number;
  cagrPercent: number;
  totalWithdrawn: number;
  finalRemainingAsset: number;
  multiplier: number;
  yearlyTimeline: YearlyTimelineRow[];
  activePresetName?: string;
}

export interface TargetCalcResult {
  targetMonthlyPension: number;
  annualTargetWithdrawal: number;
  requiredAssetAtRetirement: number;
  requiredInitialLumpSum: number;
  requiredMonthlyContribution: number;
}
