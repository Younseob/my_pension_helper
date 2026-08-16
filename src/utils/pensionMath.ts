import {
  PensionParams,
  PresetScenario,
  YearlyTimelineRow,
  CalculationResult,
  TargetCalcResult
} from '../types/pension';

export const PRESETS: Record<'conservative' | 'average' | 'optimistic', PresetScenario> = {
  conservative: {
    id: 'conservative',
    name: '보수적 시나리오',
    badge: '하방 방어형',
    description: '장기 하락장이나 세계 경기 둔화를 가정한 자산 보호 중심 모델',
    sp500Return: 6.5,
    nasdaqReturn: 8.2,
    weightedCagr: 7.01, // 0.7 * 6.5 + 0.3 * 8.2 = 4.55 + 2.46 = 7.01%
    color: '#3b82f6', // blue
    bgGradient: 'from-blue-600/20 to-blue-900/10',
    borderColor: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-500',
  },
  average: {
    id: 'average',
    name: '평균적 시나리오',
    badge: '역사적 표준',
    description: '지난 30년간 미국 증시의 역사적 연평균 수익률에 기반한 밸런스 모델',
    sp500Return: 9.8,
    nasdaqReturn: 13.8,
    weightedCagr: 11.00, // 0.7 * 9.8 + 0.3 * 13.8 = 6.86 + 4.14 = 11.00%
    color: '#10b981', // emerald
    bgGradient: 'from-emerald-600/20 to-emerald-900/10',
    borderColor: 'border-emerald-500/30',
    hoverBorder: 'hover:border-emerald-500',
    isRecommended: true,
  },
  optimistic: {
    id: 'optimistic',
    name: '희망적 시나리오',
    badge: '고성장형',
    description: '미국 대형주 및 AI/기술 혁신의 강력한 장기 상승장을 반영한 성장 모델',
    sp500Return: 12.0,
    nasdaqReturn: 18.0,
    weightedCagr: 13.80, // 0.7 * 12.0 + 0.3 * 18.0 = 8.4 + 5.4 = 13.80%
    color: '#8b5cf6', // purple
    bgGradient: 'from-purple-600/20 to-purple-900/10',
    borderColor: 'border-purple-500/30',
    hoverBorder: 'hover:border-purple-500',
  }
};

export function calculatePensionTimeline(params: PensionParams): CalculationResult {
  const {
    initialInvestment = 100000000,
    sp500Ratio = 70,
    nasdaqRatio = 30,
    sp500Return = 9.8,
    nasdaqReturn = 13.8,
    cagrOverride = null,
    accumulationYears = 15,
    withdrawalYears = 15,
    withdrawalRate = 4.0,
    monthlyContribution = 0,
    inflationRate = 0,
    withdrawalMode = 'fixed_inflation'
  } = params;

  const spWeight = sp500Ratio / 100;
  const nasdaqWeight = nasdaqRatio / 100;
  
  const annualReturnRate = cagrOverride !== null && cagrOverride !== undefined
    ? cagrOverride / 100 
    : (spWeight * (sp500Return / 100) + nasdaqWeight * (nasdaqReturn / 100));

  const yearlyTimeline: YearlyTimelineRow[] = [];
  let currentAsset = initialInvestment;
  let sp500Asset = initialInvestment * spWeight;
  let nasdaqAsset = initialInvestment * nasdaqWeight;
  let totalWithdrawn = 0;
  
  // Year 0 entry
  yearlyTimeline.push({
    year: 0,
    phase: 'start',
    phaseLabel: '시작',
    startAsset: currentAsset,
    annualContribution: 0,
    gain: 0,
    annualWithdrawal: 0,
    monthlyIncome: 0,
    endAsset: currentAsset,
    sp500Asset: sp500Asset,
    nasdaqAsset: nasdaqAsset,
    totalWithdrawnCumulative: 0,
  });

  // 1. Accumulation Phase (Years 1 to accumulationYears)
  for (let year = 1; year <= accumulationYears; year++) {
    const startAsset = currentAsset;
    const annualContribution = monthlyContribution * 12;
    
    const assetGrowth = startAsset * annualReturnRate;
    const contributionGrowth = annualContribution * (1 + annualReturnRate / 2);
    
    const yearEndAsset = startAsset + assetGrowth + contributionGrowth;
    const totalGain = yearEndAsset - startAsset - annualContribution;
    
    currentAsset = yearEndAsset;
    sp500Asset = currentAsset * spWeight;
    nasdaqAsset = currentAsset * nasdaqWeight;

    yearlyTimeline.push({
      year,
      phase: 'accumulation',
      phaseLabel: '적립기',
      startAsset,
      annualContribution,
      gain: totalGain,
      annualWithdrawal: 0,
      monthlyIncome: 0,
      endAsset: currentAsset,
      sp500Asset,
      nasdaqAsset,
      totalWithdrawnCumulative: 0,
    });
  }

  // Assets at the end of accumulation (Year 15 balance)
  const accumulatedPrincipalAtRetirement = currentAsset;
  const initialBaseWithdrawal = accumulatedPrincipalAtRetirement * (withdrawalRate / 100);

  // 2. Withdrawal Phase
  for (let year = accumulationYears + 1; year <= accumulationYears + withdrawalYears; year++) {
    const withdrawalYearIdx = year - accumulationYears;
    const startAsset = currentAsset;

    let annualWithdrawal = 0;
    if (withdrawalMode === 'fixed_inflation') {
      const inflationFactor = Math.pow(1 + inflationRate / 100, withdrawalYearIdx - 1);
      annualWithdrawal = initialBaseWithdrawal * inflationFactor;
    } else {
      annualWithdrawal = startAsset * (withdrawalRate / 100);
    }

    const growth = startAsset * annualReturnRate;
    const yearEndAsset = Math.max(0, startAsset + growth - annualWithdrawal);
    const actualWithdrawal = Math.min(annualWithdrawal, startAsset + growth);
    
    totalWithdrawn += actualWithdrawal;
    currentAsset = yearEndAsset;
    sp500Asset = currentAsset * spWeight;
    nasdaqAsset = currentAsset * nasdaqWeight;

    yearlyTimeline.push({
      year,
      phase: 'withdrawal',
      phaseLabel: '인출기',
      startAsset,
      annualContribution: 0,
      gain: growth,
      annualWithdrawal: actualWithdrawal,
      monthlyIncome: Math.round(actualWithdrawal / 12),
      endAsset: currentAsset,
      sp500Asset,
      nasdaqAsset,
      totalWithdrawnCumulative: totalWithdrawn,
    });
  }

  const firstYearWithdrawal = initialBaseWithdrawal;
  const firstYearMonthlyPension = Math.round(firstYearWithdrawal / 12);
  const cagrPercent = Math.round(annualReturnRate * 1000) / 10;

  return {
    initialInvestment,
    accumulatedPrincipalAtRetirement,
    firstYearWithdrawal,
    firstYearMonthlyPension,
    cagrPercent,
    totalWithdrawn,
    finalRemainingAsset: currentAsset,
    multiplier: Math.round((accumulatedPrincipalAtRetirement / initialInvestment) * 100) / 100,
    yearlyTimeline
  };
}

export function formatKRW(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0원';
  const rounded = Math.round(amount);
  const uk = Math.floor(rounded / 100000000);
  const man = Math.round((rounded % 100000000) / 10000);

  if (uk > 0 && man > 0) {
    return `${uk}억 ${man.toLocaleString()}만 원`;
  } else if (uk > 0) {
    return `${uk}억 원`;
  } else if (man > 0) {
    return `${man.toLocaleString()}만 원`;
  } else {
    return `${rounded.toLocaleString()}원`;
  }
}

export function formatKRWShort(amount: number | null | undefined): string {
  if (!amount || isNaN(amount)) return '0원';
  const eok = amount / 100000000;
  if (eok >= 1) {
    return `${eok.toFixed(2)}억`;
  }
  const man = amount / 10000;
  if (man >= 1) {
    return `${Math.round(man).toLocaleString()}만`;
  }
  return `${Math.round(amount).toLocaleString()}원`;
}

export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
}

export function calculateRequiredTargetAsset(
  targetMonthlyPension: number,
  accumulationYears = 15,
  expectedCagr = 11.0,
  withdrawalRate = 4.0
): TargetCalcResult {
  const annualTargetWithdrawal = targetMonthlyPension * 12;
  const requiredAssetAtRetirement = annualTargetWithdrawal / (withdrawalRate / 100);
  
  const r = expectedCagr / 100;
  const requiredInitialLumpSum = requiredAssetAtRetirement / Math.pow(1 + r, accumulationYears);
  
  const rm = Math.pow(1 + r, 1 / 12) - 1;
  const months = accumulationYears * 12;
  const requiredMonthlyContribution = requiredAssetAtRetirement * rm / (Math.pow(1 + rm, months) - 1);

  return {
    targetMonthlyPension,
    annualTargetWithdrawal,
    requiredAssetAtRetirement,
    requiredInitialLumpSum,
    requiredMonthlyContribution
  };
}
