const https = require('https');

const options = {
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

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const jsonData = JSON.parse(data);
      const history = jsonData.fear_and_greed_historical?.data || [];
      console.log("Successfully fetched CNN Data. Total points:", history.length);
      console.log(history.slice(0, 5));
      console.log("...");
      console.log(history.slice(-5));
    } catch (e) {
      console.error("Error parsing response", e);
      console.log(data);
    }
  });
});

req.on('error', (e) => {
  console.error("Request error:", e);
});

req.end();
