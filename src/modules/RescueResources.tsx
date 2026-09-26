import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useShield } from '../simulation-context'
import { ChartTip, Panel } from '../ui'

export function RescueResources() {
  const { state } = useShield()
  const data = state.resources.map((r) => ({
    name: r.label.split(' ')[0],
    available: r.available,
    committed: r.committed,
  }))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Rescue & Resources</h1>
        <p className="text-sm text-slate-400">Force laydown and commodity stocks for the current scenario.</p>
      </div>
      <Panel title="Available vs committed">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="#1c2a3d" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="available" name="Available" fill="#34d399" />
              <Bar dataKey="committed" name="Committed" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {state.resources.map((r) => (
          <div key={r.id} className="rounded-xl border border-[#1c2a3d] bg-[#0b1220] p-4">
            <div className="text-sm text-white">{r.label}</div>
            <div className="mt-1 font-mono text-2xl text-emerald-300">{r.available.toLocaleString()}</div>
            <div className="text-xs text-slate-500">
              committed {r.committed.toLocaleString()} {r.unit} · max {r.max.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
