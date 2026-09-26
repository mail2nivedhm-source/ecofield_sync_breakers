import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ackAlert, applyScenario, createBaseline, tick } from './simulation'
import type { AppState, ModuleId, ScenarioId } from './types'

type ShieldContextValue = {
  state: AppState
  module: ModuleId
  setModule: (m: ModuleId) => void
  runScenario: (s: ScenarioId) => void
  toggleLive: () => void
  ack: (id: string) => void
}

const ShieldContext = createContext<ShieldContextValue | null>(null)

export function ShieldProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => createBaseline())
  const [module, setModule] = useState<ModuleId>('command')

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((s) => tick(s))
    }, 1800)
    return () => window.clearInterval(id)
  }, [])

  const runScenario = useCallback((s: ScenarioId) => {
    setState((prev) => applyScenario(prev, s))
    if (s !== 'baseline') setModule('command')
  }, [])

  const toggleLive = useCallback(() => {
    setState((s) => ({ ...s, live: !s.live }))
  }, [])

  const ack = useCallback((id: string) => {
    setState((s) => ackAlert(s, id))
  }, [])

  const value = useMemo(
    () => ({ state, module, setModule, runScenario, toggleLive, ack }),
    [state, module, runScenario, toggleLive, ack],
  )

  return <ShieldContext.Provider value={value}>{children}</ShieldContext.Provider>
}

export function useShield() {
  const ctx = useContext(ShieldContext)
  if (!ctx) throw new Error('useShield must be used within ShieldProvider')
  return ctx
}
