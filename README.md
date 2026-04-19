# FraudLens — Dashboard de Análisis de Fraude Financiero

Dashboard interactivo full-stack para análisis y detección de fraude en transacciones de tarjeta de crédito reales. Construido como proyecto de portfolio para demostrar el ciclo completo de un AI Engineer: datos reales → análisis → modelo ML → API → UI.

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Backend | Python 3.13 · FastAPI · Uvicorn |
| Análisis de datos | Pandas |
| Machine Learning | scikit-learn (RandomForest) · joblib |
| Frontend | React 19 · TypeScript · Vite 9 |
| Visualización | Recharts |
| Estilos | Tailwind CSS v4 |

---

## Dataset

**Credit Card Fraud Detection** — Kaggle (ULB Machine Learning Group)  
284.807 transacciones reales anonimizadas de septiembre de 2013. Variables: `Time`, `Amount`, `Class` (0=legítimo, 1=fraude) y 28 features PCA (`V1`–`V28`). Dataset altamente desbalanceado: **0.17% de fraude** (492 transacciones).

> El CSV (~150MB) no está incluido en el repositorio. Ver instrucciones de instalación.

---

## Arquitectura

```
creditcard.csv
      ↓
scripts/preprocess.py     → genera JSONs agregados en data/aggregated/
scripts/train_model.py    → entrena RandomForest → guarda model.pkl
      ↓
main.py (FastAPI)         → sirve JSONs + endpoint /predict
      ↓
frontend/ (React)         → dashboard interactivo
```

**Decisión de diseño clave:** FastAPI nunca toca Pandas en producción. El preprocesado ocurre offline en local y los resultados se versionan como JSON estáticos. Esto simplifica el deploy y elimina dependencias pesadas en el servidor.

---

## Instalación y uso local

### Requisitos

- Python 3.11+
- Node.js 18+
- Dataset de Kaggle: [Credit Card Fraud Detection](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)

### Backend

```bash
# 1. Crear y activar entorno virtual
cd fraudlens/backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Colocar el dataset
# Descargar creditcard.csv de Kaggle y colocarlo en:
# backend/data/creditcard.csv

# 4. Generar datos agregados
python scripts/preprocess.py

# 5. Entrenar el modelo
python scripts/train_model.py

# 6. Arrancar el servidor
uvicorn main:app --reload
# API disponible en http://localhost:8000
# Documentación interactiva en http://localhost:8000/docs
```

### Frontend

```bash
cd fraudlens/frontend

# 1. Instalar dependencias
npm install

# 2. Crear archivo de entorno
echo "VITE_API_URL=http://localhost:8000" > .env.local

# 3. Arrancar el servidor de desarrollo
npm run dev
# Dashboard disponible en http://localhost:5173
```

---

## Endpoints API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/summary` | Métricas globales del dataset |
| GET | `/fraud-over-time` | Tasa de fraude por hora del día |
| GET | `/amount-distribution` | Distribución de fraudes por rango de importe |
| GET | `/hourly-pattern` | Patrón horario de fraude |
| GET | `/feature-correlation` | Top 10 features PCA correlacionadas con fraude |
| GET | `/metrics` | Métricas de rendimiento del modelo ML |
| GET | `/feature-stats` | Estadísticas de features para el simulador |
| POST | `/predict` | Predicción de fraude para una transacción |

### Ejemplo `/predict`

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"V1": -2.31, "V2": 1.95, "V3": -1.61, "V4": 3.99, "V5": -0.52,
       "V6": -1.43, "V7": -2.54, "V8": 1.39, "V9": -2.77, "V10": -2.77,
       "V11": 3.20, "V12": -2.90, "V13": -0.60, "V14": -4.29, "V15": 0.39,
       "V16": -1.14, "V17": -2.83, "V18": -0.02, "V19": 0.42, "V20": 0.13,
       "V21": 0.52, "V22": -0.36, "V23": -0.05, "V24": -0.21, "V25": 0.14,
       "V26": 0.08, "V27": 0.21, "V28": 0.02, "Amount": 1.0}'
```

```json
{
  "is_fraud": true,
  "probability": 0.93,
  "confidence": "high"
}
```

---

## Modelo de Machine Learning

### Algoritmo

**RandomForestClassifier** con `class_weight='balanced'` para compensar el desbalance de clases (0.17% de fraude). Entrenado con las 28 features PCA (`V1`–`V28`) + `Amount`. La feature `Time` fue excluida por no aportar señal predictiva directa.

### Problema de clases desbalanceadas

Con 0.17% de positivos, un modelo naive que prediga "legítimo" siempre tendría 99.83% de accuracy — una métrica inútil. Se utilizó `class_weight='balanced'` para que el modelo penalice más los errores en la clase minoritaria (fraude), y se optimizó el umbral de decisión para maximizar recall.

### Optimización del umbral

El umbral por defecto (0.50) producía recall de 0.76 en fraude. Tras evaluar umbrales entre 0.10 y 0.45, se seleccionó **0.30** como punto óptimo:

| Umbral | Recall | Precision |
|---|---|---|
| 0.25 | 0.827 | 0.931 |
| **0.30** | **0.806** | **0.929** |
| 0.35 | 0.776 | 0.950 |

### Métricas finales (test set, 20% del dataset)

| Métrica | Resultado | Objetivo |
|---|---|---|
| AUC-ROC | **0.958** | ≥ 0.95 ✅ |
| Recall (fraude) | **0.816** | ≥ 0.80 ✅ |
| Precision (fraude) | **0.930** | ≥ 0.85 ✅ |
| F1-Score | **0.870** | ≥ 0.70 ✅ |

---

## Decisiones técnicas destacadas

**¿Por qué JSON estáticos en lugar de consultas Pandas en tiempo real?**  
El preprocesado offline simplifica el deploy, elimina Pandas del servidor de producción y reduce la latencia de los endpoints a lectura de archivo en disco.

**¿Por qué RandomForest y no XGBoost?**  
RandomForest es más interpretable y suficiente para los criterios de éxito definidos (AUC ≥ 0.95). XGBoost sería el siguiente paso natural si se quisiera mejorar el recall por encima de 0.85.

**¿Por qué umbral 0.30 y no 0.50?**  
En detección de fraude, el coste de un falso negativo (fraude no detectado) es mayor que el de un falso positivo (transacción legítima bloqueada). Bajar el umbral prioriza el recall sin sacrificar demasiada precision.

**¿Por qué el simulador solo expone presets?**  
Las features V1–V28 son componentes PCA — el usuario no puede interpretar su significado. Los presets usan valores reales del dataset para demostrar el modelo con casos conocidos.

---

## Estructura del repositorio

```
fraudlens/
├── backend/
│   ├── data/
│   │   └── aggregated/          # JSONs pre-calculados
│   ├── models/
│   │   └── model.pkl            # Modelo serializado
│   ├── scripts/
│   │   ├── preprocess.py        # CSV → JSONs
│   │   └── train_model.py       # Entrena y evalúa el modelo
│   ├── main.py                  # FastAPI
│   └── requirements.txt
└── frontend/
    └── src/
        ├── components/          # Componentes React
        └── lib/
            └── api.ts           # Capa de datos centralizada
```