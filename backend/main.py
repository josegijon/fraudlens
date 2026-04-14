from pathlib import Path
from fastapi import FastAPI
import json

data_path = Path(__file__).resolve()
BASE_DIR = data_path.parent
aggregated_dir = BASE_DIR / 'data' / 'aggregated'

app = FastAPI()

@app.get('/summary')
def summary():
    with open(aggregated_dir / 'summary.json', 'r') as f:
        return json.load(f)

@app.get('/fraud-over-time')
def fraud_timeline():
    with open(aggregated_dir / 'fraud_timeline.json', 'r') as f:
        return json.load(f)

@app.get('/amount-distribution')
def amount_dist():
    with open(aggregated_dir / 'amount_dist.json', 'r') as f:
        return json.load(f)

@app.get('/hourly-pattern')
def hourly_pattern():
    with open(aggregated_dir / 'hourly_pattern.json', 'r') as f:
        return json.load(f)

@app.get('/feature-correlation')
def feature_corr():
    with open(aggregated_dir / 'feature_corr.json', 'r') as f:
        return json.load(f)