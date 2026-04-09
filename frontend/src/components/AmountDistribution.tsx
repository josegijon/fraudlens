import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

type AmountBucket = {
    range: string   // label del rango, ej: "$0–100"
    legit: number   // transacciones legítimas en ese rango
    fraud: number   // transacciones fraudulentas en ese rango
}

// Mock data — rangos de importe hasta $2.500 (outliers extremos excluidos)
// Basado en distribución real del dataset de Kaggle
// Las transacciones fraudulentas se concentran en el rango $0–$500
const MOCK_DATA: AmountBucket[] = [
    { range: '$0–100', legit: 98420, fraud: 241 },
    { range: '$100–250', legit: 72340, fraud: 118 },
    { range: '$250–500', legit: 48920, fraud: 72 },
    { range: '$500–1k', legit: 32180, fraud: 38 },
    { range: '$1k–2.5k', legit: 18640, fraud: 18 },
]

const FRAUD_COLOR = 'var(--color-fraud)'
const LEGIT_COLOR = 'var(--color-legit)'

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean
    payload?: { name: string; value: number; color: string }[]
    label?: string
}) => {
    if (!active || !payload?.length) return null

    const legit = payload.find(p => p.name === 'legit')
    const fraud = payload.find(p => p.name === 'fraud')
    const total = (legit?.value ?? 0) + (fraud?.value ?? 0)
    const fraudRate = total > 0
        ? ((fraud?.value ?? 0) / total * 100).toFixed(2)
        : '0.00'

    return (
        <div
            style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '2px',
                padding: '8px 12px',
                fontFamily: 'GeistMono',
                fontSize: '12px',
            }}
        >
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                {label}
            </p>
            <p style={{ color: LEGIT_COLOR, marginBottom: 2 }}>
                legítimo: {legit?.value.toLocaleString()}
            </p>
            <p style={{ color: FRAUD_COLOR, marginBottom: 6 }}>
                fraude: {fraud?.value.toLocaleString()}
            </p>
            <p style={{ color: 'var(--color-text-muted)' }}>
                tasa: {fraudRate}%
            </p>
        </div>
    )
}

const CustomLegend = () => (
    <div
        style={{
            display: 'flex',
            gap: 16,
            fontFamily: 'GeistMono',
            fontSize: 11,
            color: 'var(--color-text-muted)',
        }}
    >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 1, background: LEGIT_COLOR, display: 'inline-block' }} />
            legítimo
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 1, background: FRAUD_COLOR, display: 'inline-block' }} />
            fraude
        </span>
    </div>
)

export function AmountDistribution() {
    return (
        <div className="bg-surface border border-border rounded-sm px-5 py-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs tracking-widest uppercase font-[GeistMono] text-text-secondary">
                    Distribución por importe
                </span>
                <span className="text-xs font-[GeistMono] text-text-muted">
                    outliers &gt;$2.500 excluidos
                </span>
            </div>

            {/* Legend */}
            <div className="mb-3">
                <CustomLegend />
            </div>

            {/* Chart */}
            <div className="h-55">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={MOCK_DATA}
                        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
                        barCategoryGap="30%"
                        barGap={2}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="range"
                            tick={{ fontFamily: 'GeistMono', fontSize: 11, fill: 'var(--color-text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                            tick={{ fontFamily: 'GeistMono', fontSize: 11, fill: 'var(--color-text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-border)', opacity: 0.4 }} />
                        <Legend content={<></>} />
                        <Bar dataKey="legit" name="legit" fill={LEGIT_COLOR} radius={[1, 1, 0, 0]} />
                        <Bar dataKey="fraud" name="fraud" fill={FRAUD_COLOR} radius={[1, 1, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}