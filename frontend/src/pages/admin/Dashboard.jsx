import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Bell, ShieldAlert, CheckCircle2, Info, AlertTriangle } from 'lucide-react'

const BG = '#0d1117'
const CARD = '#161b22'
const BORDER = '#30363d'
const ACCENT = '#00d4b4'
const MUTED = '#8b949e'

const pieData = [
  { name: 'Offside', value: 42, color: ACCENT },
  { name: 'Goal Line', value: 26, color: '#3b82f6' },
  { name: 'Fouls', value: 20, color: '#f97316' },
  { name: 'Cards', value: 12, color: '#ef4444' },
]

const barData = [
  { day: 'Mon', incidents: 3 },
  { day: 'Tue', incidents: 5 },
  { day: 'Wed', incidents: 4 },
  { day: 'Thu', incidents: 6 },
  { day: 'Fri', incidents: 7 },
  { day: 'Sat', incidents: 9 },
  { day: 'Sun', incidents: 8 },
]

const recentMatches = [
  { home: 'Arsenal', away: 'Chelsea', score: '3-1', time: 'Today 14:20' },
  { home: 'Norwich', away: 'Leeds', score: '2-2', time: 'Today 12:05' },
  { home: 'Plymouth', away: 'Portsmouth', score: '1-0', time: 'Yesterday 19:10' },
]

const alerts = [
  { type: 'critical', title: '5 matches need setup', detail: 'Assign teams + officials before kickoff windows.' },
  { type: 'warning', title: 'Video uploads pending', detail: '2 completed matches missing uploaded footage.' },
  { type: 'info', title: 'Season rollover scheduled', detail: 'Championship season rollover planned for next week.' },
  { type: 'success', title: 'All systems operational', detail: 'API, storage, and review queue healthy.' },
]

const alertMeta = (type) => {
  switch (type) {
    case 'critical':
      return { Icon: ShieldAlert, color: '#ef4444' }
    case 'warning':
      return { Icon: AlertTriangle, color: '#f97316' }
    case 'success':
      return { Icon: CheckCircle2, color: ACCENT }
    default:
      return { Icon: Info, color: '#3b82f6' }
  }
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="p-6 text-white" style={{ backgroundColor: BG, minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">League Admin Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Operations snapshot for leagues, seasons, matches, and reviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/leagues/new')}
            className="font-semibold px-4 py-2 rounded-lg text-black"
            style={{ backgroundColor: ACCENT }}
          >
            Create League
          </button>

          <button
            type="button"
            className="relative rounded-lg px-3 py-2"
            style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span
              className="absolute -top-1 -right-1 text-[10px] w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              4
            </span>
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Leagues', value: '12' },
          { label: 'Active Seasons', value: '8' },
          { label: 'Matches Need Setup', value: '5' },
          { label: 'Incidents Reviewed', value: '23' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-5"
            style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
          >
            <p className="text-sm" style={{ color: MUTED }}>
              {s.label}
            </p>
            <p className="text-3xl font-bold mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent matches + alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div
          className="rounded-xl p-6 xl:col-span-2"
          style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Match Results</h2>
            <span className="text-sm" style={{ color: ACCENT }}>
              Verified
            </span>
          </div>

          <div className="space-y-3">
            {recentMatches.map((m) => (
              <div
                key={`${m.home}-${m.away}`}
                className="rounded-lg p-4 flex items-center justify-between"
                style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
              >
                <div>
                  <p className="text-white text-sm font-semibold">
                    {m.home} <span style={{ color: ACCENT }}>vs</span> {m.away}
                  </p>
                  <p className="text-xs mt-1" style={{ color: MUTED }}>
                    {m.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{m.score}</p>
                  <p className="text-xs" style={{ color: MUTED }}>
                    Final
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Alerts</h2>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: BG, border: `1px solid ${BORDER}`, color: MUTED }}>
              4
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((a) => {
              const { Icon, color } = alertMeta(a.type)
              return (
                <div
                  key={a.title}
                  className="rounded-lg p-4"
                  style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, color }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{a.title}</p>
                      <p className="text-xs mt-1" style={{ color: MUTED }}>
                        {a.detail}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
          <h2 className="font-semibold text-white">Incident Types</h2>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Reviews distribution
          </p>

          <div className="mt-4" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} stroke="none">
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: BG, border: `1px solid ${BORDER}`, color: 'white' }}
                  formatter={(value) => [value, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}>
          <h2 className="font-semibold text-white">Weekly Activity</h2>
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            Incident reviews per day
          </p>

          <div className="mt-4" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={28}>
                <XAxis dataKey="day" stroke={MUTED} tickLine={false} axisLine={{ stroke: BORDER }} />
                <YAxis stroke={MUTED} tickLine={false} axisLine={{ stroke: BORDER }} />
                <Tooltip contentStyle={{ background: BG, border: `1px solid ${BORDER}`, color: 'white' }} />
                <Bar dataKey="incidents" fill={ACCENT} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
