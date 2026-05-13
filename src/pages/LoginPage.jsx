const LoginPage = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/auth/google`
  }

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Lost & Found</h1>
          <p className="text-muted text-sm mt-1">Find what's lost. Return what's found.</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <p className="text-secondary text-sm text-center">Sign in to continue</p>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-elevated hover:bg-subtle text-primary text-sm font-medium py-2.5 rounded-lg border border-border transition-colors"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>

      </div>
    </div>
  )
}
export default LoginPage