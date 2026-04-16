// src/contexts/SaleWorkspaceContext.tsx

/**
 * SaleWorkspaceContext
 * --------------------
 * Formål:
 *  - Henter og deler den private `SaleDetailsPrivateDTO` for et salgsworkspace.
 *  - Understøtter alle entitetstyper (rabbit, yarn, osv.) via URL-params.
 *  - Bruges af SaleWorkspaceNavClient til at vise salgsoplysninger i sidenavigation.
 *
 * Hvor bruges den:
 *  - Wrappet i layoutWrapper.tsx for /account/mySales/[entityType]/[id] ruter.
 *  - Brug hooken useSaleWorkspace() i child-komponenter for at tilgå profil og loading.
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SaleDetailsPrivateDTO } from '@/api/types/SaleDetailsDTOs';
import { getRabbitSaleDetails, deleteRabbitSaleDetails } from '@/app/actions/sales/salesRabbitActions';
import { getYarnSaleDetails, deleteYarnSaleDetails } from '@/app/actions/sales/salesYarnActions';
import { updateSaleStatus } from '@/app/actions/sales/salesManagementAcions';
import { ROUTES } from '@/constants/navigationConstants';
import { toast } from 'react-toastify';

interface SaleWorkspaceContextType {
    profile: SaleDetailsPrivateDTO | null;
    isLoading: boolean;
    error: string | null;
    isDeleting: boolean;
    handleDelete: () => Promise<void>;
    isStatusUpdating: boolean;
    handleStatusUpdate: (newStatus: string) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const SaleWorkspaceContext = createContext<SaleWorkspaceContextType | undefined>(undefined);

export function SaleWorkspaceProvider({ children }: { children: ReactNode }) {
    const params = useParams();
    const router = useRouter();
    const entityType = params?.entityType as string;
    const id = params?.id as string;

    const [profile, setProfile] = useState<SaleDetailsPrivateDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isStatusUpdating, setIsStatusUpdating] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [entityType, id]); // eslint-disable-line react-hooks/exhaustive-deps

    async function fetchProfile() {
        const numId = Number(id);
        if (!entityType || !numId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            let result: { success: true; data: SaleDetailsPrivateDTO } | { success: false; error: string };

            if (entityType === 'rabbitsd') {
                result = await getRabbitSaleDetails(numId);
            } else if (entityType === 'yarnsd') {
                result = await getYarnSaleDetails(numId);
            } else {
                setError('Ukendt entitetstype');
                setIsLoading(false);
                return;
            }

            if (result.success) {
                setProfile(result.data);
            } else {
                setError(result.error);
            }
        } catch {
            setError('Der opstod en fejl ved hentning af salgsoplysninger');
        } finally {
            setIsLoading(false);
        }
    }

    async function refreshProfile() {
        await fetchProfile();
    }

    async function handleDelete() {
        if (!profile) return;
        setIsDeleting(true);
        let result: { success: boolean; error?: string; message?: string };
        if (entityType === 'rabbitsd') {
            result = await deleteRabbitSaleDetails(profile.id);
        } else if (entityType === 'yarnsd') {
            result = await deleteYarnSaleDetails(profile.id);
        } else {
            setIsDeleting(false);
            return;
        }
        if (result.success) {
            toast.success(result.message ?? 'Annonce slettet');
            router.push(ROUTES.ACCOUNT.MY_SALES);
        } else {
            toast.error(result.error ?? 'Der skete en fejl');
            setIsDeleting(false);
        }
    }

    async function handleStatusUpdate(newStatus: string) {
        if (!profile) return;
        setIsStatusUpdating(true);
        const result = await updateSaleStatus(profile.id, newStatus);
        if (result.success) {
            setProfile(prev => prev ? { ...prev, status: newStatus } : prev);
            toast.success('Status opdateret');
        } else {
            toast.error(result.error);
        }
        setIsStatusUpdating(false);
    }

    return (
        <SaleWorkspaceContext.Provider value={{ profile, isLoading, error, isDeleting, handleDelete, isStatusUpdating, handleStatusUpdate, refreshProfile }}>
            {children}
        </SaleWorkspaceContext.Provider>
    );
}

export function useSaleWorkspace() {
    const ctx = useContext(SaleWorkspaceContext);
    if (!ctx) throw new Error('useSaleWorkspace must be used within SaleWorkspaceProvider');
    return ctx;
}
