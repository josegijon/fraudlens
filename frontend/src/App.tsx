import { AmountDistribution } from './components/AmountDistribution'
import { AppHeader } from './components/AppHeader'
import { FeatureCorrelation } from './components/FeatureCorrelation'
import { FraudTimeline } from './components/FraudTimeline'
import { HourlyPattern } from './components/HourlyPattern'
import { KPICard } from './components/KPICard'

export default function App() {
    return (
        <div className="min-h-screen bg-bg md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4">
                {/* Header */}
                <div className="sm:col-span-6 md:col-span-12">
                    <AppHeader />
                </div>

                {/* Fila 1 — KPIs */}
                <div className="sm:col-span-3 px-4 md:px-0">
                    <KPICard
                        label="Tasa de fraude"
                        value="0.17%"
                        subvalue="492 / 284.807 txns"
                        variant="fraud"
                    />
                </div>
                <div className="sm:col-span-3 px-4 md:px-0">
                    <KPICard
                        label="Total transacciones"
                        value="284.807"
                    />
                </div>
                <div className="sm:col-span-3 px-4 md:px-0">
                    <KPICard
                        label="Importe fraude vs legítimo"
                        value="$122 / $88"
                        subvalue="media por transacción"
                        variant="fraud"
                    />
                </div>
                <div className="sm:col-span-3 px-4 md:px-0">
                    <KPICard
                        label="Importe máximo fraudulento"
                        value="$2.125"
                        subvalue="transacción outlier"
                        variant="fraud"
                    />
                </div>

                {/* Fila 2 — Timeline + Feature Correlation */}
                <div className="sm:col-span-6 md:col-span-8 px-4 md:px-0">
                    <FraudTimeline />
                </div>
                <div className="sm:col-span-6 md:col-span-4 px-4 md:px-0">
                    <FeatureCorrelation />
                </div>

                {/* Fila 3 — Amount Distribution + Hourly Pattern */}
                <div className="md:col-span-6">
                    <AmountDistribution />
                </div>
                <div className="md:col-span-6">
                    <HourlyPattern />
                </div>
            </div>
        </div>
    )
}