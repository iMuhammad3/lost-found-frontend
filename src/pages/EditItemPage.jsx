import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { CATEGORIES } from '../constants/categories'
import Navbar from '../components/NavBar'

export default function EditItemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => apiClient(`/api/items/${id}`),
  })

  // Pre-fill the form once item loads
  useEffect(() => {
    if (item) {
      setForm({
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location,
        status: item.status,
      })
    }
  }, [item])

  const { mutate, isPending } = useMutation({
    mutationFn: () => apiClient(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(form),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      queryClient.invalidateQueries({ queryKey: ['item', id] })
      navigate(`/items/${id}`)
    },
    onError: (err) => setError(err.message),
  })

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSubmit = e => { e.preventDefault(); setError(''); mutate() }

  if (isLoading || !form) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-muted text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base">
      <Navbar title="Edit Item" backPath={`/items/${id}`} />

      <main className="max-w-lg mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 space-y-4">

          {error && <p className="text-lost text-sm">{error}</p>}

          {/* Status toggle */}
          <div className="flex rounded-lg overflow-hidden border border-border">
            {['lost', 'found'].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, status: s }))}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  form.status === s
                    ? s === 'lost' ? 'bg-red-950 text-lost' : 'bg-green-950 text-found'
                    : 'bg-surface text-muted hover:text-primary'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-secondary text-sm">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-elevated border border-border text-primary placeholder-muted text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-secondary text-sm">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full bg-elevated border border-border text-primary placeholder-muted text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-secondary text-sm">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full bg-elevated border border-border text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-secondary text-sm">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full bg-elevated border border-border text-primary placeholder-muted text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-accent hover:bg-accent-hover text-base font-medium text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>

        </form>
      </main>
    </div>
  )
}