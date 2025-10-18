// src/app/account/rabbitsForbreeding/rabbitBreedingProfile/[earCombId]/rabbitBreedingSaleDetails.tsx
import { RabbitSaleDetailsEmbeddedDTO } from '@/api/types/AngoraDTOs';

export default function RabbitBreedingSaleDetailsView({ saleDetails }: { saleDetails: RabbitSaleDetailsEmbeddedDTO }) {
  return (
    <div className="bg-zinc-800/80 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-2">{saleDetails.title}</h3>
      <div className="text-sm text-zinc-300">
        <div>Pris: {saleDetails.price}</div>
        <div>Beskrivelse: {saleDetails.description}</div>
        {/* ... flere felter ... */}
      </div>
    </div>
  );
}