import { useState } from 'react';
import { apiCall } from '../api';
import { Loader2 } from 'lucide-react';

export const SpotifyConnectScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    setLoading(true);

    // Synchronously open a blank popup to avoid popup blockers
    const popup = window.open('', '_blank', 'width=500,height=600');

    try {
      const response = await apiCall('/spotify/connect', {
        method: 'GET',
      });
      
      if (response && response.authUrl) {
        if (popup) {
          popup.location.href = response.authUrl;
        } else {
          // Fallback if popup was blocked
          window.location.href = response.authUrl;
          return;
        }
        // Wait for the popup to complete the flow and postMessage back
        // onConnecting();
      } else {
        if (popup) popup.close();
        throw new Error('Invalid response from server.');
      }
    } catch (err: any) {
      if (popup) popup.close();
      setError(err.message || 'Failed to connect to Spotify. Please try again.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sonique_jwt");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-sonique-bg flex flex-col items-center justify-center font-hanken text-gray-200 overflow-hidden relative p-8">
      
      {/* Background Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sonique-lime/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-10">
        
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-syne font-extrabold leading-tight text-white tracking-tighter uppercase">
            Connect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sonique-lime to-sonique-cyan">Sound</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
            Sonique uses your Spotify listening history to construct your unique music identity. We never post on your behalf.
          </p>
        </div>

        {error && (
          <div className="w-full max-w-sm p-4 border border-red-500 text-red-400 bg-red-500/10 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="w-full max-w-sm space-y-6">
          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-sonique-lime text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center group"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                <span className="mr-2">Connect Spotify</span>
                <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.3 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.66 12.84c.36.18.54.78.3 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full text-gray-500 hover:text-white transition-colors text-sm uppercase tracking-wider font-bold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Abstract Waveform Graphic */}
      <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end gap-1 px-4 md:px-12 opacity-20 pointer-events-none pb-4 z-0">
        {[...Array(60)].map((_, i) => (
          <div 
            key={i} 
            className="w-full bg-sonique-lime transition-all duration-1000 ease-in-out" 
            style={{ 
              height: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1
            }}
          ></div>
        ))}
      </div>

    </div>
  );
};
