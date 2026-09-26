import { ShieldProvider } from './simulation-context'
import { Shell } from './shell'

export function App() {
  return (
    <ShieldProvider>
      <Shell />
    </ShieldProvider>
  )
}
