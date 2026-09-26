import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useShield } from '../simulation-context'
import { ChartTip, Panel } from '../ui'

export function WildfireWatch() {
  const { state } = useShield()
  const radar = state.fires.map((f) => ({
    sector: f.sector,
    FWI: f.fwi,
    Wind: f.wind,
    Acres: Math.min(100, f.acres / 20),
  }))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Wildfire Watch</h1>
        <p className="text-sm text-slate-400">Fire weather index, containment, and active complexes.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Complex fingerprint" subtitle="FWI / wind / relative acres">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="#1c2a3d" />
                <PolarAngleAxis dataKey="sector" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<ChartTip />} />
                <Radar dataKey="FWI" stroke="#fb7185" fill="#fb7185" fillOpacity={0.25} />
                <Radar dataKey="Wind" stroke="#fbbf24" fill="#fbbf24" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Incidents">
          <ul className="space-y-3">
            {state.fires.map((f) => (
              <li key={f.id} className="rounded-lg border border-[#1c2a3d] bg-[#101a2b] p-3">
                <div className="flex justify-between text-white">
                  <span>{f.sector}</span>
                  <span className="font-mono text-rose-300">{f.acres} ac</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                  <span>FWI {f.fwi}</span>
                  <span>Wind {f.wind} kt</span>
                  <span>Contain {Math.round(f.containment)}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1c2a3d]">
                  <div
                    className="h-full bg-rose-400"
                    style={{ width: `${Math.min(100, f.containment)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
