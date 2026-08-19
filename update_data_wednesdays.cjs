const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchJson(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

const cnnOptions = {
  hostname: 'production.dataviz.cnn.io',
  path: '/index/fearandgreed/graphdata',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'application/json', 'Origin': 'https://edition.cnn.com', 'Referer': 'https://edition.cnn.com/'
  }
};
// Fetch daily data instead of weekly to exactly pick Wednesdays
const sp500Options = {
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/^GSPC?interval=1d&range=1y',
  method: 'GET',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};
const ndxOptions = {
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/^NDX?interval=1d&range=1y',
  method: 'GET',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};

async function main() {
  console.log("Fetching latest daily real historical data...");
  const [cnn, sp500, ndx] = await Promise.all([
    fetchJson(cnnOptions), fetchJson(sp500Options), fetchJson(ndxOptions)
  ]);

  const fgData = cnn.fear_and_greed_historical.data;
  const spT = sp500.chart.result[0].timestamp;
  const spC = sp500.chart.result[0].indicators.quote[0].close;
  
  const ndxT = ndx.chart.result[0].timestamp;
  const ndxC = ndx.chart.result[0].indicators.quote[0].close;

  // Build a map for NDX for quick lookup by timestamp (or closest day)
  const ndxMap = new Map();
  for (let i = 0; i < ndxT.length; i++) {
    ndxMap.set(ndxT[i], ndxC[i] || (i > 0 ? ndxC[i-1] : 0));
  }

  const finalData = [];
  let wednesdayCount = 0;
  
  // First, count how many Wednesdays we have for EPS interpolation
  for (let i = 0; i < spT.length; i++) {
    const dateObj = new Date(spT[i] * 1000);
    if (dateObj.getDay() === 3) wednesdayCount++;
  }

  let currentWedIndex = 0;

  for (let i = 0; i < spT.length; i++) {
    const dateObj = new Date(spT[i] * 1000);
    
    // Only pick Wednesdays (getDay() === 3)
    if (dateObj.getDay() !== 3) continue;

    const targetMs = dateObj.getTime();
    
    // Find closest CNN FG data
    let closestFg = fgData[0];
    let minDiff = Infinity;
    for (let f of fgData) {
      const diff = Math.abs(f.x - targetMs);
      if (diff < minDiff) { minDiff = diff; closestFg = f; }
    }

    const days = ['일','월','화','수','목','금','토'];
    const dateStr = dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '').replace(/\s/g, '-') + ' (' + days[dateObj.getDay()] + ')';
    const isoDateStr = dateObj.toISOString().split('T')[0] + ' (' + days[dateObj.getDay()] + ')';

    const spIdx = spC[i] || spC[i-1];
    const nasIdx = ndxMap.get(spT[i]) || spIdx; // fallback if NDX missing that day
    
    // Interpolate EPS over the total number of Wednesdays
    const spEps = 240 + (80 * (currentWedIndex / wednesdayCount));
    const nasEps = 650 + (250 * (currentWedIndex / wednesdayCount));
    const spPe = spIdx / spEps;
    const nasPe = nasIdx / nasEps;

    let dcaSignal = 'regular';
    let signalLabel = '통상 정액 분할';
    let actionGuidance = 'EPS 우상향 구간. 평범한 구간 기계적 정액 매수 유지';
    if (closestFg.y > 65) {
      dcaSignal = 'conservative'; signalLabel = '보수적 정액 분할'; actionGuidance = '단기 고평가 과열 구간. 추격 매수 자제';
    } else if (closestFg.y < 35) {
      dcaSignal = 'aggressive'; signalLabel = '가중 적극 매수'; actionGuidance = '단기 하락장 밸류에이션 매력도 증가. 1.3배 매수';
    }

    let fgLabel = 'Neutral (중립)';
    if (closestFg.y <= 25) fgLabel = 'Extreme Fear (극도의 공포)';
    else if (closestFg.y <= 45) fgLabel = 'Fear (공포)';
    else if (closestFg.y <= 54) fgLabel = 'Neutral (중립)';
    else if (closestFg.y <= 75) fgLabel = 'Greed (탐욕)';
    else fgLabel = 'Extreme Greed (극도의 탐욕)';

    finalData.push({
      date: isoDateStr,
      sp500Index: Math.round(spIdx), sp500Eps: Number(spEps.toFixed(1)),
      sp500Pe: Number(spPe.toFixed(1)), sp500PeVs10yAvg: (((spPe/18.2 - 1)*100).toFixed(1) + '%'),
      nasdaqIndex: Math.round(nasIdx), nasdaqEps: Number(nasEps.toFixed(1)),
      nasdaqPe: Number(nasPe.toFixed(1)), nasdaqPeVs10yAvg: (((nasPe/25.4 - 1)*100).toFixed(1) + '%'),
      dcaSignal, signalLabel, actionGuidance,
      fearGreedIndex: Math.round(closestFg.y), fearGreedLabel: fgLabel
    });
    
    currentWedIndex++;
  }

  // Reverse so newest is first
  finalData.reverse();
  
  const dataDir = 'C:/Users/gosys/orca/my_pension_helper/src/data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(dataDir, 'historicalValuationData.json'), JSON.stringify(finalData, null, 2));
  console.log("Successfully extracted exactly Wednesdays from daily market data!");
}

main().catch(console.error);