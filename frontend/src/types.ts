export type ModuleId =
  | 'command'
  | 'map'
  | 'flood'
  | 'fire'
  | 'seismic'
  | 'storm'
  | 'alerts'
  | 'evac'
  | 'rescue'
  | 'intel'
  | 'demo'

export type ThreatLevel = 'CALM' | 'WATCH' | 'ADVISORY' | 'WARNING' | 'CRITICAL'

export type HazardKind = 'flood' | 'wildfire' | 'seismic' | 'cyclone' | 'heat' | 'landslide'

export type AlertSeverity = 'info' | 'watch' | 'warning' | 'critical'

export type ScenarioId =
  | 'baseline'
  | 'flash-flood'
  | 'cyclone-landfall'
  | 'seismic-event'
  | 'wildfire-cluster'
  | 'multi-hazard'

export type MapNode = {
  id: string
  name: string
  x: number
  y: number
  kind: HazardKind
  risk: number
  status: string
}

export type Gauge = {
  id: string
  river: string
  station: string
  levelM: number
  dangerM: number
  trend: number
  rainfallMm: number
}

export type SeriesPoint = { t: string; rain: number; discharge: number; soil: number }

export type FireCell = {
  id: string
  sector: string
  acres: number
  fwi: number
  wind: number
  containment: number
}

export type Quake = {
  id: string
  mag: number
  depthKm: number
  region: string
  ago: string
  felt: boolean
}

export type StormTrackPoint = { t: string; lat: number; lon: number; windKt: number }

export type AlertItem = {
  id: string
  time: string
  title: string
  body: string
  severity: AlertSeverity
  region: string
  source: string
  acked: boolean
}

export type Shelter = {
  id: string
  name: string
  district: string
  capacity: number
  occupied: number
  status: 'open' | 'filling' | 'full' | 'standby'
}

export type ResourceStock = {
  id: string
  label: string
  unit: string
  available: number
  committed: number
  max: number
}

export type IntelItem = {
  id: string
  confidence: number
  headline: string
  detail: string
  horizon: string
}

export type AppState = {
  clock: number
  threat: ThreatLevel
  scenario: ScenarioId
  live: boolean
  kpis: {
    activeAlerts: number
    regionsAtRisk: number
    peopleNotified: number
    sensorsOnline: number
    unitsDeployed: number
    aiConfidence: number
  }
  nodes: MapNode[]
  gauges: Gauge[]
  hydro: SeriesPoint[]
  fires: FireCell[]
  quakes: Quake[]
  storm: {
    name: string
    category: number
    windKt: number
    pressureMb: number
    etaHours: number
    track: StormTrackPoint[]
  }
  alerts: AlertItem[]
  shelters: Shelter[]
  resources: ResourceStock[]
  intel: IntelItem[]
  ticker: string[]
}
