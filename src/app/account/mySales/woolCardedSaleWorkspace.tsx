// src/app/account/mySales/woolCardedSaleWorkspace.tsx

/**
 * Arbejdsplads for redigering af kartet-uld-annoncer i "Mine Salg".
 * - Bruger SaleWorkspaceBase for fælles layout, edit-header og base-felter.
 * - Håndterer kartet-uld-specifikke felter med editNode-pattern.
 * - `color` er et server-beregnet felt — vises read-only, kan ikke redigeres.
 * - `fiberComponents` redigeres via WoolCardedFiberEditor (gram-baseret).
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
    WoolCardedSaleProfilePrivateDTO,
    WoolCardedPostPutSaleDetailsDTO,
    WoolCardedFiberComponentDTO,
} from '@/api/types/WoolCardedDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { updateWoolCardedSaleDetails } from '@/app/actions/sales/salesWoolCardedActions';
import { useSaleWorkspace } from '@/contexts/SaleWorkspaceContext';
import SaleWorkspaceBase from './_shared/saleWorkspaceBase';
import { PropertyTable, type PropertyTableItem } from '@/components/ui/custom/tables';
import { Input } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import { WoolCardedFiberEditor } from '@/components/features/woolCarded';

interface Props { profile: WoolCardedSaleProfilePrivateDTO; }

/** Map read-DTOs (with percentage) to write-DTOs (type + weightInGrams) for editing */
function toWriteComponents(profile: WoolCardedSaleProfilePrivateDTO): WoolCardedFiberComponentDTO[] {
    return profile.fiberComponents.map(fc => ({
        type: fc.type,
        weightInGrams: fc.weightInGrams,
    }));
}

export default function WoolCardedSaleWorkspace({ profile }: Props) {
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

    const [woolCardedData, setWoolCardedData] = useState<{
        averageFiberLengthInCm: number;
        naturalColor: string | null;
        dyedColor: string | null;
        fiberComponents: WoolCardedFiberComponentDTO[];
    }>({
        averageFiberLengthInCm: profile.averageFiberLengthInCm ?? 0,
        naturalColor: null,
        dyedColor: null,
        fiberComponents: toWriteComponents(profile),
    });

    const hasChanges =
        baseData.title !== profile.title ||
        baseData.price !== profile.price ||
        baseData.description !== profile.description ||
        baseData.canBeShipped !== profile.canBeShipped ||
        woolCardedData.averageFiberLengthInCm !== (profile.averageFiberLengthInCm ?? 0) ||
        woolCardedData.naturalColor !== null ||
        woolCardedData.dyedColor !== null ||
        JSON.stringify(woolCardedData.fiberComponents) !== JSON.stringify(toWriteComponents(profile));

    const handleSave = async () => {
        setIsSaving(true);
        const formData: WoolCardedPostPutSaleDetailsDTO = {
            baseProperties: baseData,
            averageFiberLengthInCm: woolCardedData.averageFiberLengthInCm,
            naturalColor: woolCardedData.naturalColor,
            dyedColor: woolCardedData.dyedColor,
            fiberComponents: woolCardedData.fiberComponents,
        };
        const result = await updateWoolCardedSaleDetails(profile.id, formData);
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
        setBaseData({
            title: profile.title,
            price: profile.price,
            description: profile.description,
            canBeShipped: profile.canBeShipped,
        });
        setWoolCardedData({
            averageFiberLengthInCm: profile.averageFiberLengthInCm ?? 0,
            naturalColor: null,
            dyedColor: null,
            fiberComponents: toWriteComponents(profile),
        });
        setIsEditing(false);
    };

    const woolCardedTableItems: PropertyTableItem[] = [
        {
            label: 'Farve',
            value: profile.color ?? undefined,
            editNode: (
                <div className="flex items-center gap-2 min-w-0">
                    <EnumAutocomplete
                        enumType="WoolNaturalColor"
                        value={woolCardedData.naturalColor ?? ''}
                        onChange={(val) => setWoolCardedData(prev => ({ ...prev, naturalColor: val ?? null, dyedColor: null }))}
                        label="Naturlig farve"
                        placeholder="Naturlig"
                        compact
                    />
                    <span className="text-foreground/40 text-xs shrink-0">eller</span>
                    <EnumAutocomplete
                        enumType="WoolDyedColor"
                        value={woolCardedData.dyedColor ?? ''}
                        onChange={(val) => setWoolCardedData(prev => ({ ...prev, dyedColor: val ?? null, naturalColor: null }))}
                        label="Farvet farve"
                        placeholder="Farvet"
                        compact
                    />
                </div>
            ),
        },
        {
            label: 'Gns. fiberlængde (cm)',
            value: profile.averageFiberLengthInCm ?? undefined,
            editNode: (
                <Input
                    variant="secondary"
                    type="number"
                    value={woolCardedData.averageFiberLengthInCm.toString()}
                    onChange={(e) => setWoolCardedData(prev => ({ ...prev, averageFiberLengthInCm: Number(e.target.value) }))}
                    min="0"
                    step="0.5"
                    aria-label="Gennemsnitlig fiberlængde i centimeter"
                />
            ),
        },
        {
            label: 'Fiberkomponenter',
            value: `${profile.fiberComponents.length} komponent(er) · ${profile.totalWeightInGrams} g total`,
            editNode: (
                <WoolCardedFiberEditor
                    components={woolCardedData.fiberComponents}
                    readComponents={profile.fiberComponents}
                    onChange={(components) => setWoolCardedData(prev => ({ ...prev, fiberComponents: components }))}
                    isEditing={isEditing}
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
                title="Kartet-uld-specifikke salgsdetaljer"
                items={woolCardedTableItems}
                isEditing={isEditing}
            />
        </SaleWorkspaceBase>
    );
}
