import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import { CATEGORIES } from '../constants/categories'
import Navbar from '../components/NavBar'

export default function CreateItemPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    status: 'lost',
    image: null,
  })

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('category', form.category)
      formData.append('location', form.location)
      formData.append('status', form.status)
      if (form.image) formData.append('image', form.image)

      return apiClient('/api/items', {
        method: 'POST',
        body: formData,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      navigate('/')
    },
    onError: (err) => setError(err.message),
  })

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setForm(prev => ({ ...prev, image: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = e => {
    e.preventDefault()
    setError('')
    mutate()
  }

  return (
    <div className="min-h-screen bg-base">
     <Navbar title="Report Item"  />

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

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-secondary text-sm">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Black iPhone 14"
              required
              className="w-full bg-elevated border border-border text-primary placeholder-muted text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-secondary text-sm">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the item in detail..."
              required
              rows={3}
              className="w-full bg-elevated border border-border text-primary placeholder-muted text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-secondary text-sm">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full bg-elevated border border-border text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-secondary text-sm">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Library, Block A"
              required
              className="w-full bg-elevated border border-border text-primary placeholder-muted text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-subtle"
            />
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <label className="text-secondary text-sm">Image <span className="text-muted">(optional)</span></label>

            {/* Preview */}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-border"
              />
            )}

            <label className="flex items-center justify-center w-full h-24 bg-elevated border border-dashed border-border rounded-lg cursor-pointer hover:border-subtle transition-colors">
              <div className="text-center">
                <p className="text-muted text-sm">{preview ? 'Click to change image' : 'Click to upload image'}</p>
                <p className="text-faint text-xs mt-1">PNG, JPG up to 2MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-accent hover:bg-accent-hover text-base font-medium text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? 'Submitting...' : 'Submit Report'}
          </button>

        </form>
      </main>
    </div>
  )
}