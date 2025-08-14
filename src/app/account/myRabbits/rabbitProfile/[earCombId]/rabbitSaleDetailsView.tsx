import { RabbitSaleDetailsEmbeddedDTO } from '@/api/types/AngoraDTOs';
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { formatCurrency, formatDate } from '@/utils/formatters';
import { FiEye, FiTag, FiTruck } from "react-icons/fi";
import { ROUTES } from '@/constants/navigationConstants'; // <-- Tilføjet import

interface SaleDetailsViewProps {
  saleDetails: RabbitSaleDetailsEmbeddedDTO;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function SaleDetailsView({ 
  saleDetails, 
  onEdit, 
  onDelete,
  isDeleting
}: SaleDetailsViewProps) {
  return (
    <Card className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50">
      <CardBody>
        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">{saleDetails.title}</h2>
            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              <span className="flex items-center">
                <FiEye size={14} className="mr-1" />
                {saleDetails.viewCount} visninger
              </span>
              <span className="flex items-center">
                <FiTag size={14} className="mr-1" />
                ID: {saleDetails.id}
              </span>
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-500 mt-2 md:mt-0">
            {formatCurrency(saleDetails.price)}
          </div>
        </div>

        {/* URL / Slug information */}
        <div className="bg-zinc-900/50 p-3 rounded-lg mb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-zinc-400">
              <span className="font-medium mr-1">Offentlig URL:</span>
              <a 
                href={ROUTES.SALE.RABBIT(saleDetails.slug)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {ROUTES.SALE.RABBIT(saleDetails.slug)}
              </a>
            </div>
            {saleDetails.canBeShipped && (
              <Chip 
                startContent={<FiTruck size={14} />}
                variant="flat"
                color="primary"
                size="sm"
                className="mt-2 md:mt-0"
              >
                Kan leveres
              </Chip>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-zinc-400 text-sm">Dato oprettet</h3>
            <p>{formatDate(saleDetails.dateListed)}</p>
          </div>
          <div>
            <h3 className="text-zinc-400 text-sm">Bosted</h3>
            <p>{saleDetails.homeEnvironment || 'Ikke angivet'}</p>
          </div>
          <div>
            <h3 className="text-zinc-400 text-sm">Pottetrænet</h3>
            <p>{saleDetails.isLitterTrained ? 'Ja' : 'Nej'}</p>
          </div>
          <div>
            <h3 className="text-zinc-400 text-sm">Neutraliseret</h3>
            <p>{saleDetails.isNeutered ? 'Ja' : 'Nej'}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-zinc-400 text-sm mb-2">Beskrivelse</h3>
          <div className="bg-zinc-900/50 p-4 rounded-lg">
            <p className="whitespace-pre-wrap">{saleDetails.description || 'Ingen beskrivelse'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            color="primary"
            onPress={onEdit}
            isDisabled={isDeleting}
          >
            Rediger
          </Button>
          <Button
            color="danger"
            onPress={onDelete}
            isLoading={isDeleting}
          >
            {isDeleting ? 'Fjerner...' : 'Fjern fra salg'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}