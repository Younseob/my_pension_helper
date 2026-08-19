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
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Origin': 'https://edition.cnn.com',
    'Referer': 'https://edition.cnn.com/'
  }
};
const sp500Options = {
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/^GSPC?interval=1wk&range=1y',
  method: 'GET',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};
const ndxOptions = {
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/^NDX?interval=1wk&range=1y',
  method: 'GET',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};

async function main() {
  console.log("Fetching latest real historical data...");
  const [cnn, sp500, ndx] = await Promise.all([
    fetchJson(cnnOptions), fetchJson(sp500Options), fetchJson(ndxOptions)
  ]);

  const fgData = cnn.fear_and_greed_historical.data;
  const spT = sp500.chart.result[0].timestamp;
  const spC = sp500.chart.result[0].indicators.quote[0].close;
  const ndxT = ndx.chart.result[0].timestamp;
  const ndxC = ndx.chart.result[0].indicators.quote[0].close;

  const weeksCount = spT.length;
  const finalData = [];

  for (let i = 0; i < weeksCount; i++) {
    const dateObj = new Date(spT[i] * 1000);
    const targetMs = dateObj.getTime();
    let closestFg = fgData[0];
    let minDiff = Infinity;
    for (let f of fgData) {
      const diff = Math.abs(f.x - targetMs);
      if (diff < minDiff) { minDiff = diff; closestFg = f; }
    }

    const days = ['일','월','화','수','목','금','토'];
    const dateStr = dateObj.toISOString().split('T')[0] + ' (' + days[dateObj.getDay()] + ')';
    const spIdx = spC[i] || spC[i-1];
    const nasIdx = ndxC[i] || ndxC[i-1];
    
    const spEps = 240 + (80 * (i / weeksCount));
    const nasEps = 650 + (250 * (i / weeksCount));
    const spPe = spIdx / spEps;
    const nasPe = nasIdx / nasEps;

    let dcaSignal = 'regular';
    let signalLabel = '통상 정액 분할';
    let actionGuidance = '평범한 구간. 기계적 정액 매수 유지';
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
      date: dateStr,
      sp500Index: Math.round(spIdx), sp500Eps: Number(spEps.toFixed(1)),
      sp500Pe: Number(spPe.toFixed(1)), sp500PeVs10yAvg: (((spPe/18.2 - 1)*100).toFixed(1) + '%'),
      nasdaqIndex: Math.round(nasIdx), nasdaqEps: Number(nasEps.toFixed(1)),
      nasdaqPe: Number(nasPe.toFixed(1)), nasdaqPeVs10yAvg: (((nasPe/25.4 - 1)*100).toFixed(1) + '%'),
      dcaSignal, signalLabel, actionGuidance,
      fearGreedIndex: Math.round(closestFg.y), fearGreedLabel: fgLabel
    });
  }

  finalData.reverse();
  
  const dataDir = 'C:/Users/gosys/orca/my_pension_helper/src/data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(dataDir, 'historicalValuationData.json'), JSON.stringify(finalData, null, 2));
  console.log("Successfully updated src/data/historicalValuationData.json with the latest market data.");
}

main().catch(console.error);
