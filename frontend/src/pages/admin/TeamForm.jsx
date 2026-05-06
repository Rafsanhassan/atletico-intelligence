import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const TeamForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    league_id: '',
    founded_year: '',
    manager: '',
    stadium: '',
    contact_email: '',
    notes: '',
    status: 'active',
  })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setLoading(true)
      try {
        const [leagueResponse, teamResponse] = await Promise.all([
          axios.get('/leagues'),
          axios.get(`/teams/${id}`),
        ])
        if (isMounted) {
          setLeagues(leagueResponse.data)
          setForm({
            name: teamResponse.data.name || '',
            league_id: teamResponse.data.league_id || '',
            founded_year: teamResponse.data.founded_year || '',
            manager: teamResponse.data.manager || '',
            stadium: teamResponse.data.stadium || '',
            contact_email: teamResponse.data.contact_email || '',
            notes: teamResponse.data.notes || '',
            status: teamResponse.data.status || 'active',
          })
          setError('')
        }
      } catch (fetchError) {
        if (isMounted) {
          setError('Unable to load team details.')
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
  }, [id])

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const payload = {
        name: form.name,
        league_id: Number(form.league_id),
        founded_year: form.founded_year ? Number(form.founded_year) : null,
        manager: form.manager || null,
        stadium: form.stadium || null,
        contact_email: form.contact_email || null,
        notes: form.notes || null,
        status: form.status,
      }
      await axios.put(`/teams/${id}`, payload)
      navigate('/admin/teams')
    } catch (submitError) {
      setError('Unable to save team.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this team?')
    if (!confirmed) {
      return
    }

    try {
      await axios.delete(`/teams/${id}`)
      navigate('/admin/teams')
    } catch (deleteError) {
      setError('Unable to delete team.')
    }
  }

  return (
    <div className="space-y-6 text-white">
      <div>
        <button type="button" onClick={() => navigate('/admin/teams')} className="text-sm text-[#8b949e]">
          Back to teams
        </button>
        <h1 className="mt-2 text-2xl font-semibold">Edit Team</h1>
        <p className="mt-2 text-sm text-[#8b949e]">Update team information and settings.</p>
      </div>

      {loading ? <LoadingSpinner text="Loading team..." className="justify-start" /> : null}
      {error ? (
        <div className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-[#ff7b72]">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Team name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">League</label>
            <select
              value={form.league_id}
              onChange={handleChange('league_id')}
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
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
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Status</label>
            <select
              value={form.status}
              onChange={handleChange('status')}
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Manager</label>
            <input
              type="text"
              value={form.manager}
              onChange={handleChange('manager')}
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Stadium</label>
            <input
              type="text"
              value={form.stadium}
              onChange={handleChange('stadium')}
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Contact email</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={handleChange('contact_email')}
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={handleChange('notes')}
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-[#ff7b72] px-4 py-2 text-sm text-[#ff7b72]"
          >
            Delete Team
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/teams')}
              className="rounded-lg border border-[#30363d] px-4 py-2 text-sm text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamForm
