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

function SupportApp() {
    const [chatMsg, setChatMsg] = React.useState('');
    const [messages, setMessages] = React.useState([
        { id: 1, sender: 'ai', text: '¡Hola! Soy el asistente virtual de la USB. ¿En qué puedo ayudarte hoy?' }
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!chatMsg.trim()) return;
        
        const newMsg = { id: Date.now(), sender: 'user', text: chatMsg };
        setMessages([...messages, newMsg]);
        setChatMsg('');

        // Simular respuesta IA
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                id: Date.now()+1, 
                sender: 'ai', 
                text: 'Gracias por tu consulta. Un asesor revisará este caso pronto, o si es urgente, por favor contacta al número de soporte.' 
            }]);
        }, 1000);
    };

    return (
        <div className="min-h-screen pb-20 bg-transparent" data-name="support-app">
            <Background />
            <Navbar activePage="dashboard" />
            
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Centro de Ayuda y Soporte</h1>
                    <p className="text-gray-600">Estamos aquí para ayudarte a resolver cualquier inconveniente.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Contacto Directo */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                <Icon name="phone-call" className="text-red-600" size="text-2xl" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Emergencias / Reportes</h2>
                            <p className="text-sm text-gray-600 mb-4">Si presencias un fallo crítico en el sistema o plataforma, comunícate a nuestra línea directa.</p>
                            <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Línea de Soporte</p>
                                <p className="text-xl font-bold text-[var(--primary-color)]">+52 (55) 1234-5678</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <Icon name="mail" className="text-blue-600" size="text-2xl" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Correo de Soporte</h2>
                            <p className="text-sm text-gray-600 mb-4">Para dudas académicas o administrativas, escríbenos a nuestro correo.</p>
                            <a href="mailto:soporte@usb.edu" className="text-[var(--primary-color)] font-medium hover:underline">
                                soporte@usb.edu
                            </a>
                        </div>
                    </div>

                    {/* Chat AI */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col overflow-hidden">
                            <div className="bg-[var(--primary-color)] p-4 flex items-center gap-3 text-white">
                                <Icon name="bot" size="text-2xl" />
                                <div>
                                    <h3 className="font-bold">Asistente Virtual USB</h3>
                                    <p className="text-xs text-white/80">Respuestas automáticas 24/7</p>
                                </div>
                            </div>
                            
                            <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] p-3 rounded-lg text-sm ${
                                            msg.sender === 'user' 
                                            ? 'bg-[var(--primary-color)] text-white rounded-br-none' 
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <form onSubmit={handleSend} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={chatMsg}
                                        onChange={(e) => setChatMsg(e.target.value)}
                                        placeholder="Describe tu problema o pregunta..." 
                                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-sm"
                                    />
                                    <button 
                                        type="submit"
                                        className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-black transition-colors flex items-center justify-center"
                                    >
                                        <Icon name="send" size="text-sm" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><SupportApp /></ErrorBoundary>);