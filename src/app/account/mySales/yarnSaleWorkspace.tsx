'use client';

import { useMemo, useState } from 'react';
import { YarnSaleProfilePrivateDTO } from '@/api/types/YarnDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import SaleWorkspaceBase from './_shared/saleWorkspaceBase';
import { PropertyTable, type PropertyTableItem } from '@/components/ui/custom/tables';

interface Props {
  profile: YarnSaleProfilePrivateDTO;
}

export default function YarnSaleWorkspace({ profile }: Props) {
  const [baseData, setBaseData] = useState<SaleDetailsBasePostPutDTO>({
    title: profile.title,
    price: profile.price,
    description: profile.description,
    canBeShipped: profile.canBeShipped,
  });
  const yarnTableItems: PropertyTableItem[] = useMemo(
    () => [
      { label: 'Vægt (g)', value: profile.weightInGrams, type: 'number' },
      { label: 'Længde (m)', value: profile.lengthInMeters, type: 'number' },
      { label: 'Grist', value: profile.gristDescription, type: 'text' },
      { label: 'Anvendelseskategori', value: profile.applicationCategory, type: 'text' },
      { label: 'Vægtkategori', value: profile.weightCategory, type: 'text' },
      { label: 'Konsistens', value: profile.consistency, type: 'text' },
      { label: 'Gauge', value: profile.gauge, type: 'text' },
      { label: 'Farve', value: profile.color, type: 'text' },
      { label: 'Ply count', value: profile.plyCount ?? 'N/A', type: 'text' },
      { label: 'Twist', value: profile.twistAmount ?? 'Ikke angivet', type: 'text' },
      { label: 'Blødhed', value: profile.softness ?? 'Ikke angivet', type: 'text' },
      { label: 'Holdbarhed', value: profile.durability ?? 'Ikke angivet', type: 'text' },
    ],
    [profile]
  );

  return (
    <SaleWorkspaceBase
      profile={profile}
      formData={baseData}
      setFormData={setBaseData}
      isEditing={false}
      isSaving={false}
      hasChanges={false}
      onEdit={() => undefined}
      onSave={() => undefined}
      onCancel={() => undefined}
    >
      <PropertyTable
        title="Entity-specifikke detaljer"
        items={yarnTableItems}
      />

      <div className="mt-6 rounded-3xl border border-zinc-700/60 bg-zinc-950/90 p-5">
        <div className="mb-4 text-base font-semibold text-zinc-100">Fiberkomponenter</div>
        <div className="grid gap-3">
          {profile.fiberComponents.map((component, index) => (
            <div key={`${component.type}-${index}`} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
                <span className="font-semibold text-zinc-100">Type:</span>
                <span>{component.type}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300 mt-2">
                <span className="font-semibold text-zinc-100">Procent:</span>
                <span>{component.percentage}%</span>
              </div>
              {component.fiberLengthInCm != null && (
                <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300 mt-2">
                  <span className="font-semibold text-zinc-100">Fiberlængde:</span>
                  <span>{component.fiberLengthInCm} cm</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SaleWorkspaceBase>
  );
}
