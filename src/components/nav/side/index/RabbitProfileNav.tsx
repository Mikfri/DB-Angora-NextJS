// src/components/nav/side/index/RabbitProfileNav.tsx
'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import RabbitProfileNavBase from '../base/RabbitProfileNavBase';
import { RabbitProfileNavClient } from '../client/RabbitProfileNavClient';
import { NavAction } from '@/types/navigation';
import { deleteRabbit } from '@/app/actions/rabbit/delete';
import DeleteRabbitModal from '@/components/modals/rabbit/deleteRabbitModal';
import TransferOwnershipModal from '@/components/modals/rabbit/transferRabbitModal';
import { toast } from 'react-toastify';
import { useRabbitProfile } from '@/contexts/RabbitProfileContext';

interface RabbitProfileNavProps {
  // Basis info - navne matcher PRÆCIST Rabbit_ProfileDTO
  earCombId: string;
  nickName: string | null;
  originFullName: string | null;
  ownerFullName: string | null;
  approvedRaceColorCombination: boolean | null;
  isJuvenile: boolean | null;
  profilePicture: string | null;
  
  // Handlinger (valgfri)
  onDeleteClick?: () => void;
  onChangeOwner?: () => void;
  isDeleting?: boolean;
}

/**
 * Navigation komponent for kaninprofil.
 * Kan bruges både standalone og integreret med parent komponenter.
 */
export default function RabbitProfileNav({
  earCombId, 
  nickName: initialNickName,
  originFullName: initialOriginFullName,
  ownerFullName: initialOwnerFullName,
  approvedRaceColorCombination: initialApprovedRaceColorCombination,
  isJuvenile: initialIsJuvenile,
  profilePicture: initialProfilePicture,
  onDeleteClick: externalDeleteClick,
  onChangeOwner: externalChangeOwner,
  isDeleting: externalIsDeleting = false,
}: RabbitProfileNavProps) {
  const router = useRouter();
  
  // Hent profildata fra context
  const { profile } = useRabbitProfile();
  
  // Interne states hvis externe handlers ikke er givet
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);
  
  // Effektiv isDeleting værdi
  const isDeleting = externalIsDeleting || internalIsDeleting;
  
  // Vis navn - prioriter profil data over initial values
  const nickName = profile?.nickName ?? initialNickName;
  const originFullName = profile?.originFullName ?? initialOriginFullName;
  const ownerFullName = profile?.ownerFullName ?? initialOwnerFullName;
  const approvedRaceColorCombination = profile?.approvedRaceColorCombination ?? initialApprovedRaceColorCombination;
  const isJuvenile = profile?.isJuvenile ?? initialIsJuvenile;
  const profilePicture = profile?.profilePicture ?? initialProfilePicture;
  
  // Vis navn - brug nickname hvis det findes, ellers øremærke
  const displayName = nickName || earCombId;
  
  // Interne handlere hvis eksterne ikke er givet
  const handleInternalDeleteClick = useCallback(() => {
    console.log('Internal delete click in RabbitProfileNav');
    setIsDeleteModalOpen(true);
  }, []);
  
  const handleInternalTransferClick = useCallback(() => {
    console.log('Internal transfer click in RabbitProfileNav');
    setShowTransferModal(true);
  }, []);
  
  // Vælg mellem interne og eksterne handlere
  const handleDeleteClick = useCallback(() => {
    console.log('Delete click in RabbitProfileNav', { externalHandler: !!externalDeleteClick });
    if (externalDeleteClick) {
      externalDeleteClick();
    } else {
      handleInternalDeleteClick();
    }
  }, [externalDeleteClick, handleInternalDeleteClick]);
  
  const handleChangeOwner = useCallback(() => {
    console.log('Change owner click in RabbitProfileNav', { externalHandler: !!externalChangeOwner });
    if (externalChangeOwner) {
      externalChangeOwner();
    } else {
      handleInternalTransferClick();
    }
  }, [externalChangeOwner, handleInternalTransferClick]);
  
  // Delete modal handlere
  const handleDeleteCancel = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);
  
  const handleDeleteConfirm = useCallback(async () => {
    try {
      setInternalIsDeleting(true);
      
      const result = await deleteRabbit(earCombId);
      
      if (result.success) {
        toast.success(`Kaninen "${displayName}" er slettet`);
        router.push('/account/myRabbits');
      } else {
        toast.error(`Fejl: ${result.error}`);
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Fejl under sletning af kanin:', error);
      toast.error('Der opstod en fejl under sletning af kaninen');
      setIsDeleteModalOpen(false);
    } finally {
      setInternalIsDeleting(false);
    }
  }, [earCombId, displayName, router]);
  
  // Transfer modal handlere
  const handleCloseTransferModal = useCallback(() => {
    setShowTransferModal(false);
    router.refresh();
  }, [router]);
  
  // Definér footer actions med korrekte typer
  const footerActions = useMemo((): NavAction[] => [
    {
      label: 'Ejerskifte',
      onClick: handleChangeOwner,
      color: 'primary',
      variant: 'flat'
    },
    {
      label: 'Slet kanin',
      onClick: handleDeleteClick,
      color: 'danger',
      disabled: isDeleting,
      variant: 'flat'
    }
  ], [handleChangeOwner, handleDeleteClick, isDeleting]);
  
  return (
    <>
      <RabbitProfileNavBase title={`Kanin: ${displayName}`} footerActions={footerActions}>
        <RabbitProfileNavClient
          earCombId={earCombId}
          nickName={nickName}
          originFullName={originFullName}
          ownerFullName={ownerFullName}
          approvedRaceColorCombination={approvedRaceColorCombination}
          isJuvenile={isJuvenile}
          profilePicture={profilePicture}
        />
      </RabbitProfileNavBase>
      
      {!externalDeleteClick && (
        <DeleteRabbitModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          rabbitName={displayName}
          isDeleting={internalIsDeleting}
        />
      )}
      
      {!externalChangeOwner && (
        <TransferOwnershipModal
          isOpen={showTransferModal}
          onClose={handleCloseTransferModal}
          rabbitName={displayName}
          rabbitEarCombId={earCombId}
        />
      )}
    </>
  );
}