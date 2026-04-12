# 1. summary.json
# Cuenta el total de transacciones, cuántas son fraude (Class=1) y cuántas legítimas (Class=0), calcula el porcentaje de fraude, y la media y máximo de Amount separado por clase.

# 2. fraud_timeline.json
# El campo Time está en segundos desde el inicio del dataset. Hay que convertirlo a hora del día (0–23) con una operación matemática, luego agrupar por hora y contar total de transacciones y fraudes en cada una, calculando la tasa.

# 3. amount_dist.json
# Filtra solo las transacciones fraudulentas (Class=1), las agrupa en rangos de importe que definimos nosotros, y cuenta cuántas caen en cada rango y qué porcentaje representan del total de fraudes.

# 4. hourly_pattern.json
# Similar al timeline — misma conversión de Time a hora, pero el JSON incluye tasa de fraude, conteo de fraudes y total por hora. En la práctica puedes derivarlo del mismo cálculo que fraud_timeline.json.

# 5. feature_corr.json
# Calcula la correlación de cada columna V1–V28 con la columna Class, ordena por valor absoluto descendente y guarda las 10 primeras.

import pandas as pd
import json
from pathlib import Path

data_path = Path(__file__).resolve()

BASE_DIR = data_path.parent.parent

aggregated_dir = BASE_DIR / 'data' / 'aggregated'

df = pd.read_csv(BASE_DIR / 'data' / 'creditcard.csv')

total_transactions = len(df)
fraud_transactions = len(df[df['Class'] == 1])
legitimate_transactions = len(df[df['Class'] == 0])
fraud_rate = round(fraud_transactions / total_transactions * 100, 2)
avg_fraud_amount = round(df.loc[df['Class'] == 1, 'Amount'].mean(), 2)
avg_legitimate_amount = round(df.loc[df['Class'] == 0, 'Amount'].mean(), 2)
max_fraud = df.loc[df['Class'] == 1, 'Amount'].max()

summary = {
    "totalTransactions": total_transactions,
    "fraudCount": fraud_transactions,
    "legitCount": legitimate_transactions,
    "fraudRate": fraud_rate,
    "avgAmountFraud": avg_fraud_amount,
    "avgAmountLegit": avg_legitimate_amount,
    "maxAmountFraud": max_fraud
}

with open(aggregated_dir / ("summary.json"), "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=4, ensure_ascii=False)