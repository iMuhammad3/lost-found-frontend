import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import AuthCallBack from './pages/AuthCallBack'
import { useAuth } from './context/useAuth'
import HomePage from './pages/HomePage'
import CreateItemPage from './pages/CreateItemPage'
import ItemDetailPage from './pages/ItemDetailPage'
import EditItemPage from './pages/EditItemPage'
import NotFoundPage from './pages/NotFoundPage'

const ProtectedRoute = ({ children }) => {
  const {user, loading} = useAuth();
  if (loading) return <p>Loading...</p>
  return user ? children : <Navigate to='login' />
}
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallBack />} />
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/items/create" element={<ProtectedRoute><CreateItemPage /></ProtectedRoute>} />
      <Route path="/items/:id" element={<ProtectedRoute><ItemDetailPage /></ProtectedRoute>} />
      <Route path="/items/:id/edit" element={<ProtectedRoute><EditItemPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}