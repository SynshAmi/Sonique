import { useState, useEffect } from 'react';
import { apiCall } from '../api';

// --- Type Interfaces matching DTO exactly ---
interface CompatibilityMetricResponse {
  metricName: string;
  userAValue: string;
  userBValue: string;
  similarity: number;
}

interface ListeningStyleCompatibilityResponse {
  compatibilityScore: number;
  metrics: CompatibilityMetricResponse[];
}

interface SharedPreferenceResponse {
  preference: string;
  userAWeight: number;
  userBWeight: number;
  matchType: string;
  contribution: number;
}

interface UniquePreferenceResponse {
  preference: string;
  weight: number;
  owner: 'USER_A' | 'USER_B';
}

interface TasteCompatibilityResponse {
  compatibilityScore: number;
  sharedGenres: SharedPreferenceResponse[];
  sharedMusicalTraits: SharedPreferenceResponse[];
  sharedVocalCharacteristics: SharedPreferenceResponse[];
  uniquePreferences: UniquePreferenceResponse[];
}

interface CompatibilityResponse {
  overallCompatibility: number;
  listeningStyleCompatibility: ListeningStyleCompatibilityResponse;
  musicalTasteCompatibility: TasteCompatibilityResponse;
  summary: string;
}

// --- Module-level Cache ---
const compatibilityCache: Record<string, CompatibilityResponse> = {};
const inFlightRequests: Record<string, Promise<CompatibilityResponse>> = {};

export const CompatibilityScreen = () => {
  const [targetUsername, setTargetUsername] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<CompatibilityResponse | null>(null);

  // Generative presentation state
  const phrases = [
    "READING YOUR MUSICAL IDENTITY",
    "FETCHING TARGET'S GENRES",
    "COMPARING LISTENING STYLE",
    "MAPPING SHARED TASTES",
    "ANALYZING YOUR DIFFERENCES",
    "GENERATING YOUR COMPATIBILITY"
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    let interval: any;
    if (status === 'LOADING') {
      interval = setInterval(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleCompare = async () => {
    const normalizedUsername = targetUsername.trim().toLowerCase();
    if (!normalizedUsername) return;
    
    setStatus('LOADING');
    setPhraseIndex(0);
    setErrorMsg('');
    
    if (compatibilityCache[normalizedUsername]) {
      setResult(compatibilityCache[normalizedUsername]);
      setStatus('SUCCESS');
      return;
    }
    
    try {
      let requestPromise = inFlightRequests[normalizedUsername];
      
      if (!requestPromise) {
        requestPromise = apiCall(`/compatibility/${encodeURIComponent(normalizedUsername)}`);
        inFlightRequests[normalizedUsername] = requestPromise;
      }
      
      const data = await requestPromise;
      compatibilityCache[normalizedUsername] = data;
      setResult(data);
      setStatus('SUCCESS');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to compare compatibility. Ensure the user exists.');
      setStatus('ERROR');
    } finally {
      delete inFlightRequests[normalizedUsername];
    }
  };

  const handleRetry = () => {
    setStatus('IDLE');
    setResult(null);
  };

  const formatPercentage = (val: number) => Math.round(val * 100);

  const backgroundEffect = (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sonique-magenta/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-sonique-cyan/10 rounded-full blur-[150px]"></div>
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-sonique-lime/5 rounded-full blur-[200px]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sonique-bg font-hanken text-gray-200 overflow-x-hidden relative flex flex-col pb-24 selection:bg-sonique-lime selection:text-black">
      {backgroundEffect}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-12 md:px-12 md:pt-16 flex-1 flex flex-col">
        
        {/* HEADER */}
        <header className="mb-12 border-b border-gray-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl leading-[0.9] font-syne font-extrabold tracking-tighter text-white uppercase mb-2">
              COMPATIBILITY
            </h1>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-gray-400">Discover your musical alignment</p>
          </div>
        </header>

        {/* STATES */}
        <div className="flex-1 flex flex-col justify-center">

          {status === 'IDLE' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <h2 className="text-3xl font-syne font-bold text-white mb-8">COMPARE WITH</h2>
              <input 
                type="text"
                placeholder="@username"
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value.replace('@', ''))}
                onKeyDown={(e) => e.key === 'Enter' && handleCompare()}
                className="bg-transparent border-b-2 border-gray-600 focus:border-sonique-lime text-center text-3xl font-mono text-white outline-none w-full max-w-sm pb-4 mb-12 uppercase tracking-widest placeholder:text-gray-700 transition-colors"
              />
              <button 
                onClick={handleCompare}
                disabled={!targetUsername.trim()}
                className="bg-sonique-lime text-black px-12 py-4 font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors disabled:opacity-50 disabled:hover:bg-sonique-lime cursor-pointer disabled:cursor-not-allowed"
              >
                COMPARE
              </button>
            </div>
          )}

          {status === 'LOADING' && (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-pulse">
              <div className="relative w-32 h-32 mb-12">
                <div className="absolute inset-0 border-t-2 border-sonique-lime rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-2 border-sonique-cyan rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                <div className="absolute inset-4 border-b-2 border-sonique-magenta rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
              </div>
              <h3 className="text-2xl md:text-4xl font-syne font-bold text-white tracking-widest uppercase transition-opacity duration-500 min-h-[4rem]">
                {phrases[phraseIndex]}
              </h3>
            </div>
          )}

          {status === 'ERROR' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <h2 className="text-3xl font-syne font-bold text-sonique-magenta mb-4">ANALYSIS FAILED</h2>
              <p className="text-gray-400 font-mono tracking-wider mb-8 max-w-md">{errorMsg}</p>
              <button 
                onClick={handleRetry}
                className="border border-sonique-magenta text-sonique-magenta hover:bg-sonique-magenta hover:text-black px-8 py-3 font-bold uppercase tracking-[0.2em] transition-colors"
              >
                TRY AGAIN
              </button>
            </div>
          )}

          {status === 'SUCCESS' && result && (
            <div className="animate-fade-in w-full space-y-16">
              
              {/* OVERALL COMPATIBILITY */}
              <section className="text-center bg-sonique-surface/50 border border-sonique-lime/30 p-12 relative overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-sonique-lime/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-sonique-lime/20 transition-all"></div>
                <p className="font-mono text-sm uppercase tracking-[0.2em] text-sonique-lime mb-4 relative z-10">OVERALL COMPATIBILITY</p>
                <div className="flex justify-center items-end gap-6 relative z-10">
                  <span className="font-syne font-extrabold text-white text-3xl pb-4">YOU</span>
                  <span className="font-syne font-extrabold text-white text-8xl md:text-[150px] leading-[0.8] drop-shadow-[0_0_20px_rgba(191,255,0,0.4)]">
                    {formatPercentage(result.overallCompatibility)}<span className="text-4xl md:text-6xl text-sonique-lime">%</span>
                  </span>
                  <span className="font-syne font-extrabold text-white text-3xl pb-4 uppercase">{targetUsername}</span>
                </div>
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                
                {/* LISTENING STYLE */}
                <section>
                  <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-syne font-bold text-white uppercase">LISTENING STYLE</h2>
                    <span className="font-mono text-sonique-cyan text-xl">{formatPercentage(result.listeningStyleCompatibility.compatibilityScore)}%</span>
                  </div>
                  
                  <div className="space-y-6">
                    {result.listeningStyleCompatibility.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-sonique-surface/40 p-6 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-3">{metric.metricName}</p>
                          <div className="flex items-center gap-4 text-sm font-syne">
                            <div className="text-white bg-gray-900 px-3 py-1 rounded w-1/2 text-center truncate">
                              <span className="text-gray-500 mr-2">YOU</span>
                              {metric.metricName === 'Exploration' || metric.metricName === 'Artist Diversity' ? `${formatPercentage(parseFloat(metric.userAValue))}%` : metric.userAValue}
                            </div>
                            <div className="text-white bg-gray-900 px-3 py-1 rounded w-1/2 text-center truncate">
                              <span className="text-gray-500 mr-2">THEM</span>
                              {metric.metricName === 'Exploration' || metric.metricName === 'Artist Diversity' ? `${formatPercentage(parseFloat(metric.userBValue))}%` : metric.userBValue}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end md:min-w-[100px]">
                          <p className="font-mono text-[10px] text-gray-500 tracking-widest mb-1">SIMILARITY</p>
                          <p className="font-mono text-sonique-cyan text-lg">{formatPercentage(metric.similarity)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* MUSICAL TASTE */}
                <section>
                  <div className="flex justify-between items-end mb-8 border-b border-gray-800 pb-4">
                    <h2 className="text-2xl font-syne font-bold text-white uppercase">MUSICAL TASTE</h2>
                    <span className="font-mono text-sonique-magenta text-xl">{formatPercentage(result.musicalTasteCompatibility.compatibilityScore)}%</span>
                  </div>

                  <div className="space-y-8">
                    
                    <div>
                      <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">SHARED GENRES</h3>
                      {result.musicalTasteCompatibility.sharedGenres.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.musicalTasteCompatibility.sharedGenres.slice(0, 3).map((genre, idx) => (
                            <span key={idx} className="px-3 py-1 border border-sonique-magenta/40 text-white font-mono text-xs uppercase bg-sonique-magenta/10">
                              {genre.preference}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 font-mono text-xs uppercase">No Shared Genres</p>
                      )}
                    </div>

                    <div>
                      <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">SHARED MUSICAL TRAITS</h3>
                      {result.musicalTasteCompatibility.sharedMusicalTraits.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.musicalTasteCompatibility.sharedMusicalTraits.map((trait, idx) => (
                            <span key={idx} className="px-3 py-1 border border-gray-700 text-gray-300 font-mono text-xs uppercase bg-gray-900">
                              {trait.preference}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 font-mono text-xs uppercase">No Shared Traits</p>
                      )}
                    </div>

                    <div>
                      <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">SHARED VOCAL CHARACTERISTICS</h3>
                      {result.musicalTasteCompatibility.sharedVocalCharacteristics.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {result.musicalTasteCompatibility.sharedVocalCharacteristics.map((vocal, idx) => (
                            <span key={idx} className="px-3 py-1 border border-gray-700 text-gray-300 font-mono text-xs uppercase bg-gray-900">
                              {vocal.preference}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 font-mono text-xs uppercase">No Shared Vocal Traits</p>
                      )}
                    </div>

                  </div>
                </section>

              </div>

              {/* UNIQUE PREFERENCES */}
              <section className="bg-sonique-surface/30 p-8 md:p-12 border border-gray-800">
                <h2 className="text-2xl font-syne font-bold text-white uppercase mb-8 text-center border-b border-gray-800 pb-4">UNIQUE PREFERENCES</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  
                  <div>
                    <h3 className="font-mono text-sm text-sonique-lime uppercase tracking-widest mb-6 text-center">YOUR UNIQUE TASTES</h3>
                    <div className="flex flex-col gap-3">
                      {result.musicalTasteCompatibility.uniquePreferences.filter(p => p.owner === 'USER_A').length > 0 ? (
                        result.musicalTasteCompatibility.uniquePreferences.filter(p => p.owner === 'USER_A').slice(0, 3).map((pref, idx) => (
                          <div key={idx} className="border-l-2 border-sonique-lime pl-4 py-2 bg-black/20">
                            <p className="font-syne text-white">{pref.preference}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 font-mono text-xs uppercase text-center">None</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-sm text-gray-400 uppercase tracking-widest mb-6 text-center">THEIR UNIQUE TASTES</h3>
                    <div className="flex flex-col gap-3">
                      {result.musicalTasteCompatibility.uniquePreferences.filter(p => p.owner === 'USER_B').length > 0 ? (
                        result.musicalTasteCompatibility.uniquePreferences.filter(p => p.owner === 'USER_B').slice(0, 3).map((pref, idx) => (
                          <div key={idx} className="border-l-2 border-gray-600 pl-4 py-2 bg-black/20">
                            <p className="font-syne text-gray-300">{pref.preference}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 font-mono text-xs uppercase text-center">None</p>
                      )}
                    </div>
                  </div>

                </div>
              </section>

              {/* SONIQUE'S TAKE (SUMMARY) */}
              {result.summary && (
                <section className="bg-sonique-surface/30 border border-sonique-lime/30 p-8 md:p-12 relative overflow-hidden group">
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-sonique-lime/10 rounded-full blur-[50px]"></div>
                  <h2 className="text-2xl font-syne font-bold text-sonique-lime uppercase mb-6 relative z-10">SONIQUE'S TAKE</h2>
                  <p className="font-syne text-lg md:text-xl leading-relaxed text-gray-200 relative z-10">
                    {result.summary}
                  </p>
                </section>
              )}

              <div className="flex justify-center pt-8">
                <button 
                  onClick={handleRetry}
                  className="font-mono text-xs text-gray-400 uppercase tracking-widest border-b border-gray-600 pb-1 hover:text-white transition-colors"
                >
                  COMPARE ANOTHER USER
                </button>
              </div>

            </div>
          )}
          
        </div>
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
