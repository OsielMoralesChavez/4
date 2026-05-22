// Setup Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) return <div className="text-white text-center p-4">Algo salió mal.</div>;
    return this.props.children;
  }
}

function LoginPage() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [time, setTime] = React.useState('');
    const [role, setRole] = React.useState('student');
    const [errorMsg, setErrorMsg] = React.useState('');

    React.useEffect(() => {
        // Get role from URL query params
        const params = new URLSearchParams(window.location.search);
        const urlRole = params.get('role');
        if (urlRole) setRole(urlRole);

        // Update time clock
        const updateTime = () => {
            const now = new Date();
            setTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (!email.toLowerCase().endsWith('@usb.edu.mx')) {
            setErrorMsg('Solo se permiten correos institucionales (@usb.edu.mx)');
            return;
        }
        setErrorMsg('');
        localStorage.setItem('userRole', role);
        window.location.href = 'dashboard.html';
    };

    return (
        <div className="h-screen w-full flex justify-center items-center relative overflow-hidden bg-transparent" data-name="login-page" data-file="login-app.js">
            <Background />

            <div className="futuristic-phone z-10 flex flex-col relative">
                
                {/* Inner floating circle from original design */}
                <div className="absolute w-[120px] h-[120px] rounded-full top-[100px] right-[-30px] blur-[10px] pointer-events-none" 
                     style={{ background: 'radial-gradient(circle, var(--accent-color), transparent 70%)', opacity: 0.5 }}>
                </div>

                {/* Top Bar */}
                <div className="flex justify-between items-center mb-6">
                    <div className="w-[45px] h-[45px] rounded-full flex justify-center items-center text-lg backdrop-blur-md border border-white/15 bg-white/10">
                        <Icon name="zap" className="text-white" />
                    </div>
                    <div className="text-white font-medium">{time}</div>
                </div>

                {/* Title and Subtitle */}
                <div className="mt-4">
                    <h1 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-md">
                        4everUSB<br />
                        Future.
                    </h1>
                    <p className="mt-3 text-white/70 text-sm leading-relaxed">
                        Conectando mentes de código con diseño moderno y efectos neón.
                    </p>
                </div>

                {/* Role Selection (adapted for this UI) */}
                <div className="flex gap-2 mt-5">
                    <button onClick={() => setRole('student')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${role === 'student' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        Estudiante
                    </button>
                    <button onClick={() => setRole('teacher')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${role === 'teacher' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        Docente
                    </button>
                </div>

                {/* Login Card */}
                <div className="glass-card-inner">
                    <h3 className="text-lg font-bold text-white mb-2">Iniciar sesión</h3>
                    {errorMsg && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs p-2 rounded-lg mb-3">
                            {errorMsg}
                        </div>
                    )}
                    <form onSubmit={handleLogin}>
                        <input 
                            className="futuristic-input" 
                            type="email" 
                            placeholder="Correo electrónico" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input 
                            className="futuristic-input" 
                            type="password" 
                            placeholder="Contraseña" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="futuristic-btn">ENTRAR</button>
                    </form>
                </div>

                {/* Bottom Nav */}
                <div className="bottom-nav-glass z-20">
                    <a href="index.html" className="nav-item-glass"><Icon name="house" /></a>
                    <div className="nav-item-glass"><Icon name="heart" /></div>
                    <div className="nav-item-glass"><Icon name="search" /></div>
                    <div className="nav-item-glass active"><Icon name="user" /></div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <LoginPage />
  </ErrorBoundary>
);