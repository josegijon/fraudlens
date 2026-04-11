import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { getFraudTimeline, type FraudTimelinePoint } from '../lib/api';
import { useEffect, useState } from 'react';

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
    data: FraudTimelinePoint[]
}) => {
    if (!active || !payload?.length) return null;

    const point = data[label ?? 0];

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
    const [data, setData] = useState<FraudTimelinePoint[]>([]);

    useEffect(() => {
        getFraudTimeline().then(setData);
    }, []);

    return (
        <div className="flex flex-col gap-4 bg-surface border border-border rounded-sm px-5 py-4 h-full">
            {/* Header */}
            <span className="text-xs tracking-widest uppercase font-[GeistMono] text-text-secondary">
                Tasa de fraude por hora
            </span>

            {/* Chart */}
            <div className="h-55 md:h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
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
                        <Tooltip content={<CustomTooltip data={data} />} />
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