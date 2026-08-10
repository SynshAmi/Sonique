import { useState } from 'react';
import { apiCall } from '../api';
import { Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const response = await apiCall('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        if (response.token) {
          localStorage.setItem('sonique_jwt', response.token);
          onLoginSuccess();
        } else {
          throw new Error('Invalid response from server.');
        }
      } else {
        await apiCall('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ email, username, displayName, password }),
        });
        // Success: Switch to login state to allow them to log in
        setIsLogin(true);
        setError('Registration successful. Please login.'); // Using error state for a quick success message temporarily, or just clear forms
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sonique-bg flex flex-col md:flex-row font-hanken text-gray-200 overflow-hidden relative">
      
      {/* Background Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Abstract Audio Visual Left Side */}
      <div className="w-full md:w-1/2 lg:w-3/5 p-8 md:p-16 flex flex-col justify-between relative z-10 border-b md:border-b-0 md:border-r border-white/5 bg-sonique-surface/30">
        
        {/* Subtle Gradient Glow */}
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-sonique-cyan/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-sonique-magenta/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div>
          <h1 className="text-3xl md:text-5xl font-syne font-bold tracking-tighter text-white mb-2">
            SONIQUE
          </h1>
          <div className="w-12 h-1 bg-sonique-lime mt-4"></div>
        </div>

        <div className="mt-24 md:mt-0 max-w-lg relative z-20">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-syne font-extrabold leading-[1.1] text-white tracking-tight mb-8">
            Your music <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sonique-lime to-sonique-cyan">
              says something
            </span> <br />
            about you.
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-md leading-relaxed">
            Sonique builds your music identity from your listening history and lets you compare your taste with others.
          </p>
        </div>

        {/* Abstract Waveform Graphic */}
        <div className="hidden md:flex absolute bottom-0 left-0 right-0 h-48 items-end gap-1 px-8 opacity-20 pointer-events-none pb-4">
          {[...Array(40)].map((_, i) => (
            <div 
              key={i} 
              className="w-full bg-white transition-all duration-1000 ease-in-out" 
              style={{ 
                height: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Form Right Side */}
      <div className="w-full md:w-1/2 lg:w-2/5 p-8 md:p-16 lg:p-24 flex flex-col justify-center relative z-10 bg-sonique-bg shadow-2xl">
        <div className="w-full max-w-sm mx-auto">
          
          <div className="mb-12">
            <h3 className="text-3xl font-syne font-bold text-white mb-2 uppercase tracking-wide">
              {isLogin ? 'Login' : 'Register'}
            </h3>
            <p className="text-gray-500 text-sm">
              {isLogin 
                ? 'Enter your credentials to access your identity.' 
                : 'Create your account to begin.'}
            </p>
          </div>

          {error && (
            <div className={`mb-8 p-4 border text-sm font-medium ${error.includes('successful') ? 'border-sonique-lime text-sonique-lime bg-sonique-lime/10' : 'border-red-500 text-red-400 bg-red-500/10'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-gray-800 focus:border-sonique-lime py-3 text-white placeholder-gray-700 outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Username</label>
                  <input 
                    type="text" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-800 focus:border-sonique-lime py-3 text-white placeholder-gray-700 outline-none transition-colors"
                    placeholder="e.g. soundwave99"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Display Name</label>
                  <input 
                    type="text" 
                    required 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-800 focus:border-sonique-lime py-3 text-white placeholder-gray-700 outline-none transition-colors"
                    placeholder="e.g. Alex"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-gray-800 focus:border-sonique-lime py-3 text-white placeholder-gray-700 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-sonique-lime text-black font-bold uppercase tracking-widest py-4 mt-8 hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (isLogin ? 'LOGIN' : 'REGISTER')}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              type="button"
              className="text-gray-400 hover:text-white transition-colors text-sm uppercase tracking-wider font-bold"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
