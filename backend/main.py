from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import joblib
from pydantic import BaseModel

data_path = Path(__file__).resolve()
BASE_DIR = data_path.parent
aggregated_dir = BASE_DIR / 'data' / 'aggregated'

model_data = joblib.load(BASE_DIR / 'models' / 'model.pkl')   # Carga el modelo
model = model_data['model']             # Extrae el modelo
threshold = model_data['threshold']     # Extrae el umbral

class TransactionInput(BaseModel):      # Clase heredada de BaseModel
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    Amount: float


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

@app.post('/predict')
def predict_fraud(data: TransactionInput):
    confidence = []

    data_list = [list(data.model_dump().values())]  # Convierte el objeto Pydantic en diccionario con .dump(), .value() extrae los valores es una lista
    probability = round(float(model.predict_proba(data_list)[0][1]), 4) # Devuelve una matriz
    is_fraud = probability >= threshold

    confidence = 'low'  # Por defecto, transacción segura, probability <= 0.30

    if probability <= 0.60 and probability > 0.30:
        confidence = 'medium'   # Dudas, revisión manual o SMS de confirmación del cliente
    
    if probability > 0.60:
        confidence = 'high'     # Acción inmediata

    return {"is_fraud": is_fraud, "probability": probability, "confidence": confidence}