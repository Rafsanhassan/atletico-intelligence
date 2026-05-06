import { useEffect, useMemo, useState } from 'react'
import { Eye, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const statusStyles = {
  active: 'bg-[#3fb950]/20 text-[#3fb950]',
  draft: 'bg-[#f59e0b]/20 text-[#f59e0b]',
  archived: 'bg-[#8b949e]/20 text-[#8b949e]',
}

const formatSeason = (start, end) => {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const startYear = Number.isNaN(startDate.getTime()) ? '' : startDate.getFullYear()
  const endYear = Number.isNaN(endDate.getTime()) ? '' : endDate.getFullYear()

  if (startYear && endYear) {
    return `${startYear}-${endYear}`
  }
  if (startYear) {
    return `${startYear}`
  }
  return '--'
}

const LeaguesList = () => {
  const [leagues, setLeagues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchLeagues = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/leagues')
        if (isMounted) {
          setLeagues(response.data)
          setError('')
        }
      } catch (fetchError) {
        if (isMounted) {
          setLeagues([])
          setError('Unable to load leagues.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchLeagues()

    return () => {
      isMounted = false
    }
  }, [])

  const sortedLeagues = useMemo(() => {
    return [...leagues].sort((a, b) => a.name.localeCompare(b.name))
  }, [leagues])

  const handleDelete = async (leagueId) => {
    const confirmed = window.confirm('Delete this league?')
    if (!confirmed) {
      return
    }

    setDeletingId(leagueId)
    setActionError('')

    try {
      await axios.delete(`/leagues/${leagueId}`)
      setLeagues((prev) => prev.filter((league) => league.id !== leagueId))
    } catch (deleteError) {
      setActionError('Unable to delete league.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Leagues</h1>
          <p className="mt-2 text-sm text-[#8b949e]">Manage leagues and seasons.</p>
        </div>
        <Link
          to="/admin/leagues/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#00d4b4] px-4 py-2 text-sm font-semibold text-black"
        >
          <Plus size={16} /> New League
        </Link>
      </div>

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Leagues ({leagues.length})</h2>
          {loading ? <LoadingSpinner text="" /> : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#ff7b72]">
            {error}
          </div>
        ) : null}

        {actionError ? (
          <div className="mt-4 rounded-lg border border-[#30363d] bg-[#0d1117] px-4 py-2 text-sm text-[#ff7b72]">
            {actionError}
          </div>
        ) : null}

        {sortedLeagues.length === 0 && !loading ? (
          <div className="mt-6 rounded-xl border border-[#30363d] bg-[#0d1117] p-6 text-sm text-[#8b949e]">
            No leagues found. Create a new league to get started.
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-xl border border-[#30363d]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0d1117] text-xs uppercase text-[#8b949e]">
                <tr>
                  <th className="px-4 py-3">League</th>
                  <th className="px-4 py-3">Season</th>
                  <th className="px-4 py-3">Teams</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeagues.map((league) => (
                  <tr key={league.id} className="border-t border-[#30363d]">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-white">{league.name}</p>
                      {league.description ? (
                        <p className="text-xs text-[#8b949e]">{league.description}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-[#8b949e]">
                      {formatSeason(league.season_start, league.season_end)}
                    </td>
                    <td className="px-4 py-4 text-[#8b949e]">{league.num_teams}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          statusStyles[league.status] || statusStyles.archived
                        }`}
                      >
                        {league.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/leagues/${league.id}`}
                          className="rounded-lg border border-[#30363d] p-2 text-[#8b949e] hover:text-white"
                        >
                          <Eye size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(league.id)}
                          disabled={deletingId === league.id}
                          className="rounded-lg border border-[#30363d] p-2 text-[#ff7b72] hover:text-white disabled:opacity-60"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaguesList
