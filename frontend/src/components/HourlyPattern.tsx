import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { getHourlyPattern, type HourlyPoint } from '../lib/api';
import { useEffect, useState } from 'react';

// Umbral de riesgo: > 0.5% se considera hora de alto riesgo
const HIGH_RISK_THRESHOLD = 0.5;

const getBarColor = (rate: number) => {
    if (rate >= HIGH_RISK_THRESHOLD) return 'var(--color-fraud)';
    if (rate >= 0.30) return '#c2374a';
    if (rate >= 0.20) return '#8f2636';
    return '#5c1a24';
};

const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}h`

const CustomTooltip = ({
    active,
    payload,
    label,
    data
}: {
    active?: boolean
    payload?: { value: number }[]
    label?: number
    data: HourlyPoint[]
}) => {
    if (!active || !payload?.length) return null;

    const point = data.find(p => p.hour === label) ?? data[0];
    const isHighRisk = point.fraudRate >= HIGH_RISK_THRESHOLD;

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
    const [data, setData] = useState<HourlyPoint[]>([]);

    useEffect(() => {
        getHourlyPattern().then(setData);
    }, []);

    return (
        <div className="bg-surface border border-border rounded-sm px-5 py-4 h-full">
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
                        data={data}
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
                            content={<CustomTooltip data={data} />}
                            cursor={{ fill: 'var(--color-border)', opacity: 0.4 }}
                        />
                        <Bar dataKey="fraudRate" radius={[1, 1, 0, 0]}>
                            {data.map((entry) => (
                                <Cell key={entry.hour} fill={getBarColor(entry.fraudRate)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}