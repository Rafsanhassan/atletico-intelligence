import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const formatFixture = (match) => {
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

const MatchHistory = () => {
  const navigate = useNavigate()
  const [matches, setMatches] = useState([])
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const [matchesResponse, incidentsResponse] = await Promise.all([
          axios.get('/matches'),
          axios.get('/incidents'),
        ])
        if (isMounted) {
          setMatches(matchesResponse.data)
          setIncidents(incidentsResponse.data)
        }
      } catch (error) {
        if (isMounted) {
          setMatches([])
          setIncidents([])
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

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => {
      const timeA = new Date(a.kickoff_time).getTime()
      const timeB = new Date(b.kickoff_time).getTime()
      return timeB - timeA
    })
  }, [matches])

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Match history</h1>
          <p className="mt-2 text-sm text-[#8b949e]">Completed fixtures with shared clips.</p>
        </div>
        {loading ? <LoadingSpinner text="" /> : null}
      </div>

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        {sortedMatches.length === 0 && !loading ? (
          <p className="text-sm text-[#8b949e]">No matches available.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0d1117] text-xs uppercase text-[#8b949e]">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Fixture</th>
                <th className="px-4 py-3">Competition</th>
                <th className="px-4 py-3">Clips</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedMatches.map((match) => {
                const clipCount = incidentsByMatch[match.id] || 0
                return (
                  <tr key={match.id} className="border-t border-[#30363d]">
                    <td className="px-4 py-3 text-[#8b949e]">{formatDate(match.kickoff_time)}</td>
                    <td className="px-4 py-3 text-white">{formatFixture(match)}</td>
                    <td className="px-4 py-3 text-[#8b949e]">League {match.league_id}</td>
                    <td className="px-4 py-3">
                      {clipCount > 0 ? (
                        <span className="rounded-full bg-[#00d4b4]/20 px-3 py-1 text-xs text-[#00d4b4]">
                          {clipCount}
                        </span>
                      ) : (
                        <span className="text-xs text-[#8b949e]">No clips</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {clipCount > 0 ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/viewer/clips?match_id=${match.id}`)}
                          className="text-[#00d4b4]"
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-[#8b949e]">No clips</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default MatchHistory