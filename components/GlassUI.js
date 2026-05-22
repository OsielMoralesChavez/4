// 1. Barra de Búsqueda (Search Bar)
function GlassSearchBar({ placeholder = "Buscar...", className = "" }) {
    return (
        <div className={`glass-component rounded-full flex items-center px-4 py-2.5 gap-3 ${className}`}>
            <Icon name="search" className="text-white/70" size="text-lg" />
            <input 
                type="text" 
                placeholder={placeholder}
                className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-white/50"
            />
        </div>
    );
}

// 2. Tarjeta de Contenido (Content Card)
function GlassCard({ title, children, className = "" }) {
    return (
        <div className={`glass-component p-5 rounded-[20px] ${className}`}>
            {title && <h3 className="font-bold text-[#FFFFFF] mb-4">{title}</h3>}
            {children || (
                <div className="space-y-3">
                    <div className="h-3 bg-white/20 rounded-full w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded-full w-full"></div>
                    <div className="h-3 bg-white/20 rounded-full w-5/6"></div>
                </div>
            )}
        </div>
    );
}

// 3. Panel de Ajustes (Settings Modal/Pop-over)
function GlassSettingsPanel({ title = "Ajustes", className = "" }) {
    const [isOn, setIsOn] = React.useState(true);
    const [sliderVal, setSliderVal] = React.useState(50);

    return (
        <div className={`glass-component p-6 rounded-[24px] ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-xl shadow-sm">
                    <Icon name="settings" className="text-white" size="text-xl" />
                </div>
                <h3 className="font-bold text-white text-lg">{title}</h3>
            </div>
            
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/90">Notificaciones</span>
                    <button 
                        onClick={() => setIsOn(!isOn)}
                        className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${isOn ? 'bg-blue-500/80' : 'bg-gray-400/30'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${isOn ? 'left-6' : 'left-0.5'}`}></div>
                    </button>
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium text-white/90">
                        <span>Volumen</span>
                        <span>{sliderVal}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" max="100" 
                        value={sliderVal}
                        onChange={(e) => setSliderVal(e.target.value)}
                        className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-400"
                    />
                </div>
            </div>
        </div>
    );
}

// 4. Botón de Acción (Action Button)
function GlassButton({ children, onClick, className = "", variant = "primary" }) {
    const bgClass = variant === 'primary' 
        ? 'bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/80 border-white/30 text-white shadow-lg' 
        : 'bg-white/20 hover:bg-white/30 border-white/40 text-white';

    return (
        <button 
            onClick={onClick}
            className={`glass-component ${bgClass} px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 ${className}`}
        >
            {children}
        </button>
    );
}

// 5. Avatar / Perfil
function GlassAvatar({ src, name, size = "w-12 h-12", className = "" }) {
    return (
        <div className={`glass-component ${size} rounded-[16px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-white/40 to-white/10 ${className}`}>
            {src ? (
                <img src={src} alt={name || "Avatar"} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
            ) : (
                <Icon name="user" className="text-gray-700" />
            )}
        </div>
    );
}