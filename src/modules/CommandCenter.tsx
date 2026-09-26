import { AlertTriangle } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useShield } from '../simulation-context'
import { ChartTip, Kpi, Panel, threatTone } from '../ui'

export function CommandCenter() {
  const { state, setModule } = useShield()
  const hot = [...state.nodes].sort((a, b) => b.risk - a.risk).slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Command Center</h1>
          <p className="text-sm text-slate-400">
            National common operating picture · scenario {state.scenario.replace('-', ' ')}
          </p>
        </div>
        <div className={`rounded-lg border px-4 py-2 text-sm font-semibold ${threatTone(state.threat)}`}>
          National threat: {state.threat}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <Kpi label="Active alerts" value={state.kpis.activeAlerts} accent="red" />
        <Kpi label="Regions at risk" value={state.kpis.regionsAtRisk} accent="amber" />
        <Kpi label="People notified" value={state.kpis.peopleNotified.toLocaleString()} />
        <Kpi label="Sensors online" value={state.kpis.sensorsOnline} hint="of 1,502 nodes" accent="mint" />
        <Kpi label="Units deployed" value={state.kpis.unitsDeployed} />
        <Kpi label="AI confidence" value={`${state.kpis.aiConfidence}%`} accent="mint" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Hydromet pulse" subtitle="Rain · discharge · soil moisture" className="xl:col-span-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.hydro}>
                <defs>
                  <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1c2a3d" strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="rain" name="Rain mm" stroke="#22d3ee" fill="url(#rainFill)" />
                <Area type="monotone" dataKey="soil" name="Soil %" stroke="#34d399" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Priority nodes" subtitle="Highest composite risk">
          <ul className="space-y-2">
            {hot.map((n) => (
              <li key={n.id} className="flex items-center justify-between rounded-md bg-[#101a2b] px-3 py-2">
                <div>
                  <div className="text-sm text-white">{n.name}</div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">{n.status}</div>
                </div>
                <div className="font-mono text-cyan-300">{Math.round(n.risk)}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="AI watch brief" subtitle={state.intel[0]?.horizon}>
          <div className="space-y-3">
            {state.intel.slice(0, 2).map((item) => (
              <article key={item.id} className="rounded-lg border border-[#1c2a3d] bg-[#101a2b] p-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-cyan-400">
                  <span>CONF {item.confidence}%</span>
                  <span>{item.horizon}</span>
                </div>
                <h3 className="text-sm font-medium text-white">{item.headline}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.detail}</p>
              </article>
            ))}
            <button
              type="button"
              onClick={() => setModule('intel')}
              className="text-xs text-cyan-400 hover:underline"
            >
              Open AI Intelligence →
            </button>
          </div>
        </Panel>

        <Panel
          title="Live alert stack"
          subtitle={`${state.alerts.filter((a) => !a.acked).length} unacknowledged`}
          actions={
            <button type="button" onClick={() => setModule('alerts')} className="text-xs text-cyan-400">
              Hub
            </button>
          }
        >
          <ul className="space-y-2">
            {state.alerts.slice(0, 4).map((a) => (
              <li key={a.id} className="flex gap-2 rounded-md border border-[#1c2a3d] px-3 py-2">
                <AlertTriangle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    a.severity === 'critical'
                      ? 'text-red-400'
                      : a.severity === 'warning'
                        ? 'text-orange-400'
                        : 'text-cyan-400'
                  }`}
                />
                <div>
                  <div className="text-sm text-white">{a.title}</div>
                  <div className="text-[11px] text-slate-500">
                    {a.region} · {a.source} · {a.time}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}
