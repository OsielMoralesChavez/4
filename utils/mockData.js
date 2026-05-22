const MOCK_USERS = [
    { id: 1, name: "Ana García", role: "Docente", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" },
    { id: 2, name: "Carlos Ruiz", role: "Estudiante", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" },
    { id: 3, name: "Elena Torres", role: "Estudiante", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" }
];

const MOCK_POSTS = [
    {
        id: 101,
        author: MOCK_USERS[0],
        title: "Buenas prácticas para Code Reviews",
        content: "He notado que muchos están enviando PRs grandes. Recuerden la regla de oro: PRs pequeños son más fáciles de revisar y tienen menos bugs. Aquí les dejo una guía rápida...",
        tags: ["Clean Code", "Git", "Docencia"],
        likes: 12,
        comments: 4,
        timeAgo: "2h"
    },
    {
        id: 102,
        author: MOCK_USERS[1],
        title: "Duda con useEffect en React 18",
        content: "¿Alguien sabe por qué mi efecto se ejecuta dos veces en desarrollo? Entiendo que es por el StrictMode, pero ¿cómo debería manejar la limpieza de eventos correctamente?",
        tags: ["React", "JavaScript", "Duda"],
        likes: 5,
        comments: 8,
        timeAgo: "45m"
    },
    {
        id: 103,
        author: MOCK_USERS[2],
        title: "Recurso: Cheatsheet de Flexbox",
        content: "Encontré este diagrama visual muy útil para entender justify-content y align-items. Se los comparto por si a alguien le sirve para el proyecto final.",
        tags: ["CSS", "Frontend", "Recursos"],
        likes: 24,
        comments: 2,
        timeAgo: "1d"
    }
];

const MOCK_NOTIFICATIONS = [
    { id: 1, type: "announcement", text: "Aviso: Mantenimiento del servidor Moodle este fin de semana.", time: "Hace 1 hora", read: false },
    { id: 2, type: "message", text: "Ana García te ha enviado un mensaje privado.", time: "Hace 2 horas", read: false },
    { id: 3, type: "system", text: "Carlos comentó en tu publicación sobre React.", time: "Hace 3 horas", read: true },
    { id: 4, type: "announcement", text: "Nuevos cursos extracurriculares disponibles.", time: "Hace 1 día", read: true }
];
