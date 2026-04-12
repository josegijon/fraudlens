// ─── Config ───────────────────────────────────────────────────────────────────

const USE_MOCK = true
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Summary = {
    totalTransactions: number
    fraudCount: number
    legitCount: number
    fraudRate: number        // porcentaje, ej: 0.172
    avgAmountFraud: number   // importe medio txn fraudulenta
    avgAmountLegit: number   // importe medio txn legítima
    maxAmountFraud: number   // importe máximo fraudulento
}

export type FraudTimelinePoint = {
    hour: number
    total: number
    fraudCount: number
    fraudRate: number
}

export type AmountBucket = {
    range: string
    count: number
    pct: number // % del total de fraudes en este rango
}

export type HourlyPoint = {
    hour: number
    fraudRate: number // % de fraude en esa hora
    fraudCount: number
    total: number
}

export type FeaturePoint = {
    feature: string
    correlation: number
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_SUMMARY: Summary = {
    totalTransactions: 284807,
    fraudCount: 492,
    legitCount: 284315,
    fraudRate: 0.172,
    avgAmountFraud: 122.21,
    avgAmountLegit: 88.35,
    maxAmountFraud: 2125.87,
}

const MOCK_FRAUD_TIMELINE: FraudTimelinePoint[] = [
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

const MOCK_AMOUNT_DISTRIBUTION: AmountBucket[] = [
    { range: '$0–50', count: 148, pct: 30.1 },
    { range: '$50–100', count: 93, pct: 18.9 },
    { range: '$100–250', count: 112, pct: 22.8 },
    { range: '$250–500', count: 72, pct: 14.6 },
    { range: '$500–1k', count: 38, pct: 7.7 },
    { range: '$1k–2.5k', count: 18, pct: 3.7 },
    { range: '>$2.5k', count: 11, pct: 2.2 },
]

const MOCK_HOURLY_PATTERN: HourlyPoint[] = MOCK_FRAUD_TIMELINE.map(p => ({
    hour: p.hour,
    fraudRate: p.fraudRate,
    fraudCount: p.fraudCount,
    total: p.total,
}))

const MOCK_FEATURE_CORRELATION: FeaturePoint[] = [
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

// ─── Fetch functions ──────────────────────────────────────────────────────────

export async function getSummary(): Promise<Summary> {
    if (USE_MOCK) return MOCK_SUMMARY
    const res = await fetch(`${API_URL}/summary`)
    return res.json()
}

export async function getFraudTimeline(): Promise<FraudTimelinePoint[]> {
    if (USE_MOCK) return MOCK_FRAUD_TIMELINE
    const res = await fetch(`${API_URL}/fraud-over-time`)
    return res.json()
}

export async function getAmountDistribution(): Promise<AmountBucket[]> {
    if (USE_MOCK) return MOCK_AMOUNT_DISTRIBUTION
    const res = await fetch(`${API_URL}/amount-distribution`)
    return res.json()
}

export async function getHourlyPattern(): Promise<HourlyPoint[]> {
    if (USE_MOCK) return MOCK_HOURLY_PATTERN
    const res = await fetch(`${API_URL}/hourly-pattern`)
    return res.json()
}

export async function getFeatureCorrelation(): Promise<FeaturePoint[]> {
    if (USE_MOCK) return MOCK_FEATURE_CORRELATION
    const res = await fetch(`${API_URL}/feature-correlation`)
    return res.json()
}