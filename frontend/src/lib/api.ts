// ─── Config ───────────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

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

// ─── Fetch functions ──────────────────────────────────────────────────────────

export async function getSummary(): Promise<Summary> {
    const res = await fetch(`${API_URL}/summary`)
    return res.json()
}

export async function getFraudTimeline(): Promise<FraudTimelinePoint[]> {
    const res = await fetch(`${API_URL}/fraud-over-time`)
    return res.json()
}

export async function getAmountDistribution(): Promise<AmountBucket[]> {
    const res = await fetch(`${API_URL}/amount-distribution`)
    return res.json()
}

export async function getHourlyPattern(): Promise<HourlyPoint[]> {
    const res = await fetch(`${API_URL}/hourly-pattern`)
    return res.json()
}

export async function getFeatureCorrelation(): Promise<FeaturePoint[]> {
    const res = await fetch(`${API_URL}/feature-correlation`)
    return res.json()
}