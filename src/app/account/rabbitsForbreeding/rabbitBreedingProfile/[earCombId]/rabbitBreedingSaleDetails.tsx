// src/app/account/rabbitsForbreeding/rabbitBreedingProfile/[earCombId]/rabbitBreedingSaleDetails.tsx
import { SaleDetailsBaseAndEntityDTO } from '@/api/types/AngoraDTOs';
import { Chip } from '@/components/ui/heroui';
import { formatDate } from '@/utils/formatters';
import { CiDeliveryTruck } from 'react-icons/ci';
import { FiEye } from 'react-icons/fi';

export default function RabbitBreedingSaleDetailsView({ saleDetails }: { saleDetails: SaleDetailsBaseAndEntityDTO }) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="p-4 border-b border-border flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">{saleDetails.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-foreground/55">
            <span className="flex items-center gap-1">
              <FiEye size={12} />
              {saleDetails.viewCount} visninger
            </span>
            <span>Oprettet: {formatDate(saleDetails.dateListed)}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-bold text-foreground">{saleDetails.price} kr.</p>
          {saleDetails.canBeShipped && (
            <Chip color="success" variant="soft" size="sm" className="mt-1 h-5">
              <CiDeliveryTruck size={12} className="mr-1" />Kan sendes
            </Chip>
          )}
        </div>
      </div>

      {saleDetails.description && (
        <div className="p-4 border-b border-border">
          <p className="text-xs text-foreground/55 mb-1">Beskrivelse</p>
          <p className="text-sm text-foreground/80 whitespace-pre-wrap">{saleDetails.description}</p>
        </div>
      )}

      {saleDetails.entityTypeSaleProperties && Object.keys(saleDetails.entityTypeSaleProperties).length > 0 && (
        <div className="p-4">
          <p className="text-xs text-foreground/55 mb-2">Yderligere oplysninger</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(saleDetails.entityTypeSaleProperties).map(([key, value]) => (
              <div key={key} className="flex gap-2 text-sm">
                <span className="text-foreground/55 shrink-0">{key}:</span>
                <span className="text-foreground/80">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
