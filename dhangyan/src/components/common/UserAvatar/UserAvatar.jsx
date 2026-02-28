import React, { useMemo } from 'react';
import './UserAvatar.css';

// Generate consistent color from string
const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
};

// Get initials from name
const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const UserAvatar = ({
    name = 'User',
    size = 40,
    fontSize,
    className = ''
}) => {
    const bgColor = useMemo(() => stringToColor(name), [name]);
    const initials = useMemo(() => getInitials(name), [name]);

    const style = {
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: bgColor,
        fontSize: fontSize || `${size * 0.4}px`,
    };

    return (
        <div
            className={`user-avatar ${className}`}
            style={style}
            title={name}
        >
            {initials}
        </div>
    );
};

export default UserAvatar;
