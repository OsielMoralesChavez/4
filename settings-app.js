class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <div className="p-8 text-center">Algo salió mal.</div>;
    return this.props.children;
  }
}

function SettingsApp() {
    const [darkMode, setDarkMode] = React.useState(false);
    
    React.useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark';
        setDarkMode(isDark);
        if (isDark) document.body.classList.add('dark-mode');
    }, []);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className="min-h-screen pb-20 bg-transparent" data-name="settings-app">
            <Background />
            <Navbar activePage="dashboard" />
            
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Configuración</h1>
                
                <div className="card rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    {/* Apariencia */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Icon name="palette" className="text-[var(--primary-color)]" size="text-xl" />
                            <h2 className="text-lg font-semibold text-gray-900">Apariencia</h2>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-gray-900">Modo Oscuro</p>
                                <p className="text-sm text-gray-500">Cambia el tema de la aplicación para reducir la fatiga visual.</p>
                            </div>
                            <button 
                                onClick={toggleTheme}
                                className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-[var(--primary-color)]' : 'bg-gray-300'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${darkMode ? 'left-6' : 'left-0.5'}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* Notificaciones */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <Icon name="bell" className="text-[var(--primary-color)]" size="text-xl" />
                            <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Notificaciones de correo</p>
                                    <p className="text-sm text-gray-500">Recibir correos sobre anuncios importantes.</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Mensajes Directos</p>
                                    <p className="text-sm text-gray-500">Notificarme cuando reciba un mensaje en la plataforma.</p>
                                </div>
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300" />
                            </div>
                        </div>
                    </div>

                    {/* Privacidad */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Icon name="lock" className="text-[var(--primary-color)]" size="text-xl" />
                            <h2 className="text-lg font-semibold text-gray-900">Privacidad y Seguridad</h2>
                        </div>
                        <div className="space-y-4">
                            <button className="w-full text-left px-4 py-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                                <p className="font-medium text-gray-900">Cambiar Contraseña</p>
                                <p className="text-sm text-gray-500">Actualiza tu contraseña periódicamente por seguridad.</p>
                            </button>
                            <div className="w-full text-left px-4 py-4 rounded-md border border-gray-200 bg-white transition-colors">
                                <p className="font-medium text-gray-900 mb-1">Personalización de perfil</p>
                                <p className="text-sm text-gray-500 mb-4">Elige el tema de colores de tu preferencia para personalizar la plataforma.</p>
                                
                                <div className="flex gap-6 mt-2">
                                    <button onClick={() => window.setAppTheme('default')} className="flex flex-col items-center gap-2 group focus:outline-none">
                                        <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden flex cursor-pointer group-hover:scale-105 group-hover:shadow-md transition-all">
                                            <div className="w-1/2 h-full bg-[#213A5C]"></div>
                                            <div className="w-1/2 h-full bg-[#F1F1F1]"></div>
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium group-hover:text-[var(--primary-color)]">Original</span>
                                    </button>
                                    
                                    <button onClick={() => window.setAppTheme('theme1')} className="flex flex-col items-center gap-2 group focus:outline-none">
                                        <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden flex cursor-pointer group-hover:scale-105 group-hover:shadow-md transition-all">
                                            <div className="w-1/2 h-full bg-[#510004]"></div>
                                            <div className="w-1/2 h-full bg-[#ffb7ff]"></div>
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium group-hover:text-[var(--primary-color)]">Carmesí</span>
                                    </button>
                                    
                                    <button onClick={() => window.setAppTheme('theme2')} className="flex flex-col items-center gap-2 group focus:outline-none">
                                        <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden flex cursor-pointer group-hover:scale-105 group-hover:shadow-md transition-all">
                                            <div className="w-1/2 h-full bg-[#12101f]"></div>
                                            <div className="w-1/2 h-full bg-[#ba9ee5]"></div>
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium group-hover:text-[var(--primary-color)]">Nocturno</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><SettingsApp /></ErrorBoundary>);