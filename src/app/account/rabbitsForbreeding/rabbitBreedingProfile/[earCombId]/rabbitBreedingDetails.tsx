// RabbitBreedingDetails.tsx
import { Rabbit_ForbreedingProfileDTO } from "@/api/types/AngoraDTOs";

export default function RabbitBreedingDetails({ rabbit }: { rabbit: Rabbit_ForbreedingProfileDTO }) {
  return (
    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50 overflow-hidden h-full">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-zinc-700/50">
        <h3 className="text-zinc-100 font-medium">Kanin Information</h3>
      </div>

      {/* Content */}
      <div className="grid gap-4 p-4">
        <DetailRow label="Øremærke" value={rabbit.earCombId} />
        <DetailRow label="Kaldenavn" value={rabbit.nickName} />
        <DetailRow label="Race" value={rabbit.race} />
        <DetailRow label="Køn" value={rabbit.gender} />
        <DetailRow label="Farve" value={rabbit.color} />
        <DetailRow label="Fødselsdato" value={rabbit.dateOfBirth} />
        <DetailRow label="Indavlskoefficient" value={rabbit.inbreedingCoefficient?.toFixed(4)} />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[200px,1fr] gap-2 items-center">
      <label className="font-medium text-zinc-300">{label}</label>
      <div className="text-zinc-100">
        {value ?? <span className="text-zinc-500 italic">Ikke angivet</span>}
      </div>
    </div>
  );
}