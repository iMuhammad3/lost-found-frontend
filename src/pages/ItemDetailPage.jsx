import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { useAuth } from '../context/useAuth'
import { useState } from 'react'
import Navbar from '../components/NavBar'

export default function ItemDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => apiClient(`/api/items/${id}`),
  })

  const { mutate: deleteItem, isPending: isDeleting } = useMutation({
    mutationFn: () => apiClient(`/api/items/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      navigate('/')
    },
  })

  const { mutate: markRecovered } = useMutation({
    mutationFn: () => apiClient(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ recovery_status: 'recovered' }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', id] })
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-muted text-sm">Loading...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-muted text-sm">Item not found.</p>
      </div>
    )
  }

  const isOwner = user?.id === item.user_id
  const isRecovered = item.recovery_status === 'recovered'

  return (
    <div className="min-h-screen bg-base">

      <Navbar title="Item Details" backPath={`/`} />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Image */}
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-64 object-cover rounded-xl border border-border"
        />

        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                item.status === 'lost' ? 'bg-red-950 text-lost' : 'bg-green-950 text-found'
              }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
              {isRecovered && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-950 text-recovered">
                  ✓ Recovered
                </span>
              )}
              <span className="text-muted text-xs">{item.category}</span>
            </div>
            <h1 className="text-xl font-semibold text-primary">{item.title}</h1>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate(`/items/${id}/edit`)}
                className="text-sm text-secondary hover:text-primary border border-border hover:border-subtle px-3 py-1.5 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-sm text-lost hover:text-red-300 border border-red-950 hover:border-red-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Details card */}
        <div className="bg-surface border border-border rounded-xl divide-y divide-border">

          <div className="px-4 py-3 flex justify-between">
            <span className="text-muted text-sm">Location</span>
            <span className="text-primary text-sm">📍 {item.location}</span>
          </div>

          <div className="px-4 py-3 flex justify-between">
            <span className="text-muted text-sm">Category</span>
            <span className="text-primary text-sm">{item.category}</span>
          </div>

          <div className="px-4 py-3 flex justify-between">
            <span className="text-muted text-sm">Reported by</span>
            <div className="flex items-center gap-1.5">
              <img src={item.user?.avatar} alt={item.user?.name} className="w-5 h-5 rounded-full" />
              <span className="text-primary text-sm">{isOwner ? 'You' : item.user?.name}</span>
            </div>
          </div>

          <div className="px-4 py-3 flex justify-between">
            <span className="text-muted text-sm">Date posted</span>
            <span className="text-primary text-sm">
              {new Date(item.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric'
              })}
            </span>
          </div>

        </div>

        {/* Description */}
        <div className="bg-surface border border-border rounded-xl p-4 space-y-2">
          <p className="text-muted text-xs uppercase tracking-wide">Description</p>
          <p className="text-secondary text-sm leading-relaxed">{item.description}</p>
        </div>

        {/* Action buttons */}
        {!isOwner && (
          <a
            href={`mailto:${item.user?.email}?subject=Regarding your ${item.status} item: ${item.title}`}
            className="flex items-center justify-center w-full bg-accent hover:bg-accent-hover text-base font-medium text-sm py-2.5 rounded-lg transition-colors"
          >
            Contact via Email
          </a>
        )}

        {isOwner && !isRecovered && (
          <button
            onClick={() => markRecovered()}
            className="w-full border border-violet-800 text-recovered hover:bg-violet-950 text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Mark as Recovered
          </button>
        )}

        {/* Delete confirmation */}
        {confirmDelete && (
          <div className="bg-surface border border-red-900 rounded-xl p-4 space-y-3">
            <p className="text-primary text-sm font-medium">Delete this item?</p>
            <p className="text-muted text-xs">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => deleteItem()}
                disabled={isDeleting}
                className="flex-1 bg-red-950 hover:bg-red-900 text-lost text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 bg-elevated hover:bg-subtle text-secondary text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}