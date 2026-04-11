import { AmountDistribution } from './components/AmountDistribution'
import { AppHeader } from './components/AppHeader'
import { FeatureCorrelation } from './components/FeatureCorrelation'
import { FraudTimeline } from './components/FraudTimeline'
import { HourlyPattern } from './components/HourlyPattern'
import { KPICard } from './components/KPICard'

export default function App() {
    return (
        <div className="min-h-screen bg-bg p-8">
            <div className="grid grid-cols-12 gap-4">
                {/* Header */}
                <AppHeader />

                {/* Fila 1 — KPIs */}
                <div className="col-span-3">
                    <KPICard
                        label="Tasa de fraude"
                        value="0.17%"
                        subvalue="492 / 284.807 txns"
                        variant="fraud"
                    />
                </div>
                <div className="col-span-3">
                    <KPICard
                        label="Total transacciones"
                        value="284.807"
                    />
                </div>
                <div className="col-span-3">
                    <KPICard
                        label="Importe fraude vs legítimo"
                        value="$122 / $88"
                        subvalue="media por transacción"
                        variant="fraud"
                    />
                </div>
                <div className="col-span-3">
                    <KPICard
                        label="Importe máximo fraudulento"
                        value="$2.125"
                        subvalue="transacción outlier"
                        variant="fraud"
                    />
                </div>

                {/* Fila 2 — Timeline + Feature Correlation */}
                <div className="col-span-8">
                    <FraudTimeline />
                </div>
                <div className="col-span-4">
                    <FeatureCorrelation />
                </div>

                {/* Fila 3 — Amount Distribution + Hourly Pattern */}
                <div className="col-span-6">
                    <AmountDistribution />
                </div>
                <div className="col-span-6">
                    <HourlyPattern />
                </div>
            </div>
        </div>
    )
}