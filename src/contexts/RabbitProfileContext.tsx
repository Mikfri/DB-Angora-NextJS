// src/contexts/RabbitProfileContext.tsx

/**
 * RabbitProfileContext
 * --------------------
 * Formål:
 *  - Centraliserer state og datahåndtering for en enkelt kaninprofil (Rabbit_ProfileDTO).
 *  - Håndterer alle handlinger (refresh, delete, transfer) så child-komponenter undgår prop-drilling.
 *  - Henter earCombId fra URL params (ligesom BlogWorkspaceContext henter blogId).
 *
 * Hvor bruges den:
 *  - Wrappet i layoutWrapper.tsx for /account/myRabbits/rabbitProfile/[earCombId] ruter.
 *  - Brug hooken useRabbitProfile() i child-komponenter for at tilgå profil, loading, fejl og handlinger.
 */
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo, Dispatch, SetStateAction } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Rabbit_ProfileDTO, Rabbit_UpdateDTO, TransferRequest_CreateDTO } from '@/api/types/AngoraDTOs';
import { getRabbitProfile, deleteRabbit, updateRabbit } from '@/app/actions/rabbit/rabbitCrudActions';
import { createRabbitTransferRequest } from '@/app/actions/transfers/transferRequestsActions';
import { toast } from 'react-toastify';

interface RabbitProfileContextType {
  // Data
  profile: Rabbit_ProfileDTO | null;
  isLoading: boolean;
  error: { status: number; message: string } | null;
  // Redigering
  isEditing: boolean;
  isSaving: boolean;
  editedData: Rabbit_ProfileDTO | null;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setEditedData: Dispatch<SetStateAction<Rabbit_ProfileDTO | null>>;
  handleSave: () => Promise<void>;
  handleCancelEdit: () => void;
  patchProfile: (patch: Partial<Rabbit_ProfileDTO>) => void;
  // Handlinger
  isDeleting: boolean;
  isTransferring: boolean;
  refreshProfile: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleTransfer: (transferData: TransferRequest_CreateDTO) => Promise<boolean>;
}

const RabbitProfileContext = createContext<RabbitProfileContextType | undefined>(undefined);

export function RabbitProfileProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const earCombId = typeof params.earCombId === 'string'
    ? params.earCombId
    : Array.isArray(params.earCombId)
      ? params.earCombId[0]
      : '';

  const [profile, setProfile] = useState<Rabbit_ProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<Rabbit_ProfileDTO | null>(null);

  const loadProfile = useCallback(async () => {
    if (!earCombId) {
      setError({ status: 400, message: 'Ugyldigt øremærke ID' });
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const result = await getRabbitProfile(earCombId);
      if (!result.success) {
        setError({ status: result.status, message: result.error });
        return;
      }
      setProfile(result.data);
      setEditedData(result.data);
    } catch (err) {
      console.error('Error loading rabbit profile:', err);
      setError({ status: 500, message: 'Der opstod en fejl ved indlæsning af kaninprofilen.' });
    } finally {
      setIsLoading(false);
    }
  }, [earCombId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  const patchProfile = useCallback((patch: Partial<Rabbit_ProfileDTO>) => {
    setProfile(prev => prev ? { ...prev, ...patch } : prev);
  }, []);

  const handleSave = useCallback(async () => {
    if (!profile || !editedData) return;
    try {
      setIsSaving(true);
      const updateDto: Rabbit_UpdateDTO = {
        nickName: editedData.nickName ?? null,
        race: editedData.race,
        gender: editedData.gender,
        color: editedData.color,
        dateOfBirth: editedData.dateOfBirth,
        dateOfDeath: editedData.dateOfDeath ?? null,
        isForBreeding: editedData.isForBreeding ?? null,
        fatherId_Placeholder: editedData.fatherId_Placeholder ?? null,
        motherId_Placeholder: editedData.motherId_Placeholder ?? null,
      };

      const result = await updateRabbit(profile.earCombId, updateDto);

      if (result.success) {
        setIsEditing(false);
        toast.success('Kaninen blev opdateret');
        await refreshProfile();
      } else {
        toast.error(result.error || 'Der skete en fejl ved opdatering af kaninen');
      }
    } catch (err) {
      console.error('Error saving:', err);
      toast.error('Der skete en fejl ved opdatering af kaninen');
    } finally {
      setIsSaving(false);
    }
  }, [profile, editedData, refreshProfile]);

  const handleCancelEdit = useCallback(() => {
    setEditedData(profile ? { ...profile } : null);
    setIsEditing(false);
  }, [profile]);

  const handleDelete = useCallback(async () => {
    if (!profile) return;
    const displayName = profile.nickName || profile.earCombId;
    try {
      setIsDeleting(true);
      const result = await deleteRabbit(profile.earCombId);
      if (result.success) {
        toast.success(`Kaninen "${displayName}" er slettet`);
        router.push('/account/myRabbits');
      } else {
        toast.error(`Fejl: ${result.error}`);
      }
    } catch (err) {
      console.error('Fejl under sletning af kanin:', err);
      toast.error('Der opstod en fejl under sletning af kaninen');
    } finally {
      setIsDeleting(false);
    }
  }, [profile, router]);

  const handleTransfer = useCallback(async (transferData: TransferRequest_CreateDTO): Promise<boolean> => {
    try {
      setIsTransferring(true);
      const result = await createRabbitTransferRequest(transferData);
      if (result.success) {
        toast.success(result.message);
        await refreshProfile();
        return true;
      } else {
        toast.error(result.error);
        return false;
      }
    } catch (err) {
      console.error('Transfer request failed:', err);
      toast.error('Der skete en fejl ved anmodning om ejerskifte');
      return false;
    } finally {
      setIsTransferring(false);
    }
  }, [refreshProfile]);

  const contextValue = useMemo(() => ({
    profile,
    isLoading,
    error,
    isEditing,
    isSaving,
    editedData,
    setIsEditing,
    setEditedData,
    handleSave,
    handleCancelEdit,
    patchProfile,
    isDeleting,
    isTransferring,
    refreshProfile,
    handleDelete,
    handleTransfer,
  }), [profile, isLoading, error, isEditing, isSaving, editedData, handleSave, handleCancelEdit, patchProfile, isDeleting, isTransferring, refreshProfile, handleDelete, handleTransfer]);

  return (
    <RabbitProfileContext.Provider value={contextValue}>
      {children}
    </RabbitProfileContext.Provider>
  );
}

export function useRabbitProfile() {
  const context = useContext(RabbitProfileContext);
  if (context === undefined) {
    throw new Error('useRabbitProfile must be used within a RabbitProfileProvider');
  }
  return context;
}
