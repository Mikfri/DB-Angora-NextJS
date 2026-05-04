// src/app/account/mySales/rabbitSaleWorkspace.tsx

/**
 * Arbejdsplads for redigering af kaninannoncer i "Mine Salg".
 * - Bruger SaleWorkspaceBase for fælles layout, edit-header og base-felter.
 * - Håndterer kanin-specifikke felter (bosted, pottetræning, neutralisering) med editNode-pattern.
 * - Inputs vises altid — låste når !isEditing, aktive når isEditing.
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { RabbitSaleProfilePrivateDTO, RabbitPostPutSaleDetailsDTO } from '@/api/types/RabbitSaleDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { updateRabbitSaleDetails } from '@/app/actions/sales/salesRabbitActions';
import { useSaleWorkspace } from '@/contexts/SaleWorkspaceContext';
import SaleWorkspaceBase from '../../_shared/saleWorkspaceBase';
import { PropertyTableItem, PropertyTable } from '@/components/ui/custom/tables';
import { Switch } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';

interface Props { profile: RabbitSaleProfilePrivateDTO; }

export default function RabbitSaleWorkspace({ profile }: Props) {
    const router = useRouter();
    const { refreshProfile } = useSaleWorkspace();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [baseData, setBaseData] = useState<SaleDetailsBasePostPutDTO>({
        title: profile.title,
        price: profile.price,
        description: profile.description,
        canBeShipped: profile.canBeShipped,
    });

    const [rabbitData, setRabbitData] = useState({
        homeEnvironment: profile.homeEnvironment,
        isLitterTrained: profile.isLitterTrained,
        isNeutered: profile.isNeutered,
    });

    const hasChanges =
        baseData.title !== profile.title ||
        baseData.price !== profile.price ||
        baseData.description !== profile.description ||
        baseData.canBeShipped !== profile.canBeShipped ||
        rabbitData.homeEnvironment !== profile.homeEnvironment ||
        rabbitData.isLitterTrained !== profile.isLitterTrained ||
        rabbitData.isNeutered !== profile.isNeutered;

    const handleSave = async () => {
        setIsSaving(true);
        const formData: RabbitPostPutSaleDetailsDTO = {
            baseProperties: baseData,
            ...rabbitData,
        };
        const result = await updateRabbitSaleDetails(profile.id, formData);
        if (result.success) {
            toast.success(result.message);
            setIsEditing(false);
            await refreshProfile(); // opdater nav øjeblikkeligt
            router.refresh();       // opdater server-prop baseline (hasChanges)
        } else {
            toast.error(result.error);
        }
        setIsSaving(false);
    };

    const handleCancel = () => {
        setBaseData({ title: profile.title, price: profile.price, description: profile.description, canBeShipped: profile.canBeShipped });
        setRabbitData({ homeEnvironment: profile.homeEnvironment, isLitterTrained: profile.isLitterTrained, isNeutered: profile.isNeutered });
        setIsEditing(false);
    };

    const rabbitTableItems: PropertyTableItem[] = [
        {
            label: 'Bosted',
            editNode: (
                <EnumAutocomplete
                    enumType="RabbitHomeEnvironment"
                    value={rabbitData.homeEnvironment}
                    onChange={(val) => setRabbitData({ ...rabbitData, homeEnvironment: val ?? '' })}
                    label="Bosted"
                    placeholder="Vælg boform"
                />
            ),
        },
        {
            label: 'Pottetrænet',
            editNode: (
                <Switch
                    size="md"
                    isSelected={rabbitData.isLitterTrained}
                    onChange={(v) => setRabbitData({ ...rabbitData, isLitterTrained: v })}
                    aria-label="Pottetrænet"
                >
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                    <span className="text-sm">{rabbitData.isLitterTrained ? 'Ja' : 'Nej'}</span>
                </Switch>
            ),
        },
        {
            label: 'Neutraliseret',
            editNode: (
                <Switch
                    size="md"
                    isSelected={rabbitData.isNeutered}
                    onChange={(v) => setRabbitData({ ...rabbitData, isNeutered: v })}
                    aria-label="Neutraliseret"
                >
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                    <span className="text-sm">{rabbitData.isNeutered ? 'Ja' : 'Nej'}</span>
                </Switch>
            ),
        },
    ];

    return (
        <SaleWorkspaceBase
            profile={profile}
            formData={baseData}
            setFormData={setBaseData}
            isEditing={isEditing}
            isSaving={isSaving}
            hasChanges={hasChanges}
            onEdit={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
        >
            <PropertyTable
                title="Kanin-specifikke salgsdetaljer"
                items={rabbitTableItems}
                isEditing={isEditing}
            />
        </SaleWorkspaceBase>
    );
}

