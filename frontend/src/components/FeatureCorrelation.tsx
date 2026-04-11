import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine,
} from 'recharts'

type FeaturePoint = {
    feature: string
    correlation: number
}

// Correlaciones reales del dataset de Kaggle (Class vs V1–V28)
// Ordenadas por valor absoluto descendente — las más predictivas primero
const MOCK_DATA: FeaturePoint[] = [
    { feature: 'V17', correlation: -0.327 },
    { feature: 'V14', correlation: -0.302 },
    { feature: 'V12', correlation: -0.261 },
    { feature: 'V10', correlation: -0.216 },
    { feature: 'V16', correlation: -0.196 },
    { feature: 'V3', correlation: -0.192 },
    { feature: 'V7', correlation: -0.187 },
    { feature: 'V11', correlation: 0.154 },
    { feature: 'V4', correlation: 0.133 },
    { feature: 'V2', correlation: -0.091 },
]

const FRAUD_COLOR = 'var(--color-fraud)'
const LEGIT_COLOR = 'var(--color-legit)'

const getBarColor = (value: number) =>
    value < 0 ? FRAUD_COLOR : LEGIT_COLOR

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean
    payload?: { value: number }[]
    label?: string
}) => {
    if (!active || !payload?.length) return null

    const value = payload[0].value

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
            <p style={{ color: getBarColor(value), marginBottom: 4 }}>
                correlación: {value > 0 ? '+' : ''}{value.toFixed(3)}
            </p>
        </div>
    )
}

export function FeatureCorrelation() {
    return (
        <div className="bg-surface border border-border rounded-sm px-5 py-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs tracking-widest uppercase font-[GeistMono] text-text-secondary">
                    Correlación de features con fraude
                </span>
                <div className="flex items-center gap-4">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'GeistMono', fontSize: 11, color: 'var(--color-text-muted)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 1, background: FRAUD_COLOR, display: 'inline-block' }} />
                        negativa
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'GeistMono', fontSize: 11, color: 'var(--color-text-muted)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 1, background: LEGIT_COLOR, display: 'inline-block' }} />
                        positiva
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="h-70">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={MOCK_DATA}
                        layout="vertical"
                        margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
                        barCategoryGap="25%"
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            horizontal={false}
                        />
                        <XAxis
                            type="number"
                            domain={[-0.4, 0.2]}
                            tickFormatter={(v) => v.toFixed(1)}
                            tick={{ fontFamily: 'GeistMono', fontSize: 11, fill: 'var(--color-text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="feature"
                            tick={{ fontFamily: 'GeistMono', fontSize: 11, fill: 'var(--color-text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                            width={32}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'var(--color-border)', opacity: 0.4 }}
                        />
                        <ReferenceLine
                            x={0}
                            stroke="var(--color-border-hi)"
                            strokeWidth={1}
                        />
                        <Bar dataKey="correlation" radius={[0, 1, 1, 0]}>
                            {MOCK_DATA.map((entry) => (
                                <Cell key={entry.feature} fill={getBarColor(entry.correlation)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}