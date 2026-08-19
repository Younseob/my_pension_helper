@echo off
cline --provider openai-compatible "update_data_wednesdays.cjs 파일을 참고해서 새로운 백테스팅용 데이터 수집 스크립트 fetch_daily_backtest_data.cjs 를 작성해줘. 1. 기존 로직 재사용 2. 수요일만 필터링하는 로직 삭제 3. 수집 기간을 2025-01-01부터 2026-12-31로 2년치 셋팅 4. 결과물은 src/data/dailyBacktestData.json 에 저장 5. JSON 데이터는 date, sp500Index, nasdaqIndex, fearGreedIndex 형태만 유지 6. 코드 작성 후 반드시 node로 실행하여 JSON 파일 생성까지 완료할 것."
