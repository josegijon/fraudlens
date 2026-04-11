import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts'

type AmountBucket = {
    range: string
    count: number
    pct: number // % del total de fraudes en este rango
}

// Mock data — distribución de importes exclusivamente de transacciones fraudulentas
// Basado en el patrón real del dataset: fraude concentrado en importes bajos-medios
const MOCK_DATA: AmountBucket[] = [
    { range: '$0–50', count: 148, pct: 30.1 },
    { range: '$50–100', count: 93, pct: 18.9 },
    { range: '$100–250', count: 112, pct: 22.8 },
    { range: '$250–500', count: 72, pct: 14.6 },
    { range: '$500–1k', count: 38, pct: 7.7 },
    { range: '$1k–2.5k', count: 18, pct: 3.7 },
    { range: '>$2.5k', count: 11, pct: 2.2 },
]

// Intensidad de rojo proporcional al % — más fraude, más saturado
const getBarColor = (pct: number) => {
    if (pct >= 25) return 'var(--color-fraud)'
    if (pct >= 15) return '#c2374a'
    if (pct >= 8) return '#8f2636'
    return '#5c1a24'
}

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

    const point = MOCK_DATA.find(d => d.range === label)

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
            <p style={{ color: 'var(--color-fraud)', marginBottom: 2 }}>
                {payload[0].value} transacciones fraudulentas
            </p>
            <p style={{ color: 'var(--color-text-muted)' }}>
                {point?.pct.toFixed(1)}% del total de fraudes
            </p>
        </div>
    )
}

export function AmountDistribution() {
    return (
        <div className="bg-surface border border-border rounded-sm px-5 py-4 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs tracking-widest uppercase font-[GeistMono] text-text-secondary">
                    Distribución de fraude por importe
                </span>
                <span className="text-xs font-[GeistMono] text-text-muted">
                    492 transacciones fraudulentas
                </span>
            </div>

            {/* Chart */}
            <div className="h-55">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={MOCK_DATA}
                        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
                        barCategoryGap="30%"
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="range"
                            tick={{ fontFamily: 'GeistMono', fontSize: 10, fill: 'var(--color-text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fontFamily: 'GeistMono', fontSize: 11, fill: 'var(--color-text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'var(--color-border)', opacity: 0.4 }}
                        />
                        <Bar dataKey="count" radius={[1, 1, 0, 0]}>
                            {MOCK_DATA.map((entry) => (
                                <Cell key={entry.range} fill={getBarColor(entry.pct)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}