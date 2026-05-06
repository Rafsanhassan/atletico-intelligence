import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Download } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const verdictCopy = {
  onside:
    'Attacking player is positioned behind the second-last defender at the moment the ball is played.',
  offside: 'Attacking player is in an offside position at the moment the ball is played.',
  goal: 'Ball has fully crossed the goal line. Goal confirmed.',
  no_goal: 'Ball has not fully crossed the goal line. No goal.',
  review: 'AI confidence too low for automatic verdict. Manual review required.',
}

const verdictColors = {
  onside: '#00d4b4',
  goal: '#00d4b4',
  offside: '#ef4444',
  no_goal: '#ef4444',
  review: '#f97316',
}

const IncidentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [incident, setIncident] = useState(null)
  const [incidentList, setIncidentList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchIncident = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/incidents/${id}`)
        if (isMounted) {
          setIncident(response.data)
        }
      } catch (error) {
        if (isMounted) {
          setIncident(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (id) {
      fetchIncident()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    let isMounted = true

    const fetchList = async () => {
      if (!incident?.match_id) {
        return
      }
      try {
        const response = await axios.get(`/incidents/match/${incident.match_id}`)
        if (isMounted) {
          setIncidentList(response.data)
        }
      } catch (error) {
        if (isMounted) {
          setIncidentList([])
        }
      }
    }

    fetchList()

    return () => {
      isMounted = false
    }
  }, [incident?.match_id])

  const sortedList = useMemo(() => {
    return [...incidentList].sort((a, b) => a.id - b.id)
  }, [incidentList])

  const currentIndex = sortedList.findIndex((item) => item.id === incident?.id)
  const prevIncident = currentIndex > 0 ? sortedList[currentIndex - 1] : null
  const nextIncident = currentIndex >= 0 && currentIndex < sortedList.length - 1
    ? sortedList[currentIndex + 1]
    : null

  const confidencePercent = Math.round((incident?.confidence_score || 0) * 100)
  const confidenceLabel = confidencePercent > 80 ? 'High' : confidencePercent > 65 ? 'Medium' : 'Low'
  const verdict = incident?.ai_verdict || 'review'
  const verdictColor = verdictColors[verdict] || '#f97316'
  const verdictText = verdict.toUpperCase()
  const description = verdictCopy[verdict] || verdictCopy.review
  const typeBadge = incident?.incident_type === 'goal_line' ? 'GL' : 'OS'

  const renderFieldVisual = () => {
    if (!incident) {
      return null
    }

    if (incident.incident_type === 'goal_line') {
      const ballX = verdict === 'goal' ? 265 : 255
      return (
        <svg width="100%" viewBox="0 0 300 200">
          <rect x="0" y="0" width="300" height="200" fill="#1a3a1a" />
          <rect x="10" y="10" width="280" height="180" fill="none" stroke="#ffffff" opacity="0.3" />
          <rect x="210" y="60" width="80" height="80" fill="none" stroke="#ffffff" opacity="0.3" />
          <rect x="240" y="80" width="50" height="40" fill="none" stroke="#ffffff" opacity="0.3" />
          <rect x="260" y="75" width="10" height="50" fill="#ffffff" opacity="0.5" />
          <line x1="260" y1="75" x2="260" y2="125" stroke="#ef4444" strokeWidth="2" />
          <circle cx={ballX} cy="100" r="10" fill="#f5f5f5" />
        </svg>
      )
    }

    const attackerAhead = verdict === 'offside'
    const attackerX = attackerAhead ? 215 : 185

    return (
      <svg width="100%" viewBox="0 0 300 200">
        <rect x="0" y="0" width="300" height="200" fill="#1a3a1a" />
        <rect x="10" y="10" width="280" height="180" fill="none" stroke="#ffffff" opacity="0.3" />
        <circle cx="150" cy="100" r="30" fill="none" stroke="#ffffff" opacity="0.3" />
        <rect x="210" y="60" width="80" height="80" fill="none" stroke="#ffffff" opacity="0.3" />
        <rect x="240" y="80" width="50" height="40" fill="none" stroke="#ffffff" opacity="0.3" />
        <line x1="200" y1="0" x2="200" y2="200" stroke="#ef4444" strokeDasharray="5,5" />
        <circle cx="200" cy="100" r="12" fill="#ef4444" />
        <text x="193" y="104" fontSize="8" fill="#ffffff">
          DEF
        </text>
        <circle cx={attackerX} cy="90" r="12" fill="#3b82f6" />
        <text x={attackerX - 6} y="94" fontSize="8" fill="#ffffff">
          ATT
        </text>
        <line x1="150" y1="150" x2={attackerX} y2="90" stroke="#3b82f6" strokeDasharray="5,5" />
        <line x1="160" y1="140" x2="200" y2="100" stroke="#ef4444" strokeDasharray="5,5" />
      </svg>
    )
  }

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#8b949e]">
          <button
            type="button"
            onClick={() => navigate(`/viewer/clips?match_id=${incident?.match_id || ''}`)}
            className="flex items-center gap-2 text-sm text-[#8b949e] hover:text-white"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span className="rounded-full bg-[#161b22] px-3 py-1 text-xs text-white">{typeBadge}</span>
          <span className="text-white">{incident?.match_time || '--:--'}</span>
          <span className="text-white">Incident Detail</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[#30363d] px-4 py-2 text-sm"
        >
          <Download size={16} /> Download Clip
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6">
          <LoadingSpinner text="Loading incident..." />
        </div>
      ) : !incident ? (
        <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-6 text-sm text-[#9ca3af]">
          Incident not found.
        </div>
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div>
              <h1 className="text-3xl font-semibold" style={{ color: verdictColor }}>
                {verdictText}
              </h1>
              <p className="mt-3 text-sm text-[#8b949e]">{description}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                <span className="rounded-full bg-[#0b2b22] px-3 py-1 text-[#00d4b4]">
                  Confidence: {confidencePercent}% {confidenceLabel}
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
              <h2 className="text-sm font-semibold text-white">Referee Note</h2>
              <p className="mt-3 text-xs text-[#8b949e]">
                {incident.referee_note || 'No referee note provided.'}
              </p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
              <div className="relative mt-2 h-72 rounded-xl border border-[#30363d] bg-black"></div>
              <div className="mt-4 flex items-center justify-between text-xs text-[#8b949e]">
                <span>Stored clip playback (5-15s)</span>
                <span>Frame #2405</span>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-[#8b949e]">
                {prevIncident ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/viewer/incident/${prevIncident.id}`)}
                    className="text-[#00d4b4]"
                  >
                    <- Previous clip ({prevIncident.match_time})
                  </button>
                ) : (
                  <span className="text-[#6b7280]">No previous clip</span>
                )}
                {nextIncident ? (
                  <button
                    type="button"
                    onClick={() => navigate(`/viewer/incident/${nextIncident.id}`)}
                    className="text-[#00d4b4]"
                  >
                    Next clip ({nextIncident.match_time}) ->
                  </button>
                ) : (
                  <span className="text-[#6b7280]">No next clip</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
              <h2 className="text-sm font-semibold">3D Positional Visual</h2>
              <div className="mt-4 rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                {renderFieldVisual()}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8b949e]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#3b82f6]"></span>
                    Home (Attacking)
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#ef4444]"></span>
                    Away (Defending)
                  </span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default IncidentDetail