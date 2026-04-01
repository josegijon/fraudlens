import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <h1 className="text-2xl font-mono">FraudLens</h1>
    </div>
  </StrictMode>,
)
