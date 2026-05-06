import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const typeStyles = {
  offside: 'bg-[#0b2b22] text-[#00d4b4]',
  goal_line: 'bg-[#0b1b33] text-[#3b82f6]',
}

const verdictStyles = {
  onside: 'text-[#00d4b4] bg-[#0b2b22]',
  goal: 'text-[#00d4b4] bg-[#0b2b22]',
  offside: 'text-[#ff7b72] bg-[#2a1515]',
  no_goal: 'text-[#ff7b72] bg-[#2a1515]',
  review: 'text-[#f97316] bg-[#2a1d12]',
}

const verdictColors = {
  onside: '#00d4b4',
  goal: '#00d4b4',
  offside: '#ff7b72',
  no_goal: '#ff7b72',
  review: '#f97316',
}

const statusLabels = {
  confirmed: { label: '✓ Confirmed', className: 'text-[#3fb950]' },
  pending: { label: '⏰ Pending Note', className: 'text-[#f59e0b]' },
  flagged: { label: '⚠ Flagged', className: 'text-[#ff7b72]' },
}

const defaultFilters = {
  type: 'all',
  verdict: 'all',
  minConfidence: 0,
}

const IncidentsLog = () => {
  const navigate = useNavigate()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState(defaultFilters.type)
  const [verdictFilter, setVerdictFilter] = useState(defaultFilters.verdict)
  const [confidenceMin, setConfidenceMin] = useState(defaultFilters.minConfidence)
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters)

  useEffect(() => {
    let isMounted = true

    const fetchIncidents = async () => {
      try {
        const response = await axios.get('/incidents/match/1')
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
    const intervalId = setInterval(fetchIncidents, 10000)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [])

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      if (appliedFilters.type !== 'all' && incident.incident_type !== appliedFilters.type) {
        return false
      }
      if (appliedFilters.verdict !== 'all' && incident.ai_verdict !== appliedFilters.verdict) {
        return false
      }
      if (incident.confidence_score !== null && incident.confidence_score !== undefined) {
        return incident.confidence_score * 100 >= appliedFilters.minConfidence
      }
      return appliedFilters.minConfidence === 0
    })
  }, [appliedFilters, incidents])

  const totalIncidents = incidents.length
  const highConfidence = incidents.filter((incident) => incident.confidence_score >= 0.8).length
  const pendingCount = incidents.filter(
    (incident) => incident.review_status === 'pending' || incident.review_status === 'flagged'
  ).length

  const handleReset = () => {
    setFilter(defaultFilters.type)
    setVerdictFilter(defaultFilters.verdict)
    setConfidenceMin(defaultFilters.minConfidence)
    setAppliedFilters(defaultFilters)
  }

  const handleApply = () => {
    setAppliedFilters({
      type: filter,
      verdict: verdictFilter,
      minConfidence: confidenceMin,
    })
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Incidents Log · Riverside FC vs North End</h2>
        <button
          type="button"
          onClick={() => navigate('/official/console')}
          className="rounded-lg border border-[#30363d] px-4 py-2 text-sm text-white"
        >
          ← Back to Console
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
          <p className="text-xs uppercase text-[#8b949e]">Total</p>
          <p className="mt-3 text-2xl font-semibold">{totalIncidents}</p>
        </div>
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
          <p className="text-xs uppercase text-[#8b949e]">High Confidence</p>
          <p className="mt-3 text-2xl font-semibold text-[#3fb950]">{highConfidence}</p>
        </div>
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
          <p className="text-xs uppercase text-[#8b949e]">Pending</p>
          <p className="mt-3 text-2xl font-semibold text-[#f59e0b]">{pendingCount}</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="appearance-none rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 pr-8 text-sm text-white"
            >
              <option value="all">All Types</option>
              <option value="offside">Offside</option>
              <option value="goal_line">Goal Line</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8b949e]"
            />
          </div>
          <div className="relative">
            <select
              value={verdictFilter}
              onChange={(event) => setVerdictFilter(event.target.value)}
              className="appearance-none rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 pr-8 text-sm text-white"
            >
              <option value="all">All Verdicts</option>
              <option value="onside">Onside</option>
              <option value="offside">Offside</option>
              <option value="goal">Goal</option>
              <option value="no_goal">No Goal</option>
              <option value="review">Review</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#8b949e]"
            />
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm">
            <span className="text-[#8b949e]">Confidence (Min %)</span>
            <input
              type="range"
              min="0"
              max="100"
              value={confidenceMin}
              onChange={(event) => setConfidenceMin(Number(event.target.value))}
            />
            <span className="text-xs text-[#8b949e]">{confidenceMin}%</span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-[#30363d] px-3 py-2 text-sm text-[#8b949e]"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg bg-[#00d4b4] px-3 py-2 text-sm font-semibold text-black"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Incident Timeline</h2>
          {loading ? <LoadingSpinner text="" /> : null}
        </div>

        {loading ? null : filteredIncidents.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[#30363d] bg-[#0d1117] p-6 text-center">
            <p className="text-sm text-[#9ca3af]">
              No incidents yet. Go to Live Console and trigger a review.
            </p>
            <button
              type="button"
              onClick={() => navigate('/official/console')}
              className="mt-4 rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black"
            >
              Go to Live Console
            </button>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-[#30363d]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0d1117] text-xs uppercase text-[#8b949e]">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Team/Player</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">AI Verdict + Confidence</th>
                  <th className="px-4 py-3">Review Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map((incident) => {
                  const typeClass = typeStyles[incident.incident_type] || 'bg-[#111827] text-[#9ca3af]'
                  const verdictClass = verdictStyles[incident.ai_verdict] || 'text-[#9ca3af]'
                  const verdictColor = verdictColors[incident.ai_verdict] || '#9ca3af'
                  const status = statusLabels[incident.review_status] || {
                    label: incident.review_status,
                    className: 'text-[#9ca3af]',
                  }
                  const confidence = Math.round((incident.confidence_score || 0) * 100)

                  return (
                    <tr key={incident.id} className="border-t border-[#30363d]">
                      <td className="px-4 py-4 text-[#8b949e]">{incident.match_time}</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs ${typeClass}`}>
                          {incident.incident_type === 'offside' ? 'OS' : 'GL'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-white">{incident.team_player}</td>
                      <td className="px-4 py-4 text-[#8b949e]">{incident.description}</td>
                      <td className="px-4 py-4">
                        <p className={`text-sm ${verdictClass}`}>{incident.ai_verdict}</p>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-[#0d1117]">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${confidence}%`,
                              backgroundColor: verdictColor,
                            }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-[#8b949e]">{confidence}% confidence</p>
                      </td>
                      <td className={`px-4 py-4 ${status.className}`}>{status.label}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => navigate(`/official/incidents/${incident.id}`)}
                          className="text-[#00d4b4]"
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default IncidentsLog
