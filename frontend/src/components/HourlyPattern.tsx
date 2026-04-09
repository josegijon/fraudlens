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

type HourlyPoint = {
    hour: number
    fraudRate: number // % de fraude en esa hora
    fraudCount: number
    total: number
}

// Mock data — tasa de fraude por hora
// Pico en madrugada (2h–4h), mínimo en mediodía (11h–14h)
const MOCK_DATA: HourlyPoint[] = [
    { hour: 0, fraudRate: 0.73, fraudCount: 28, total: 3842 },
    { hour: 1, fraudRate: 0.82, fraudCount: 24, total: 2910 },
    { hour: 2, fraudRate: 0.90, fraudCount: 21, total: 2340 },
    { hour: 3, fraudRate: 0.99, fraudCount: 18, total: 1820 },
    { hour: 4, fraudRate: 0.91, fraudCount: 14, total: 1540 },
    { hour: 5, fraudRate: 0.52, fraudCount: 10, total: 1920 },
    { hour: 6, fraudRate: 0.37, fraudCount: 12, total: 3210 },
    { hour: 7, fraudRate: 0.24, fraudCount: 14, total: 5840 },
    { hour: 8, fraudRate: 0.19, fraudCount: 17, total: 8920 },
    { hour: 9, fraudRate: 0.16, fraudCount: 18, total: 11240 },
    { hour: 10, fraudRate: 0.15, fraudCount: 20, total: 13580 },
    { hour: 11, fraudRate: 0.14, fraudCount: 21, total: 14920 },
    { hour: 12, fraudRate: 0.14, fraudCount: 22, total: 15340 },
    { hour: 13, fraudRate: 0.15, fraudCount: 22, total: 14780 },
    { hour: 14, fraudRate: 0.16, fraudCount: 22, total: 14120 },
    { hour: 15, fraudRate: 0.16, fraudCount: 21, total: 13240 },
    { hour: 16, fraudRate: 0.16, fraudCount: 20, total: 12180 },
    { hour: 17, fraudRate: 0.17, fraudCount: 19, total: 11420 },
    { hour: 18, fraudRate: 0.18, fraudCount: 20, total: 10840 },
    { hour: 19, fraudRate: 0.19, fraudCount: 19, total: 9920 },
    { hour: 20, fraudRate: 0.22, fraudCount: 19, total: 8740 },
    { hour: 21, fraudRate: 0.26, fraudCount: 19, total: 7320 },
    { hour: 22, fraudRate: 0.38, fraudCount: 22, total: 5840 },
    { hour: 23, fraudRate: 0.56, fraudCount: 26, total: 4620 },
]

// Umbral de riesgo: > 0.5% se considera hora de alto riesgo
const HIGH_RISK_THRESHOLD = 0.5

const getBarColor = (rate: number) => {
    if (rate >= HIGH_RISK_THRESHOLD) return 'var(--color-fraud)'
    if (rate >= 0.30) return '#c2374a'
    if (rate >= 0.20) return '#8f2636'
    return '#5c1a24'
}

const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}h`

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean
    payload?: { value: number }[]
    label?: number
}) => {
    if (!active || !payload?.length) return null

    const point = MOCK_DATA[label ?? 0]
    const isHighRisk = point.fraudRate >= HIGH_RISK_THRESHOLD

    return (
        <div
            style={{
                background: 'var(--color-surface)',
                border: `1px solid ${isHighRisk ? 'var(--color-fraud)' : 'var(--color-border)'}`,
                borderRadius: '2px',
                padding: '8px 12px',
                fontFamily: 'GeistMono',
                fontSize: '12px',
            }}
        >
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                {formatHour(label ?? 0)}
                {isHighRisk && (
                    <span style={{ color: 'var(--color-fraud)', marginLeft: 8 }}>
                        · alto riesgo
                    </span>
                )}
            </p>
            <p style={{ color: getBarColor(point.fraudRate), marginBottom: 2 }}>
                tasa: {payload[0].value.toFixed(2)}%
            </p>
            <p style={{ color: 'var(--color-text-muted)' }}>
                {point.fraudCount} fraudes / {point.total.toLocaleString()} txns
            </p>
        </div>
    )
}

export function HourlyPattern() {
    return (
        <div className="bg-surface border border-border rounded-sm px-5 py-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs tracking-widest uppercase font-[GeistMono] text-text-secondary">
                    Tasa de fraude por hora
                </span>
                <span className="text-xs font-[GeistMono] text-text-muted">
                    umbral alto riesgo: &gt;0.5%
                </span>
            </div>

            {/* Chart */}
            <div className="h-55">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={MOCK_DATA}
                        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="hour"
                            tickFormatter={formatHour}
                            tick={{ fontFamily: 'GeistMono', fontSize: 11, fill: 'var(--color-text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                            interval={3}
                        />
                        <YAxis
                            tickFormatter={(v) => `${v}%`}
                            tick={{ fontFamily: 'GeistMono', fontSize: 11, fill: 'var(--color-text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'var(--color-border)', opacity: 0.4 }}
                        />
                        <Bar dataKey="fraudRate" radius={[1, 1, 0, 0]}>
                            {MOCK_DATA.map((entry) => (
                                <Cell key={entry.hour} fill={getBarColor(entry.fraudRate)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}