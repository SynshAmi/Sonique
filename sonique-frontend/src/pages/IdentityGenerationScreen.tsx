export const IdentityGenerationScreen = () => {
  return (
    <div className="min-h-screen bg-sonique-bg flex flex-col items-center justify-center font-hanken text-gray-200 overflow-hidden relative p-8">
      
      {/* Background Noise Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sonique-cyan/10 rounded-full blur-[150px] pointer-events-none animate-pulse duration-3000"></div>

      <div className="z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center space-y-10">
        
        {/* Pulsing Core */}
        <div className="relative flex items-center justify-center mb-8">
          <div className="absolute w-32 h-32 bg-sonique-lime rounded-full opacity-20 blur-2xl animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="w-16 h-16 border-2 border-sonique-lime rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
            <div className="w-8 h-8 bg-sonique-lime/50 rounded-full blur-md"></div>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-syne font-extrabold leading-tight text-white tracking-tighter uppercase">
            Give us a moment. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sonique-lime to-sonique-cyan">
              We're tuning your sonic identity.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light max-w-md mx-auto leading-relaxed">
            We're analyzing your listening history and building your Sonique profile. This may take a little while.
          </p>
        </div>

      </div>

      {/* Abstract Audio Visualizer */}
      <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center gap-1 px-4 opacity-30 pointer-events-none pb-4 z-0">
        {[...Array(40)].map((_, i) => (
          <div 
            key={i} 
            className="w-2 bg-sonique-lime transition-all duration-300 ease-in-out animate-pulse" 
            style={{ 
              height: `${Math.max(10, Math.random() * 100)}%`,
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: `${0.5 + Math.random() * 1.5}s`
            }}
          ></div>
        ))}
      </div>

    </div>
  );
};
