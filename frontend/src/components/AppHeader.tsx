import { useEffect, useState } from "react";
import { getSummary, type Summary } from "../lib/api"

export function AppHeader() {
    const [data, setData] = useState<Summary | null>(null);

    useEffect(() => {
        getSummary().then(setData);
    }, []);

    return (
        <header className="max-w-480 mx-auto col-span-12 flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-5">
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
                        {data ? data.totalTransactions.toLocaleString() : '—'} txns
                    </span>
                </div>
            </div>
        </header>
    )
}