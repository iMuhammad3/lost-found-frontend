import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { CATEGORIES } from '../constants/categories'
import ItemCard from '../components/ItemCard'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/NavBar'

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')

  const { data: items, isLoading } = useQuery({
    queryKey: ['items', search, category, status],
    queryFn: () => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category) params.append('category', category)
      if (status) params.append('status', status)
      return apiClient(`/api/items?${params.toString()}`)
    },
  })

  return (
    <div className="min-h-screen bg-base">

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">Items</h2>
          <button
            onClick={() => navigate('/items/create')}
            className="bg-accent hover:bg-accent-hover text-base text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Report Item
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-surface border border-border text-primary placeholder-muted text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="bg-surface border border-border text-secondary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle"
          >
            <option value="">All categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="bg-surface border border-border text-secondary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle"
          >
            <option value="">All statuses</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        {/* Items */}
        {isLoading ? (
          <p className="text-muted text-sm text-center py-20">Loading...</p>
        ) : items?.length === 0 ? (
          <p className="text-muted text-sm text-center py-20">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items?.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

      </main>
    </div>
  )
}
