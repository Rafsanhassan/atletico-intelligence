import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Plus, X } from 'lucide-react'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const statusStyles = {
  active: 'bg-[#3fb950]/20 text-[#3fb950]',
  inactive: 'bg-[#8b949e]/20 text-[#8b949e]',
}

const TeamsList = () => {
  const [teams, setTeams] = useState([])
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({ name: '', league_id: '', founded_year: '' })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setLoading(true)
      try {
        const [teamsResponse, leaguesResponse] = await Promise.all([
          axios.get('/teams'),
          axios.get('/leagues'),
        ])
        if (isMounted) {
          setTeams(teamsResponse.data)
          setLeagues(leaguesResponse.data)
          setError('')
        }
      } catch (fetchError) {
        if (isMounted) {
          setTeams([])
          setLeagues([])
          setError('Unable to load teams.')
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

  const leagueLookup = useMemo(() => {
    return leagues.reduce((acc, league) => {
      acc[league.id] = league.name
      return acc
    }, {})
  }, [leagues])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const closeModal = () => {
    setShowModal(false)
    setFormError('')
  }

  const handleCreate = async () => {
    setFormError('')

    if (!form.name || !form.league_id) {
      setFormError('Please enter a team name and league.')
      return
    }

    setSaving(true)

    try {
      const payload = {
        name: form.name,
        league_id: Number(form.league_id),
        founded_year: form.founded_year ? Number(form.founded_year) : null,
        status: 'active',
      }
      const response = await axios.post('/teams', payload)
      setTeams((prev) => [response.data, ...prev])
      setForm({ name: '', league_id: '', founded_year: '' })
      closeModal()
    } catch (submitError) {
      setFormError('Unable to create team.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Teams</h1>
          <p className="mt-2 text-sm text-[#8b949e]">Manage clubs and roster access.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black"
        >
          <Plus size={16} /> Create Team
        </button>
      </div>

      {loading ? <LoadingSpinner text="" /> : null}
      {error ? (
        <div className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#ff7b72]">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        {teams.length === 0 && !loading ? (
          <p className="text-sm text-[#8b949e]">No teams found.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#30363d]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0d1117] text-xs uppercase text-[#8b949e]">
                <tr>
                  <th className="px-4 py-3">Team</th>
                  <th className="px-4 py-3">League</th>
                  <th className="px-4 py-3">Founded</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id} className="border-t border-[#30363d]">
                    <td className="px-4 py-4 text-white">{team.name}</td>
                    <td className="px-4 py-4 text-[#8b949e]">{leagueLookup[team.league_id] || `League ${team.league_id}`}</td>
                    <td className="px-4 py-4 text-[#8b949e]">{team.founded_year || '--'}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          statusStyles[team.status] || statusStyles.inactive
                        }`}
                      >
                        {team.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/admin/teams/${team.id}`}
                        className="rounded-lg border border-[#30363d] p-2 text-[#8b949e] hover:text-white"
                      >
                        <Pencil size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#30363d] bg-[#161b22] p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create Team</h2>
              <button type="button" onClick={closeModal} className="text-[#8b949e]">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 grid gap-4">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Team name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange('name')}
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">League</label>
                <select
                  value={form.league_id}
                  onChange={handleChange('league_id')}
                  className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-white"
                >
                  <option value="">Select league</option>
                  {leagues.map((league) => (
                    <option key={league.id} value={league.id}>
                      {league.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Founded year</label>
                <input
                  type="number"
                  value={form.founded_year}
                  onChange={handleChange('founded_year')}
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

export default TeamsList
