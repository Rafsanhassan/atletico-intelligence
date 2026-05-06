import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const formatFixture = (match) => {
  if (!match) {
    return 'No completed matches'
  }
  const home = match.home_team_id ? `Team ${match.home_team_id}` : 'Home'
  const away = match.away_team_id ? `Team ${match.away_team_id}` : 'Away'
  return `${home} vs ${away}`
}

const formatDate = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '--'
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const Dashboard = () => {
  const [matches, setMatches] = useState([])
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const [incidentsResponse, matchesResponse] = await Promise.all([
          axios.get('/incidents'),
          axios.get('/matches'),
        ])
        if (isMounted) {
          setIncidents(incidentsResponse.data)
          setMatches(matchesResponse.data)
        }
      } catch (error) {
        if (isMounted) {
          setIncidents([])
          setMatches([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  const incidentsByMatch = useMemo(() => {
    return incidents.reduce((acc, incident) => {
      acc[incident.match_id] = (acc[incident.match_id] || 0) + 1
      return acc
    }, {})
  }, [incidents])

  const completedMatches = useMemo(
    () => matches.filter((match) => match.status === 'completed'),
    [matches]
  )

  const sortedCompleted = useMemo(() => {
    return [...completedMatches].sort((a, b) => {
      const timeA = new Date(a.kickoff_time).getTime()
      const timeB = new Date(b.kickoff_time).getTime()
      return timeB - timeA
    })
  }, [completedMatches])

  const recentMatches = sortedCompleted.slice(0, 3)
  const latestMatch = sortedCompleted[0]
  const matchesWithClips = completedMatches.filter(
    (match) => (incidentsByMatch[match.id] || 0) > 0
  ).length

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm text-[#8b949e]">Welcome back, Alex Chen</p>
          <p className="mt-2 max-w-3xl text-sm text-[#8b949e]">
            Approved clips after the match. Read-only access to incidents and clips for your club.
          </p>
        </div>
        {loading ? <LoadingSpinner text="" /> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
          <p className="text-xs uppercase text-[#8b949e]">Matches with clips</p>
          <p className="mt-3 text-3xl font-semibold text-white">{matchesWithClips}</p>
        </div>
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
          <p className="text-xs uppercase text-[#8b949e]">Total incidents</p>
          <p className="mt-3 text-3xl font-semibold text-white">{incidents.length}</p>
        </div>
        <div className="rounded-xl border border-[#30363d] bg-[#1c2030] p-5">
          <p className="text-xs uppercase text-[#8b949e]">Latest match</p>
          <p className="mt-3 text-lg font-semibold text-white">{formatFixture(latestMatch)}</p>
          {latestMatch ? (
            <p className="mt-2 text-sm text-[#8b949e]">
              {formatDate(latestMatch.kickoff_time)} | {incidentsByMatch[latestMatch.id] || 0} clips
            </p>
          ) : (
            <p className="mt-2 text-sm text-[#8b949e]">No completed matches yet</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent matches</h2>
            <Link to="/viewer/history" className="text-sm text-[#00d4b4]">
              All matches
            </Link>
          </div>
          {recentMatches.length === 0 ? (
            <p className="mt-4 text-sm text-[#8b949e]">No completed matches yet.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-[#30363d]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0d1117] text-xs uppercase text-[#8b949e]">
                  <tr>
                    <th className="px-4 py-3">Fixture</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Clips</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMatches.map((match) => (
                    <tr key={match.id} className="border-t border-[#30363d]">
                      <td className="px-4 py-3 text-white">{formatFixture(match)}</td>
                      <td className="px-4 py-3 text-[#8b949e]">{formatDate(match.kickoff_time)}</td>
                      <td className="px-4 py-3 text-[#8b949e]">{incidentsByMatch[match.id] || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
          <h2 className="text-lg font-semibold">Quick links</h2>
          <div className="mt-4 space-y-3">
            <Link
              to="/viewer/clips"
              className="block rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            >
              Open clips and incidents
            </Link>
            <Link
              to="/viewer/history"
              className="block rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            >
              Match history
            </Link>
          </div>
          <p className="mt-4 text-xs text-[#8b949e]">
            Only content approved for your role is shown.
          </p>
        </section>
      </div>
    </div>
  )
}

export default Dashboard