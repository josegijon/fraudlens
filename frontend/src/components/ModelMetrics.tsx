import { useEffect, useState } from 'react'
import { getMetrics, type Metrics } from '../lib/api'

const METRIC_CONFIG = [
    {
        key: 'auc' as keyof Metrics,
        label: 'AUC-ROC',
        description: 'Capacidad del modelo para distinguir fraude de legítimo',
        good: 0.95,
    },
    {
        key: 'recall' as keyof Metrics,
        label: 'Recall',
        description: 'Fraudes reales detectados correctamente',
        good: 0.80,
    },
    {
        key: 'precision' as keyof Metrics,
        label: 'Precision',
        description: 'Alertas de fraude que son realmente fraude',
        good: 0.85,
    },
    {
        key: 'f1' as keyof Metrics,
        label: 'F1-Score',
        description: 'Balance entre precision y recall',
        good: 0.70,
    },
]

export function ModelMetrics() {
    const [data, setData] = useState<Metrics | null>(null)

    useEffect(() => {
        getMetrics().then(setData)
    }, [])

    return (
        <div className="bg-surface border border-border rounded-sm px-5 py-4 h-full flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <span className="text-xs tracking-widest uppercase font-geist-mono text-text-secondary">
                    Rendimiento del modelo
                </span>
                <span className="text-xs font-geist-mono text-text-muted">
                    RandomForest · umbral 0.30 · test set 20%
                </span>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {METRIC_CONFIG.map(({ key, label, description, good }) => {
                    const value = data?.[key]
                    const passes = value !== undefined && value >= good

                    return (
                        <div
                            key={key}
                            className="flex flex-col gap-2 p-4 border border-border rounded-sm bg-bg"
                        >
                            <span className="text-xs font-geist-mono text-text-muted uppercase tracking-widest">
                                {label}
                            </span>
                            <span className={`text-3xl font-geist-mono leading-none ${passes ? 'text-legit' : 'text-fraud'}`}>
                                {value !== undefined ? (value * 100).toFixed(1) + '%' : '—'}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-geist-mono ${passes ? 'text-legit' : 'text-fraud'}`}>
                                    {passes ? '✓ objetivo' : '✗ objetivo'}
                                </span>
                                <span className="text-xs font-geist-mono text-text-muted">
                                    ≥{(good * 100).toFixed(0)}%
                                </span>
                            </div>
                            <p className="text-xs font-geist-mono text-text-muted leading-relaxed">
                                {description}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}