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

export function SeismicNetwork() {
  const { state } = useShield()
  const data = state.quakes.map((q) => ({ name: `${q.region}`, mag: q.mag, depth: q.depthKm }))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Seismic Network</h1>
        <p className="text-sm text-slate-400">Recent events, felt reports, and aftershock watch.</p>
      </div>
      <Panel title="Magnitude board">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="#1c2a3d" strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="mag" name="Magnitude" fill="#c084fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Event log">
        <ul className="space-y-2">
          {state.quakes.map((q) => (
            <li key={q.id} className="flex items-center justify-between rounded-md bg-[#101a2b] px-3 py-2">
              <div>
                <div className="text-sm text-white">{q.region}</div>
                <div className="text-[11px] text-slate-500">
                  {q.depthKm} km · {q.ago} ago {q.felt ? '· FELT' : ''}
                </div>
              </div>
              <div className="font-mono text-xl text-violet-300">M{q.mag.toFixed(1)}</div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
