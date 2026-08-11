import { useState, useEffect } from 'react';
import { apiCall } from '../api';

interface Profile {
  username: string;
  displayName: string;
  totalTracks: number;
  uniqueTracks: number;
  uniqueArtists: number;
  totalListeningHours: number;
  explorationScore: number;
  artistDiversityScore: number;
  averageTrackAge: number;
  dominantTimeWindow: string;
  topArtistName: string;
  topSongName: string;
  topGenres: string | null;
  topMusicalTraits: string | null;
  topVocalCharacteristic: string | null;
  lastUpdated: string;
}

interface IdentityDashboardProps {
  profile: Profile;
}

export const IdentityDashboard = ({ profile }: IdentityDashboardProps) => {
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [topSongs, setTopSongs] = useState<any[]>([]);
  const [recentListening, setRecentListening] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuxData = async () => {
      try {
        const [artistsRes, songsRes, recentRes] = await Promise.all([
          apiCall('/history/top-artists').catch(() => []),
          apiCall('/history/top-songs').catch(() => []),
          apiCall('/history/recent').catch(() => [])
        ]);
        if (Array.isArray(artistsRes)) setTopArtists(artistsRes.slice(0, 5));
        if (Array.isArray(songsRes)) setTopSongs(songsRes.slice(0, 10));
        if (Array.isArray(recentRes)) setRecentListening(recentRes.slice(0, 20));
      } catch (err) {
        // Ignored, auxiliary data
      }
    };
    fetchAuxData();
  }, []);

  // Convert raw 0-1 scores to percentages
  const explorationPercent = Math.round((profile.explorationScore || 0) * 100);
  const diversityPercent = Math.round((profile.artistDiversityScore || 0) * 100);

  return (
    <div className="min-h-screen bg-sonique-bg font-hanken text-gray-200 overflow-x-hidden relative pb-24 selection:bg-sonique-lime selection:text-black">
      {/* Background Noise & Glow */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      {/* Decorative ambient glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-sonique-magenta/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-sonique-cyan/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="fixed top-[40%] left-[50%] -translate-x-1/2 w-[500px] h-[500px] bg-sonique-lime/5 rounded-full blur-[200px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:px-12 md:pt-24">
        
        {/* Header */}
        <header className="mb-16 pb-10 border-b border-gray-800 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h1 className="text-5xl md:text-[80px] leading-[0.9] font-syne font-extrabold tracking-tighter text-white uppercase mb-4">
              Sonic <br/> <span className="text-sonique-lime drop-shadow-[0_0_15px_rgba(191,255,0,0.3)]">Identity</span>
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-xl md:text-2xl font-syne font-bold text-white uppercase tracking-wider">{profile.displayName}</span>
              <span className="font-mono text-xs uppercase tracking-[0.2em] px-3 py-1 bg-sonique-surface text-gray-400">@{profile.username}</span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Last Analysis</p>
            <p className="text-lg font-mono text-sonique-lime">{new Date(profile.lastUpdated || Date.now()).toISOString().split('T')[0]}</p>
          </div>
        </header>

        {/* CURRENT IDENTITY SECTION */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="font-syne font-bold text-3xl text-white">CURRENT IDENTITY</h2>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sonique-lime mt-2">Based on your most recent 100 tracks</p>
          </div>

          {/* Identity Grid (Bento style) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
            
            {/* Top Artist (Span 8) */}
            <div className="bg-sonique-surface/80 p-8 md:p-12 md:col-span-8 flex flex-col justify-between min-h-[350px] group transition-all duration-500 relative overflow-hidden backdrop-blur-md hover:bg-sonique-surface border border-gray-900/50">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-sonique-lime/10 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <h3 className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em] mb-4">TOP ARTIST</h3>
                <div className="text-5xl md:text-[100px] leading-[0.85] font-syne font-extrabold text-white break-words drop-shadow-md">
                  {profile.topArtistName || 'Unknown'}
                </div>
              </div>
              
              <div className="relative z-10 flex justify-between items-end mt-16 w-full">
                <div className="w-full max-w-[300px] h-1 bg-gray-900">
                  <div className="h-full bg-sonique-lime w-[100%] shadow-[0_0_10px_rgba(191,255,0,0.5)]"></div>
                </div>
              </div>
            </div>

            {/* Top Song (Span 4) */}
            <div className="bg-sonique-surface/80 p-8 md:p-12 md:col-span-4 flex flex-col justify-between min-h-[350px] group transition-all duration-500 border-l-4 border-sonique-cyan hover:bg-sonique-surface backdrop-blur-md">
              <div>
                <h3 className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em] mb-4">TOP SONG</h3>
                <div className="text-3xl md:text-4xl font-syne font-bold text-sonique-cyan leading-tight mb-2 drop-shadow-[0_0_12px_rgba(0,255,255,0.3)]">
                  {profile.topSongName || 'Unknown'}
                </div>
              </div>
              
              {/* Audio Waveform decoration */}
              <div className="flex items-end gap-1 h-12 mt-12 opacity-80 group-hover:opacity-100 transition-opacity">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-sonique-cyan rounded-t-sm"
                    style={{ 
                      height: `${Math.max(20, Math.random() * 100)}%`,
                      animation: `pulse ${1 + Math.random()}s infinite alternate` 
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Genres (Span 6) */}
            <div className="bg-sonique-surface/80 p-8 md:p-10 md:col-span-6 min-h-[250px] backdrop-blur-md">
              <h3 className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em] mb-6">GENRES</h3>
              
              {profile.topGenres ? (
                <div className="flex flex-wrap gap-3">
                  {profile.topGenres.split(',').map((genre, idx) => (
                    <span 
                      key={idx} 
                      className={`px-4 py-2 text-sm font-mono uppercase tracking-wider ${
                        idx < 3 ? 'bg-gray-800 text-white shadow-[0_0_15px_rgba(255,0,255,0.15)] border border-sonique-magenta/30' : 'border border-gray-700 text-gray-400'
                      }`}
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 font-mono text-sm uppercase">No genre data</p>
              )}
            </div>

            {/* Traits & Vocal (Span 6) */}
            <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Traits */}
              <div className="bg-sonique-surface/80 p-8 md:p-10 flex flex-col justify-center backdrop-blur-md hover:bg-gray-900 transition-colors">
                <h3 className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em] mb-4">MUSICAL TRAITS</h3>
                <p className="text-white font-syne text-xl md:text-2xl leading-snug">
                  {profile.topMusicalTraits || 'Unknown'}
                </p>
              </div>
              
              {/* Vocal */}
              <div className="bg-[#181818] p-8 md:p-10 flex flex-col justify-center border border-gray-800">
                <h3 className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em] mb-4">VOCAL CHARACTERISTIC</h3>
                <div className="flex items-center gap-3 text-sonique-magenta">
                  <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  <span className="font-syne font-bold text-xl md:text-2xl">{profile.topVocalCharacteristic || 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Listening Style Metrics */}
          <div className="bg-sonique-surface/30 p-8 md:p-12 border border-gray-800/50 backdrop-blur-sm">
            <h3 className="font-syne font-bold text-3xl mb-10 text-white">LISTENING STYLE</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="flex flex-col gap-8">
                {/* Exploration */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">Exploration Score</p>
                    <p className="text-sonique-lime font-mono text-lg">{explorationPercent}%</p>
                  </div>
                  <div className="w-full h-[2px] bg-gray-900 relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-sonique-lime shadow-[0_0_8px_rgba(191,255,0,0.8)]" style={{ width: `${Math.min(100, Math.max(0, explorationPercent))}%` }}></div>
                    {/* Thumb / needle */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-sonique-lime shadow-[0_0_8px_rgba(191,255,0,0.8)]" style={{ left: `calc(${Math.min(100, Math.max(0, explorationPercent))}% - 2px)` }}></div>
                  </div>
                </div>

                {/* Diversity */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">Artist Diversity Score</p>
                    <p className="text-sonique-cyan font-mono text-lg">{diversityPercent}%</p>
                  </div>
                  <div className="w-full h-[2px] bg-gray-900 relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-sonique-cyan shadow-[0_0_8px_rgba(0,255,255,0.8)]" style={{ width: `${Math.min(100, Math.max(0, diversityPercent))}%` }}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-sonique-cyan shadow-[0_0_8px_rgba(0,255,255,0.8)]" style={{ left: `calc(${Math.min(100, Math.max(0, diversityPercent))}% - 2px)` }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-sonique-surface/50 p-6 border-l-2 border-gray-700 flex flex-col justify-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Avg Track Age</p>
                  <p className="font-syne font-bold text-3xl md:text-4xl text-white">{Math.round(profile.averageTrackAge || 0)} <span className="text-sm text-gray-500 font-hanken">Years</span></p>
                </div>
                <div className="bg-sonique-surface/50 p-6 border-l-2 border-gray-700 flex flex-col justify-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Dominant Time Window</p>
                  <p className="font-syne font-bold text-3xl md:text-4xl text-white">{profile.dominantTimeWindow || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIFETIME STATS SECTION */}
        <section className="mb-20">
          <h2 className="font-syne font-bold text-3xl mb-8 text-white border-b border-gray-800 pb-4">LIFETIME STATS</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0a0a0a] p-6 md:p-8 border border-gray-900 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-sonique-lime opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(191,255,0,0.5)] transition-all"></div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Unique Artists</p>
              <p className="font-syne font-bold text-4xl md:text-5xl text-white">{profile.uniqueArtists?.toLocaleString() || 0}</p>
            </div>

            <div className="bg-[#0a0a0a] p-6 md:p-8 border border-gray-900 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-sonique-cyan opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all"></div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Unique Tracks</p>
              <p className="font-syne font-bold text-4xl md:text-5xl text-white">{profile.uniqueTracks?.toLocaleString() || 0}</p>
            </div>

            <div className="bg-[#0a0a0a] p-6 md:p-8 border border-gray-900 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-sonique-magenta opacity-50 group-hover:opacity-100 group-hover:shadow-[0_0_10px_rgba(255,0,255,0.5)] transition-all"></div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Total Tracks</p>
              <p className="font-syne font-bold text-4xl md:text-5xl text-white">{profile.totalTracks?.toLocaleString() || 0}</p>
            </div>

            <div className="bg-[#0a0a0a] p-6 md:p-8 border border-gray-900 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white opacity-20 group-hover:opacity-50 transition-all"></div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Total Hours</p>
              <p className="font-syne font-bold text-4xl md:text-5xl text-white">{Math.round(profile.totalListeningHours || 0)}</p>
            </div>
          </div>
        </section>

        {/* Auxiliary History */}
        {(topArtists.length > 0 || topSongs.length > 0) && (
          <section className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {topArtists.length > 0 && (
                <div className="bg-sonique-surface/50 p-8 md:p-10 border border-gray-800">
                  <h3 className="font-syne font-bold text-2xl text-white mb-8 border-b border-gray-800 pb-4">ALL-TIME TOP ARTISTS</h3>
                  <div className="space-y-4">
                    {topArtists.map((artist, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-gray-800 pb-4 last:border-0 group">
                        <div className="flex items-center gap-6">
                          <span className="font-mono text-gray-600 text-sm">{String(idx + 1).padStart(2, '0')}</span>
                          <p className="text-white font-syne text-xl md:text-2xl group-hover:text-sonique-lime transition-colors">{artist.artistName}</p>
                        </div>
                        <p className="font-mono text-xs text-gray-500">{artist.playCount} PLAYS</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {topSongs.length > 0 && (
                <div className="bg-sonique-surface/50 p-8 md:p-10 border border-gray-800">
                  <h3 className="font-syne font-bold text-2xl text-white mb-8 border-b border-gray-800 pb-4">ALL-TIME TOP SONGS</h3>
                  <div className="space-y-4">
                    {topSongs.map((song, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-gray-800 pb-4 last:border-0 group">
                        <div className="flex items-center gap-6">
                          <span className="font-mono text-gray-600 text-sm">{String(idx + 1).padStart(2, '0')}</span>
                          <div>
                            <p className="text-white font-syne text-lg md:text-xl group-hover:text-sonique-cyan transition-colors leading-tight mb-1">{song.songName}</p>
                            <p className="font-hanken text-sm text-gray-400">{song.artistName}</p>
                          </div>
                        </div>
                        <p className="font-mono text-xs text-gray-500">{song.playCount} PLAYS</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </section>
        )}

        {/* Recent Listening */}
        {recentListening.length > 0 && (
          <section className="mb-20">
            <div className="bg-sonique-surface/30 p-8 md:p-10 border border-gray-800">
              <div className="mb-8 border-b border-gray-800 pb-4">
                <h3 className="font-syne font-bold text-2xl text-white">RECENT LISTENING</h3>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mt-2">Last 20 tracks</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {recentListening.map((track, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-800/50 pb-3 group">
                     <div className="flex items-center gap-4">
                        <span className="font-mono text-gray-600 text-xs">{String(idx + 1).padStart(2, '0')}</span>
                        <div>
                          <p className="text-gray-200 font-syne text-base group-hover:text-white transition-colors">{track.songName}</p>
                          <p className="font-hanken text-xs text-gray-500">{track.artistName}</p>
                        </div>
                     </div>
                     <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest whitespace-nowrap ml-4">
                       {new Date(track.playedAt).toLocaleDateString()}
                     </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 0.5; height: 15%; }
          100% { opacity: 1; height: 100%; }
        }
      `}} />
    </div>
  );
};
