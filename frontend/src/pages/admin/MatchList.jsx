import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const statusStyles = {
  not_started: 'bg-[#8b949e]/20 text-[#8b949e]',
  upload: 'bg-[#3b82f6]/20 text-[#3b82f6]',
  live_stream: 'bg-[#3fb950]/20 text-[#3fb950] animate-pulse',
}

const statusLabels = {
  not_started: 'Not started',
  upload: 'Uploaded',
  live_stream: 'Live stream',
}

const formatKickoff = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '--'
  }
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const MatchList = () => {
  const [matches, setMatches] = useState([])
  const [incidents, setIncidents] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    home_team_id: '',
    away_team_id: '',
    kickoff_time: '',
    venue: '',
  })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setLoading(true)
      try {
        const [matchesResponse, incidentsResponse, teamsResponse] = await Promise.all([
          axios.get('/matches'),
          axios.get('/incidents'),
          axios.get('/teams'),
        ])
        if (isMounted) {
          setMatches(matchesResponse.data)
          setIncidents(incidentsResponse.data)
          setTeams(teamsResponse.data)
          setError('')
        }
      } catch (fetchError) {
        if (isMounted) {
          setError('Unable to load matches.')
          setMatches([])
          setIncidents([])
          setTeams([])
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

  const teamLookup = useMemo(() => {
    return teams.reduce((acc, team) => {
      acc[team.id] = team.name
      return acc
    }, {})
  }, [teams])

  const incidentsByMatch = useMemo(() => {
    return incidents.reduce((acc, incident) => {
      acc[incident.match_id] = (acc[incident.match_id] || 0) + 1
      return acc
    }, {})
  }, [incidents])

  const sortedMatches = useMemo(() => {
    return [...matches].sort((a, b) => new Date(b.kickoff_time) - new Date(a.kickoff_time))
  }, [matches])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const closeModal = () => {
    setShowModal(false)
    setFormError('')
  }

  const handleCreate = async () => {
    setFormError('')

    if (!form.home_team_id || !form.away_team_id || !form.kickoff_time) {
      setFormError('Please fill all required fields.')
      return
    }

    if (form.home_team_id === form.away_team_id) {
      setFormError('Home and away teams must be different.')
      return
    }

    const homeTeam = teams.find((team) => team.id === Number(form.home_team_id))
    const awayTeam = teams.find((team) => team.id === Number(form.away_team_id))
    const leagueId = homeTeam?.league_id || awayTeam?.league_id

    if (!leagueId) {
      setFormError('League could not be determined for the selected teams.')
      return
    }

    setSaving(true)

    try {
      const payload = {
        league_id: leagueId,
        home_team_id: Number(form.home_team_id),
        away_team_id: Number(form.away_team_id),
        kickoff_time: form.kickoff_time,
        venue: form.venue,
        status: 'scheduled',
        video_status: 'not_started',
        home_score: 0,
        away_score: 0,
      }

      const response = await axios.post('/matches', payload)
      setMatches((prev) => [response.data, ...prev])
      setForm({ home_team_id: '', away_team_id: '', kickoff_time: '', venue: '' })
      closeModal()
    } catch (submitError) {
      setFormError('Unable to create match.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Matches</h1>
          <p className="mt-2 text-sm text-[#8b949e]">Manage fixtures and video status.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black"
        >
          <Plus size={16} /> Create Match
        </button>
      </div>

      {loading ? <LoadingSpinner text="" /> : null}
      {error ? (
        <div className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#ff7b72]">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        {sortedMatches.length === 0 && !loading ? (
          <p className="text-sm text-[#8b949e]">No matches found.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#30363d]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0d1117] text-xs uppercase text-[#8b949e]">
                <tr>
                  <th className="px-4 py-3">Kickoff</th>
                  <th className="px-4 py-3">Teams</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Official</th>
                  <th className="px-4 py-3">Video Status</th>
                  <th className="px-4 py-3">Incidents</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedMatches.map((match) => {
                  const homeName = teamLookup[match.home_team_id] || `Team ${match.home_team_id}`
                  const awayName = teamLookup[match.away_team_id] || `Team ${match.away_team_id}`
                  const incidentCount = incidentsByMatch[match.id] || 0
                  const statusClass = statusStyles[match.video_status] || statusStyles.not_started
                  const statusLabel = statusLabels[match.video_status] || 'Not started'

                  return (
                    <tr key={match.id} className="border-t border-[#30363d]">
                      <td className="px-4 py-4 text-[#8b949e]">{formatKickoff(match.kickoff_time)}</td>
                      <td className="px-4 py-4 text-white">{homeName} vs {awayName}</td>
                      <td className="px-4 py-4 text-[#8b949e]">{match.venue || '--'}</td>
                      <td className="px-4 py-4 text-[#8b949e]">
                        {match.official_id ? `Official ${match.official_id}` : 'Unassigned'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs ${statusClass}`}>{statusLabel}</span>
                      </td>
                      <td className="px-4 py-4 text-[#8b949e]">{incidentCount}</td>
                      <td className="px-4 py-4">
                        <Link to={`/admin/matches/${match.id}`} className="text-[#00d4b4]">
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#30363d] bg-[#161b22] p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Match</h2>
              <button type="button" onClick={closeModal} className="text-[#8b949e]">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 grid gap-4">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Home team</label>
                <select
                  value={form.home_team_id}
                  onChange={handleChange('home_team_id')}
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-white"
                >
                  <option value="">Select home team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Away team</label>
                <select
                  value={form.away_team_id}
                  onChange={handleChange('away_team_id')}
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-white"
                >
                  <option value="">Select away team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Kickoff time</label>
                <input
                  type="datetime-local"
                  value={form.kickoff_time}
                  onChange={handleChange('kickoff_time')}
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Venue</label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={handleChange('venue')}
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-white"
                />
              </div>
            </div>
            {formError ? (
              <p className="mt-4 text-sm text-[#ff7b72]">{formError}</p>
            ) : null}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-[#30363d] px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={saving}
                className="rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default MatchList