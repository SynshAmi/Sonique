import { useState, useEffect } from 'react';
import { apiCall } from '../api';

export const AccountScreen = () => {
  const [user, setUser] = useState<{ id: number, email: string, username: string, displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiCall('/users/me');
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load account information.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sonique_jwt');
    window.location.href = '/';
  };

  const handleDelete = async () => {
    try {
      await apiCall('/users/me', { method: 'DELETE' });
      localStorage.removeItem('sonique_jwt');
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message || 'Failed to delete account.');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-sonique-bg font-hanken text-gray-200 overflow-x-hidden relative flex flex-col pb-24 selection:bg-sonique-cyan selection:text-black">
      {/* Background Noise & Glow */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="fixed top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-sonique-cyan/10 rounded-full blur-[200px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-12 md:px-12 md:pt-16 flex-1 flex flex-col">
        
        {/* HEADER */}
        <header className="mb-12 border-b border-gray-800 pb-8">
          <h1 className="text-4xl md:text-6xl leading-[0.9] font-syne font-extrabold tracking-tighter text-white uppercase mb-2">
            ACCOUNT
          </h1>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-gray-400">Manage your Sonique identity</p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-sonique-magenta/10 border border-sonique-magenta text-sonique-magenta font-mono text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20 animate-pulse">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-t-2 border-sonique-cyan rounded-full animate-spin"></div>
            </div>
          </div>
        ) : user ? (
          <div className="space-y-12 animate-fade-in">
            
            {/* ACCOUNT / PROFILE SECTION */}
            <section className="bg-sonique-surface/30 border border-gray-800 p-8 md:p-12">
              <h2 className="text-2xl font-syne font-bold text-white uppercase mb-8 pb-4 border-b border-gray-800">Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Username</label>
                  <p className="font-syne text-xl text-white">@{user.username}</p>
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Display Name</label>
                  <p className="font-syne text-xl text-white">{user.displayName}</p>
                </div>
                <div>
                  <label className="block font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Email</label>
                  <p className="font-syne text-xl text-gray-300">{user.email}</p>
                </div>
              </div>
            </section>

            {/* SPOTIFY CONNECTION SECTION */}
            <section className="bg-sonique-surface/30 border border-gray-800 p-8 md:p-12">
              <h2 className="text-2xl font-syne font-bold text-white uppercase mb-8 pb-4 border-b border-gray-800">Spotify Connection</h2>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-sonique-lime rounded-full shadow-[0_0_10px_rgba(191,255,0,0.8)]"></div>
                <p className="font-mono text-sm tracking-widest uppercase text-white">Connected</p>
              </div>
            </section>

            {/* SESSION SECTION */}
            <section className="bg-sonique-surface/30 border border-gray-800 p-8 md:p-12">
              <h2 className="text-2xl font-syne font-bold text-white uppercase mb-8 pb-4 border-b border-gray-800">Session</h2>
              <button 
                onClick={handleLogout}
                className="border border-gray-600 hover:border-white text-gray-300 hover:text-white px-8 py-3 font-bold uppercase tracking-[0.2em] transition-colors"
              >
                Log Out
              </button>
            </section>

            {/* DANGER ZONE */}
            <section className="border border-sonique-magenta/30 bg-sonique-magenta/5 p-8 md:p-12 mt-16">
              <h2 className="text-2xl font-syne font-bold text-sonique-magenta uppercase mb-8 pb-4 border-b border-sonique-magenta/20">Danger Zone</h2>
              
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-sonique-magenta text-black px-8 py-3 font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <p className="font-mono text-sm text-sonique-magenta uppercase tracking-widest">
                    Are you absolutely sure? This action cannot be undone.
                  </p>
                  <div className="flex gap-4">
                    <button 
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-[0.2em] hover:bg-red-500 transition-colors"
                    >
                      Yes, Delete My Account
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="border border-gray-600 text-gray-300 px-8 py-3 font-bold uppercase tracking-[0.2em] hover:text-white hover:border-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>

          </div>
        ) : null}

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}} />
    </div>
  );
};
