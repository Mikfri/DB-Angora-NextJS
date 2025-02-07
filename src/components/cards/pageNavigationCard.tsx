// src/components/cards/pageNavigationCard.tsx
'use client'

import { Card, CardHeader, CardBody } from "@heroui/react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface PageNavigationCardProps {
  href: string;
  imageSrc: string;
  title: string;
  description: string;
  isDisabled?: boolean;
  onDisabledClick?: () => void;
}

export default function PageNavigationCard({ 
  href, 
  imageSrc, 
  title, 
  description,
  isDisabled,
  onDisabledClick 
}: PageNavigationCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!isDisabled) {
      router.push(href);
    } else if (onDisabledClick) {
      onDisabledClick();
    }
  };

  return (
    <Card 
      isPressable={!isDisabled}
      //isHoverable={!isDisabled}
      isBlurred={!isDisabled}
      onPress={handleClick}
      className={`max-w-sm transition-shadow backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50
        ${isDisabled 
          ? 'bg-zinc-800/40 opacity-60 cursor-not-allowed' 
          : 'bg-zinc-800/80 hover:shadow-lg'
        }`}
    >
      <div className="relative w-full h-48">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-cover"
        />
      </div>
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md font-bold text-zinc-100">{title}</p>
        </div>
      </CardHeader>
      <CardBody className="text-zinc-300">
        <p>{description}</p>
      </CardBody>
    </Card>
  );
}