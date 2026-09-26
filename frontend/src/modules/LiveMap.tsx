import { useEffect, useRef } from 'react'
import { MapPin, AlertTriangle, Crosshair } from 'lucide-react'
import { useShield } from '../simulation-context'

export function LiveMap() {
  const { state } = useShield()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // FEATURE 2: AUDIO ALERT SYSTEM
  useEffect(() => {
    // Check if the system state registers a critical threat
    if (state?.threat === 'CRITICAL') {
      if (!audioRef.current) {
        // Using a standard, reliable Google-hosted warning beep
        audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
        audioRef.current.loop = true // Loop the alarm while critical
      }
      // Play the sound (Note: Browsers require you to click anywhere on the page first before sound can play)
      audioRef.current.play().catch(e => console.log("Audio blocked by browser until user clicks:", e))
    } else {
      // Stop the alarm when the threat passes
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [state?.threat])

  return (
    <div className="flex h-full w-full flex-col gap-4">
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Live Map — India Region</h2>
          <p className="text-xs text-cyan-400/80 uppercase tracking-widest">National Disaster Operations Grid</p>
        </div>
        <div className="flex gap-3">
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold border ${
            state?.threat === 'CRITICAL' 
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 animate-pulse' 
              : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
          }`}>
            <AlertTriangle className="h-3.5 w-3.5" /> 
            {state?.threat === 'CRITICAL' ? 'ACTIVE THREAT DETECTED' : 'NO THREATS'}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
            <Crosshair className="h-3.5 w-3.5" /> 
            TRACKING ONLINE
          </span>
        </div>
      </div>

      {/* Interactive Map Container */}
      <div className="relative flex-1 overflow-hidden rounded-xl border border-[#1c2a3d] bg-[#070b14] shadow-2xl">
        
        <iframe
          title="India Live Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src="https://www.openstreetmap.org/export/embed.html?bbox=67.0,6.5,98.0,36.0&amp;layer=mapnik"
          className="absolute inset-0 z-0"
          style={{
            filter: 'invert(100%) hue-rotate(180deg) brightness(85%) contrast(110%)'
          }}
        />
        
        {/* Shadow overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_0_60px_rgba(7,11,20,1)]" />

        {/* FEATURE 1: VISUAL DISASTER IDENTIFICATION */}
        {/* This marker will appear and pulse red when a critical threat is active */}
        {state?.threat === 'CRITICAL' && (
          <div className="absolute top-[80%] left-[32%] z-20 flex flex-col items-center">
            <span className="relative flex h-8 w-8">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-8 w-8 bg-rose-600 border-2 border-white shadow-[0_0_15px_rgba(225,29,72,0.8)]"></span>
            </span>
            <span className="mt-2 rounded bg-rose-900/90 px-2 py-1 text-[11px] font-bold tracking-wider text-white backdrop-blur border border-rose-500 shadow-xl">
              COASTAL CYCLONE WARNING
            </span>
          </div>
        )}
        
        {/* Telemetry Overlay */}
        <div className="absolute bottom-4 left-4 z-20 rounded-lg border border-[#1c2a3d] bg-[#0a0f1c]/90 p-3 backdrop-blur">
          <div className="text-[10px] font-mono text-slate-400 mb-2">LIVE TELEMETRY</div>
          <div className="flex items-center gap-2 text-sm text-white">
            <MapPin className="h-4 w-4 text-cyan-400" />
            Coordinates: 9.9312° N, 76.2673° E
          </div>
        </div>
      </div>
    </div>
  )
}