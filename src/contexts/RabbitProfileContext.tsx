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

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Rabbit_ProfileDTO } from '@/api/types/AngoraDTOs';
import { getRabbitProfile, deleteRabbit } from '@/app/actions/rabbit/rabbitCrudActions';
import { createRabbitTransferRequest } from '@/app/actions/transfers/transferRequestsActions';
import { TransferRequest_CreateDTO } from '@/api/types/AngoraDTOs';
import { toast } from 'react-toastify';

interface RabbitProfileContextType {
  profile: Rabbit_ProfileDTO | null;  // ← null her er KORREKT (data-lag)
  isLoading: boolean;
  error: { status: number; message: string } | null;
  isDeleting: boolean;
  isTransferring: boolean;
  refreshProfile: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleTransfer: (transferData: TransferRequest_CreateDTO) => Promise<boolean>;
}

// ✅ Brug undefined (provider-lag)
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

  // Load profile
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
        setError({ 
          status: result.status, 
          message: result.error 
        });
        return;
      }
      
      setProfile(result.data);
    } catch (err) {
      console.error("Error loading rabbit profile:", err);
      setError({ 
        status: 500, 
        message: "Der opstod en fejl ved indlæsning af kaninprofilen." 
      });
    } finally {
      setIsLoading(false);
    }
  }, [earCombId]);

  // Initial load
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Refresh profile
  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  // Handle delete
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
    } catch (error) {
      console.error('Fejl under sletning af kanin:', error);
      toast.error('Der opstod en fejl under sletning af kaninen');
    } finally {
      setIsDeleting(false);
    }
  }, [profile, router]);

  // Handle transfer
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
    } catch (error) {
      console.error('Transfer request failed:', error);
      toast.error('Der skete en fejl ved anmodning om ejerskifte');
      return false;
    } finally {
      setIsTransferring(false);
    }
  }, [refreshProfile]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    profile,  // null hvis ikke hentet
    isLoading,
    error,
    isDeleting,
    isTransferring,
    refreshProfile,
    handleDelete,
    handleTransfer
  }), [profile, isLoading, error, isDeleting, isTransferring, refreshProfile, handleDelete, handleTransfer]);

  return (
    <RabbitProfileContext.Provider value={contextValue}>
      {children}
    </RabbitProfileContext.Provider>
  );
}

export function useRabbitProfile() {
  const context = useContext(RabbitProfileContext);
  if (context === undefined) {  // ✅ Check for undefined
    throw new Error('useRabbitProfile must be used within a RabbitProfileProvider');
  }
  return context;
}