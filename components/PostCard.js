function PostCard({ post }) {
    const [liked, setLiked] = React.useState(false);
    const [likesCount, setLikesCount] = React.useState(post.likes);

    const handleLike = () => {
        if (liked) {
            setLikesCount(p => p - 1);
        } else {
            setLikesCount(p => p + 1);
        }
        setLiked(!liked);
    };

    return (
        <article className="card mb-4 hover:shadow-[0_0_15px_var(--accent-color)] transition-shadow" data-file="components/PostCard.js">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />
                    <div>
                        <h4 className="font-semibold text-sm text-white drop-shadow-sm">{post.author.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-white/80">
                            <span className={`px-1.5 py-0.5 rounded border ${post.author.role === 'Docente' ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/30 text-white font-bold' : 'border-white/30 bg-white/10 text-white font-bold'}`}>
                                {post.author.role}
                            </span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                        </div>
                    </div>
                </div>
                <button className="text-white/60 hover:text-white">
                    <Icon name="ellipsis" size="text-lg" />
                </button>
            </div>
            
            <h3 className="text-xl font-bold mb-2 text-white leading-tight drop-shadow-md">
                {post.title}
            </h3>
            
            <p className="text-white/90 text-sm leading-relaxed mb-4">
                {post.content}
            </p>

            {post.media && (
                <div className="mb-4 rounded-xl overflow-hidden border border-white/20">
                    <img src={post.media} alt="Post media" className="w-full h-auto object-cover max-h-96" />
                </div>
            )}
            
            <div className="flex items-center gap-2 mb-4">
                {post.tags.map(tag => (
                    <span key={tag} className="text-xs font-bold px-2 py-1 rounded-full bg-white/20 text-white border border-white/30 shadow-sm">#{tag}</span>
                ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${liked ? 'text-[#ff4dff] drop-shadow-[0_0_8px_#ff4dff]' : 'text-white/80 hover:text-white'}`}
                    >
                        <Icon name="heart" className={liked ? "fill-current" : ""} size="text-lg" />
                        <span>{likesCount}</span>
                    </button>
                    
                    <button className="flex items-center gap-1.5 text-sm font-bold text-white/80 hover:text-white transition-colors">
                        <Icon name="message-circle" size="text-lg" />
                        <span>{post.comments}</span>
                    </button>
                </div>
                
                <button className="text-white/60 hover:text-[var(--accent-color)] transition-colors drop-shadow-sm">
                    <Icon name="share-2" size="text-lg" />
                </button>
            </div>
        </article>
    );
}