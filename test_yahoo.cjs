const https = require('https');

const options = {
  hostname: 'query1.finance.yahoo.com',
  path: '/v8/finance/chart/^GSPC?interval=1wk&range=1y',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      const result = jsonData.chart.result[0];
      console.log("Yahoo SP500 Data fetched. Points:", result.timestamp.length);
      console.log("Last close:", result.indicators.quote[0].close.slice(-1)[0]);
    } catch (e) {
      console.error("Error parsing response", e);
    }
  });
});

req.on('error', (e) => {
  console.error("Request error:", e);
});

req.end();
