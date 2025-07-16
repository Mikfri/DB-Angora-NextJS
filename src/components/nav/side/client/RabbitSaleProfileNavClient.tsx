// src/components/nav/side/client/RabbitSaleProfileNavClient.tsx
'use client';

import { ReactNode } from 'react';
import { Divider, Chip } from '@heroui/react';
import ProfileImage from '@/components/ui/ProfileImage';
import { IoLocationOutline, IoCallOutline, IoTimeOutline, IoEyeOutline } from "react-icons/io5";
import { MdOutlineLocalShipping } from 'react-icons/md';
import { FaUserCircle } from "react-icons/fa";
import { formatDate } from '@/lib/utils/formatters';

interface RabbitSaleProfileNavClientProps {
  // Sælger information
  sellerName: string | null;
  sellerContact: string | null;
  
  // Lokation
  city: string | null;
  zipCode: number | null;
  
  // Salgs information
  price: number;
  dateListed: string;
  viewCount: number | null;
  canBeShipped: boolean;
  
  // Kanin billede
  imageUrl: string | null;
  title: string | null;
}

// Konstanter til sektioner
const SECTIONS = {
  SELLER: 'Sælger',
  SALE_INFO: 'Salgs Information',
  CONTACT: 'Kontakt'
} as const;

// Standardtekster
const DEFAULT_TEXTS = {
  SELLER_NOT_FOUND: 'Ikke angivet',
  LOCATION_NOT_FOUND: 'Ikke angivet',
  CONTACT_NOT_FOUND: 'Ikke angivet'
} as const;

/**
 * Client-side komponent til kanin salgs profil navigation
 * Viser sælger og kontaktinformation
 */
export function RabbitSaleProfileNavClient({
  sellerName,
  sellerContact,
  city,
  zipCode,
  //price,
  dateListed,
  viewCount,
  canBeShipped,
  imageUrl,
  title
}: RabbitSaleProfileNavClientProps) {
  
  // Formater værdier til visning
  const sellerText = sellerName || DEFAULT_TEXTS.SELLER_NOT_FOUND;
  const locationText = city && zipCode ? `${city}, ${zipCode}` : DEFAULT_TEXTS.LOCATION_NOT_FOUND;
  const contactText = sellerContact || DEFAULT_TEXTS.CONTACT_NOT_FOUND;
  
  const displayName = title || 'Kanin til salg';

  return (
    <div className="w-full p-1 space-y-2">
      
      {/* Kanin billede */}
      <div className="flex justify-center">
        <div className="w-full max-w-[300px] aspect-square">
          <ProfileImage 
            imageUrl={imageUrl} 
            alt={displayName}
            className="w-full h-full"
          />
        </div>
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Salgs information sektion */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.SALE_INFO}
        </h3>

        <div className="space-y-1">
          {/* Pris */}
          {/* <InfoRow 
            icon={<FaMoneyBillWave className="text-lg text-amber-500" />}
            label="Pris" 
            value={formatCurrency(price)}
            isHighlighted={true}
          /> */}
          
          {/* Oprettet dato */}
          <InfoRow 
            icon={<IoTimeOutline className="text-lg text-default-500" />}
            label="Oprettet" 
            value={formatDate(dateListed)}
          />
          
          {/* Visninger */}
          <InfoRow 
            icon={<IoEyeOutline className="text-lg text-default-500" />}
            label="Visninger" 
            value={`${viewCount || 0} visninger`}
          />
        </div>
        
        {/* Forsendelse chip */}
        {canBeShipped && (
          <div className="mt-2">
            <Chip 
              color="success" 
              variant="flat" 
              size="sm" 
              startContent={<MdOutlineLocalShipping />}
              className="text-xs"
            >
              Kan sendes
            </Chip>
          </div>
        )}
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Sælger sektion */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.SELLER}
        </h3>

        <div className="space-y-1">
          {/* Sælger navn */}
          <InfoRow 
            icon={<FaUserCircle className="text-lg text-default-500" />}
            label="Navn" 
            value={sellerText}
            isDefaultValue={!sellerName}
          />
          
          {/* Lokation */}
          <InfoRow 
            icon={<IoLocationOutline className="text-lg text-default-500" />}
            label="Lokation" 
            value={locationText}
            isDefaultValue={!city || !zipCode}
          />
        </div>
      </div>

      <Divider className="bg-zinc-200/5 my-0.5" />

      {/* Kontakt sektion */}
      <div>
        <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
          {SECTIONS.CONTACT}
        </h3>

        <div className="space-y-2">
          {/* Telefonnummer display */}
          <InfoRow 
            icon={<IoCallOutline className="text-lg text-default-500" />}
            label="Telefon" 
            value={contactText}
            isDefaultValue={!sellerContact}
          />
          
          {/* Ring til sælger knap */}
          {/* {sellerContact && (
            <Button
              color="primary"
              size="sm"
              className="w-full font-semibold"
              startContent={<IoCallOutline />}
              as="a"
              href={`tel:${sellerContact}`}
            >
              Ring til sælger
            </Button>
          )} */}
        </div>
      </div>
    </div>
  );
}

// Hjælpekomponent til info rækker
function InfoRow({ 
  icon, 
  label, 
  value,
  isDefaultValue = false,
  isHighlighted = false
}: { 
  icon: ReactNode; 
  label: string; 
  value: string;
  isDefaultValue?: boolean;
  isHighlighted?: boolean;
}) {
  return (
    <div className="py-0.5">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 min-w-[80px]">
          {icon}
          <span className="text-xs font-medium text-zinc-300">{label}</span>
        </div>
        
        <div className={`text-sm ${
          isHighlighted 
            ? 'text-amber-400 font-semibold' 
            : isDefaultValue 
              ? 'text-zinc-500 italic' 
              : 'text-zinc-100'
        }`}>
          {value}
        </div>
      </div>
    </div>
  );
}