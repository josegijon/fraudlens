from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json

data_path = Path(__file__).resolve()
BASE_DIR = data_path.parent
aggregated_dir = BASE_DIR / 'data' / 'aggregated'

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

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