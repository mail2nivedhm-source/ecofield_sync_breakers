import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useShield } from '../simulation-context'
import { ChartTip, Panel } from '../ui'

export function FloodMonitoring() {
  const { state } = useShield()
  const gaugeData = state.gauges.map((g) => ({
    name: g.station,
    level: Number(((g.levelM / g.dangerM) * 100).toFixed(1)),
    rain: Math.round(g.rainfallMm),
  }))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Flood Monitoring</h1>
        <p className="text-sm text-slate-400">
          River gauges vs danger level, basin rainfall, and soil saturation nowcast.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {state.gauges.slice(0, 3).map((g) => {
          const pct = g.levelM / g.dangerM
          const hot = pct >= 1
          return (
            <div key={g.id} className="rounded-xl border border-[#1c2a3d] bg-[#0b1220] p-4">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{g.river}</div>
              <div className="text-lg text-white">{g.station}</div>
              <div className={`mt-2 font-mono text-3xl ${hot ? 'text-red-400' : 'text-cyan-300'}`}>
                {g.levelM.toFixed(2)}
                <span className="text-sm text-slate-500"> m</span>
              </div>
              <div className="text-xs text-slate-400">
                Danger {g.dangerM} m · trend {g.trend > 0 ? '+' : ''}
                {g.trend.toFixed(2)} m/tick · rain {g.rainfallMm.toFixed(0)} mm
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Gauge load vs danger" subtitle="% of danger stage">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gaugeData}>
                <CartesianGrid stroke="#1c2a3d" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<ChartTip />} />
                <Legend />
                <Bar dataKey="level" name="% danger" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rain" name="Rain mm" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Basin hydrograph" subtitle="Discharge & rain">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={state.hydro}>
                <CartesianGrid stroke="#1c2a3d" strokeDasharray="3 3" />
                <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip content={<ChartTip />} />
                <Legend />
                <Line type="monotone" dataKey="discharge" name="Discharge" stroke="#67e8f9" dot={false} />
                <Line type="monotone" dataKey="rain" name="Rain" stroke="#38bdf8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="All stations">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="pb-2">River</th>
                <th className="pb-2">Station</th>
                <th className="pb-2">Level</th>
                <th className="pb-2">Danger</th>
                <th className="pb-2">Rain</th>
                <th className="pb-2">State</th>
              </tr>
            </thead>
            <tbody>
              {state.gauges.map((g) => {
                const over = g.levelM >= g.dangerM
                return (
                  <tr key={g.id} className="border-t border-[#1c2a3d]">
                    <td className="py-2 text-white">{g.river}</td>
                    <td className="text-slate-300">{g.station}</td>
                    <td className="font-mono text-cyan-300">{g.levelM.toFixed(2)}</td>
                    <td className="font-mono text-slate-400">{g.dangerM}</td>
                    <td className="font-mono">{g.rainfallMm.toFixed(0)} mm</td>
                    <td className={over ? 'text-red-400' : 'text-emerald-400'}>
                      {over ? 'DANGER' : 'BELOW'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
