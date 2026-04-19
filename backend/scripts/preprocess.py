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
max_fraud = round(df.loc[df['Class'] == 1, 'Amount'].max(), 2)

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

# ------------------------------------------------------------------------------------

df['hour'] = (df['Time'] % 86400) // 3600

hourly_stats = df.groupby('hour').agg(
    total=('Class', 'count'),
    fraudCount=('Class', 'sum')
).reset_index()

hourly_stats['hour'] = hourly_stats['hour'].astype(int)

hourly_stats['fraudRate'] = round((hourly_stats['fraudCount'] / hourly_stats['total']) * 100, 2)

hourly_summary = hourly_stats.to_dict(orient='records')

with open(aggregated_dir / ("fraud_timeline.json"), "w", encoding="utf-8") as f:
    json.dump(hourly_summary, f, indent=4, ensure_ascii=False)

# ------------------------------------------------------------------------------------

bins = [0, 50, 100, 250, 500, 1000, 2500, float('inf')]
labels = ['0–50', '50–100', '100–250', '250–500', '500–1k', '1k–2.5k', '>2.5k']

ranges = pd.cut(df.loc[df['Class'] == 1, 'Amount'], bins=bins, labels=labels, include_lowest=True)

fraud_by_range = ranges.value_counts(sort=False).reset_index()

fraud_by_range.columns = ['range', 'count']

fraud_by_range['pct'] = round((fraud_by_range['count'] / fraud_transactions) * 100, 2)

with open(aggregated_dir / ("amount_dist.json"), "w", encoding="utf-8") as f:
    json.dump(fraud_by_range.to_dict(orient='records'), f, indent=4, ensure_ascii=False)

# ------------------------------------------------------------------------------------

with open(aggregated_dir / ("hourly_pattern.json"), "w", encoding="utf-8") as f:
    json.dump(hourly_summary, f, indent=4, ensure_ascii=False)

# ------------------------------------------------------------------------------------

corr_values = df.corr()['Class'].drop(['Time', 'hour', 'Amount', 'Class'])
top10 = corr_values.abs().sort_values(ascending=False).head(10)
top10_original = corr_values[top10.index].reset_index()
top10_original.columns = ['feature', 'correlation']
top10_original['correlation'] = top10_original['correlation'].round(3)

with open(aggregated_dir / ("feature_corr.json"), "w", encoding="utf-8") as f:
    json.dump(top10_original.to_dict(orient='records'), f, indent=4, ensure_ascii=False)


# Estadísticas para el formulario de predicción
feature_cols = [f'V{i}' for i in range(1, 29)] + ['Amount']

stats = {}
for col in feature_cols:
    stats[col] = {
        'mean': round(df[col].mean(), 4),
        'min': round(df[col].quantile(0.01), 4),
        'max': round(df[col].quantile(0.99), 4),
    }

with open(aggregated_dir / 'feature_stats.json', 'w', encoding='utf-8') as f:
    json.dump(stats, f, indent=4, ensure_ascii=False)