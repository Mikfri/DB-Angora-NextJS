'use client';

import Image from 'next/image';
import { SaleDetailsPrivateCardDTO } from '@/api/types/AngoraDTOs';
import ClickableCard from '@/components/ui/custom/cards/ClickableCard';
import { memo, useState } from 'react';
import { formatRelativeDate } from '@/utils/formatters';
import { LuRabbit } from 'react-icons/lu';
import { GiWool } from 'react-icons/gi';
import { MdRemoveRedEye } from 'react-icons/md';

const statusConfig: Record<string, { label: string; className: string }> = {
    Active:  { label: 'Aktiv',     className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    OnHold:  { label: 'Inaktiv',  className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    Sold:    { label: 'Solgt',     className: 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400' },
};

interface Props {
    item: SaleDetailsPrivateCardDTO;
    onClick?: () => void;
    priority?: boolean;
}

const SaleOwnDetailsCard = memo(function SaleOwnDetailsCard({ item, onClick, priority = false }: Props) {
    const [imageError, setImageError] = useState(false);

    const defaultImage = '/images/default-rabbit.jpg';
    const profileImage = (!imageError && item.profilePhotoUrl) || defaultImage;

    const getEntityIcon = () => {
        switch (item.entityType?.toLowerCase()) {
            case 'rabbit': return <LuRabbit size={14} />;
            case 'wool':   return <GiWool size={14} />;
            default:       return <LuRabbit size={14} />;
        }
    };

    const status = statusConfig[item.status] ?? { label: item.status, className: 'bg-zinc-100 text-zinc-500' };
    const formattedDate = formatRelativeDate(item.dateListed);

    return (
        <ClickableCard onClick={onClick} className="w-full h-full flex flex-col hover:-translate-y-1">
            {/* Billede */}
            <div className="relative w-full h-48 overflow-hidden">
                <Image
                    src={profileImage}
                    alt={`${item.title || 'Salgsobjekt'} billede`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                    onError={() => setImageError(true)}
                    draggable={false}
                    priority={priority}
                />
            </div>

            {/* Tekst-indhold */}
            <ClickableCard.Content>
                <div className="space-y-1.5">
                    {/* Status + dato */}
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
                            {status.label}
                        </span>
                        <span className="text-xs text-muted">· {formattedDate}</span>
                    </div>

                    {/* Titel */}
                    <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug flex items-center gap-1">
                        {getEntityIcon()} {item.title}
                    </p>

                    {/* Pris */}
                    <p className="text-base font-bold text-foreground">{item.price} kr.</p>

                    {/* Visninger + kan sendes */}
                    <div className="flex items-center gap-3 text-xs text-muted">
                        <span className="flex items-center gap-1">
                            <MdRemoveRedEye size={13} />
                            {item.viewCount ?? 0} visninger
                        </span>
                        {item.canBeShipped && <span>· Kan sendes</span>}
                    </div>
                </div>
            </ClickableCard.Content>
        </ClickableCard>
    );
});

export default SaleOwnDetailsCard;
