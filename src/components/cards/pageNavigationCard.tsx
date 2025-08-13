// src/components/cards/pageNavigationCard.tsx
'use client'

import { Card, CardHeader, CardBody } from "@heroui/react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface PageNavigationCardProps {
  href: string;
  imageSrc: string;
  title: string;
  description: React.ReactNode; // <-- Ændret fra string til React.ReactNode
  isDisabled?: boolean;
  onDisabledClick?: () => void;
  disabledMessage?: string;
}

export default function PageNavigationCard({ 
  href, 
  imageSrc, 
  title, 
  description,
  isDisabled = false,
  onDisabledClick,
  disabledMessage = 'Denne funktion er endnu ikke tilgængelig'
}: PageNavigationCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!isDisabled) {
      router.push(href);
    } else {
      // Vis en toast besked når brugeren klikker på en disabled card
      toast.info(disabledMessage);
      
      // Kald custom handler hvis den er defineret
      if (onDisabledClick) {
        onDisabledClick();
      }
    }
  };

  return (
    <Card 
      isPressable={true} // Altid pressable så vi kan håndtere disabled state
      onPress={handleClick}
      className={`max-w-sm transition-all duration-200 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50 transform hover:scale-[1.02]
        ${isDisabled 
          ? 'bg-zinc-800/40 opacity-60 cursor-not-allowed hover:opacity-70' 
          : 'bg-zinc-800/80 hover:shadow-lg hover:border-zinc-600/50'
        }`}
    >
      <div className="relative w-full h-48">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className={`object-cover transition-all duration-200 ${
            isDisabled ? 'grayscale' : 'hover:scale-105'
          }`}
        />
        
        {/* Overlay for disabled cards */}
        {isDisabled && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-zinc-900/80 px-3 py-1 rounded-full">
              <span className="text-xs text-zinc-300 font-medium">Kommer snart</span>
            </div>
          </div>
        )}
      </div>
      
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className={`text-md font-bold transition-colors ${
            isDisabled ? 'text-zinc-400' : 'text-zinc-100'
          }`}>
            {title}
          </p>
        </div>
      </CardHeader>
      
      <CardBody className={`transition-colors ${
        isDisabled ? 'text-zinc-500' : 'text-zinc-300'
      }`}>
        <p>{description}</p>
      </CardBody>
    </Card>
  );
}