window.THEMES = {
    default: {
        '--primary-color': '#213A5C',
        '--secondary-color': '#586b84',
        '--accent-color': '#3b82f6',
        '--bg-color': '#F1F1F1',
        '--surface-color': '#ffffff',
        '--border-color': '#d1d5db'
    },
    theme1: {
        '--primary-color': '#510004',
        '--secondary-color': '#8a1c00',
        '--accent-color': '#a180ff',
        '--bg-color': '#ffb7ff',
        '--surface-color': '#ffffff',
        '--border-color': '#a180ff'
    },
    theme2: {
        '--primary-color': '#12101f',
        '--secondary-color': '#2f3656',
        '--accent-color': '#6d6399',
        '--bg-color': '#ba9ee5',
        '--surface-color': '#f8cfed',
        '--border-color': '#6d6399'
    }
};

window.setAppTheme = function(themeName) {
    localStorage.setItem('appTheme', themeName);
    window.applyTheme();
};

window.applyTheme = function() {
    const theme = localStorage.getItem('appTheme') || 'default';
    const variables = window.THEMES[theme];
    
    if (variables) {
        for (const [key, value] of Object.entries(variables)) {
            document.documentElement.style.setProperty(key, value);
        }
    }
};

// Aplicar el tema inmediatamente al cargar el script
window.applyTheme();