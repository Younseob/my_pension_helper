// src/utils/backtestEngine.ts

interface DailyData {
  date: string;
  sp500Index: number;
  nasdaqIndex: number;
  fearGreedIndex: number;
}

interface BacktestResult {
  cagr: number;
  mdd: number;
  totalReturn: number;
  finalCapital: number;
}

export function runBacktest(data: DailyData[], initialCapital: number, strategyParams: { buyThreshold: number, sellThreshold: number }): { strategyResult: BacktestResult, buyAndHoldResult: BacktestResult, history: { date: string, portfolioValue: number }[] } {
  let cash = initialCapital;
  let holdings = 0;
  let portfolioValue = initialCapital;
  let maxPortfolioValue = initialCapital;
  let history: { date: string, portfolioValue: number }[] = [];

  for (let i = 0; i < data.length - 1; i++) {
    const currentFG = data[i].fearGreedIndex;
    const nextDayPrice = data[i + 1].nasdaqIndex;

    if (currentFG <= strategyParams.buyThreshold) {
      // BUY signal
      if (cash > 0) {
        holdings = cash / nextDayPrice;
        cash = 0;
      }
    } else if (currentFG >= strategyParams.sellThreshold) {
      // SELL signal
      if (holdings > 0) {
        cash = holdings * nextDayPrice;
        holdings = 0;
      }
    }

    portfolioValue = cash + holdings * nextDayPrice;
    maxPortfolioValue = Math.max(maxPortfolioValue, portfolioValue);
    history.push({ date: data[i + 1].date, portfolioValue });
  }

  const strategyResult: BacktestResult = {
    cagr: Math.pow(portfolioValue / initialCapital, 252 / data.length) - 1,
    mdd: (maxPortfolioValue - portfolioValue) / maxPortfolioValue,
    totalReturn: (portfolioValue - initialCapital) / initialCapital,
    finalCapital: portfolioValue
  };

  // Buy and Hold strategy
  let buyAndHoldCash = 0;
  let buyAndHoldHoldings = initialCapital / data[0].nasdaqIndex;
  let buyAndHoldPortfolioValue = initialCapital;
  let buyAndHoldMaxPortfolioValue = initialCapital;
  let buyAndHoldHistory: { date: string, portfolioValue: number }[] = [];

  for (let i = 0; i < data.length; i++) {
    const nasdaqPrice = data[i].nasdaqIndex;
    buyAndHoldPortfolioValue = buyAndHoldCash + buyAndHoldHoldings * nasdaqPrice;
    buyAndHoldMaxPortfolioValue = Math.max(buyAndHoldMaxPortfolioValue, buyAndHoldPortfolioValue);
    buyAndHoldHistory.push({ date: data[i].date, portfolioValue: buyAndHoldPortfolioValue });
  }

  const buyAndHoldResult: BacktestResult = {
    cagr: Math.pow(buyAndHoldPortfolioValue / initialCapital, 252 / data.length) - 1,
    mdd: (buyAndHoldMaxPortfolioValue - buyAndHoldPortfolioValue) / buyAndHoldMaxPortfolioValue,
    totalReturn: (buyAndHoldPortfolioValue - initialCapital) / initialCapital,
    finalCapital: buyAndHoldPortfolioValue
  };

  return {
    strategyResult,
    buyAndHoldResult,
    history
  };
}