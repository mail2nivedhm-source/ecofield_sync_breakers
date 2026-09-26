import {
    Shield, Droplets, Activity, Map, Waves, Flame, Radio, Wind, Bell, Tent, LifeBuoy, Cpu, PlayCircle
  } from 'lucide-react'
  import { useShield } from './simulation-context'
  
  // 1. IMPORTING YOUR ACTUAL DASHBOARD FILES HERE!
  import { CommandCenter } from './modules/CommandCenter'
  import { LiveMap } from './modules/LiveMap'
  import { FloodMonitoring } from './modules/FloodMonitoring'
  import { WildfireWatch } from './modules/WildfireWatch'
  import { SeismicNetwork } from './modules/SeismicNetwork'
  import { StormCyclone } from './modules/StormCyclone'
  import { EarlyWarning } from './modules/EarlyWarning'
  import { Evacuation } from './modules/Evacuation'
  import { RescueResources } from './modules/RescueResources'
  import { AiIntelligence } from './modules/AiIntelligence'
  import { DemoControl } from './modules/DemoControl'
  
  const NAV = [
    { id: 'command', label: 'Command Center', icon: Activity },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'flood', label: 'Flood Monitoring', icon: Waves },
    { id: 'wildfire', label: 'Wildfire Watch', icon: Flame },
    { id: 'seismic', label: 'Seismic Network', icon: Radio },
    { id: 'cyclone', label: 'Storm & Cyclone', icon: Wind },
    { id: 'early-warning', label: 'Early Warning Hub', icon: Bell },
    { id: 'evacuation', label: 'Evacuation & Shelters', icon: Tent },
    { id: 'rescue', label: 'Rescue & Resources', icon: LifeBuoy },
    { id: 'ai', label: 'AI Intelligence', icon: Cpu },
    { id: 'demo', label: 'Demo Mode', icon: PlayCircle },
  ]
  
  function formatClock(seconds: number) {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '00:00:00'
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${hrs}:${mins}:${secs}`
  }
  
  export function Shell() {
    const { state, module, setModule, toggleLive } = useShield()
  
    return (
      <div className="grid-bg flex min-h-svh text-slate-200">
        <aside className="flex w-[248px] shrink-0 flex-col border-r border-[#1c2a3d] bg-[#070b14]">
          <div className="flex items-center gap-3 border-b border-[#1c2a3d] px-4 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10">
              <Shield className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-wide text-white">EcoShield AI</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-cyan-400/80">
                Disaster Intelligence
              </div>
            </div>
          </div>
          
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
            {NAV.map((item) => {
              const active = module === item.id
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  // Kept "as any" here to prevent the red TypeScript warning you saw earlier
                  onClick={() => setModule(item.id as any)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
                    active
                      ? 'bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/30'
                      : 'text-slate-400 hover:bg-[#1c2a3d] hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </nav>
  
          <div className="border-t border-[#1c2a3d] p-3 text-[10px] leading-relaxed text-slate-500">
            Simulated mesh · local React state
            <br />
            No live telemetry connected
          </div>
        </aside>
  
        <div className="relative flex min-w-0 flex-1 flex-col">
          <div className="scanlines absolute inset-0 z-10 opacity-40" />
          <header className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[#1c2a3d] bg-[#0a0f1c]/90 px-5 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <Droplets className="h-4 w-4 text-cyan-400" />
              <div>
                <div className="text-sm font-medium text-white">
                  Early Warning System - National Operations
                </div>
                <div className="font-mono text-[11px] text-slate-500">
                  {state?.ticker?.[0] || 'Standby'}
                </div>
              </div>
            </div>
  
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-rose-400">
                THREAT {state?.threat || 'NOMINAL'}
              </span>
  
              <button
                type="button"
                onClick={toggleLive}
                className={`rounded-full border px-3 py-1 font-mono text-[11px] ${
                  state?.live
                    ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                    : 'border-slate-500/40 bg-slate-500/10 text-slate-400'
                }`}
              >
                {state?.live ? '• LIVE' : '■ PAUSED'}
              </button>
  
              <span className="rounded-full border border-[#1c2a3d] bg-[#101a2b] px-3 py-1 font-mono text-[11px] text-slate-300">
                {formatClock(state?.clock)}
              </span>
            </div>
          </header>
  
          <main className="relative z-20 min-h-0 flex-1 overflow-auto p-5">
            <ModuleView id={module} />
          </main>
        </div>
      </div>
    )
  }
  
  // 2. THIS SWITCHES BETWEEN YOUR ACTUAL FILES!
  const ModuleView = ({ id }: { id: string }) => {
    switch (id) {
      case 'command': return <CommandCenter />
      case 'map': return <LiveMap />
      case 'flood': return <FloodMonitoring />
      case 'wildfire': return <WildfireWatch />
      case 'seismic': return <SeismicNetwork />
      case 'cyclone': return <StormCyclone />
      case 'early-warning': return <EarlyWarning />
      case 'evacuation': return <Evacuation />
      case 'rescue': return <RescueResources />
      case 'ai': return <AiIntelligence />
      case 'demo': return <DemoControl />
      default: return null
    }
  }