import { useState } from 'react';
import {
    getAvatarFallbackColor,
    getAvatarInitial,
    getAvatarUrl,
} from '../utils/avatar';
import './UserAvatar.css';

function UserAvatar({ user, size = 40, className = '' }) {
    const [imgError, setImgError] = useState(false);

    const name = user?.name || 'User';
    const seed = user?.email || user?.id || name;
    const initial = getAvatarInitial(name);

    if (!user || imgError) {
        return (
            <div
                className={`user-avatar user-avatar-fallback ${className}`}
                style={{
                    width: size,
                    height: size,
                    backgroundColor: getAvatarFallbackColor(seed),
                }}
                aria-hidden="true"
            >
                {initial}
            </div>
        );
    }

    return (
        <img
            src={getAvatarUrl(user)}
            alt=""
            className={`user-avatar ${className}`}
            width={size}
            height={size}
            onError={() => setImgError(true)}
        />
    );
}

export default UserAvatar;
