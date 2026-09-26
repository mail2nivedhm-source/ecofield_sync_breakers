import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useShield } from '../simulation-context'
import { ChartTip, Panel } from '../ui'

export function AiIntelligence() {
  const { state } = useShield()
  const profile = [
    { axis: 'Flood', v: Math.round(state.nodes.filter((n) => n.kind === 'flood').reduce((s, n) => s + n.risk, 0) / 3) },
    { axis: 'Cyclone', v: Math.round(state.storm.windKt / 1.4) },
    { axis: 'Fire', v: Math.round(state.fires[0]?.fwi ?? 10) * 2 },
    { axis: 'Seismic', v: Math.round((state.quakes[0]?.mag ?? 2) * 12) },
    { axis: 'Surge', v: Math.round(state.nodes.find((n) => n.name === 'Sundarbans')?.risk ?? 20) },
    { axis: 'Slope', v: Math.round(state.nodes.find((n) => n.kind === 'landslide')?.risk ?? 20) },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">AI Intelligence</h1>
        <p className="text-sm text-slate-400">
          Explainable nowcasts from the local simulation engine (stand-in for model services).
        </p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Multi-hazard fingerprint">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={profile}>
                <PolarGrid stroke="#1c2a3d" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip content={<ChartTip />} />
                <Radar dataKey="v" name="Risk index" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Model cards" subtitle={`Engine confidence ${state.kpis.aiConfidence}%`}>
          <div className="space-y-3">
            {state.intel.map((item) => (
              <article key={item.id} className="rounded-lg border border-cyan-500/20 bg-[#101a2b] p-3">
                <div className="text-[11px] text-cyan-400">
                  {item.horizon} · conf {item.confidence}%
                </div>
                <h3 className="mt-1 text-sm font-medium text-white">{item.headline}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
