import type { ReactNode } from 'react'
import type { ThreatLevel } from './types'

export function threatTone(level: ThreatLevel) {
  if (level === 'CRITICAL') return 'text-red-400 bg-red-500/15 border-red-500/40'
  if (level === 'WARNING') return 'text-orange-300 bg-orange-500/15 border-orange-400/40'
  if (level === 'ADVISORY') return 'text-amber-300 bg-amber-500/15 border-amber-400/40'
  if (level === 'WATCH') return 'text-cyan-300 bg-cyan-500/10 border-cyan-400/30'
  return 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30'
}

export function hazardColor(kind: string) {
  if (kind === 'flood') return '#38bdf8'
  if (kind === 'wildfire') return '#fb7185'
  if (kind === 'seismic') return '#c084fc'
  if (kind === 'cyclone') return '#fbbf24'
  if (kind === 'landslide') return '#f59e0b'
  return '#34d399'
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className = '',
}: {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`rounded-xl border border-[#1c2a3d] bg-[#0b1220]/90 shadow-[0_0_0_1px_rgba(34,211,238,0.04)] ${className}`}
    >
      <header className="flex items-start justify-between gap-3 border-b border-[#1c2a3d] px-4 py-3">
        <div>
          <h2 className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300/90 uppercase">
            {title}
          </h2>
          {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
        </div>
        {actions}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

export function Kpi({
  label,
  value,
  hint,
  accent = 'cyan',
}: {
  label: string
  value: string | number
  hint?: string
  accent?: 'cyan' | 'red' | 'amber' | 'mint'
}) {
  const ring =
    accent === 'red'
      ? 'text-red-300'
      : accent === 'amber'
        ? 'text-amber-300'
        : accent === 'mint'
          ? 'text-emerald-300'
          : 'text-cyan-300'
  return (
    <div className="rounded-lg border border-[#1c2a3d] bg-[#101a2b] px-3 py-3">
      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className={`mt-1 font-mono text-2xl font-semibold ${ring}`}>{value}</div>
      {hint ? <div className="mt-1 text-[11px] text-slate-500">{hint}</div> : null}
    </div>
  )
}

export function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string | number }>
  label?: string | number
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-cyan-500/30 bg-[#05080d] px-3 py-2 text-xs text-slate-200">
      <div className="mb-1 font-mono text-cyan-300">{label}</div>
      {payload.map((p) => (
        <div key={String(p.name ?? p.dataKey)} className="flex justify-between gap-4">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono">{p.value}</span>
        </div>
      ))}
    </div>
  )
}
