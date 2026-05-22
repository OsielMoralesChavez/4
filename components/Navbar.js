function Navbar({ activePage = "dashboard", currentTab = "feed", onTabChange }) {
    const isDashboard = activePage === "dashboard";
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isNotifOpen, setIsNotifOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const notifRef = React.useRef(null);

    React.useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const handleLogout = () => {
        window.location.href = "index.html";
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }} data-file="components/Navbar.js">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-8">
                        <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" onClick={() => window.location.href = "dashboard.html"}>
                            <div className="w-10 h-10 rounded-full flex justify-center items-center text-lg bg-white/10 border border-white/15 shadow-[0_0_10px_var(--accent-color)] group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold font-mono">⚡</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">4everUSB</span>
                        </div>
                        
                        {isDashboard && (
                            <div className="hidden md:flex space-x-8">
                                <a 
                                    href={onTabChange ? "#" : "dashboard.html"} 
                                    onClick={(e) => { if(onTabChange) { e.preventDefault(); onTabChange('feed'); } }}
                                    className={`${currentTab === 'feed' ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'} py-5 transition-colors text-sm font-medium flex items-center gap-2`}
                                >
                                    <Icon name="house" size="text-lg" />
                                    Feed
                                </a>
                                <a 
                                    href={onTabChange ? "#" : "dashboard.html"} 
                                    onClick={(e) => { if(onTabChange) { e.preventDefault(); onTabChange('community'); } }}
                                    className={`${currentTab === 'community' ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'} py-5 transition-colors text-sm font-medium flex items-center gap-2`}
                                >
                                    <Icon name="users" size="text-lg" />
                                    Comunidad
                                </a>
                                <a 
                                    href={onTabChange ? "#" : "dashboard.html"} 
                                    onClick={(e) => { if(onTabChange) { e.preventDefault(); onTabChange('resources'); } }}
                                    className={`${currentTab === 'resources' ? 'text-white border-b-2 border-white' : 'text-gray-300 hover:text-white'} py-5 transition-colors text-sm font-medium flex items-center gap-2`}
                                >
                                    <Icon name="briefcase" size="text-lg" />
                                    Recursos
                                </a>
                            </div>
                        )}
                    </div>
                    
                    {isDashboard ? (
                        <div className="flex items-center gap-4">
                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
                                    className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 relative transition-colors"
                                >
                                    <Icon name="bell" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[var(--primary-color)]"></span>
                                </button>

                                {isNotifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                            <h3 className="text-sm font-bold text-[var(--primary-color)]">Notificaciones</h3>
                                            <button className="text-xs text-blue-600 hover:text-blue-800">Marcar leídas</button>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {typeof MOCK_NOTIFICATIONS !== 'undefined' && MOCK_NOTIFICATIONS.map(notif => (
                                                <div key={notif.id} className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                            notif.type === 'announcement' ? 'bg-orange-100 text-orange-600' :
                                                            notif.type === 'message' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            <Icon name={
                                                                notif.type === 'announcement' ? 'megaphone' : 
                                                                notif.type === 'message' ? 'mail' : 'bell'
                                                            } size="text-sm" />
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{notif.text}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 text-center border-t border-gray-100">
                                            <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-800">Ver todas</a>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
                                    className="flex items-center gap-2 focus:outline-none group"
                                >
                                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-400/30 ring-offset-2 ring-offset-[var(--primary-color)] group-hover:ring-2 ring-white/20 transition-all">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" alt="Profile" />
                                    </div>
                                    <Icon name="chevron-down" size="text-sm" className={`text-gray-300 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl py-1 border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                            <p className="text-sm font-semibold text-[var(--primary-color)]">Carlos Ruiz</p>
                                            <p className="text-xs text-gray-500 truncate">carlos.ruiz@usb.edu</p>
                                        </div>
                                        
                                        <div className="py-1">
                                            <a href="profile.html" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-[var(--primary-color)] transition-colors">
                                                <Icon name="user" size="text-base" className="text-gray-400" />
                                                Mi Perfil
                                            </a>
                                            <a href="settings.html" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-[var(--primary-color)] transition-colors">
                                                <Icon name="settings" size="text-base" className="text-gray-400" />
                                                Configuración
                                            </a>
                                            <a href="support.html" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-[var(--primary-color)] transition-colors">
                                                <Icon name="circle-help" size="text-base" className="text-gray-400" />
                                                Ayuda y Soporte
                                            </a>
                                        </div>
                                        
                                        <div className="border-t border-gray-100 py-1">
                                            <button 
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Icon name="log-out" size="text-base" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                             <a href="login.html" className="text-sm font-medium text-white hover:text-gray-200">Iniciar Sesión</a>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}