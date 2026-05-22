function Button({ children, variant = "primary", className = "", onClick, ...props }) {
    const baseClass = "btn";
    const variantClass = `btn-${variant}`;
    
    return (
        <button 
            className={`${baseClass} ${variantClass} ${className}`} 
            onClick={onClick}
            {...props}
            data-file="components/Button.js"
        >
            {children}
        </button>
    );
}