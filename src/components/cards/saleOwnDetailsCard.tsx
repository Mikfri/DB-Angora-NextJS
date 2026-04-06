'use client';

import Image from 'next/image';
import { SaleDetailsPrivateCardDTO } from '@/api/types/AngoraDTOs';
import { Card, CardHeader, CardBody, Divider } from '@heroui/react';
import { useState, memo } from 'react';
import { ImPriceTag } from 'react-icons/im';
import { IoLocationOutline } from 'react-icons/io5';
import { LuRabbit } from 'react-icons/lu';
import { GiWool } from 'react-icons/gi';
import { BsClock } from 'react-icons/bs';

interface Props {
  item: SaleDetailsPrivateCardDTO;
  onClick?: () => void;
}

const SaleOwnDetailsCard = memo(function SaleOwnDetailsCard({
  item,
  onClick
}: Props) {
  const [imageError, setImageError] = useState(false);

  const defaultImage = '/images/default-rabbit.jpg';
  const profileImage = (!imageError && item.profilePhotoUrl) || defaultImage;

  // Klik handler
  const handleCardPress = () => {
    if (onClick) onClick();
  };

  const getEntityIcon = () => {
    const entityType = item.entityType?.toLowerCase() || 'rabbit';

    switch (entityType) {
      case 'rabbit':
        return <LuRabbit size={14} />;
      case 'wool':
        return <GiWool size={14} />;
      default:
        return <LuRabbit size={14} />;
    }
  };

  const typeChip = (
    <div className="inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-sm font-medium px-2 py-1 rounded-full shadow-sm">
      {getEntityIcon()}
      <span className="truncate max-w-[120px]">{item.title || 'Ukendt'}</span>
    </div>
  );

  const priceChip = (
    <div className="inline-flex items-center gap-1 bg-emerald-600/90 text-white text-sm font-medium px-2 py-1 rounded-full shadow-sm">
      <ImPriceTag size={12} />
      <span>{item.price} kr.</span>
    </div>
  );

  const calculateTimeSince = () => {
    if (!item.dateListed) return 'Ukendt';

    const listedDate = new Date(item.dateListed);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - listedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'I dag';
    } else if (diffDays === 1) {
      return 'I går';
    } else if (diffDays < 7) {
      return `${diffDays} dage siden`;
    } else if (diffDays < 31) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'uge' : 'uger'} siden`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'måned' : 'måneder'} siden`;
    }
  };

  return (
    <Card
      isPressable
      onPress={handleCardPress}
      className="max-w-sm hover:shadow-lg transition-shadow bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50 select-none"
    >
      <div className="relative w-full h-64">
        <Image
          src={profileImage}
          alt={`${item.title || 'Salgsobjekt'} billede`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={() => setImageError(true)}
          draggable={false}
        />

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute bottom-2 left-2 z-10 select-none">{typeChip}</div>
        <div className="absolute bottom-2 right-2 z-10 select-none">{priceChip}</div>
      </div>

      <CardHeader className="flex gap-3 py-2.5">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <p className="text-small text-zinc-300">ID: {item.slug}</p>
          </div>
        </div>
      </CardHeader>

      <CardBody className="text-zinc-300 py-0 pb-3 select-none">
        <div className="space-y-2">
          <div className="flex items-center">
            <BsClock className="text-zinc-400 mr-2 shrink-0" size={14} />
            <div className="grid grid-cols-2 gap-x-2 w-full">
              <span className="text-zinc-400 text-sm">Oprettet:</span>
              <span className="text-sm">{calculateTimeSince()}</span>
            </div>
          </div>

          <Divider className="my-1.5 bg-zinc-700/50" />

          <div className="flex items-center">
            <IoLocationOutline className="text-zinc-400 mr-2 shrink-0" size={16} />
            <div className="grid grid-cols-2 gap-x-2 w-full">
              <span className="text-zinc-400 text-sm">Lokation:</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

export default SaleOwnDetailsCard;
