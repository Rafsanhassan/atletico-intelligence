import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Camera,
  Download,
  Lock,
  Paperclip,
  Trash2,
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const verdictCopy = {
  onside:
    'Attacking player is positioned behind the second-last defender at the moment the ball is played.',
  offside:
    'Attacking player is in an offside position at the moment the ball is played.',
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

const offenseRationale = [
  'Point of contact identified at frame #2405',
  'Last defender shoulder mapped',
  'Attacker trailing foot mapped',
  'Distance to goal line: Attacker +0.4m',
]

const goalRationale = [
  'Ball trajectory tracked',
  'Goal line barrier applied',
  'Full ball crossing confirmed',
  'Frame-accurate detection',
]

const profanityRegex = /\b(damn|shit|fuck|ass|crap)\b/i

const clampPercent = (value) => Math.min(100, Math.max(0, value))

const IncidentDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [incident, setIncident] = useState(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [noteError, setNoteError] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Main Cam')
  const [fieldView, setFieldView] = useState('Top-down')
  const [toastMessage, setToastMessage] = useState('')
  const [showAnnotated, setShowAnnotated] = useState(false)
  const [annotatedFrame, setAnnotatedFrame] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchIncident = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`/incidents/${id}`)
        if (isMounted) {
          setIncident(response.data)
          setNote(response.data.referee_note || '')
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
    if (!incident?.id) {
      setAnnotatedFrame(null)
      setShowAnnotated(false)
      return
    }
    const cached = localStorage.getItem(`annotated_frame_${incident.id}`)
    if (cached) {
      setAnnotatedFrame(cached)
      setShowAnnotated(true)
    } else {
      setAnnotatedFrame(null)
      setShowAnnotated(false)
    }
  }, [incident])

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 2000)
  }

  const confidenceScore = incident?.confidence_score ?? 0
  const confidencePercent = Math.round(confidenceScore * 100)
  const confidenceLabel = confidencePercent > 80 ? 'High' : confidencePercent > 65 ? 'Medium' : 'Low'
  const verdict = incident?.ai_verdict || 'review'
  const verdictColor = verdictColors[verdict] || '#f97316'
  const verdictText = verdict.toUpperCase()
  const description = verdictCopy[verdict] || verdictCopy.review
  const typeBadge = incident?.incident_type === 'goal_line' ? 'GL' : 'OS'

  const rationaleItems = incident?.incident_type === 'goal_line' ? goalRationale : offenseRationale

  const updateNote = (value) => {
    setNote(value)
    if (profanityRegex.test(value)) {
      setNoteError('Profanity not allowed')
    } else {
      setNoteError('')
    }
  }

  const handleSave = async (status) => {
    if (noteError) {
      return
    }
    setSaving(true)
    try {
      const response = await axios.put(`/incidents/${id}`, {
        referee_note: note,
        review_status: status,
      })
      setIncident(response.data)
      showToast(status === 'confirmed' ? 'Recommendation finalized' : 'Saved!')
    } catch (error) {
      setNoteError('Unable to save note.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/incidents/${id}`)
      navigate('/official/incidents')
    } catch (error) {
      showToast('Unable to delete incident')
    }
  }

  const renderFieldVisual = () => {
    if (!incident) {
      return null
    }

    const isGoal = incident.incident_type === 'goal_line'

    if (isGoal) {
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

  const signalScore = (delta) => clampPercent(Math.round(confidencePercent + delta))

  return (
    <div className="space-y-8 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[#8b949e]">
          <button
            type="button"
            onClick={() => navigate('/official/incidents')}
            className="flex items-center gap-2 text-sm text-[#8b949e] hover:text-white"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span className="rounded-full bg-[#161b22] px-3 py-1 text-xs text-white">{typeBadge}</span>
          <span className="text-white">{incident?.match_time || '--:--'}</span>
          <span className="text-white">Incident Detail</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-[#30363d] px-4 py-2 text-sm"
          >
            <Download size={16} /> Download Clip
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-[#ef4444] px-4 py-2 text-sm text-[#ef4444]"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
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
                <span className="flex items-center gap-2 rounded-full bg-[#30363d] px-3 py-1 text-white">
                  <Lock size={12} /> Frame Locked
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
              <h2 className="text-sm font-semibold text-white">AI Rationale</h2>
              <ul className="mt-3 space-y-2 text-xs text-[#8b949e]">
                {rationaleItems.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
              <div className="flex flex-wrap items-center gap-2 border-b border-[#30363d] pb-3 text-sm">
                {['Main Cam', 'AI Overlay'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-3 py-1 text-xs ${
                      activeTab === tab
                        ? 'bg-[#00d4b4] text-black'
                        : 'border border-[#30363d] text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {annotatedFrame && showAnnotated ? (
                <div className="relative mt-4 rounded-xl bg-[#0d1117] p-3">
                  <img
                    src={annotatedFrame}
                    alt="YOLO Analysis Frame"
                    className="w-full rounded-xl"
                    style={{ maxHeight: '400px', objectFit: 'contain', backgroundColor: '#000' }}
                  />
                  <div className="absolute top-3 right-3 bg-black/70 rounded-lg px-3 py-1">
                    <span className="text-teal-400 text-xs font-mono">
                      ● YOLO Detection Active
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 bg-black/70 rounded-lg px-3 py-1">
                    <span className="text-white text-xs font-mono">Frame #2405</span>
                  </div>
                </div>
              ) : (
                <div className="relative mt-4 flex h-72 flex-col items-center justify-center rounded-xl bg-[#0d1117]">
                  <span className="absolute right-3 top-3 rounded-full bg-[#161b22] px-3 py-1 text-xs text-[#8b949e]">
                    Frame #2405
                  </span>
                  <Camera size={28} className="text-[#6b7280]" />
                  <p className="mt-2 text-sm text-[#6b7280]">Stored clip playback (5-15s)</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">3D Positional Visual</h2>
                <div className="flex gap-2 text-xs">
                  {['Top-down', 'Perspective'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFieldView(option)}
                      className={`rounded-full px-3 py-1 ${
                        fieldView === option
                          ? 'bg-[#00d4b4] text-black'
                          : 'border border-[#30363d] text-white'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                {renderFieldVisual()}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8b949e]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#3b82f6]"></span>
                    Riverside FC (Attacking)
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#ef4444]"></span>
                    North End (Defending)
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Referee Notes</h2>
                <span className="rounded-full bg-[#30363d] px-3 py-1 text-xs text-white">
                  Status: {incident.review_status}
                </span>
              </div>
              <p className="mt-2 text-xs text-[#8b949e]">Optional · Max 300 characters · Profanity filtered</p>
              <textarea
                rows={4}
                maxLength={300}
                value={note}
                onChange={(event) => updateNote(event.target.value)}
                placeholder="Add referee note... (max 300 characters)"
                className="mt-4 w-full rounded-xl border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
              ></textarea>
              {noteError ? (
                <p className="mt-2 text-xs text-[#ef4444]">{noteError}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8b949e]">
                <span>{note.length} / 300</span>
                <button
                  type="button"
                  disabled
                  title="Available in full version"
                  className="flex items-center gap-2 text-[#6b7280]"
                >
                  <Paperclip size={14} /> Attach Clip
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={saving || Boolean(noteError)}
                  onClick={() => handleSave('pending')}
                  className="rounded-lg border border-[#30363d] px-4 py-2 text-sm disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  type="button"
                  disabled={saving || Boolean(noteError)}
                  onClick={() => handleSave('confirmed')}
                  className="rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Finalize Recommendation'}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
              <h2 className="text-sm font-semibold">Audit Trail</h2>
              <div className="mt-4 space-y-3 text-xs text-[#8b949e]">
                <p>o Just now - Note saved - by Current User</p>
                <p>o 2 min ago - AI verdict generated - System</p>
                <p>o {incident.match_time} - Incident flagged - AR-1</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#30363d] bg-[#161b22] p-5">
            <h2 className="text-sm font-semibold">AI Analysis Details</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                <h3 className="text-xs font-semibold text-white">Model Signals</h3>
                <div className="mt-3 space-y-3 text-xs text-[#8b949e]">
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Position Detection</span>
                      <span>{signalScore(3)}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[#161b22]">
                      <div className="h-2 rounded-full bg-[#00d4b4]" style={{ width: `${signalScore(3)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Contact Point</span>
                      <span>{signalScore(1)}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[#161b22]">
                      <div className="h-2 rounded-full bg-[#00d4b4]" style={{ width: `${signalScore(1)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span>Line Calibration</span>
                      <span>{signalScore(-1)}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[#161b22]">
                      <div className="h-2 rounded-full bg-[#00d4b4]" style={{ width: `${signalScore(-1)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                <h3 className="text-xs font-semibold text-white">Evidence Frames</h3>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-[#8b949e]">
                  <div className="rounded-lg border border-[#30363d] px-3 py-6">#2404</div>
                  <div className="rounded-lg border border-[#00d4b4] px-3 py-6 text-[#00d4b4]">
                    #2405
                    <span className="mt-2 block text-[10px] text-[#00d4b4]">Primary frame</span>
                  </div>
                  <div className="rounded-lg border border-[#30363d] px-3 py-6">#2406</div>
                </div>
                <p className="mt-3 text-xs text-[#8b949e]">Primary frame locked for analysis</p>
              </div>

              <div className="rounded-xl border border-[#30363d] bg-[#0d1117] p-4">
                <h3 className="text-xs font-semibold text-white">Measurement Data</h3>
                <div className="mt-3 space-y-3 text-xs text-[#8b949e]">
                  <div className="flex items-center justify-between">
                    <span>Distance from line</span>
                    <span className="text-white">+0.4m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Calibration error</span>
                    <span className="text-white">+/- 0.05m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Camera angle</span>
                    <span className="text-white">12 deg</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {toastMessage ? (
        <div className="fixed bottom-6 right-6 rounded-lg bg-[#0f1623] px-4 py-2 text-sm text-white shadow-lg">
          {toastMessage}
        </div>
      ) : null}
    </div>
  )
}

export default IncidentDetail