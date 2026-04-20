// RabbitBreedingDetails.tsx
'use client';

import { Rabbit_ForbreedingProfileDTO } from "@/api/types/AngoraDTOs";
import { PropertyTable } from "@/components/ui/custom/tables";

export default function RabbitBreedingDetails({ rabbit }: { rabbit: Rabbit_ForbreedingProfileDTO }) {
  const items = [
    { label: 'Øremærke', value: rabbit.earCombId },
    { label: 'Kaldenavn', value: rabbit.nickName },
    { label: 'Race', value: rabbit.race, type: 'badge' as const },
    { label: 'Køn', value: rabbit.gender, type: 'badge' as const },
    { label: 'Farve', value: rabbit.color, type: 'badge' as const },
    { label: 'Godkendt race/farve', value: rabbit.approvedRaceColorCombination, type: 'boolean' as const },
    { label: 'Fødselsdato', value: rabbit.dateOfBirth, type: 'date' as const },
    { label: 'Ungdyrgruppe M', value: rabbit.ungdyrGruppe_M, type: 'boolean' as const },
    { label: 'Fader', value: rabbit.father_EarCombId ?? rabbit.fatherId_Placeholder },
    { label: 'Moder', value: rabbit.mother_EarCombId ?? rabbit.motherId_Placeholder },
    {
      label: 'Indavlskoefficient',
      value: rabbit.inbreedingCoefficient != null
        ? `${(rabbit.inbreedingCoefficient * 100).toFixed(2)}%`
        : null
    },
  ];

  return (
    <div className="bg-surface border border-divider rounded-lg overflow-hidden h-full">
      <div className="flex justify-between items-center px-3 py-2 border-b border-divider">
        <h3 className="text-sm font-semibold text-foreground">Kanin Information</h3>
      </div>
      <PropertyTable items={items} useCard={false} />
    </div>
  );
}
