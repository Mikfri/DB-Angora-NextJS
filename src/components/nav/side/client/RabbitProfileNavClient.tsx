// src/components/nav/side/client/RabbitProfileNavClient.tsx
'use client';

import { ReactNode } from 'react';
import { Divider } from '@heroui/react';
import ProfileImage from '@/components/ui/ProfileImage';
import { IoColorPaletteOutline } from "react-icons/io5";
import { FaInfoCircle, FaPercent, FaUserCircle } from "react-icons/fa";
import { FaIdCard } from 'react-icons/fa6';

interface RabbitProfileNavClientProps {
  // Props der præcist matcher Rabbit_ProfileDTO
  earCombId: string;
  nickName: string | null;
  originFullName: string | null;
  ownerFullName: string | null;
  approvedRaceColorCombination: boolean | null;
  isJuvenile: boolean | null;
  profilePicture: string | null;
  inbreedingCoefficient: number | null;
}

// Konstanter til sektioner - matcher samme stil som RabbitOwnNavClient
const SECTIONS = {
  INFO: 'Kanin information',
  OWNER: 'Ejerforhold',
  FEATURES: 'Egenskaber'
} as const;

// Standardtekster
const DEFAULT_TEXTS = {
  BREEDER_NOT_FOUND: 'Findes ikke i systemet',
  OWNER_NOT_FOUND: 'Findes ikke i systemet',
  UNKNOWN: 'Ukendt',
  INBREEDING_UNKNOWN: 'Ikke beregnet'
} as const;

/**
 * Client-side komponent til kaninprofil navigation
 * Harmoniseret med eksisterende navigation styling
 */
export function RabbitProfileNavClient({
  earCombId,
  nickName,
  originFullName,
  ownerFullName,
  approvedRaceColorCombination,
  isJuvenile,
  profilePicture,
  inbreedingCoefficient
}: RabbitProfileNavClientProps) {
  
  // Beregn visningsnavn
  const displayName = nickName || earCombId;
  
  // Formater værdier til visning med fallbacks til standardtekster
  const breederText = originFullName || DEFAULT_TEXTS.BREEDER_NOT_FOUND;
  const ownerText = ownerFullName || DEFAULT_TEXTS.OWNER_NOT_FOUND;
  
  // Formater indavlskoefficient som procent med to decimaler
  const inbreedingText = inbreedingCoefficient !== null && inbreedingCoefficient !== undefined 
    ? `${(inbreedingCoefficient * 100).toFixed(2)}%` 
    : DEFAULT_TEXTS.INBREEDING_UNKNOWN;
  
  const approvalText = approvedRaceColorCombination === null ? DEFAULT_TEXTS.UNKNOWN
    : approvedRaceColorCombination ? 'Ja' : 'Nej';
    
  const statusText = isJuvenile === null ? DEFAULT_TEXTS.UNKNOWN
    : isJuvenile ? 'Ungdyr' : 'Voksen';

  return (
    <div className="w-full p-1 space-y-2"> {/* Reduceret yderligere padding og spacing */}
      {/* Optimeret profilbillede - fylder maksimal plads */}
      <div className="flex justify-center">
        <div className="w-full max-w-[300px] aspect-square">
          <ProfileImage 
            imageUrl={profilePicture} 
            alt={displayName}
            className="w-full h-full"
            // Fjernet size="custom" for at undgå TypeScript-fejl
            fallbackText={displayName.substring(0,2).toUpperCase()}
          />
        </div>
      </div>

      {/* Divider med minimal spacing */}
      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Kaninformation sektion - mere kompakt */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.INFO}
        </h3>

        <div className="space-y-1"> {/* Yderligere reduceret spacing */}
          {/* Øremærke vises først */}
          <InfoRow 
            icon={<FaIdCard className="text-lg text-default-500" />}
            label="Øremærke" 
            value={earCombId} 
          />
          
          {/* Indavlskoefficient */}
          <InfoRow 
            icon={<FaPercent className="text-lg text-default-500" />}
            label="Indavl" 
            value={inbreedingText}
            isDefaultValue={inbreedingCoefficient === undefined || inbreedingCoefficient === null}
          />
        </div>
      </div>

      {/* Divider med minimal spacing */}
      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Ejerforhold sektion - mere kompakt */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.OWNER}
        </h3>

        <div className="space-y-1"> {/* Yderligere reduceret spacing */}
          {/* Opdrætter */}
          <InfoRow 
            icon={<FaUserCircle className="text-lg text-default-500" />}
            label="Opdrætter" 
            value={breederText}
            isDefaultValue={!originFullName}
          />

          {/* Ejer */}
          <InfoRow 
            icon={<FaUserCircle className="text-lg text-default-500" />}
            label="Ejer" 
            value={ownerText}
            isDefaultValue={!ownerFullName}
          />
        </div>
      </div>

      {/* Divider med minimal spacing */}
      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Egenskaber sektion - mere kompakt */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.FEATURES}
        </h3>

        <div className="space-y-1"> {/* Yderligere reduceret spacing */}
          {/* Racegodkendelse */}
          <InfoRow 
            icon={<IoColorPaletteOutline className="text-lg text-default-500" />}
            label="Racegodkendt" 
            value={approvalText} 
            isDefaultValue={approvedRaceColorCombination === null}
          />

          {/* Alder status */}
          <InfoRow 
            icon={<FaInfoCircle className="text-lg text-default-500" />}
            label="Status" 
            value={statusText} 
            isDefaultValue={isJuvenile === null}
          />
        </div>
      </div>
    </div>
  );
}

// Optimeret hjælpekomponent med mere kompakt layout
function InfoRow({ 
  icon, 
  label, 
  value,
  isDefaultValue = false
}: { 
  icon: ReactNode; 
  label: string; 
  value: string;
  isDefaultValue?: boolean
}) {
  return (
    <div className="py-0.5"> {/* Reduceret padding */}
      {/* Label og værdi på samme linje med mere mellemrum */}
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 min-w-[110px]">
          {icon}
          <span className="text-xs font-medium text-zinc-300">{label}</span>
        </div>
        
        <div className={`text-sm ${isDefaultValue ? 'text-zinc-500 italic' : 'text-zinc-100'}`}>
          {value}
        </div>
      </div>
    </div>
  );
}