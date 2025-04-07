'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@heroui/react';

interface ProfileImageProps {
  imageUrl: string | null;
  alt: string;
  className?: string;
  fallbackText?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Genanvendelig komponent til visning af profilbilleder med fallback til initialer
 * 
 * @example
 * <ProfileImage 
 *   imageUrl={user.avatar}
 *   alt="John Doe" 
 *   fallbackText="JD"
 *   size="medium"
 * />
 */
export default function ProfileImage({
  imageUrl,
  alt,
  className = '',
  fallbackText,
  size = 'medium'
}: ProfileImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // Bestem størrelse baseret på size prop
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-24 h-24 text-lg'
  };
  
  // Hvis intet billede eller billedefejl, vis fallback
  const showFallback = !imageUrl || imageError;
  
  // Udregn tekstfarve og baggrund baseret på alt tekst
  // Dette giver konsistente, men forskellige farver til forskellige brugere
  const getInitialStyles = () => {
    const colors = [
      'bg-primary-500 text-white',
      'bg-secondary-600 text-white',
      'bg-accent-500 text-white',
      'bg-success-500 text-white',
      'bg-warning-500 text-black',
      'bg-danger-500 text-white',
    ];
    
    // Simpel hash funktion for alt tekst for at vælge en farve
    const hash = alt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % colors.length;
    
    return colors[colorIndex];
  };
  
  // Beregn initialer fra alt tekst hvis intet fallbackText er givet
  const getInitials = () => {
    if (fallbackText) return fallbackText;
    
    // Ellers udregn fra alt tekst (fx "John Doe" -> "JD")
    return alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  return (
    <div 
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center',
        sizeClasses[size],
        className
      )}
    >
      {showFallback ? (
        // Fallback til initialer med dynamisk baggrundsfarve
        <div className={cn('w-full h-full flex items-center justify-center font-semibold', getInitialStyles())}>
          {getInitials()}
        </div>
      ) : (
        // Billed rendering
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes={`(max-width: 768px) 100vw, ${size === 'small' ? '32px' : size === 'medium' ? '48px' : '96px'}`}
          className="object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}