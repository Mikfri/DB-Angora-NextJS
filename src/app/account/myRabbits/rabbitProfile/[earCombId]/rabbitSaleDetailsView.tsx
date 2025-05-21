// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitSaleDetailsView.tsx
import { SaleDetailsProfileDTO } from '@/api/types/AngoraDTOs';
import { Button, Card, CardBody } from "@heroui/react";
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

interface SaleDetailsViewProps {
  saleDetails: SaleDetailsProfileDTO;
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
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <h2 className="text-xl font-semibold">Salgsprofil</h2>
          <div className="text-2xl font-bold text-amber-500">
            {formatCurrency(saleDetails.price)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-zinc-400 text-sm">Dato oprettet</h3>
            <p>{formatDate(saleDetails.dateListed)}</p>
          </div>
          <div>
            <h3 className="text-zinc-400 text-sm">Bosted</h3>
            <p>{saleDetails.rabbitSaleDetails?.homeEnvironment || 'Ikke angivet'}</p>
          </div>
          <div>
            <h3 className="text-zinc-400 text-sm">Pottetrænet</h3>
            <p>{saleDetails.rabbitSaleDetails?.isLitterTrained ? 'Ja' : 'Nej'}</p>
          </div>
          <div>
            <h3 className="text-zinc-400 text-sm">Neutraliseret</h3>
            <p>{saleDetails.rabbitSaleDetails?.isNeutered ? 'Ja' : 'Nej'}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-zinc-400 text-sm mb-2">Beskrivelse</h3>
          <div className="bg-zinc-900/50 p-4 rounded-lg">
            <p className="whitespace-pre-wrap">{saleDetails.saleDescription || 'Ingen beskrivelse'}</p>
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