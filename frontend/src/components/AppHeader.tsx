export function AppHeader() {
    return (
        <header className="col-span-12 flex items-center justify-between border-b border-border pb-4 mb-2">
            {/* Branding */}
            <div className="flex items-center gap-3">
                <span className="text-lg font-geist-mono text-text-primary tracking-tight">
                    FRAUD<span className="text-fraud">LENS</span>
                </span>
                <span className="text-text-muted font-geist-mono text-xs">|</span>
                <span className="text-xs font-geist-mono text-text-secondary tracking-widest uppercase">
                    Credit Card Fraud Detection
                </span>
            </div>

            {/* Right side: dataset info + status */}
            <div className="flex items-center gap-6">
                {/* Dataset meta */}
                <div className="flex items-center gap-4">
                    <span className="text-xs font-geist-mono text-text-muted">
                        ULB · Sep 2013
                    </span>
                    <span className="text-xs font-geist-mono text-text-muted">
                        284.807 txns
                    </span>
                </div>
            </div>
        </header>
    )
}