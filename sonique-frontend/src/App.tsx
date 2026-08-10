import { useState, useEffect } from 'react'
import { AuthScreen } from './pages/AuthScreen'
import { DashboardPlaceholder } from './pages/DashboardPlaceholder'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const token = localStorage.getItem('sonique_jwt')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>
  }

  return (
    <>
      {isAuthenticated ? (
        <DashboardPlaceholder />
      ) : (
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

export default App
