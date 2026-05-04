// src/app/account/mySales/woolRawSaleWorkspace.tsx

/**
 * Arbejdsplads for redigering af råuld-annoncer i "Mine Salg".
 * - Bruger SaleWorkspaceBase for fælles layout, edit-header og base-felter.
 * - Håndterer råuld-specifikke felter (fibertype, farve, fiberlængde, vægt) med editNode-pattern.
 * - Inputs vises altid — låste når !isEditing, aktive når isEditing.
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { WoolRawSaleProfilePrivateDTO, WoolRawPostPutSaleDetailsDTO } from '@/api/types/WoolRawDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { updateWoolRawSaleDetails } from '@/app/actions/sales/salesWoolRawActions';
import { useSaleWorkspace } from '@/contexts/SaleWorkspaceContext';
import SaleWorkspaceBase from '../../_shared/saleWorkspaceBase';
import { PropertyTableItem, PropertyTable } from '@/components/ui/custom/tables';
import { Input } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';

interface Props { profile: WoolRawSaleProfilePrivateDTO; }

export default function WoolRawSaleWorkspace({ profile }: Props) {
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

    const [woolRawData, setWoolRawData] = useState<{
        fiberType: string;
        naturalColor: string | null;
        fiberLengthInCm: number;
        weightInGrams: number;
    }>({
        fiberType: profile.fiberType,
        naturalColor: profile.naturalColor ?? null,
        fiberLengthInCm: profile.fiberLengthInCm,
        weightInGrams: profile.weightInGrams,
    });

    const hasChanges =
        baseData.title !== profile.title ||
        baseData.price !== profile.price ||
        baseData.description !== profile.description ||
        baseData.canBeShipped !== profile.canBeShipped ||
        woolRawData.fiberType !== profile.fiberType ||
        (woolRawData.naturalColor ?? null) !== (profile.naturalColor ?? null) ||
        woolRawData.fiberLengthInCm !== profile.fiberLengthInCm ||
        woolRawData.weightInGrams !== profile.weightInGrams;

    const handleSave = async () => {
        setIsSaving(true);
        const formData: WoolRawPostPutSaleDetailsDTO = {
            baseProperties: baseData,
            fiberType: woolRawData.fiberType,
            naturalColor: woolRawData.naturalColor,
            fiberLengthInCm: woolRawData.fiberLengthInCm,
            weightInGrams: woolRawData.weightInGrams,
        };
        const result = await updateWoolRawSaleDetails(profile.id, formData);
        if (result.success) {
            toast.success(result.message);
            setIsEditing(false);
            await refreshProfile();
            router.refresh();
        } else {
            toast.error(result.error);
        }
        setIsSaving(false);
    };

    const handleCancel = () => {
        setBaseData({ title: profile.title, price: profile.price, description: profile.description, canBeShipped: profile.canBeShipped });
        setWoolRawData({
            fiberType: profile.fiberType,
            naturalColor: profile.naturalColor ?? null,
            fiberLengthInCm: profile.fiberLengthInCm,
            weightInGrams: profile.weightInGrams,
        });
        setIsEditing(false);
    };

    const woolRawTableItems: PropertyTableItem[] = [
        {
            label: 'Fibertype',
            value: profile.fiberType,
            editNode: (
                <EnumAutocomplete
                    enumType="WoolFiberType"
                    value={woolRawData.fiberType}
                    onChange={(val) => setWoolRawData(prev => ({ ...prev, fiberType: val ?? '' }))}
                    label="Fibertype"
                    placeholder="Vælg fibertype"
                />
            ),
        },
        {
            label: 'Naturlig farve',
            value: profile.naturalColor ?? undefined,
            editNode: (
                <EnumAutocomplete
                    enumType="WoolNaturalColor"
                    value={woolRawData.naturalColor ?? ''}
                    onChange={(val) => setWoolRawData(prev => ({ ...prev, naturalColor: val ?? null }))}
                    label="Naturlig farve"
                    placeholder="Vælg farve"
                />
            ),
        },
        {
            label: 'Fiberlængde (cm)',
            value: profile.fiberLengthInCm,
            editNode: (
                <Input
                    variant="secondary"
                    type="number"
                    value={woolRawData.fiberLengthInCm.toString()}
                    onChange={(e) => setWoolRawData(prev => ({ ...prev, fiberLengthInCm: Number(e.target.value) }))}
                    min="0"
                    aria-label="Fiberlængde i centimeter"
                />
            ),
        },
        {
            label: 'Vægt (g)',
            value: profile.weightInGrams,
            editNode: (
                <Input
                    variant="secondary"
                    type="number"
                    value={woolRawData.weightInGrams.toString()}
                    onChange={(e) => setWoolRawData(prev => ({ ...prev, weightInGrams: Number(e.target.value) }))}
                    min="0"
                    aria-label="Vægt i gram"
                />
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
                title="Råuld-specifikke salgsdetaljer"
                items={woolRawTableItems}
                isEditing={isEditing}
            />
        </SaleWorkspaceBase>
    );
}
