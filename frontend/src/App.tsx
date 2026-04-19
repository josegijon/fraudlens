import { useEffect, useState } from 'react'
import { AmountDistribution } from './components/AmountDistribution'
import { AppHeader } from './components/AppHeader'
import { FeatureCorrelation } from './components/FeatureCorrelation'
import { FraudTimeline } from './components/FraudTimeline'
import { HourlyPattern } from './components/HourlyPattern'
import { KPICard } from './components/KPICard'
import { getSummary, type Summary } from './lib/api'
import { PredictForm } from './components/PredictForms'

export default function App() {
    const [data, setData] = useState<Summary | null>(null);

    useEffect(() => {
        getSummary().then(setData);
    }, []);

    return (
        <div className="min-h-screen bg-bg">
            {/* Header */}
            <div className="w-full border-b border-border">
                <AppHeader data={data} />
            </div>

            <div className="max-w-480 mx-auto grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4 py-5 p-4 md:p-8">

                {/* Fila 1 — KPIs */}
                <div className="sm:col-span-3">
                    <KPICard
                        label="Tasa de fraude"
                        value={data ? `${data.fraudRate.toFixed(2)}%` : '—'}
                        subvalue={data ? `${data.fraudCount.toLocaleString()} / ${data.totalTransactions.toLocaleString()} txns` : undefined}
                        variant="fraud"
                    />
                </div>
                <div className="sm:col-span-3">
                    <KPICard
                        label="Total transacciones"
                        value={data ? data.totalTransactions.toLocaleString() : '—'}
                    />
                </div>
                <div className="sm:col-span-3">
                    <KPICard
                        label="Importe fraude vs legítimo"
                        value={data ? `$${data.avgAmountFraud.toFixed(0)} / $${data.avgAmountLegit.toFixed(0)}` : '—'}
                        subvalue="media por transacción"
                        variant="fraud"
                    />
                </div>
                <div className="sm:col-span-3">
                    <KPICard
                        label="Importe máximo fraudulento"
                        value={data ? `$${data.maxAmountFraud.toLocaleString()}` : '—'}
                        subvalue="transacción outlier"
                        variant="fraud"
                    />
                </div>

                {/* Fila 2 — Timeline + Feature Correlation */}
                <div className="sm:col-span-6 md:col-span-8">
                    <FraudTimeline />
                </div>
                <div className="sm:col-span-6 md:col-span-4">
                    <FeatureCorrelation />
                </div>

                {/* Fila 3 — Amount Distribution + Hourly Pattern */}
                <div className="sm:col-span-6">
                    <AmountDistribution />
                </div>
                <div className="sm:col-span-6">
                    <HourlyPattern />
                </div>

                <div className="col-span-3">
                    <PredictForm />
                </div>
            </div>
        </div>
    )
}