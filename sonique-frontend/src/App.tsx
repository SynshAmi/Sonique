import { useState, useEffect } from 'react'
import { AuthScreen } from './pages/AuthScreen'
import { SpotifyConnectScreen } from './pages/SpotifyConnectScreen'
import { IdentityGenerationScreen } from './pages/IdentityGenerationScreen'
import { AuthenticatedApp } from './components/AuthenticatedApp'
import { apiCall, API_BASE_URL } from './api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [profileData, setProfileData] = useState<any>(null)
  const [profileExists, setProfileExists] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

  const checkProfile = async () => {
    try {
      const data = await apiCall('/profile')
      setProfileData(data)
      setProfileExists(true)
      setIsGenerating(false)
      setGenerationError(null)
      return true
    } catch (err: any) {
      if (err.message.includes('[404]')) {
        setProfileExists(false)
      } else if (err.message.includes('[401]') || err.message.includes('[403]')) {
        // Authentication problem - force logout
        localStorage.removeItem('sonique_jwt');
        setIsAuthenticated(false);
      } else {
        // Unexpected error (e.g. 500, network error)
        setGenerationError(err.message || 'An unexpected error occurred while checking profile.')
      }
      return false
    }
  }

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('sonique_jwt')
      if (token) {
        setIsAuthenticated(true)
        await checkProfile()
      }
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    let intervalId: any;
    if (isGenerating && !profileExists && !generationError) {
      intervalId = setInterval(async () => {
        await checkProfile();
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(intervalId);
  }, [isGenerating, profileExists, generationError]);

  useEffect(() => {
    const expectedOrigin = new URL(API_BASE_URL, window.location.origin).origin;
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== expectedOrigin && event.origin !== window.location.origin) return;
      if (event.data?.type === 'SPOTIFY_CONNECTED') {
        setIsGenerating(true);
        checkProfile();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLoginSuccess = async () => {
    setLoading(true)
    setIsAuthenticated(true)
    await checkProfile()
    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen bg-sonique-bg flex items-center justify-center font-hanken text-sonique-lime tracking-widest uppercase font-bold text-sm">Initializing...</div>
  }

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />
  }

  if (generationError) {
    return (
      <div className="min-h-screen bg-sonique-bg flex flex-col items-center justify-center p-8 text-center font-hanken">
        <h1 className="text-3xl font-syne font-bold text-white mb-4 uppercase text-red-500">Error Checking Profile</h1>
        <p className="text-gray-400 mb-8 max-w-md">{generationError}</p>
        <button 
          onClick={() => { setGenerationError(null); checkProfile(); }} 
          className="bg-sonique-lime text-black px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (profileExists && profileData) {
    return <AuthenticatedApp profile={profileData} />
  }

  if (isGenerating) {
    return <IdentityGenerationScreen />
  }

  return <SpotifyConnectScreen />
}

export default App
