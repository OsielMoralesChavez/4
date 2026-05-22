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
    if (this.state.hasError) return <div className="p-8 text-center">Algo salió mal. Por favor recarga.</div>;
    return this.props.children;
  }
}

function LandingPage() {
    React.useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });

        const handleScroll = () => {
            const scrolled = window.scrollY;
            const bgImage = document.getElementById('hero-bg');
            if (bgImage) {
                bgImage.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogin = (role) => {
        window.location.href = `login.html?role=${role}`;
    };

    return (
        <div className="min-h-screen flex flex-col" data-name="landing-page" data-file="app.js">
            <Background />
            <Navbar activePage="landing" />
            
            {/* Hero Section */}
            <main className="flex-grow">
                <div className="relative overflow-hidden min-h-screen flex items-center">
                    <section className="relative z-10 max-w-5xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg" style={{ textShadow: '0 0 20px var(--accent-color)' }}>
                            UNIVERSIDAD SIMÓN BOLÍVAR.
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium" data-aos="fade-up" data-aos-delay="100">
                            Una comunidad enfocada y exclusiva diseñada para toda la comunidad de la USB con diseño moderno y efectos neón.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center" id="login" data-aos="fade-up" data-aos-delay="200">
                            <button 
                                onClick={() => handleLogin('student')}
                                className="btn btn-primary text-lg px-8 py-4 w-full sm:w-auto"
                            >
                                <Icon name="user" className="text-white" />
                                Soy Estudiante
                            </button>
                            <button 
                                onClick={() => handleLogin('teacher')}
                                className="btn btn-outline text-lg px-8 py-4 w-full sm:w-auto"
                            >
                                <Icon name="graduation-cap" className="text-white" />
                                Soy Docente
                            </button>
                        </div>
                    </section>
                </div>

                {/* Features / Mission Vision Values */}
                <section className="py-24 relative z-10" id="features">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {/* Misión */}
                            <div className="card flex flex-col" data-aos="fade-up" data-aos-delay="0">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_var(--accent-color)]" style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))' }}>
                                    <Icon name="target" className="text-white text-2xl" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide">MISIÓN</h3>
                                <p className="text-white/70 leading-relaxed text-sm flex-grow text-justify">
                                    Formar personas a nivel universitario orientadas a la búsqueda de la Verdad, que se desempeñen profesionalmente con responsabilidad y calidad, para que contribuyan a la edificación del bien común bajo la guía del carisma franciscano.
                                </p>
                            </div>
                            
                            {/* Visión */}
                            <div className="card flex flex-col" data-aos="fade-up" data-aos-delay="100">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_var(--accent-color)]" style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))' }}>
                                    <Icon name="telescope" className="text-white text-2xl" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide">VISIÓN</h3>
                                <p className="text-white/70 leading-relaxed text-sm flex-grow text-justify">
                                    Ser un referente nacional entre las universidades de inspiración cristiana por la calidad en sus servicios educativos, orientados a la formación humana e interdisciplinaria de profesionistas competentes.
                                </p>
                            </div>
                            
                            {/* Valores */}
                            <div className="card flex flex-col" data-aos="fade-up" data-aos-delay="200">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_var(--accent-color)]" style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))' }}>
                                    <Icon name="heart-handshake" className="text-white text-2xl" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white uppercase tracking-wide">VALORES</h3>
                                <ul className="space-y-3 text-white/70 text-sm flex-grow">
                                    <li className="flex items-center gap-3">
                                        <Icon name="check" className="text-[var(--accent-color)] w-5 h-5" />
                                        <span>Fraternidad</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Icon name="check" className="text-[var(--accent-color)] w-5 h-5" />
                                        <span>Humildad</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Icon name="check" className="text-[var(--accent-color)] w-5 h-5" />
                                        <span>Paz y Bien</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Icon name="check" className="text-[var(--accent-color)] w-5 h-5" />
                                        <span>Servicio y Entrega</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Icon name="check" className="text-[var(--accent-color)] w-5 h-5" />
                                        <span>Respeto a la Creación</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 relative z-10 border-t border-white/10" style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
                <div className="max-w-5xl mx-auto px-4 text-center text-sm text-white/60">
                    <p>&copy; 2026 4everUSB. Glassmorphism Edition.</p>
                </div>
            </footer>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <LandingPage />
  </ErrorBoundary>
);