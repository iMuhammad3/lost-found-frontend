import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ItemCard({ item }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isOwner = user?.id === item.user_id

  return (
    <div
      onClick={() => navigate(`/items/${item.id}`)}
      className="bg-surface border border-border rounded-xl overflow-hidden cursor-pointer hover:border-subtle transition-colors"
    >
      {/* Image */}
      <img
        src={item.image_url}
        alt={item.title}
        className="w-full h-40 object-cover"
      />

      <div className="p-4 space-y-3">
        {/* Status badge + category */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            item.status === 'lost' ? 'bg-red-950 text-lost' : 'bg-green-950 text-found'
          }`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
          <span className="text-muted text-xs">{item.category}</span>
        </div>

        {/* Title */}
        <h3 className="text-primary font-medium text-sm leading-snug">{item.title}</h3>

        {/* Description */}
        <p className="text-secondary text-xs line-clamp-2">{item.description}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-muted text-xs">📍 {item.location}</span>
          <div className="flex items-center gap-1.5">
            <img src={item.user?.avatar} alt={item.user?.name} className="w-5 h-5 rounded-full" />
            <span className="text-muted text-xs">{isOwner ? 'You' : item.user?.name}</span>
          </div>
        </div>

        {item.recovery_status === 'recovered' && (
          <p className="text-xs text-recovered font-medium">✓ Recovered</p>
        )}
      </div>
    </div>
  )
}