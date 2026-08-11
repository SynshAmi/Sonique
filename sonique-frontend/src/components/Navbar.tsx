import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from '../hooks/useRouter';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPath, navigate } = useRouter();

  const navItems = [
    { label: 'IDENTITY', path: '/identity' },
    { label: 'COMPATIBILITY', path: '/compatibility' },
    { label: 'ACCOUNT', path: '/account' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/identity') {
      return currentPath === '/' || currentPath.startsWith('/identity');
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-sonique-bg/80 backdrop-blur-md border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => handleNav('/identity')}
          className="font-syne font-extrabold text-2xl tracking-tighter text-white uppercase cursor-pointer hover:text-sonique-lime transition-colors"
        >
          SONIQUE
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                isActive(item.path) 
                  ? 'text-sonique-lime drop-shadow-[0_0_8px_rgba(191,255,0,0.5)] border-b-2 border-sonique-lime py-1' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white hover:text-sonique-lime transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-sonique-bg border-b border-gray-800/50 py-4 px-6 flex flex-col gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`font-mono text-sm uppercase tracking-[0.2em] text-left transition-all ${
                isActive(item.path) 
                  ? 'text-sonique-lime drop-shadow-[0_0_8px_rgba(191,255,0,0.5)] pl-2 border-l-2 border-sonique-lime' 
                  : 'text-gray-400 hover:text-white pl-2 border-l-2 border-transparent'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
