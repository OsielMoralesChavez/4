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

function ProfileApp() {
    const [isEditing, setIsEditing] = React.useState(false);
    const [profile, setProfile] = React.useState({
        about: "¡Hola! Soy estudiante apasionado por el desarrollo Frontend y las tecnologías web modernas. Actualmente aprendiendo React, Tailwind y explorando el mundo del diseño UI/UX.",
        academic: {
            carrera: "Ingeniería de Software",
            semestre: "8vo Semestre",
            matricula: "USB-2023-456"
        },
        skills: ["React.js", "JavaScript", "HTML/CSS", "Git"],
        contact: {
            email: "carlos.ruiz@usb.edu",
            github: "github.com/carlosruiz"
        },
        newSkill: ""
    });

    const handleSave = () => {
        setIsEditing(false);
        // Normally save to DB here
    };

    const addSkill = (e) => {
        if(e.key === 'Enter' && profile.newSkill.trim()) {
            setProfile({...profile, skills: [...profile.skills, profile.newSkill.trim()], newSkill: ''});
        }
    };

    const removeSkill = (skillToRemove) => {
        setProfile({...profile, skills: profile.skills.filter(s => s !== skillToRemove)});
    };

    return (
        <div className="min-h-screen pb-20 relative overflow-hidden" data-name="profile-app">
            <Background />
            <Navbar activePage="dashboard" />
            
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="card overflow-hidden mb-6 p-0">
                    <div className="h-40 relative" style={{ background: 'linear-gradient(135deg, var(--accent-color), var(--primary-color))' }}>
                        {isEditing && (
                            <button className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-md backdrop-blur-sm transition-colors text-sm flex items-center gap-2">
                                <Icon name="camera" size="text-sm" />
                                Cambiar portada
                            </button>
                        )}
                    </div>
                    <div className="px-8 pb-8 relative">
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 mb-4">
                            <div className="relative">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" alt="Carlos Ruiz" className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-transparent bg-black/20 shadow-[0_0_20px_var(--accent-color)]" />
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 hover:bg-white/40 text-white transition-colors">
                                        <Icon name="camera" size="text-sm" />
                                    </button>
                                )}
                            </div>
                            <div className="flex-grow pt-14 sm:pt-0">
                                <h1 className="text-3xl font-bold text-white drop-shadow-md">Carlos Ruiz</h1>
                                <p className="text-white/70 font-medium">Estudiante</p>
                            </div>
                            <div className="w-full sm:w-auto pt-4 sm:pt-0">
                                {isEditing ? (
                                    <button onClick={handleSave} className="w-full sm:w-auto px-6 py-2.5 bg-green-500/20 border border-green-500/50 text-green-300 rounded-[18px] hover:bg-green-500/30 transition-colors font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                        <Icon name="save" size="text-sm" />
                                        Guardar Cambios
                                    </button>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="w-full sm:w-auto px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-[18px] hover:bg-white/20 transition-colors font-bold flex items-center justify-center gap-2">
                                        <Icon name="pencil" size="text-sm" />
                                        Editar Perfil
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                            <div className="col-span-2 space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 drop-shadow-sm">
                                        <Icon name="user-round" className="text-[var(--accent-color)]" />
                                        Sobre mí
                                    </h3>
                                    {isEditing ? (
                                        <textarea 
                                            className="w-full bg-black/20 border border-white/20 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-[var(--accent-color)]"
                                            rows="4"
                                            value={profile.about}
                                            onChange={e => setProfile({...profile, about: e.target.value})}
                                        />
                                    ) : (
                                        <p className="text-white/80 leading-relaxed text-sm bg-black/10 p-4 rounded-xl border border-white/5">
                                            {profile.about}
                                        </p>
                                    )}
                                </div>
                                
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 drop-shadow-sm">
                                        <Icon name="book-open" className="text-[var(--accent-color)]" />
                                        Información Académica
                                    </h3>
                                    <div className="bg-black/10 rounded-xl p-5 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-xs text-[var(--accent-color)] uppercase font-semibold mb-1">Carrera</p>
                                            {isEditing ? <input type="text" className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white text-sm focus:outline-none" value={profile.academic.carrera} onChange={e => setProfile({...profile, academic: {...profile.academic, carrera: e.target.value}})} /> : <p className="font-medium text-white">{profile.academic.carrera}</p>}
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--accent-color)] uppercase font-semibold mb-1">Semestre Actual</p>
                                            {isEditing ? <input type="text" className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white text-sm focus:outline-none" value={profile.academic.semestre} onChange={e => setProfile({...profile, academic: {...profile.academic, semestre: e.target.value}})} /> : <p className="font-medium text-white">{profile.academic.semestre}</p>}
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--accent-color)] uppercase font-semibold mb-1">Matrícula</p>
                                            {isEditing ? <input type="text" className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white text-sm focus:outline-none" value={profile.academic.matricula} onChange={e => setProfile({...profile, academic: {...profile.academic, matricula: e.target.value}})} /> : <p className="font-medium text-white">{profile.academic.matricula}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="bg-black/10 rounded-xl p-5 border border-white/5">
                                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-[var(--accent-color)]">Habilidades</h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {profile.skills.map(skill => (
                                            <span key={skill} className="px-3 py-1 bg-[var(--primary-color)]/30 text-white text-xs font-medium rounded-full border border-[var(--accent-color)]/30 flex items-center gap-1 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                                                {skill}
                                                {isEditing && <button onClick={() => removeSkill(skill)}><Icon name="x" size="text-xs" className="hover:text-red-400" /></button>}
                                            </span>
                                        ))}
                                    </div>
                                    {isEditing && (
                                        <input 
                                            type="text" 
                                            placeholder="Añadir habilidad y Enter..." 
                                            className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-[var(--accent-color)]"
                                            value={profile.newSkill}
                                            onChange={e => setProfile({...profile, newSkill: e.target.value})}
                                            onKeyDown={addSkill}
                                        />
                                    )}
                                </div>
                                
                                <div className="bg-black/10 rounded-xl p-5 border border-white/5">
                                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-[var(--accent-color)]">Contacto</h3>
                                    <ul className="space-y-4 text-sm">
                                        <li className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-white/50"><Icon name="mail" size="text-sm" /> Correo</div>
                                            {isEditing ? <input type="email" className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white text-sm" value={profile.contact.email} onChange={e => setProfile({...profile, contact: {...profile.contact, email: e.target.value}})} /> : <span className="text-white">{profile.contact.email}</span>}
                                        </li>
                                        <li className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-white/50"><Icon name="link" size="text-sm" /> GitHub</div>
                                            {isEditing ? <input type="text" className="w-full bg-black/20 border border-white/20 rounded-lg p-2 text-white text-sm" value={profile.contact.github} onChange={e => setProfile({...profile, contact: {...profile.contact, github: e.target.value}})} /> : <a href="#" className="text-[var(--accent-color)] hover:underline">{profile.contact.github}</a>}
                                        </li>
                                    </ul>
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
root.render(<ErrorBoundary><ProfileApp /></ErrorBoundary>);