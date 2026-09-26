import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useShield } from '../simulation-context'
import { ChartTip, Panel } from '../ui'

export function Evacuation() {
  const { state } = useShield()
  const data = state.shelters.map((s) => ({
    name: s.name.split(' ')[0],
    occ: s.occupied,
    cap: s.capacity,
  }))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Evacuation & Shelters</h1>
        <p className="text-sm text-slate-400">Capacity, occupancy, and open/standby status.</p>
      </div>
      <Panel title="Occupancy vs capacity">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="#1c2a3d" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="occ" name="Occupied" fill="#22d3ee" />
              <Bar dataKey="cap" name="Capacity" fill="#1e3a4c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <div className="grid gap-3 md:grid-cols-2">
        {state.shelters.map((s) => (
          <div key={s.id} className="rounded-xl border border-[#1c2a3d] bg-[#0b1220] p-4">
            <div className="flex justify-between">
              <div className="text-white">{s.name}</div>
              <span className="text-[11px] uppercase tracking-wide text-cyan-400">{s.status}</span>
            </div>
            <div className="text-xs text-slate-500">{s.district}</div>
            <div className="mt-3 font-mono text-sm text-slate-300">
              {s.occupied.toLocaleString()} / {s.capacity.toLocaleString()}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1c2a3d]">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${Math.min(100, (s.occupied / s.capacity) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
