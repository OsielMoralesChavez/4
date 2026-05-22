function Icon({ name, className = "", size = "text-xl" }) {
    return <div className={`icon-${name} ${size} ${className}`} data-name={`icon-${name}`}></div>;
}