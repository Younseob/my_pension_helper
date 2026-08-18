import urllib.request
import json

url = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Origin': 'https://edition.cnn.com',
    'Referer': 'https://edition.cnn.com/'
}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        data = response.read().decode('utf-8')
        json_data = json.loads(data)
        
        # print first few historical points
        history = json_data.get('fear_and_greed_historical', {}).get('data', [])
        print("Successfully fetched CNN Data. Total points:", len(history))
        for item in history[:10]:
            print(item)
except Exception as e:
    print("Error:", e)
