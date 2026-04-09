import { AmountDistribution } from './components/AmountDistribution'
import { FraudTimeline } from './components/FraudTimeline'
import { HourlyPattern } from './components/HourlyPattern'
import { KPICard } from './components/KPICard'

export default function App() {
    return (
        <div className="min-h-screen bg-bg p-8">
            <div className="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-4">
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
                <div className="col-span-12">
                    <FraudTimeline />
                </div>
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