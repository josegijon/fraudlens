import { useState } from "react";
import { API_URL } from '../lib/api';

type PredictResult = {
    is_fraud: boolean
    probability: number
    confidence: string
};

const PRESET_LEGIT = {
    features: {
        V1: -1.3598, V2: -0.0728, V3: 2.5363, V4: 1.3782, V5: -0.3383,
        V6: 0.4624, V7: 0.2396, V8: 0.0987, V9: 0.3638, V10: 0.0908,
        V11: -0.5516, V12: -0.6178, V13: -0.9914, V14: -0.3112, V15: 1.4682,
        V16: -0.4704, V17: 0.2080, V18: 0.0258, V19: 0.4040, V20: 0.2514,
        V21: -0.0183, V22: 0.2778, V23: -0.1105, V24: 0.0669, V25: 0.1285,
        V26: -0.1891, V27: 0.1336, V28: -0.0211
    },
    amount: 149.62
}

const PRESET_FRAUD = {
    features: {
        V1: -2.3122, V2: 1.9519, V3: -1.6096, V4: 3.9979, V5: -0.5222,
        V6: -1.4265, V7: -2.5374, V8: 1.3918, V9: -2.7700, V10: -2.7722,
        V11: 3.2020, V12: -2.8992, V13: -0.5955, V14: -4.2895, V15: 0.3898,
        V16: -1.1405, V17: -2.8300, V18: -0.0168, V19: 0.4165, V20: 0.1267,
        V21: 0.5176, V22: -0.3556, V23: -0.0498, V24: -0.2136, V25: 0.1425,
        V26: 0.0794, V27: 0.2052, V28: 0.0199
    },
    amount: 1.0
}

const confidenceLabel: Record<string, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
};

export const PredictForm = () => {
    const [amount, setAmount] = useState<number>(88.35);
    const [result, setResult] = useState<PredictResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [features, setFeatures] = useState(PRESET_LEGIT.features);

    const handleSubmit = async () => {
        setLoading(true)
        const res = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...features, Amount: amount })
        })
        const data = await res.json()
        setResult(data)
        setLoading(false)
    };

    const applyPreset = (preset: typeof PRESET_LEGIT) => {
        setFeatures(preset.features)
        setAmount(preset.amount)
        setResult(null)
    };

    return (
        <div className="bg-surface border border-border rounded-sm px-5 py-4 h-full flex flex-col gap-4">
            {/* Header */}
            <span className="text-xs tracking-widest uppercase font-geist-mono text-text-secondary">
                Simular transacción
            </span>

            {/* Formulario */}
            {!result && (
                <div className="flex flex-col gap-4">
                    {/* Presets */}
                    <div className="flex gap-2 md:flex-col lg:flex-row">
                        <button
                            onClick={() => applyPreset(PRESET_LEGIT)}
                            className="text-xs font-geist-mono px-3 py-1.5 rounded-sm border border-border text-legit hover:border-legit transition-colors cursor-pointer"
                        >
                            Preset legítimo
                        </button>
                        <button
                            onClick={() => applyPreset(PRESET_FRAUD)}
                            className="text-xs font-geist-mono px-3 py-1.5 rounded-sm border border-border text-fraud hover:border-fraud transition-colors cursor-pointer"
                        >
                            Preset fraude
                        </button>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-geist-mono text-text-secondary uppercase tracking-widest">
                            Amount (€)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="bg-bg border border-border rounded-sm px-3 py-2 text-sm font-geist-mono text-text-primary focus:border-border-hi focus:outline-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="mt-2 px-4 py-2 bg-fraud-dim border border-fraud text-fraud text-xs font-geist-mono uppercase tracking-widest rounded-sm hover:bg-fraud hover:text-bg transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? 'Analizando...' : 'Analizar'}
                    </button>
                </div>
            )}

            {/* Resultado */}
            {result && (
                <div className="flex flex-col gap-4 md:justify-around md:h-full">
                    {/* Badge principal */}
                    <div className={`flex flex-col gap-2 p-4 rounded-sm border ${result.is_fraud ? 'border-fraud bg-fraud-dim' : 'border-legit bg-legit-dim'}`}>
                        <span className={`text-lg font-geist-mono md:text-sm md:text-center xl:text-left lg:text-lg ${result.is_fraud ? 'text-fraud' : 'text-legit'}`}>
                            {result.is_fraud ? '⚠ FRAUDE DETECTADO' : '✓ TRANSACCIÓN LEGÍTIMA'}
                        </span>
                        <div className="flex items-center gap-6 md:flex-col md:gap-2 xl:flex-row">
                            <div className="flex flex-col">
                                <span className="text-xs font-geist-mono text-text-muted uppercase tracking-widest">Probabilidad</span>
                                <span className={`text-2xl font-geist-mono md:text-center xl:text-left ${result.is_fraud ? 'text-fraud' : 'text-legit'}`}>
                                    {(result.probability * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-geist-mono text-text-muted uppercase tracking-widest">Confianza</span>
                                <span className="text-2xl font-geist-mono text-text-primary md:text-center xl:text-left">
                                    {confidenceLabel[result.confidence]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reset */}
                    <button
                        onClick={() => setResult(null)}
                        className="px-4 py-2 border border-border text-text-secondary text-xs font-geist-mono uppercase tracking-widest rounded-sm hover:border-border-hi transition-colors cursor-pointer"
                    >
                        Nueva simulación
                    </button>
                </div>
            )}
        </div>
    );
};