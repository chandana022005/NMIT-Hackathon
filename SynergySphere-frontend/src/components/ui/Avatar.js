import React from 'react';

const Avatar = ({ 
  src, 
  name, 
  size = 'md', 
  className = '',
  showOnline = false,
  online = false 
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-gray-300 flex items-center justify-center overflow-hidden`}>
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-600 font-medium">
            {name ? getInitials(name) : '?'}
          </span>
        )}
      </div>
      {showOnline && (
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
          online ? 'bg-green-500' : 'bg-gray-400'
        }`} />
      )}
    </div>
  );
};

export default Avatar;
