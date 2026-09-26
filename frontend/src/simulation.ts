import type {
  AlertItem,
  AppState,
  Gauge,
  MapNode,
  ScenarioId,
  SeriesPoint,
  ThreatLevel,
} from './types'

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const jitter = (n: number, amt: number) => n + (Math.random() - 0.5) * amt

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function formatClock(ms: number) {
  const d = new Date(ms)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function levelFromRisk(maxRisk: number, alerts: number): ThreatLevel {
  if (maxRisk >= 88 || alerts >= 6) return 'CRITICAL'
  if (maxRisk >= 72) return 'WARNING'
  if (maxRisk >= 55) return 'ADVISORY'
  if (maxRisk >= 35) return 'WATCH'
  return 'CALM'
}

function hydroSeed(offset: number): SeriesPoint[] {
  return Array.from({ length: 24 }, (_, i) => {
    const rain = Math.max(0, 12 + Math.sin((i + offset) / 3) * 18 + (i > 16 ? 10 : 0))
    return {
      t: `${pad(i)}:00`,
      rain: Math.round(rain),
      discharge: Math.round(420 + rain * 14 + i * 6),
      soil: Math.round(48 + rain * 0.9),
    }
  })
}

const baselineNodes = (): MapNode[] => [
  { id: 'n1', name: 'Guwahati', x: 72, y: 32, kind: 'flood', risk: 28, status: 'Monsoon watch' },
  { id: 'n2', name: 'Kochi', x: 28, y: 78, kind: 'flood', risk: 22, status: 'Tidal normal' },
  { id: 'n3', name: 'Puri', x: 58, y: 52, kind: 'cyclone', risk: 18, status: 'Bay quiet' },
  { id: 'n4', name: 'Dehradun', x: 38, y: 22, kind: 'landslide', risk: 16, status: 'Stable slopes' },
  { id: 'n5', name: 'Mumbai', x: 22, y: 52, kind: 'flood', risk: 24, status: 'Urban drain ok' },
  { id: 'n6', name: 'Simlipal', x: 52, y: 48, kind: 'wildfire', risk: 31, status: 'Dry understory' },
  { id: 'n7', name: 'Imphal', x: 78, y: 38, kind: 'seismic', risk: 20, status: 'No events' },
  { id: 'n8', name: 'Sundarbans', x: 66, y: 48, kind: 'cyclone', risk: 26, status: 'Surge watch' },
  { id: 'n9', name: 'Chennai', x: 42, y: 72, kind: 'flood', risk: 19, status: 'Coastal calm' },
  { id: 'n10', name: 'Uttarkashi', x: 36, y: 18, kind: 'landslide', risk: 21, status: 'Road open' },
]

function gauges(): Gauge[] {
  return [
    { id: 'g1', river: 'Brahmaputra', station: 'Pandu', levelM: 48.2, dangerM: 51.8, trend: 0.04, rainfallMm: 12 },
    { id: 'g2', river: 'Ganga', station: 'Farakka', levelM: 21.4, dangerM: 24.1, trend: -0.02, rainfallMm: 6 },
    { id: 'g3', river: 'Periyar', station: 'Aluva', levelM: 3.1, dangerM: 4.6, trend: 0.01, rainfallMm: 9 },
    { id: 'g4', river: 'Mahanadi', station: 'Naraj', levelM: 24.8, dangerM: 27.9, trend: 0.03, rainfallMm: 8 },
    { id: 'g5', river: 'Yamuna', station: 'ITO', levelM: 202.1, dangerM: 205.3, trend: 0.0, rainfallMm: 2 },
    { id: 'g6', river: 'Godavari', station: 'Dowleswaram', levelM: 12.6, dangerM: 16.2, trend: 0.02, rainfallMm: 4 },
  ]
}

function mkAlert(
  id: string,
  severity: AlertItem['severity'],
  title: string,
  body: string,
  region: string,
  source: string,
): AlertItem {
  return {
    id,
    time: formatClock(Date.now()),
    title,
    body,
    severity,
    region,
    source,
    acked: false,
  }
}

export function createBaseline(): AppState {
  return {
    clock: Date.now(),
    threat: 'WATCH',
    scenario: 'baseline',
    live: true,
    kpis: {
      activeAlerts: 2,
      regionsAtRisk: 3,
      peopleNotified: 18420,
      sensorsOnline: 1486,
      unitsDeployed: 12,
      aiConfidence: 81,
    },
    nodes: baselineNodes(),
    gauges: gauges(),
    hydro: hydroSeed(2),
    fires: [
      { id: 'f1', sector: 'Simlipal North', acres: 42, fwi: 18, wind: 8, containment: 62 },
      { id: 'f2', sector: 'Bandipur fringe', acres: 11, fwi: 14, wind: 6, containment: 80 },
      { id: 'f3', sector: 'Nilgiri ridge', acres: 6, fwi: 11, wind: 12, containment: 91 },
    ],
    quakes: [
      { id: 'q1', mag: 3.1, depthKm: 18, region: 'Imphal valley', ago: '6h', felt: false },
      { id: 'q2', mag: 2.6, depthKm: 11, region: 'Andaman arc', ago: '14h', felt: false },
    ],
    storm: {
      name: 'BAY DISTURBANCE 04B',
      category: 0,
      windKt: 28,
      pressureMb: 1004,
      etaHours: 86,
      track: [
        { t: '-36h', lat: 12.1, lon: 88.2, windKt: 22 },
        { t: '-24h', lat: 13.4, lon: 87.1, windKt: 25 },
        { t: '-12h', lat: 14.6, lon: 86.0, windKt: 27 },
        { t: 'now', lat: 15.4, lon: 85.2, windKt: 28 },
        { t: '+12h', lat: 16.2, lon: 84.4, windKt: 31 },
        { t: '+24h', lat: 16.8, lon: 83.6, windKt: 34 },
      ],
    },
    alerts: [
      mkAlert(
        'a1',
        'watch',
        'Monsoon pulse — Upper Assam',
        '48h rainfall anomaly +32% vs climatology. River stations approaching alert, not danger.',
        'Assam',
        'Hydro-AI',
      ),
      mkAlert(
        'a2',
        'info',
        'Sensor mesh healthy',
        '1,486 of 1,502 hydromet and seismic nodes reporting. 16 in maintenance.',
        'National',
        'Ops',
      ),
    ],
    shelters: [
      { id: 's1', name: 'Pandu Relief Campus', district: 'Kamrup', capacity: 2400, occupied: 180, status: 'open' },
      { id: 's2', name: 'Puri Cyclone Shelter-12', district: 'Puri', capacity: 900, occupied: 40, status: 'standby' },
      { id: 's3', name: 'Aluva Municipal Hall', district: 'Ernakulam', capacity: 650, occupied: 20, status: 'standby' },
      { id: 's4', name: 'Mumbai BMC Ward-F', district: 'Mumbai', capacity: 1800, occupied: 90, status: 'open' },
      { id: 's5', name: 'Cuttack Stadium Annex', district: 'Cuttack', capacity: 3200, occupied: 110, status: 'open' },
    ],
    resources: [
      { id: 'r1', label: 'NDRF teams', unit: 'units', available: 38, committed: 12, max: 64 },
      { id: 'r2', label: 'Rescue boats', unit: 'craft', available: 86, committed: 14, max: 140 },
      { id: 'r3', label: 'Medical kits', unit: 'crates', available: 4200, committed: 310, max: 8000 },
      { id: 'r4', label: 'Water (L)', unit: 'liters', available: 92000, committed: 8000, max: 160000 },
      { id: 'r5', label: 'Food packets', unit: 'packs', available: 64000, committed: 4200, max: 120000 },
      { id: 'r6', label: 'Shelter cots', unit: 'beds', available: 11800, committed: 440, max: 18000 },
    ],
    intel: [
      {
        id: 'i1',
        confidence: 78,
        headline: 'Assam catchment wetting — 36h flood watch',
        detail:
          'Soil moisture in the Brahmaputra basin is 14% above the 10-year mean. If the next westerly pulse verifies, Pandu may hit alert by T+30h.',
        horizon: '36 hours',
      },
      {
        id: 'i2',
        confidence: 64,
        headline: 'Bay convection organizing slowly',
        detail:
          'Low-level vorticity increasing east of 85E. Intensification to depression is possible after 48h if shear remains <15 kt.',
        horizon: '72 hours',
      },
    ],
    ticker: [
      'MESH 99.0%  •  HYDROMET 412  •  SEISMIC 88  •  FIRMS 14',
      'No IMD cyclone warning in force',
      'National threat: WATCH',
    ],
  }
}

export function applyScenario(prev: AppState, scenario: ScenarioId): AppState {
  const next = structuredClone(prev) as AppState
  next.scenario = scenario
  next.clock = Date.now()
  next.alerts = next.alerts.map((a) => ({ ...a }))

  const push = (
    severity: AlertItem['severity'],
    title: string,
    body: string,
    region: string,
    source: string,
  ) => {
    next.alerts = [
      mkAlert(`a${Date.now()}${Math.random()}`, severity, title, body, region, source),
      ...next.alerts,
    ].slice(0, 12)
  }

  if (scenario === 'baseline') {
    return { ...createBaseline(), live: prev.live, clock: Date.now() }
  }

  if (scenario === 'flash-flood') {
    next.nodes = next.nodes.map((n) =>
      n.kind === 'flood' || n.name === 'Guwahati' || n.name === 'Kochi'
        ? { ...n, risk: n.name === 'Guwahati' ? 92 : 78, status: 'FLASH FLOOD' }
        : n,
    )
    next.gauges = next.gauges.map((g) =>
      g.river === 'Brahmaputra' || g.river === 'Periyar'
        ? { ...g, levelM: g.dangerM + 0.4, trend: 0.18, rainfallMm: 86 }
        : { ...g, rainfallMm: g.rainfallMm + 20, trend: 0.08 },
    )
    next.hydro = next.hydro.map((p, i) => ({
      ...p,
      rain: i > 16 ? 92 : p.rain + 20,
      discharge: p.discharge + (i > 16 ? 380 : 80),
      soil: Math.min(98, p.soil + 22),
    }))
    next.kpis = {
      ...next.kpis,
      activeAlerts: 7,
      regionsAtRisk: 6,
      peopleNotified: 412000,
      unitsDeployed: 41,
      aiConfidence: 89,
    }
    next.shelters = next.shelters.map((s) =>
      s.district === 'Kamrup' || s.district === 'Ernakulam'
        ? { ...s, occupied: Math.round(s.capacity * 0.72), status: 'filling' }
        : s,
    )
    next.resources = next.resources.map((r) => ({
      ...r,
      committed: Math.round(r.committed + r.max * 0.22),
      available: Math.max(0, r.available - Math.round(r.max * 0.18)),
    }))
    next.intel = [
      {
        id: 'iff',
        confidence: 91,
        headline: 'Nowcast: embankment stress on Brahmaputra left bank',
        detail:
          'Hourly rain 38–54 mm over Kamrup. Inundation model shows 11 wards below 4m MSL at risk within 90 minutes.',
        horizon: '90 minutes',
      },
      ...next.intel,
    ]
    push(
      'critical',
      'FLASH FLOOD WARNING — Kamrup Metro',
      'Pandu gauge crossed danger +0.4 m. Evacuation of riverine wards authorized.',
      'Assam',
      'Flood Engine',
    )
    push(
      'warning',
      'Urban inundation — Kochi',
      'Periyar at Aluva rising 11 cm/10 min. Pumping stations at 94% load.',
      'Kerala',
      'Flood Engine',
    )
    next.ticker = [
      'FLASH FLOOD PROTOCOL  •  NDRF 7 & 12 MOBILIZED',
      'Cell broadcast: 412,000 recipients',
      'Do not drive through inundated roads',
    ]
  }

  if (scenario === 'cyclone-landfall') {
    next.nodes = next.nodes.map((n) =>
      n.kind === 'cyclone' || n.name === 'Puri' || n.name === 'Sundarbans'
        ? { ...n, risk: 94, status: 'LANDFALL WINDOW' }
        : { ...n, risk: Math.min(70, n.risk + 12) },
    )
    next.storm = {
      name: 'CYCLONE VAYU',
      category: 3,
      windKt: 105,
      pressureMb: 962,
      etaHours: 6,
      track: [
        { t: '-36h', lat: 14.2, lon: 88.8, windKt: 55 },
        { t: '-24h', lat: 15.6, lon: 86.9, windKt: 75 },
        { t: '-12h', lat: 17.1, lon: 85.4, windKt: 92 },
        { t: 'now', lat: 18.4, lon: 84.6, windKt: 105 },
        { t: '+6h', lat: 19.3, lon: 84.0, windKt: 98 },
        { t: '+12h', lat: 20.1, lon: 83.2, windKt: 70 },
      ],
    }
    next.kpis = {
      ...next.kpis,
      activeAlerts: 9,
      regionsAtRisk: 8,
      peopleNotified: 2100000,
      unitsDeployed: 58,
      aiConfidence: 93,
    }
    next.shelters = next.shelters.map((s) =>
      s.district === 'Puri' || s.district === 'Cuttack'
        ? { ...s, occupied: Math.round(s.capacity * 0.91), status: s.capacity > 1000 ? 'filling' : 'full' }
        : s,
    )
    push(
      'critical',
      'RED — Cyclone Vayu landfall 6h',
      'Eyewall approaching south Odisha. Storm surge 2.4–3.1 m Puri–Gopalpur. Coastal evacuation mandatory.',
      'Odisha',
      'Storm Engine',
    )
    next.ticker = [
      'CYCLONE VAYU  CAT 3  •  LANDFALL T-6H  •  SURGE 3.1M',
      'Rail and port operations suspended',
      '2.1M cell broadcasts delivered',
    ]
  }

  if (scenario === 'seismic-event') {
    next.nodes = next.nodes.map((n) =>
      n.kind === 'seismic' || n.name === 'Imphal' || n.name === 'Uttarkashi'
        ? { ...n, risk: 88, status: 'AFTERSHOCK WINDOW' }
        : n,
    )
    next.quakes = [
      { id: 'qm', mag: 6.4, depthKm: 14, region: 'Imphal valley', ago: '11m', felt: true },
      { id: 'qa', mag: 4.8, depthKm: 10, region: 'Imphal south', ago: '4m', felt: true },
      { id: 'qb', mag: 4.1, depthKm: 16, region: 'Kohima', ago: '2m', felt: true },
      ...next.quakes,
    ]
    next.kpis = {
      ...next.kpis,
      activeAlerts: 6,
      regionsAtRisk: 5,
      peopleNotified: 890000,
      unitsDeployed: 33,
      aiConfidence: 86,
    }
    push(
      'critical',
      'M6.4 Imphal — damage assessment live',
      'Shaking MMI VII in Imphal. Lifelines unknown. Aftershock probability high for 72h.',
      'Manipur',
      'Seismic Net',
    )
    next.ticker = [
      'SEISMIC ALERT  M6.4  IMPHAL  DEPTH 14KM',
      'USAR staging at Imphal airport',
      'Drop-cover-hold still in effect',
    ]
  }

  if (scenario === 'wildfire-cluster') {
    next.nodes = next.nodes.map((n) =>
      n.kind === 'wildfire' ? { ...n, risk: 90, status: 'RED FLAG' } : n,
    )
    next.fires = [
      { id: 'f1', sector: 'Simlipal North', acres: 1860, fwi: 48, wind: 28, containment: 12 },
      { id: 'f2', sector: 'Bandipur fringe', acres: 640, fwi: 41, wind: 22, containment: 18 },
      { id: 'f3', sector: 'Nilgiri ridge', acres: 210, fwi: 36, wind: 31, containment: 40 },
      { id: 'f4', sector: 'Kanha buffer', acres: 95, fwi: 33, wind: 18, containment: 55 },
    ]
    next.kpis = {
      ...next.kpis,
      activeAlerts: 5,
      regionsAtRisk: 4,
      peopleNotified: 126000,
      unitsDeployed: 27,
      aiConfidence: 84,
    }
    push(
      'warning',
      'RED FLAG — Simlipal complex',
      'FWI 48 with 28 kt gusts. Spot fires ahead of main front. Village buffer 2 km.',
      'Odisha',
      'Fire Engine',
    )
    next.ticker = [
      'WILDFIRE COMPLEX  •  FWI 48  •  RED FLAG',
      'Aerial assets requested',
      'Evac advisory: buffer villages',
    ]
  }

  if (scenario === 'multi-hazard') {
    const flooded = applyScenario(prev, 'flash-flood')
    const stormed = applyScenario(flooded, 'cyclone-landfall')
    const mix = applyScenario(stormed, 'seismic-event')
    mix.scenario = 'multi-hazard'
    mix.kpis = {
      activeAlerts: 14,
      regionsAtRisk: 11,
      peopleNotified: 3400000,
      sensorsOnline: 1410,
      unitsDeployed: 96,
      aiConfidence: 88,
    }
    mix.threat = 'CRITICAL'
    mix.ticker = [
      'NATIONAL EMERGENCY  •  MULTI-HAZARD CASCADE',
      'Flood + cyclone + seismic windows overlapping',
      'All commands to unified ICS',
    ]
    mix.intel = [
      {
        id: 'imh',
        confidence: 88,
        headline: 'Compound risk: surge on already-wet catchments',
        detail:
          'Landfall winds plus saturated soils raise inland flood depth 0.6–1.1 m vs cyclone-only climatology. Seismic aftershocks may cut evacuation corridors in the northeast.',
        horizon: '12 hours',
      },
      ...mix.intel,
    ]
    return mix
  }

  const maxRisk = Math.max(...next.nodes.map((n) => n.risk))
  next.threat = levelFromRisk(maxRisk, next.alerts.filter((a) => !a.acked && a.severity !== 'info').length)
  return next
}

export function tick(state: AppState): AppState {
  if (!state.live) return { ...state, clock: Date.now() }

  const nodes = state.nodes.map((n) => {
    const drift = state.scenario === 'baseline' ? 4 : 2.2
    return { ...n, risk: clamp(jitter(n.risk, drift), 8, 99) }
  })

  const gauges = state.gauges.map((g) => {
    const levelM = clamp(g.levelM + g.trend * jitter(1, 0.4), g.dangerM - 8, g.dangerM + 1.8)
    return {
      ...g,
      levelM: Number(levelM.toFixed(2)),
      rainfallMm: clamp(jitter(g.rainfallMm, 3), 0, 140),
    }
  })

  const last = state.hydro[state.hydro.length - 1]
  const hydro = [
    ...state.hydro.slice(1),
    {
      t: formatClock(Date.now()).slice(0, 5),
      rain: clamp(jitter(last.rain, state.scenario === 'flash-flood' ? 8 : 4), 0, 120),
      discharge: clamp(jitter(last.discharge, 18), 200, 1400),
      soil: clamp(jitter(last.soil, 2), 20, 99),
    },
  ]

  const fires = state.fires.map((f) => ({
    ...f,
    acres: Math.max(1, Math.round(jitter(f.acres, f.containment < 40 ? 12 : 3))),
    containment: clamp(jitter(f.containment, 1.5), 0, 100),
    wind: clamp(jitter(f.wind, 2), 2, 45),
  }))

  const storm = {
    ...state.storm,
    windKt: Math.round(clamp(jitter(state.storm.windKt, 2), 18, 140)),
    pressureMb: Math.round(clamp(jitter(state.storm.pressureMb, 1.2), 930, 1012)),
    etaHours: Math.max(0, Number((state.storm.etaHours - 0.03).toFixed(2))),
  }

  const kpis = {
    ...state.kpis,
    sensorsOnline: Math.round(clamp(jitter(state.kpis.sensorsOnline, 4), 1380, 1502)),
    peopleNotified: state.kpis.peopleNotified + (state.threat === 'CALM' ? 0 : Math.round(Math.random() * 40)),
    aiConfidence: Math.round(clamp(jitter(state.kpis.aiConfidence, 1.4), 55, 97)),
  }

  const maxRisk = Math.max(...nodes.map((n) => n.risk))
  const active = state.alerts.filter((a) => !a.acked && a.severity !== 'info').length
  kpis.activeAlerts = active
  kpis.regionsAtRisk = nodes.filter((n) => n.risk >= 55).length

  return {
    ...state,
    clock: Date.now(),
    nodes,
    gauges,
    hydro,
    fires,
    storm,
    kpis,
    threat: levelFromRisk(maxRisk, active),
  }
}

export function ackAlert(state: AppState, id: string): AppState {
  return {
    ...state,
    alerts: state.alerts.map((a) => (a.id === id ? { ...a, acked: true } : a)),
  }
}
