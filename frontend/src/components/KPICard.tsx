interface KPICardProps {
    label: string
    value: string
    subvalue?: string
    variant?: 'default' | 'fraud' | 'legit'
}

export function KPICard({
    label,
    value,
    subvalue,
    variant = 'default',
}: KPICardProps) {
    const isFraud = variant === 'fraud'
    const isLegit = variant === 'legit'

    return (
        <div
            className={[
                'relative flex flex-col justify-between',
                'bg-surface border border-border rounded-sm',
                'px-5 py-4 min-h-25 h-full',
                isFraud ? 'fraud-pulse' : '',
            ].join(' ')}
        >
            {/* Label superior */}
            <span className="text-xs tracking-widest uppercase font-[GeistMono] text-text-secondary">
                {label}
            </span>

            {/* Bloque inferior: valor + subvalue en columna */}
            <div className="mt-2 flex flex-col gap-1">
                <span
                    className={[
                        'text-3xl leading-none font-[GeistMono]',
                        isFraud ? 'text-fraud' : isLegit ? 'text-legit' : 'text-text-primary',
                    ].join(' ')}
                >
                    {value}
                </span>

                {subvalue && (
                    <span className="text-xs font-[GeistMono] text-text-muted">
                        {subvalue}
                    </span>
                )}
            </div>
        </div>
    )
}