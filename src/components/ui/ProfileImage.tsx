'use client';

interface ProfileImageProps {
  imageUrl?: string | null;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  initials?: string;
}

export default function ProfileImage({
  imageUrl,
  alt = '',
  size = 'medium',
  className = '',
  initials,
}: ProfileImageProps) {
  // Generering af initialer - håndterer null/undefined sikkert
  const getInitials = () => {
    // Hvis initialer er angivet direkte, brug dem
    if (initials) return initials.substring(0, 2).toUpperCase();
    
    // Hvis alt-tekst findes, brug den til initialer
    if (alt && alt.trim() !== '') {
      // Sikker split - hvis alt ikke indeholder space, tag de første to tegn
      const parts = alt.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      } else if (parts[0]) {
        return parts[0].substring(0, 2).toUpperCase();
      }
    }
    
    // Fallback
    return '??';
  };

  // Størrelses-klasser
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-20 h-20 text-lg'
  };

  // Ved rendering
  if (imageUrl) {
    return (
      <div className={`rounded-full overflow-hidden bg-zinc-700 ${sizeClasses[size]} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={imageUrl} 
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Hvis intet billede, vis initialer
  return (
    <div 
      className={`rounded-full bg-zinc-700 flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <span className="font-medium text-zinc-300">
        {getInitials()}
      </span>
    </div>
  );
}