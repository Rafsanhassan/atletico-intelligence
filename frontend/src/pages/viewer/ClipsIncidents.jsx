import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const typeStyles = {
  offside: 'bg-[#0b2b22] text-[#00d4b4]',
  goal_line: 'bg-[#0b1b33] text-[#3b82f6]',
}

const verdictColors = {
  onside: 'text-[#00d4b4]',
  goal: 'text-[#00d4b4]',
  offside: 'text-[#ef4444]',
  no_goal: 'text-[#ef4444]',
  review: 'text-[#f97316]',
}

const confidenceLabel = (score) => {
  if (score > 0.8) {
    return 'High'
  }
  if (score > 0.65) {
    return 'Med'
  }
  return 'Low'
}

const ClipsIncidents = () => {
  const [searchParams] = useSearchParams()
  const matchId = Number(searchParams.get('match_id')) || null
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchIncidents = async () => {
      if (!matchId) {
        setLoading(false)
        setIncidents([])
        return
      }

      setLoading(true)
      try {
        const response = await axios.get(`/incidents/match/${matchId}`)
        if (isMounted) {
          setIncidents(response.data)
        }
      } catch (error) {
        if (isMounted) {
          setIncidents([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchIncidents()

    return () => {
      isMounted = false
    }
  }, [matchId])

  const sortedIncidents = useMemo(() => {
    return [...incidents].sort((a, b) => b.id - a.id)
  }, [incidents])

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Clips and incidents</h1>
          <p className="mt-2 text-sm text-[#8b949e]">Approved for your club, read-only.</p>
        </div>
        {loading ? <LoadingSpinner text="" /> : null}
      </div>

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4 text-sm text-[#8b949e]">
        {matchId ? `Showing match ${matchId}` : 'Select a match from history to view incidents.'}
      </div>

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        {sortedIncidents.length === 0 && !loading ? (
          <p className="text-sm text-[#8b949e]">No incidents available for this match.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0d1117] text-xs uppercase text-[#8b949e]">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Match Time</th>
                <th className="px-4 py-3">AI Verdict</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedIncidents.map((incident) => {
                const typeClass = typeStyles[incident.incident_type] || 'bg-[#111827] text-[#9ca3af]'
                const verdictClass = verdictColors[incident.ai_verdict] || 'text-[#9ca3af]'
                const confidence = confidenceLabel(incident.confidence_score || 0)

                return (
                  <tr key={incident.id} className="border-t border-[#30363d]">
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs ${typeClass}`}>
                        {incident.incident_type === 'offside' ? 'OS' : 'GL'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#8b949e]">{incident.match_time}</td>
                    <td className={`px-4 py-3 ${verdictClass}`}>{incident.ai_verdict}</td>
                    <td className="px-4 py-3 text-white">{confidence}</td>
                    <td className="px-4 py-3">
                      <Link to={`/viewer/incident/${incident.id}`} className="text-[#00d4b4]">
                        Open
                      </Link>
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

export default ClipsIncidents