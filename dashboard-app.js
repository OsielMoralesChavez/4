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

function CreatePostInput({ onPublish }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [errors, setErrors] = React.useState([]);
    const [cursorPos, setCursorPos] = React.useState(0);
    const [isChecking, setIsChecking] = React.useState(false);
    const [toast, setToast] = React.useState(null);
    const [selectedMedia, setSelectedMedia] = React.useState(null);
    const [profanityError, setProfanityError] = React.useState('');
    const fileInputRef = React.useRef(null);
    
    // Diccionario básico de groserías/insultos
    const BAD_WORDS = ['puto', 'puta', 'pendejo', 'pendeja', 'mierda', 'cabron', 'cabrona', 'chinga', 'verga', 'pene', 'idiota', 'estupido', 'estúpido', 'estupida', 'estúpida', 'imbecil', 'imbécil', 'zorra', 'perra'];
    
    const textareaRef = React.useRef(null);
    const checkTimeout = React.useRef(null);

    const checkSpelling = async (text) => {
        if (!text.trim()) {
            setErrors([]);
            return;
        }
        setIsChecking(true);
        try {
            const response = await fetch('https://proxy-api.trickle-app.host/?url=https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ text: text, language: 'es' })
            });
            const data = await response.json();
            setErrors(data.matches || []);
        } catch (error) {
            console.error('Error en corrección ortográfica:', error);
        } finally {
            setIsChecking(false);
        }
    };

    const handleChange = (e) => {
        const newText = e.target.value;
        setContent(newText);
        setCursorPos(e.target.selectionStart);

        if (checkTimeout.current) clearTimeout(checkTimeout.current);
        checkTimeout.current = setTimeout(() => {
            checkSpelling(newText);
        }, 800);
    };

    const handleSelect = (e) => {
        setCursorPos(e.target.selectionStart);
    };

    const applyCorrection = (error, replacement) => {
        const before = content.slice(0, error.offset);
        const after = content.slice(error.offset + error.length);
        const newContent = before + replacement + after;
        
        setContent(newContent);
        setErrors(prev => prev.filter(e => e !== error));
        
        // Ajustar el cursor y volver a revisar después de la actualización
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newPos = error.offset + replacement.length;
                textareaRef.current.setSelectionRange(newPos, newPos);
                setCursorPos(newPos);
                checkSpelling(newContent);
            }
        }, 0);
    };

    const handlePublish = () => {
        if (!content.trim() && !title.trim() && !selectedMedia) return;
        
        // Comprobar groserías
        const textToCheck = (title + ' ' + content).toLowerCase();
        const hasProfanity = BAD_WORDS.some(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'i');
            return regex.test(textToCheck);
        });

        if (hasProfanity) {
            setProfanityError("Tu publicación contiene lenguaje inapropiado y no puede ser compartida.");
            setTimeout(() => setProfanityError(''), 5000);
            return;
        }
        
        // Extract tags from content
        const hashtagRegex = /#[\wñáéíóú]+/gi;
        const extractedTags = (content.match(hashtagRegex) || []).map(t => t.slice(1));
        
        if (onPublish) {
            onPublish({
                title: title.trim() || 'Sin título',
                content: content.trim(),
                tags: extractedTags.length > 0 ? extractedTags : ['General'],
                media: selectedMedia
            });
        }

        setToast("¡Publicación compartida exitosamente!");
        setTimeout(() => setToast(null), 3000);
        setTitle('');
        setContent('');
        setErrors([]);
        setProfanityError('');
        setSelectedMedia(null);
        setIsExpanded(false);
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedMedia(URL.createObjectURL(file));
            setIsExpanded(true);
        }
    };

    const activeError = errors.find(e => cursorPos >= e.offset && cursorPos <= e.offset + e.length);

    // Preparar renderizado de fondo (Highlights de errores y hashtags)
    const charArray = content.split('').map(c => ({ char: c, className: 'text-gray-800' }));
    
    // Identificar y colorear Hashtags
    const hashtagRegex = /#[\wñáéíóú]+/gi;
    let match;
    while ((match = hashtagRegex.exec(content)) !== null) {
        for (let i = match.index; i < match.index + match[0].length; i++) {
            if(charArray[i]) charArray[i].className = 'text-blue-600 font-semibold';
        }
    }
    
    // Identificar y subrayar errores ortográficos
    errors.forEach(err => {
        // Ignorar si LanguageTool marca un hashtag como error
        if (content[err.offset] === '#') return;
        for (let i = err.offset; i < err.offset + err.length; i++) {
            if (charArray[i]) {
                charArray[i].className = charArray[i].className.replace('text-gray-800', 'text-red-700');
                charArray[i].className += ' underline decoration-red-500 decoration-wavy decoration-2 underline-offset-4 bg-red-50/40';
            }
        }
    });

    // Asegurar que el último salto de línea no colapse el div
    if (content.endsWith('\n')) {
        charArray.push({ char: ' ', className: '' });
    }

    const textStyle = "font-sans text-sm leading-relaxed m-0 p-0 border-none w-full h-[120px] text-left align-top whitespace-pre-wrap break-words";

    return (
        <div className="card mb-6 transition-all duration-200">
            {toast && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                    <Icon name="circle-check" size="text-xl" />
                    <span className="font-medium">{toast}</span>
                </div>
            )}
            
            <div className={`flex gap-3 ${isExpanded ? 'items-start' : 'items-center'}`}>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="Me" />
                </div>
                <div className="flex-grow">
                    {!isExpanded ? (
                        <div 
                            onClick={() => setIsExpanded(true)}
                            className="bg-gray-50 text-gray-500 rounded-md px-4 py-2.5 cursor-text text-sm hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                        >
                            ¿Qué estás codeando hoy? Usa # para añadir tendencias...
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-200 flex flex-col">
                            <input 
                                type="text" 
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Título breve y descriptivo..." 
                                className="w-full text-lg font-bold mb-3 placeholder-gray-400 outline-none bg-transparent"
                                autoFocus
                            />
                            
                            {profanityError && (
                                <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-md border border-red-200 mb-3 flex items-center gap-2">
                                    <Icon name="circle-alert" size="text-sm" />
                                    {profanityError}
                                </div>
                            )}

                            <div className="relative w-full mb-2 bg-gray-50/50 rounded-md p-3 border border-gray-200 focus-within:border-[var(--primary-color)] transition-colors">
                                {/* Capa de Fondo - Muestra colores y subrayados */}
                                <div className={`absolute inset-0 p-3 pointer-events-none z-0 overflow-hidden ${textStyle}`}>
                                    {charArray.map((c, i) => (
                                        <span key={i} className={c.className}>{c.char}</span>
                                    ))}
                                    {!content && <span className="text-gray-400">Describe tu problema o idea... (ej. Hola comunidad, tengo un error en #React)</span>}
                                </div>
                                
                                {/* Capa Interactiva - Textarea transparente para escribir */}
                                <textarea 
                                    ref={textareaRef}
                                    value={content}
                                    onChange={handleChange}
                                    onClick={handleSelect}
                                    onKeyUp={handleSelect}
                                    className={`relative z-10 bg-transparent text-transparent caret-black outline-none resize-none overflow-y-auto ${textStyle} [&::placeholder]:text-transparent`}
                                    spellCheck={false}
                                    ></textarea>
                            </div>

                            {selectedMedia && (
                                <div className="relative inline-block mb-3">
                                    <img src={selectedMedia} alt="Media" className="max-h-40 rounded-lg border border-gray-200 shadow-sm" />
                                    <button 
                                        onClick={() => setSelectedMedia(null)}
                                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 text-gray-500 hover:text-red-500"
                                    >
                                        <Icon name="x" size="text-xs" />
                                    </button>
                                </div>
                            )}
                            
                            {isChecking && (
                                <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                                    <Icon name="loader" className="animate-spin text-gray-400" size="text-xs" /> 
                                    Revisando ortografía...
                                </div>
                            )}

                            {activeError && activeError.replacements && activeError.replacements.length > 0 && (
                                <div className="bg-white border border-red-200 shadow-md rounded-md p-3 mb-3 animate-in fade-in slide-in-from-top-1 relative z-20">
                                    <div className="text-xs text-red-600 mb-2 font-medium flex items-center gap-1">
                                        <Icon name="circle-alert" size="text-sm" />
                                        {activeError.message}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {activeError.replacements.slice(0, 4).map(rep => (
                                            <button 
                                                key={rep.value}
                                                onClick={() => applyCorrection(activeError, rep.value)}
                                                className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-full text-xs font-medium transition-colors border border-red-100"
                                            >
                                                {rep.value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                                <div className="flex gap-3 text-xs text-gray-500 items-center">
                                    <input 
                                        type="file" 
                                        accept="image/*,video/*" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        onChange={handleMediaChange} 
                                    />
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-1 text-gray-500 hover:text-[var(--primary-color)] transition-colors"
                                        title="Subir Imagen/Video"
                                    >
                                        <Icon name="image" size="text-lg" />
                                    </button>
                                    
                                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium border border-blue-100 ml-2 hidden sm:flex">
                                        <Icon name="hash" size="text-xs" /> Tendencias activas
                                    </span>
                                    {errors.length > 0 && (
                                        <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-1 rounded-md font-medium border border-red-100">
                                            <Icon name="circle-x" size="text-xs" /> 
                                            {errors.length}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setIsExpanded(false); setErrors([]); setContent(''); setTitle(''); setSelectedMedia(null); setProfanityError(''); }}
                                        className="btn btn-ghost text-sm text-gray-500"
                                    >
                                        Cancelar
                                    </button>
                                    <button onClick={handlePublish} className="btn btn-primary text-sm px-6">
                                        Publicar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function CommunityView() {
    const [subTab, setSubTab] = React.useState('alumnos');
    const [selectedUser, setSelectedUser] = React.useState(null);
    
    const tabs = [
        { id: 'alumnos', label: 'Alumnos' },
        { id: 'egresados', label: 'Egresados' },
        { id: 'profesores', label: 'Profesores' },
        { id: 'directores', label: 'Directores' }
    ];

    const handleViewProfile = (user) => {
        setSelectedUser(user);
    };

    return (
        <div className="md:col-span-9 relative" data-aos="fade-up">
            {selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedUser(null)}>
                    <div className="card w-full max-w-md relative p-8 shadow-[0_0_30px_var(--accent-color)]" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 text-white/50 hover:text-white" onClick={() => setSelectedUser(null)}>
                            <Icon name="x" size="text-xl" />
                        </button>
                        <div className="text-center mb-6">
                            <img src={selectedUser.avatar} alt="Avatar" className="w-24 h-24 mx-auto rounded-full bg-white/10 mb-4 border-2 border-[var(--accent-color)] shadow-[0_0_15px_var(--accent-color)]" />
                            <h3 className="text-2xl font-bold text-white mb-1">{selectedUser.name}</h3>
                            <p className="text-sm text-[var(--accent-color)] uppercase tracking-wider font-semibold">{selectedUser.role}</p>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-white/60 mb-1 flex items-center gap-2"><Icon name="mail" size="text-sm" /> Correo</p>
                                <p className="text-white font-medium">{selectedUser.name.toLowerCase().replace(' ', '.')}@usb.edu</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="text-white/60 mb-2 flex items-center gap-2"><Icon name="code" size="text-sm" /> Habilidades Destacadas</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-[var(--accent-color)]/20 rounded-md text-[var(--accent-color)] text-xs border border-[var(--accent-color)]/30">React</span>
                                    <span className="px-2 py-1 bg-[var(--accent-color)]/20 rounded-md text-[var(--accent-color)] text-xs border border-[var(--accent-color)]/30">JavaScript</span>
                                    <span className="px-2 py-1 bg-[var(--accent-color)]/20 rounded-md text-[var(--accent-color)] text-xs border border-[var(--accent-color)]/30">UI/UX</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button className="btn btn-primary w-full py-3 text-sm"><Icon name="message-circle" /> Enviar Mensaje</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card mb-6 p-0 overflow-hidden">
                <div className="flex border-b border-white/10 overflow-x-auto bg-white/5">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setSubTab(tab.id)}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${
                                subTab === tab.id 
                                ? 'text-white border-b-2 border-white bg-white/10 shadow-[inset_0_-2px_10px_rgba(255,255,255,0.1)]' 
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => {
                    const user = { name: `Usuario ${i}`, role: subTab, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${subTab}${i}` };
                    return (
                    <div key={i} className="card text-center hover:shadow-[0_0_20px_var(--accent-color)] transition-all group">
                        <img 
                            src={user.avatar} 
                            alt="Avatar" 
                            className="w-20 h-20 mx-auto rounded-full bg-white/10 mb-4 border border-white/20 group-hover:scale-105 transition-transform"
                        />
                        <h4 className="font-bold text-white">{user.name}</h4>
                        <p className="text-sm text-white/60 capitalize mb-4">{user.role}</p>
                        <button onClick={() => handleViewProfile(user)} className="btn btn-outline w-full text-sm py-1.5 hover:bg-white/10">Ver Perfil</button>
                    </div>
                )})}
            </div>
        </div>
    );
}

function ResourcesView() {
    const [subTab, setSubTab] = React.useState('mapa');
    
    return (
        <div className="md:col-span-9" data-aos="fade-up">
            <div className="card mb-6 p-0 overflow-hidden">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setSubTab('mapa')}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                            subTab === 'mapa' 
                            ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)] bg-gray-50' 
                            : 'text-gray-500 hover:text-[var(--primary-color)] hover:bg-gray-50'
                        }`}
                    >
                        Mapa USB
                    </button>
                    <button
                        onClick={() => setSubTab('llegar')}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                            subTab === 'llegar' 
                            ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)] bg-gray-50' 
                            : 'text-gray-500 hover:text-[var(--primary-color)] hover:bg-gray-50'
                        }`}
                    >
                        Cómo llegar
                    </button>
                </div>
            </div>

            <div className="card min-h-[400px] flex items-center justify-center bg-gray-50">
                {subTab === 'mapa' ? (
                    <div className="text-center">
                        <Icon name="map" size="text-6xl" className="text-gray-300 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Mapa del Campus Universitario</h3>
                        <p className="text-gray-500 mb-6">Explora las instalaciones, facultades y áreas comunes de la USB.</p>
                        <button className="btn btn-primary mx-auto">Descargar Mapa PDF</button>
                    </div>
                ) : (
                    <div className="text-center">
                        <Icon name="bus" size="text-6xl" className="text-gray-300 mb-4 mx-auto" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Rutas y Transporte</h3>
                        <p className="text-gray-500 mb-6">Información sobre rutas de transporte público y accesos vehiculares.</p>
                        <button className="btn btn-primary mx-auto">Ver Rutas</button>
                    </div>
                )}
            </div>
        </div>
    );
}

function Sidebar() {
    return (
        <aside className="space-y-6">
            <GlassSearchBar className="mb-6" />

            <GlassCard title="Tendencias" className="mb-6 dark-mode-tendencias">
                <ul className="space-y-3">
                    {['#React19', '#CleanCode', '#IA', '#DevOps'].map(topic => (
                        <li key={topic}>
                            <a href="#" className="flex justify-between items-center group">
                                <span className="text-[#FFFFFF] group-hover:text-[var(--accent-color)] transition-colors text-sm font-semibold">{topic}</span>
                                <span className="text-xs text-[#FFFFFF] bg-white/20 px-2 py-0.5 rounded-full">24 posts</span>
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-white/20">
                    <GlassButton variant="secondary" className="w-full text-sm py-1.5">Explorar más</GlassButton>
                </div>
            </GlassCard>

            <GlassSettingsPanel title="Ajustes Rápidos" className="mb-6" />
            
            <div className="text-center">
                <p className="text-xs text-white/70">
                    &copy; 2026 4everUSB <br/>
                    <a href="#" className="hover:text-white transition-colors">Reglas</a> • 
                    <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                </p>
            </div>
        </aside>
    );
}

function DashboardApp() {
    const [currentTab, setCurrentTab] = React.useState('feed');
    const [filter, setFilter] = React.useState('all');
    const [posts, setPosts] = React.useState(typeof MOCK_POSTS !== 'undefined' ? MOCK_POSTS : []);

    React.useEffect(() => {
        AOS.init({
            duration: 600,
            once: true
        });
        
        // Dark mode setup
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Parallax effect on blobs
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const blobs = document.querySelectorAll('.parallax-blob');
            blobs.forEach((blob, index) => {
                const speed = (index + 1) * 0.15;
                blob.style.transform = `translateY(${scrolled * speed}px)`;
            });
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getFilteredPosts = () => {
        if (filter === 'all') return posts;
        const filterMap = {
            'questions': 'Duda',
            'resources': 'Recursos',
            'bugs': 'Errores'
        };
        const tagToMatch = filterMap[filter];
        if (!tagToMatch) return posts;
        
        return posts.filter(post => post.tags && post.tags.includes(tagToMatch));
    };

    const handleNewPost = (postData) => {
        const newPost = {
            id: Date.now(),
            author: typeof MOCK_USERS !== 'undefined' ? MOCK_USERS[1] : { name: 'Yo', role: 'Estudiante', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yo' },
            title: postData.title,
            content: postData.content,
            tags: postData.tags,
            likes: 0,
            comments: 0,
            timeAgo: "Justo ahora"
        };
        setPosts([newPost, ...posts]);
    };

    const filteredPosts = getFilteredPosts();

    const NavButton = ({ id, icon, label }) => (
        <button 
            onClick={() => setFilter(id)}
            className={`w-full text-left px-4 py-2 rounded-md flex items-center gap-3 transition-all ${
                filter === id 
                ? 'bg-white/20 text-white font-bold shadow-md border border-white/30' 
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
        >
            <Icon name={icon} />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen pb-20 bg-transparent" data-name="dashboard-app" data-file="dashboard-app.js">
            <Background />
            <Navbar activePage="dashboard" currentTab={currentTab} onTabChange={setCurrentTab} />
            
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* Left Sidebar / Navigation (Desktop) - Solo visible en Feed */}
                    <div className="hidden md:block md:col-span-3">
                        <div className="sticky top-24 space-y-2" data-aos="fade-right">
                            {currentTab === 'feed' ? (
                                <>
                                    <NavButton id="all" icon="layout-grid" label="Todo" />
                                    <NavButton id="questions" icon="message-circle-question" label="Preguntas" />
                                    <NavButton id="resources" icon="book-open" label="Recursos" />
                                    <NavButton id="bugs" icon="bug" label="Errores" />
                                    <div className="my-2 border-t border-white/10"></div>
                                    <NavButton id="trash" icon="trash-2" label="Papelera" />
                                </>
                            ) : (
                                <div className="card bg-blue-50 border-blue-100">
                                    <p className="text-sm text-blue-800">
                                        Explora la plataforma para conectar con la comunidad y encontrar recursos útiles para tu desarrollo.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    {currentTab === 'feed' && (
                        <>
                            {/* Main Feed */}
                            <div className="md:col-span-6">
                                {/* Mobile Filter Navigation */}
                                <div className="md:hidden flex overflow-x-auto pb-4 mb-2 gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} data-aos="fade-right">
                                    <button onClick={() => setFilter('all')} className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10 text-white border border-white/20'}`}>
                                        <Icon name="layout-grid" size="text-sm" /> Todo
                                    </button>
                                    <button onClick={() => setFilter('questions')} className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'questions' ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10 text-white border border-white/20'}`}>
                                        <Icon name="message-circle-question" size="text-sm" /> Preguntas
                                    </button>
                                    <button onClick={() => setFilter('resources')} className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'resources' ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10 text-white border border-white/20'}`}>
                                        <Icon name="book-open" size="text-sm" /> Recursos
                                    </button>
                                    <button onClick={() => setFilter('bugs')} className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'bugs' ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10 text-white border border-white/20'}`}>
                                        <Icon name="bug" size="text-sm" /> Errores
                                    </button>
                                </div>

                                <div data-aos="fade-down">
                                    <CreatePostInput onPublish={handleNewPost} />
                                </div>
                                
                                <div className="flex items-center justify-between mb-4 px-1" data-aos="fade-in">
                                    <h2 className="text-lg font-bold text-white drop-shadow-sm">
                                        {filter === 'all' ? 'Recientes' : 
                                         filter === 'questions' ? 'Preguntas' :
                                         filter === 'resources' ? 'Recursos' : 'Errores'}
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm text-white">
                                        <span>Ordenar por:</span>
                                        <select className="bg-transparent font-medium text-white outline-none cursor-pointer [&>option]:text-black">
                                            <option>Más relevantes</option>
                                            <option>Más recientes</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {filteredPosts.length > 0 ? (
                                        filteredPosts.map((post, index) => (
                                            <div key={post.id} data-aos="fade-up" data-aos-delay={index * 100}>
                                                <PostCard post={post} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-gray-500">
                                            No hay publicaciones en esta categoría.
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-8 text-center">
                                    <button className="btn btn-ghost text-sm w-full py-4 border border-dashed border-gray-300">
                                        Cargar más publicaciones...
                                    </button>
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div className="hidden md:block md:col-span-3">
                                <div className="sticky top-24" data-aos="fade-left">
                                    <Sidebar />
                                </div>
                            </div>
                        </>
                    )}

                    {currentTab === 'community' && <CommunityView />}
                    {currentTab === 'resources' && <ResourcesView />}
                    
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-t border-white/10 pb-safe">
                <div className="flex justify-around items-center h-[68px]">
                    <button 
                        onClick={() => setCurrentTab('feed')} 
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentTab === 'feed' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                    >
                        <div className={`p-1.5 rounded-full transition-all ${currentTab === 'feed' ? 'bg-white/20 scale-110 shadow-[0_0_10px_var(--accent-color)]' : ''}`}>
                            <Icon name="house" size="text-xl" className={currentTab === 'feed' ? 'text-[var(--accent-color)]' : ''} />
                        </div>
                        <span className={`text-[10px] font-medium ${currentTab === 'feed' ? 'font-bold' : ''}`}>Feed</span>
                    </button>
                    
                    <button 
                        onClick={() => setCurrentTab('community')} 
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentTab === 'community' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                    >
                        <div className={`p-1.5 rounded-full transition-all ${currentTab === 'community' ? 'bg-white/20 scale-110 shadow-[0_0_10px_var(--accent-color)]' : ''}`}>
                            <Icon name="users" size="text-xl" className={currentTab === 'community' ? 'text-[var(--accent-color)]' : ''} />
                        </div>
                        <span className={`text-[10px] font-medium ${currentTab === 'community' ? 'font-bold' : ''}`}>Comunidad</span>
                    </button>

                    <button 
                        onClick={() => setCurrentTab('resources')} 
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentTab === 'resources' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                    >
                        <div className={`p-1.5 rounded-full transition-all ${currentTab === 'resources' ? 'bg-white/20 scale-110 shadow-[0_0_10px_var(--accent-color)]' : ''}`}>
                            <Icon name="briefcase" size="text-xl" className={currentTab === 'resources' ? 'text-[var(--accent-color)]' : ''} />
                        </div>
                        <span className={`text-[10px] font-medium ${currentTab === 'resources' ? 'font-bold' : ''}`}>Recursos</span>
                    </button>

                    <button 
                        onClick={() => window.location.href="profile.html"} 
                        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-white/50 hover:text-white/80 transition-colors"
                    >
                        <div className="p-1.5 rounded-full">
                            <Icon name="user" size="text-xl" />
                        </div>
                        <span className="text-[10px] font-medium">Perfil</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <DashboardApp />
  </ErrorBoundary>
);