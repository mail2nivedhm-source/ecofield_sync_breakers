import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useShield } from '../simulation-context'
import { ChartTip, Kpi, Panel } from '../ui'

export function StormCyclone() {
  const { state } = useShield()
  const s = state.storm

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Storm & Cyclone</h1>
        <p className="text-sm text-slate-400">Track, intensity, and landfall window for the Bay of Bengal.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="System" value={s.name} />
        <Kpi label="Category" value={s.category} accent={s.category >= 3 ? 'red' : 'amber'} />
        <Kpi label="Winds" value={`${s.windKt} kt`} />
        <Kpi label="Pressure" value={`${s.pressureMb} mb`} />
        <Kpi label="ETA landfall" value={`${s.etaHours.toFixed(1)} h`} accent="amber" />
      </div>
      <Panel title="Intensity track" subtitle="Advisory wind (kt)">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={s.track}>
              <CartesianGrid stroke="#1c2a3d" strokeDasharray="3 3" />
              <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="windKt" name="Wind kt" stroke="#fbbf24" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Fix table">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase text-slate-500">
            <tr>
              <th className="pb-2">Time</th>
              <th className="pb-2">Lat</th>
              <th className="pb-2">Lon</th>
              <th className="pb-2">Wind</th>
            </tr>
          </thead>
          <tbody>
            {s.track.map((p) => (
              <tr key={p.t} className="border-t border-[#1c2a3d] font-mono text-cyan-100">
                <td className="py-2">{p.t}</td>
                <td>{p.lat.toFixed(1)}</td>
                <td>{p.lon.toFixed(1)}</td>
                <td>{p.windKt} kt</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}
