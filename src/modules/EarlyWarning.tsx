import { useShield } from '../simulation-context'
import { Panel } from '../ui'

const tone: Record<string, string> = {
  critical: 'border-red-500/40 bg-red-500/10',
  warning: 'border-orange-400/40 bg-orange-500/10',
  watch: 'border-cyan-400/30 bg-cyan-500/10',
  info: 'border-[#1c2a3d] bg-[#101a2b]',
}

export function EarlyWarning() {
  const { state, ack } = useShield()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-white">Early Warning Hub</h1>
        <p className="text-sm text-slate-400">
          Dissemination stack — acknowledge products once operators have actioned them.
        </p>
      </div>
      <Panel title="Product queue" subtitle="Most recent first">
        <ul className="space-y-3">
          {state.alerts.map((a) => (
            <li key={a.id} className={`rounded-lg border p-4 ${tone[a.severity]}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    {a.severity} · {a.region} · {a.source} · {a.time}
                  </div>
                  <h3 className={`mt-1 text-base font-medium ${a.acked ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {a.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">{a.body}</p>
                </div>
                <button
                  type="button"
                  disabled={a.acked}
                  onClick={() => ack(a.id)}
                  className="rounded-md border border-cyan-400/30 px-3 py-1 text-xs text-cyan-200 disabled:opacity-40"
                >
                  {a.acked ? 'Acked' : 'Acknowledge'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
