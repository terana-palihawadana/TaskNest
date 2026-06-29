export function getAvatarUrl(user) {
    const seed = encodeURIComponent(user?.email || user?.id || user?.name || 'guest');
    return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;
}

export function getAvatarInitial(name) {
    return (name?.charAt(0) || 'U').toUpperCase();
}

export function getAvatarFallbackColor(seed = '') {
    const palette = ['#003333', '#1a4744', '#5a7a1e', '#2d6a6a', '#4a6741'];
    let hash = 0;

    for (let i = 0; i < seed.length; i += 1) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    return palette[Math.abs(hash) % palette.length];
}
