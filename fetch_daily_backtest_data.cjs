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

const sp500Options = {
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/^GSPC?interval=1d&range=2y',
  method: 'GET',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};

const ndxOptions = {
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/^NDX?interval=1d&range=2y',
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
  
  for (let i = 0; i < spT.length; i++) {
    const dateObj = new Date(spT[i] * 1000);
    
    // Filter dates to only include those between '2025-01-01' and '2026-12-31'
    if (dateObj < new Date('2025-01-01') || dateObj > new Date('2026-12-31')) continue;

    const targetMs = dateObj.getTime();
    
    // Find closest CNN FG data
    let closestFg = fgData[0];
    let minDiff = Infinity;
    for (let f of fgData) {
      const diff = Math.abs(f.x - targetMs);
      if (diff < minDiff) { minDiff = diff; closestFg = f; }
    }

    const isoDateStr = dateObj.toISOString().split('T')[0];

    const spIdx = spC[i] || spC[i-1];
    const nasIdx = ndxMap.get(spT[i]) || spIdx; // fallback if NDX missing that day
    
    finalData.push({
      date: isoDateStr,
      sp500Index: Math.round(spIdx),
      nasdaqIndex: Math.round(nasIdx),
      fearGreedIndex: Math.round(closestFg.y)
    });
  }

  // Reverse so newest is first
  finalData.reverse();
  
  const dataDir = 'src/data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(dataDir, 'dailyBacktestData.json'), JSON.stringify(finalData, null, 2));
  console.log("Successfully extracted daily market data for backtesting!");
}

main().catch(console.error);