import React from 'react';
import { getInitials } from '../utils/helpers';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  online = false, 
  className = '',
  onClick
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-3xl'
  };

  const onlineIndicatorSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6'
  };

  return (
    <div className={`relative inline-block ${className}`} onClick={onClick}>
      {src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 dark:border-dark-700 ${
            onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
          }`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold border-2 border-gray-200 dark:border-dark-700 ${
            onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
          }`}
        >
          {getInitials(alt || 'User')}
        </div>
      )}
      
      {online && (
        <div className={`absolute bottom-0 right-0 ${onlineIndicatorSizes[size]} bg-green-500 border-2 border-white dark:border-dark-800 rounded-full`} />
      )}
    </div>
  );
};

export default Avatar;
