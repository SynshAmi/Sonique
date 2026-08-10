export const DashboardPlaceholder = () => {
  const handleLogout = () => {
    localStorage.removeItem("sonique_jwt");
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sonique-surface to-sonique-bg opacity-50 pointer-events-none"></div>
      
      <div className="z-10 text-center space-y-6">
        <h1 className="text-4xl md:text-6xl text-white">Dashboard Placeholder</h1>
        <p className="text-gray-400 max-w-md mx-auto text-lg">
          You have successfully authenticated.
        </p>
        <button
          onClick={handleLogout}
          className="mt-8 px-6 py-3 border border-sonique-lime text-sonique-lime hover:bg-sonique-lime hover:text-black transition-colors font-bold uppercase tracking-widest text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
