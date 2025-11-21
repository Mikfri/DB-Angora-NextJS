// src/components/nav/side/client/RabbitProfileNavClient.tsx
'use client';

import { useState, ReactNode } from 'react';
import { Divider, Button } from '@heroui/react';
import ProfileImage from '@/components/ui/ProfileImage';
import { useRabbitProfile } from '@/contexts/RabbitProfileContext';
import { IoColorPaletteOutline } from "react-icons/io5";
import { FaInfoCircle, FaPercent, FaUserCircle, FaIdCard, FaTrash, FaExchangeAlt } from "react-icons/fa";
import DeleteRabbitModal from '@/components/modals/rabbit/deleteRabbitModal';
import TransferOwnershipModal from '@/components/modals/rabbit/transferRabbitModal';
import { TransferRequest_CreateDTO } from '@/api/types/AngoraDTOs';

const SECTIONS = {
  INFO: 'Kanin information',
  OWNER: 'Ejerforhold',
  FEATURES: 'Egenskaber'
} as const;

const DEFAULT_TEXTS = {
  BREEDER_NOT_FOUND: 'Findes ikke i systemet',
  OWNER_NOT_FOUND: 'Findes ikke i systemet',
  UNKNOWN: 'Ukendt',
  INBREEDING_UNKNOWN: 'Ikke beregnet'
} as const;

export function RabbitProfileNavClient() {
  const { 
    profile, 
    isDeleting, 
    isTransferring, 
    handleDelete, 
    handleTransfer 
  } = useRabbitProfile();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  
  if (!profile) return null;
  
  const displayName = profile.nickName || profile.earCombId;
  const breederText = profile.originFullName || DEFAULT_TEXTS.BREEDER_NOT_FOUND;
  const ownerText = profile.ownerFullName || DEFAULT_TEXTS.OWNER_NOT_FOUND;
  
  const inbreedingText = profile.inbreedingCoefficient !== null && profile.inbreedingCoefficient !== undefined 
    ? `${(profile.inbreedingCoefficient * 100).toFixed(2)}%` 
    : DEFAULT_TEXTS.INBREEDING_UNKNOWN;
  
  const approvalText = profile.approvedRaceColorCombination === null ? DEFAULT_TEXTS.UNKNOWN
    : profile.approvedRaceColorCombination ? 'Ja' : 'Nej';
    
  const statusText = profile.isJuvenile === null ? DEFAULT_TEXTS.UNKNOWN
    : profile.isJuvenile ? 'Ungdyr' : 'Voksen';

  // Delete handler
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete();
    // Modal lukkes automatisk når kaninen er slettet (redirect)
  };

  // Transfer handler
  const handleTransferClick = () => {
    setShowTransferModal(true);
  };

  const handleTransferSubmit = async (transferData: TransferRequest_CreateDTO) => {
    const success = await handleTransfer(transferData);
    if (success) {
      setShowTransferModal(false);
    }
    return success;
  };

  return (
    <>
      <div className="w-full p-1 space-y-2">
        {/* Action buttons section */}
        <div>
          <h3 className="text-[13px] font-medium text-zinc-400 mb-1">Handlinger</h3>
          <div className="flex flex-col gap-2 mb-3">
            <Button
              color="primary"
              variant="bordered"
              fullWidth
              size="sm"
              startContent={<FaExchangeAlt />}
              onPress={handleTransferClick}
              isDisabled={isTransferring}
              isLoading={isTransferring}
            >
              Ejerskifte
            </Button>
            <Button
              color="danger"
              variant="bordered"
              fullWidth
              size="sm"
              startContent={<FaTrash />}
              onPress={handleDeleteClick}
              isDisabled={isDeleting}
              isLoading={isDeleting}
            >
              Slet kanin
            </Button>
          </div>
          <Divider className="bg-zinc-200/5 my-0.5" />
        </div>

        {/* Profile image */}
        <div className="flex justify-center">
          <div className="w-full max-w-[300px] aspect-square">
            <ProfileImage 
              imageUrl={profile.profilePicture} 
              alt={displayName}
              className="w-full h-full"
            />
          </div>
        </div>

        <Divider className="bg-zinc-200/5 my-0.5" />

        {/* Info section */}
        <div>
          <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
            {SECTIONS.INFO}
          </h3>
          <div className="space-y-1">
            <InfoRow 
              icon={<FaIdCard className="text-lg text-default-500" />}
              label="Øremærke" 
              value={profile.earCombId} 
            />
            <InfoRow 
              icon={<FaPercent className="text-lg text-default-500" />}
              label="Indavl" 
              value={inbreedingText}
              isDefaultValue={profile.inbreedingCoefficient === undefined || profile.inbreedingCoefficient === null}
            />
          </div>
        </div>

        <Divider className="bg-zinc-200/5 my-0.5" />

        {/* Owner section */}
        <div>
          <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
            {SECTIONS.OWNER}
          </h3>
          <div className="space-y-1">
            <InfoRow 
              icon={<FaUserCircle className="text-lg text-default-500" />}
              label="Opdrætter" 
              value={breederText}
              isDefaultValue={!profile.originFullName}
            />
            <InfoRow 
              icon={<FaUserCircle className="text-lg text-default-500" />}
              label="Ejer" 
              value={ownerText}
              isDefaultValue={!profile.ownerFullName}
            />
          </div>
        </div>

        <Divider className="bg-zinc-200/5 my-0.5" />

        {/* Features section */}
        <div>
          <h3 className="text-[13px] font-medium text-zinc-400 mb-0.5">
            {SECTIONS.FEATURES}
          </h3>
          <div className="space-y-1">
            <InfoRow 
              icon={<IoColorPaletteOutline className="text-lg text-default-500" />}
              label="Racegodkendt" 
              value={approvalText} 
              isDefaultValue={profile.approvedRaceColorCombination === null}
            />
            <InfoRow 
              icon={<FaInfoCircle className="text-lg text-default-500" />}
              label="Status" 
              value={statusText} 
              isDefaultValue={profile.isJuvenile === null}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteRabbitModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        rabbitName={displayName}
        isDeleting={isDeleting}
      />
      
      <TransferOwnershipModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        rabbitName={displayName}
        rabbitEarCombId={profile.earCombId}
        onSubmit={handleTransferSubmit}
        isSubmitting={isTransferring}
      />
    </>
  );
}

function InfoRow({ icon, label, value, isDefaultValue = false }: { 
  icon: ReactNode; 
  label: string; 
  value: string;
  isDefaultValue?: boolean;
}) {
  return (
    <div className="py-0.5">
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