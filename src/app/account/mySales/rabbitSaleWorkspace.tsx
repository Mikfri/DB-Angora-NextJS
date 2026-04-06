// src/app/account/mySales/rabbitSaleWorkspace.tsx

/**
 * Arbejdsplads for redigering af kaninannoncer i "Mine Salg".
 * - Bruger SaleWorkspaceBase for fælles layout og funktionalitet.
 * - Håndterer kanin-specifikke felter som bosted, pottetræning og neutralisering.
 * - Inkluderer form til redigering af kaninannoncer (RabbitSaleForm).
 * - Målrettet mod private salgsvisninger, da den viser følsomme oplysninger som ID.
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { RabbitSaleProfilePrivateDTO } from '@/api/types/RabbitSaleDTOs';
import { RabbitPostPutSaleDetailsDTO } from '@/api/types/RabbitSaleDTOs';
import { updateRabbitSaleDetails, deleteRabbitSaleDetails } from '@/app/actions/sales/salesRabbitActions';
import SaleWorkspaceBase from './_shared/saleWorkspaceBase';
import { ROUTES } from '@/constants/navigationConstants';
import RabbitSaleForm from './rabbitSaleForm';
// + form komponent

interface Props { profile: RabbitSaleProfilePrivateDTO; }

export default function RabbitSaleWorkspace({ profile }: Props) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState<RabbitPostPutSaleDetailsDTO>({
        baseProperties: { title: profile.title, price: profile.price, description: profile.description, canBeShipped: profile.canBeShipped },
        isLitterTrained: profile.isLitterTrained,
        isNeutered: profile.isNeutered,
        homeEnvironment: profile.homeEnvironment,
    });

    const handleSave = async () => {
        setIsSaving(true);
        const result = await updateRabbitSaleDetails(profile.id, formData);
        if (result.success) { toast.success(result.message); setIsEditing(false); router.refresh(); }
        else toast.error(result.error);
        setIsSaving(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const result = await deleteRabbitSaleDetails(profile.id);
        if (result.success) { toast.success(result.message); router.push(ROUTES.ACCOUNT.MY_SALES); }
        else { toast.error(result.error); setIsDeleting(false); }
    };

    if (isEditing) {
        return <RabbitSaleForm formData={formData} setFormData={setFormData} onSave={handleSave} onCancel={() => setIsEditing(false)} isSaving={isSaving} />;
    }

    return (
        <SaleWorkspaceBase profile={profile} onEdit={() => setIsEditing(true)} onDelete={handleDelete} isDeleting={isDeleting}>
            {/* Rabbit-specifikke felter */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm border-t border-zinc-700/30 pt-4">
                <div><p className="text-zinc-400">Bosted</p><p>{profile.homeEnvironment}</p></div>
                <div><p className="text-zinc-400">Pottetrænet</p><p>{profile.isLitterTrained ? 'Ja' : 'Nej'}</p></div>
                <div><p className="text-zinc-400">Neutraliseret</p><p>{profile.isNeutered ? 'Ja' : 'Nej'}</p></div>
            </div>
        </SaleWorkspaceBase>
    );
}