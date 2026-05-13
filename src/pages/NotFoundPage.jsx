import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center gap-4">
      <p className="text-5xl">🔍</p>
      <h1 className="text-primary font-semibold text-lg">Page not found</h1>
      <p className="text-muted text-sm">This page doesn't exist or was moved.</p>
      <button
        onClick={() => navigate('/')}
        className="mt-2 bg-elevated hover:bg-subtle text-primary text-sm px-4 py-2 rounded-lg transition-colors"
      >
        Go home
      </button>
    </div>
  )
}