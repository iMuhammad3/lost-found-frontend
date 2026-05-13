import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar({ title = 'Lost & Found', backPath = null }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="bg-surface border-b border-border">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">

        <div className="flex items-center gap-3">
          {backPath && (
            <button
              onClick={() => navigate(backPath)}
              className="text-muted hover:text-primary text-sm transition-colors"
            >
              ←
            </button>
          )}
          <span
            onClick={() => !backPath && navigate('/')}
            className={`text-primary font-semibold ${!backPath ? 'cursor-pointer' : ''}`}
          >
            {title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full" />
          <span className="text-secondary text-sm hidden sm:block">{user?.name}</span>
          <button
            onClick={logout}
            className="text-muted hover:text-primary text-sm transition-colors"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  )
}