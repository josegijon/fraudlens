import pandas as pd 
from pathlib import Path 
import joblib
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, precision_score, f1_score # precision_score: Calcula cuantos de los bloqueos fueron aciertos reales
from sklearn.metrics import recall_score    # Calcula cuantos fraudes del total lograste capturar 
# import numpy as np

data_path = Path(__file__).resolve()    # Ruta absoluta de este archivo
BASE_DIR = data_path.parent.parent
aggregated_dir = BASE_DIR / 'data' / 'aggregated'
models_dir = BASE_DIR / 'models'

df = pd.read_csv(BASE_DIR / 'data' / 'creditcard.csv')    # Carga el csv

x = df.drop(columns=['Time', 'Class'])    # Elimina las columnas que no necesitamos (Features)
y = df['Class']                           # Separa una columna (Target)

X_train, X_test, y_train, y_test = train_test_split(
    x, y,               # Variables
    test_size=0.2,      # 20% para evaluar
    random_state=42,    # Para que el azar sea siempre el mismo
    stratify=y          # Para que el porcentaje de fraude sea igual en ambos grupos
)

# Entrenar el modelo
model = RandomForestClassifier(class_weight='balanced', random_state=42)    # Crea el modelo
model.fit(X_train, y_train)                                                 # Entrena el modelo

# Evaluar el modelo
y_pred = model.predict(X_test)                  # Devuelve la clase predicha
y_proba = model.predict_proba(X_test)[:, 1]     # Devuelve la probabilidad de cada clase

# thresholds = np.arange(0.1, 0.5, 0.05)                        # Crea una lista de valores (desde, hasta, de x en x)
# for threshold in thresholds:                  
#     y_pred_threshold = (y_proba >= threshold).astype(int)     # Si la probabilidad es mayor al umbral, marca como fraude (1)
#     recall = recall_score(y_test, y_pred_threshold)           # Calcula cuantos fraudes reales logro atrapar con ese umbral
#     precision = precision_score(y_test, y_pred_threshold)     # Calcula que porcentaje de las alarmas dadas fueron fraudes reales
#     print(f"Umbral {threshold:.2f} → Recall: {recall:.3f} | Precision: {precision:.3f}")   

y_pred_final = (y_proba >= 0.30).astype(int)    # Aplica el umbral elegido para convertir probabilidades en veredictos finales

precision = round(precision_score(y_test, y_pred_final), 3)     # Calcula que porcentaje de las alarmas dadas fueron fraudes reales
recall = round(recall_score(y_test, y_pred_final), 3)           # Calcula cuantos fraudes reales logro atrapar con ese umbral
f1 = round(f1_score(y_test, y_pred_final), 3)
auc = round(roc_auc_score(y_test, y_proba), 3)

# print(classification_report(y_test, y_pred))    # Muestra con el umbral por defecto (0.5)
# print(f"AUC-ROC: {roc_auc_score(y_test, y_proba):.4f}")

metrics = {
    "precision": precision,
    "recall": recall,
    "f1": f1,
    "auc": auc,
}

with open(aggregated_dir / ("metrics.json"), "w", encoding="utf-8") as f:
    json.dump(metrics, f, indent=4, ensure_ascii=False)

joblib.dump({'model': model, 'threshold': 0.30}, models_dir / 'model.pkl')
print("Modelo guardado en models/model.pkl")