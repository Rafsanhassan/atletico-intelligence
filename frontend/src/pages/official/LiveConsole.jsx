import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UploadCloud, X, CheckCircle2 } from 'lucide-react'
import api from '../../api/axios'

const BG = '#0d1117'
const CARD = '#161b22'
const BORDER = '#30363d'
const ACCENT = '#00d4b4'
const MUTED = '#8b949e'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const randomVerdict = (type) => {
  if (type === 'offside') {
    return Math.random() < 0.5 ? 'ONSIDE' : 'OFFSIDE'
  }
  return Math.random() < 0.5 ? 'GOAL' : 'NO GOAL'
}

export default function LiveConsole() {
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [localResult, setLocalResult] = useState(null) // { type, verdict, confidence }
  const [apiResult, setApiResult] = useState(null)
  const [apiError, setApiError] = useState(null)

  useEffect(() => {
    if (!videoUrl) return
    return () => URL.revokeObjectURL(videoUrl)
  }, [videoUrl])

  const canAnalyze = Boolean(videoUrl) && !isAnalyzing

  const modalTitle = useMemo(() => {
    if (!localResult) return 'Analysis'
    return localResult.type === 'offside' ? 'Offside Check' : 'Goal Check'
  }, [localResult])

  const onPickFile = (picked) => {
    if (!picked) return
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setFile(picked)
    setVideoUrl(URL.createObjectURL(picked))
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const picked = e.dataTransfer.files?.[0]
    onPickFile(picked)
  }

  const runAnalysis = async (type) => {
    if (!videoUrl) {
      window.alert('Please upload a video first.')
      return
    }

    setApiError(null)
    setApiResult(null)
    setLocalResult(null)
    setIsAnalyzing(true)
    setModalOpen(true)

    await sleep(2500)

    const verdict = randomVerdict(type)
    const confidence = randomInt(72, 98)
    setLocalResult({ type, verdict, confidence })

    const incidentType = type === 'offside' ? 'offside' : 'goal_line'

    try {
      const resp = await api.post('/incidents/analyze', {
        match_id: 1,
        incident_type: incidentType,
        match_time: '72:14',
        team_player: 'Riverside FC (J. Smith)',
        description: 'Through ball, marginal call',
      })
      setApiResult(resp.data)
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to analyze incident'
      setApiError(msg)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setIsAnalyzing(false)
    setLocalResult(null)
    setApiResult(null)
    setApiError(null)
  }

  return (
    <div style={{ backgroundColor: BG, minHeight: '100vh' }} className="p-6 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Live Match Console</h1>
        <p className="text-sm mt-1" style={{ color: MUTED }}>
          Upload a clip, trigger an incident check, and review the AI output.
        </p>
      </div>

      {/* Upload */}
      {!videoUrl ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className="rounded-xl p-10 text-center cursor-pointer"
          style={{
            backgroundColor: CARD,
            border: `2px dashed ${isDragging ? ACCENT : BORDER}`,
          }}
        >
          <UploadCloud size={56} style={{ color: MUTED }} className="mx-auto" />
          <p className="mt-4 text-sm" style={{ color: MUTED }}>
            Drop a video here or click to upload
          </p>
          <p className="mt-2 text-xs" style={{ color: MUTED }}>
            Accepts any <code>video/*</code> format your browser supports
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div
          className="rounded-xl p-4"
          style={{
            backgroundColor: CARD,
            border: `1px solid ${BORDER}`,
          }}
        >
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <p className="text-sm font-semibold">Loaded video</p>
              <p className="text-xs mt-1" style={{ color: MUTED }}>
                {file?.name || 'Untitled'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (videoUrl) URL.revokeObjectURL(videoUrl)
                setFile(null)
                setVideoUrl(null)
              }}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ backgroundColor: BG, border: `1px solid ${BORDER}`, color: 'white' }}
            >
              Change video
            </button>
          </div>

          <video src={videoUrl} controls className="w-full rounded-lg bg-black" style={{ maxHeight: 520 }} />
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <button
          type="button"
          disabled={!canAnalyze}
          onClick={() => runAnalysis('offside')}
          className="rounded-xl p-6 text-left disabled:opacity-60"
          style={{ backgroundColor: CARD, border: `2px solid ${ACCENT}` }}
        >
          <div className="text-xs font-bold" style={{ color: ACCENT }}>
            OS
          </div>
          <div className="text-xl font-bold mt-2">OS - Offside Check</div>
          <div className="text-sm mt-1" style={{ color: MUTED }}>
            Analyze attacker vs last defender alignment
          </div>
        </button>

        <button
          type="button"
          disabled={!canAnalyze}
          onClick={() => runAnalysis('goal')}
          className="rounded-xl p-6 text-left disabled:opacity-60"
          style={{ backgroundColor: CARD, border: `2px solid ${BORDER}` }}
        >
          <div className="text-xs font-bold" style={{ color: '#3b82f6' }}>
            GL
          </div>
          <div className="text-xl font-bold mt-2">GL - Goal Check</div>
          <div className="text-sm mt-1" style={{ color: MUTED }}>
            Determine if the ball fully crossed the line
          </div>
        </button>
      </div>

      {/* Modal + overlay */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.72)' }}>
          <div
            className="w-full max-w-lg rounded-xl p-6"
            style={{ backgroundColor: CARD, border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{modalTitle}</h2>
                <p className="text-xs mt-1" style={{ color: MUTED }}>
                  Match time: 72:14 · Riverside FC (J. Smith)
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2"
                style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {isAnalyzing ? (
              <div className="mt-6 text-center">
                <div className="mx-auto h-14 w-14 rounded-full animate-spin" style={{ border: `4px solid ${ACCENT}`, borderTopColor: 'transparent' }} />
                <p className="mt-4 font-semibold">Analyzing incident…</p>
                <p className="text-sm mt-1" style={{ color: MUTED }}>
                  Running AI model and syncing to backend
                </p>
              </div>
            ) : (
              <div className="mt-6">
                {localResult ? (
                  <div
                    className="rounded-lg p-4 mb-4"
                    style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs" style={{ color: MUTED }}>
                          Local verdict (mock)
                        </p>
                        <p className="text-2xl font-bold mt-1" style={{ color: ACCENT }}>
                          {localResult.verdict}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: MUTED }}>
                          Confidence
                        </p>
                        <p className="text-xl font-bold mt-1">{localResult.confidence}%</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-lg p-4" style={{ backgroundColor: BG, border: `1px solid ${BORDER}` }}>
                  <p className="text-xs" style={{ color: MUTED }}>
                    Backend result (`POST /incidents/analyze`)
                  </p>

                  {apiError ? (
                    <p className="text-sm mt-2" style={{ color: '#ef4444' }}>
                      {apiError}
                    </p>
                  ) : apiResult ? (
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} style={{ color: ACCENT }} />
                        <span className="font-semibold">Incident created</span>
                        <span style={{ color: MUTED }}>#{apiResult.id}</span>
                      </div>
                      <div style={{ color: MUTED }}>
                        <div>ai_verdict: <span style={{ color: 'white' }}>{String(apiResult.ai_verdict)}</span></div>
                        <div>confidence_score: <span style={{ color: 'white' }}>{String(apiResult.confidence_score)}</span></div>
                        <div>review_status: <span style={{ color: 'white' }}>{String(apiResult.review_status)}</span></div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm mt-2" style={{ color: MUTED }}>
                      No response received.
                    </p>
                  )}
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    disabled={!apiResult?.id}
                    onClick={() => navigate(`/official/incidents/${apiResult.id}`)}
                    className="rounded-lg px-4 py-2 font-semibold text-black disabled:opacity-60"
                    style={{ backgroundColor: ACCENT }}
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-lg px-4 py-2"
                    style={{ backgroundColor: BG, border: `1px solid ${BORDER}`, color: 'white' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}