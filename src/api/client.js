const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Something went wrong')
  }

  return response.json()
}