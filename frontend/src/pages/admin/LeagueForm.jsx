import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { useToast } from '../../contexts/ToastContext'

const defaultForm = {
  name: '',
  season_start: '',
  season_end: '',
  description: '',
  format_type: 'Round robin',
  num_teams: 12,
  half_length: 45,
  extra_time: 15,
  ai_review_enabled: true,
  var_protocol: true,
  status: 'active',
}

const normalizeDate = (value) => (value ? value.split('T')[0] : '')

const LeagueForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const isEditMode = Boolean(id)
  const [form, setForm] = useState(defaultForm)
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditMode) {
      setLoading(false)
      return
    }

    let isMounted = true

    const fetchLeague = async () => {
      try {
        const response = await axios.get(`/leagues/${id}`)
        if (!isMounted) {
          return
        }
        const data = response.data
        setForm({
          ...defaultForm,
          ...data,
          season_start: normalizeDate(data.season_start),
          season_end: normalizeDate(data.season_end),
        })
      } catch (fetchError) {
        if (isMounted) {
          setError('Unable to load league details.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchLeague()

    return () => {
      isMounted = false
    }
  }, [id, isEditMode])

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      const payload = {
        ...form,
        num_teams: Number(form.num_teams),
        half_length: Number(form.half_length),
        extra_time: Number(form.extra_time),
      }

      if (isEditMode) {
        await axios.put(`/leagues/${id}`, payload)
      } else {
        await axios.post('/leagues', payload)
      }

      addToast('League saved successfully.')
      navigate('/admin/leagues')
    } catch (submitError) {
      setError('Unable to save league. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-semibold">{isEditMode ? 'Edit League' : 'Create League'}</h1>
        <p className="mt-2 text-sm text-[#8b949e]">Configure league details.</p>
      </div>

      {loading ? <LoadingSpinner text="Loading league..." className="justify-start" /> : null}

      {error ? (
        <div className="rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-[#ff7b72]">
          {error}
        </div>
      ) : null}

      <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">League name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              required
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Season start</label>
            <input
              type="date"
              value={form.season_start}
              onChange={handleChange('season_start')}
              required
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Season end</label>
            <input
              type="date"
              value={form.season_end}
              onChange={handleChange('season_end')}
              required
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Format</label>
            <input
              type="text"
              value={form.format_type}
              onChange={handleChange('format_type')}
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Teams</label>
            <input
              type="number"
              value={form.num_teams}
              onChange={handleChange('num_teams')}
              min="2"
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
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Half length (minutes)</label>
            <input
              type="number"
              value={form.half_length}
              onChange={handleChange('half_length')}
              min="1"
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Extra time (minutes)</label>
            <input
              type="number"
              value={form.extra_time}
              onChange={handleChange('extra_time')}
              min="0"
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#8b949e]">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={handleChange('description')}
              className="mt-2 w-full rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-3 text-sm text-white"
            ></textarea>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#8b949e]">
            <input
              id="ai_review_enabled"
              type="checkbox"
              checked={form.ai_review_enabled}
              onChange={handleChange('ai_review_enabled')}
            />
            <label htmlFor="ai_review_enabled">Enable AI review</label>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#8b949e]">
            <input
              id="var_protocol"
              type="checkbox"
              checked={form.var_protocol}
              onChange={handleChange('var_protocol')}
            />
            <label htmlFor="var_protocol">Enable VAR protocol</label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/leagues')}
            className="rounded-lg border border-[#30363d] px-4 py-2 text-sm text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save League'}
          </button>
        </div>
      </section>
    </form>
  )
}

export default LeagueForm
