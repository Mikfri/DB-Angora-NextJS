// src/components/cards/rabbitCardGrid.tsx
import { Rabbit_ForsalePreviewDTO } from '@/types/backendTypes';
import RabbitForsaleCard from './rabbitForsaleCard';

interface Props {
    rabbits: Rabbit_ForsalePreviewDTO[];
    onCardClick?: (rabbit: Rabbit_ForsalePreviewDTO) => void;
}

export default function RabbitCardGrid({ rabbits, onCardClick }: Props) {
    return (
        <div className="rabbit-card-grid">
            {rabbits.map((rabbit) => (
                <RabbitForsaleCard 
                    key={rabbit.earCombId} 
                    rabbit={rabbit}
                    onClick={() => onCardClick?.(rabbit)}
                />
            ))}
        </div>
    );
}