import { CloudLightning, Flame, RotateCcw, Waves, Zap } from 'lucide-react'
import { useShield } from '../simulation-context'
import { Panel } from '../ui'
import type { ScenarioId } from '../types'

const SCENARIOS: {
  id: ScenarioId
  title: string
  body: string
  icon: typeof Waves
}[] = [
  {
    id: 'flash-flood',
    title: 'Flash flood',
    body: 'Spike Brahmaputra & Periyar, push Kamrup into danger, notify 412k, fill riverine shelters.',
    icon: Waves,
  },
  {
    id: 'cyclone-landfall',
    title: 'Cyclone landfall',
    body: 'Spin up Cyclone Vayu (Cat 3), 6-hour landfall on Odisha, 2.1M broadcasts, surge 3.1 m.',
    icon: CloudLightning,
  },
  {
    id: 'seismic-event',
    title: 'Seismic event',
    body: 'Inject M6.4 Imphal mainshock plus felt aftershocks and USAR staging.',
    icon: Zap,
  },
  {
    id: 'wildfire-cluster',
    title: 'Wildfire cluster',
    body: 'Red-flag Simlipal–Bandipur complex with low containment and village buffer.',
    icon: Flame,
  },
  {
    id: 'multi-hazard',
    title: 'Multi-hazard cascade',
    body: 'Compound flood + cyclone + seismic windows. National emergency picture.',
    icon: CloudLightning,
  },
  {
    id: 'baseline',
    title: 'Reset to baseline',
    body: 'Clear injects and restore the quiet monsoon-watch operating picture.',
    icon: RotateCcw,
  },
]

export function DemoControl() {
  const { state, runScenario } = useShield()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Demo Mode</h1>
        <p className="text-sm text-slate-400">
          Exercise the command center with local scenario injects. Active: {state.scenario}.
        </p>
      </div>
      <Panel title="Scenario injects" subtitle="Buttons drive shared React state used by every module">
        <div className="grid gap-3 md:grid-cols-2">
          {SCENARIOS.map((s) => {
            const Icon = s.icon
            const active = state.scenario === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => runScenario(s.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  active
                    ? 'border-cyan-400/50 bg-cyan-400/10'
                    : 'border-[#1c2a3d] bg-[#101a2b] hover:border-cyan-400/30'
                }`}
              >
                <div className="flex items-center gap-2 text-white">
                  <Icon className="h-4 w-4 text-cyan-300" />
                  {s.title}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{s.body}</p>
              </button>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
