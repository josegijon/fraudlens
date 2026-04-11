import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

type FraudTimelinePoint = {
    hour: number
    total: number
    fraudCount: number
    fraudRate: number
}

// Mock data — distribución realista basada en el dataset de Kaggle
// El fraude tiende a concentrarse en horas de madrugada (0–4h) y tarde-noche (22–23h)
const MOCK_DATA: FraudTimelinePoint[] = [
    { hour: 0, total: 3842, fraudCount: 28, fraudRate: 0.73 },
    { hour: 1, total: 2910, fraudCount: 24, fraudRate: 0.82 },
    { hour: 2, total: 2340, fraudCount: 21, fraudRate: 0.90 },
    { hour: 3, total: 1820, fraudCount: 18, fraudRate: 0.99 },
    { hour: 4, total: 1540, fraudCount: 14, fraudRate: 0.91 },
    { hour: 5, total: 1920, fraudCount: 10, fraudRate: 0.52 },
    { hour: 6, total: 3210, fraudCount: 12, fraudRate: 0.37 },
    { hour: 7, total: 5840, fraudCount: 14, fraudRate: 0.24 },
    { hour: 8, total: 8920, fraudCount: 17, fraudRate: 0.19 },
    { hour: 9, total: 11240, fraudCount: 18, fraudRate: 0.16 },
    { hour: 10, total: 13580, fraudCount: 20, fraudRate: 0.15 },
    { hour: 11, total: 14920, fraudCount: 21, fraudRate: 0.14 },
    { hour: 12, total: 15340, fraudCount: 22, fraudRate: 0.14 },
    { hour: 13, total: 14780, fraudCount: 22, fraudRate: 0.15 },
    { hour: 14, total: 14120, fraudCount: 22, fraudRate: 0.16 },
    { hour: 15, total: 13240, fraudCount: 21, fraudRate: 0.16 },
    { hour: 16, total: 12180, fraudCount: 20, fraudRate: 0.16 },
    { hour: 17, total: 11420, fraudCount: 19, fraudRate: 0.17 },
    { hour: 18, total: 10840, fraudCount: 20, fraudRate: 0.18 },
    { hour: 19, total: 9920, fraudCount: 19, fraudRate: 0.19 },
    { hour: 20, total: 8740, fraudCount: 19, fraudRate: 0.22 },
    { hour: 21, total: 7320, fraudCount: 19, fraudRate: 0.26 },
    { hour: 22, total: 5840, fraudCount: 22, fraudRate: 0.38 },
    { hour: 23, total: 4620, fraudCount: 26, fraudRate: 0.56 },
]

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
    if (!active || !payload?.length) return null;

    const point = MOCK_DATA[label ?? 0];

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
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                {formatHour(label ?? 0)}
            </p>
            <p style={{ color: 'var(--color-fraud)' }}>
                tasa {payload[0].value.toFixed(2)}%
            </p>
            <p style={{ color: 'var(--color-text-muted)' }}>
                {point.fraudCount} fraudes / {point.total.toLocaleString()} txns
            </p>
        </div>
    )
}

export function FraudTimeline() {
    return (
        <div className="bg-surface border border-border rounded-sm px-5 py-4 h-full">
            {/* Header */}
            <span className="text-xs tracking-widest uppercase font-[GeistMono] text-text-secondary">
                Tasa de fraude por hora
            </span>

            {/* Chart */}
            <div className="mt-4 h-55">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={MOCK_DATA}
                        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
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
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="fraudRate"
                            stroke="var(--color-fraud)"
                            strokeWidth={1.5}
                            dot={false}
                            activeDot={{ r: 3, fill: 'var(--color-fraud)', strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}