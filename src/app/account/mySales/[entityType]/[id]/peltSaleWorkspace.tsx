// src/app/account/mySales/peltSaleWorkspace.tsx

/**
 * Arbejdsplads for redigering af skind-annoncer i "Mine Salg".
 * - Bruger SaleWorkspaceBase for fælles layout, edit-header og base-felter.
 * - Håndterer skind-specifikke felter med editNode-pattern.
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { PeltSaleProfilePrivateDTO, PeltPostPutSaleDetailsDTO } from '@/api/types/PeltDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { updatePeltSaleDetails } from '@/app/actions/sales/salesPeltActions';
import { useSaleWorkspace } from '@/contexts/SaleWorkspaceContext';
import SaleWorkspaceBase from '../../_shared/saleWorkspaceBase';
import { PropertyTable, type PropertyTableItem } from '@/components/ui/custom/tables';
import { Input } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';

interface Props { profile: PeltSaleProfilePrivateDTO; }

export default function PeltSaleWorkspace({ profile }: Props) {
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

    const [peltData, setPeltData] = useState({
        color: profile.color,
        race: profile.race,
        tanningMethod: profile.tanningMethod,
        condition: profile.condition,
        lengthCm: profile.lengthCm,
        widthCm: profile.widthCm,
    });

    const hasChanges =
        baseData.title !== profile.title ||
        baseData.price !== profile.price ||
        baseData.description !== profile.description ||
        baseData.canBeShipped !== profile.canBeShipped ||
        peltData.color !== profile.color ||
        peltData.race !== profile.race ||
        peltData.tanningMethod !== profile.tanningMethod ||
        peltData.condition !== profile.condition ||
        peltData.lengthCm !== profile.lengthCm ||
        peltData.widthCm !== profile.widthCm;

    const handleSave = async () => {
        setIsSaving(true);
        const formData: PeltPostPutSaleDetailsDTO = {
            baseProperties: baseData,
            color: peltData.color,
            race: peltData.race,
            tanningMethod: peltData.tanningMethod,
            condition: peltData.condition,
            lengthCm: peltData.lengthCm,
            widthCm: peltData.widthCm,
        };
        const result = await updatePeltSaleDetails(profile.id, formData);
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
        setPeltData({
            color: profile.color,
            race: profile.race,
            tanningMethod: profile.tanningMethod,
            condition: profile.condition,
            lengthCm: profile.lengthCm,
            widthCm: profile.widthCm,
        });
        setIsEditing(false);
    };

    const peltTableItems: PropertyTableItem[] = [
        {
            label: 'Farve',
            value: profile.color,
            editNode: (
                <EnumAutocomplete
                    enumType="Color"
                    value={peltData.color}
                    onChange={(val) => setPeltData(prev => ({ ...prev, color: val ?? '' }))}
                    label="Farve"
                    placeholder="Vælg farve"
                    compact
                />
            ),
        },
        {
            label: 'Race',
            value: profile.race,
            editNode: (
                <EnumAutocomplete
                    enumType="Race"
                    value={peltData.race}
                    onChange={(val) => setPeltData(prev => ({ ...prev, race: val ?? '' }))}
                    label="Race"
                    placeholder="Vælg race"
                    compact
                />
            ),
        },
        {
            label: 'Garvningsmetode',
            value: profile.tanningMethod,
            editNode: (
                <EnumAutocomplete
                    enumType="TanningMethod"
                    value={peltData.tanningMethod}
                    onChange={(val) => setPeltData(prev => ({ ...prev, tanningMethod: val ?? '' }))}
                    label="Garvningsmetode"
                    placeholder="Vælg metode"
                    compact
                />
            ),
        },
        {
            label: 'Stand',
            value: profile.condition,
            editNode: (
                <EnumAutocomplete
                    enumType="PeltCondition"
                    value={peltData.condition}
                    onChange={(val) => setPeltData(prev => ({ ...prev, condition: val ?? '' }))}
                    label="Stand"
                    placeholder="Vælg stand"
                    compact
                />
            ),
        },
        {
            label: 'Mål (cm)',
            value: `${profile.lengthCm} × ${profile.widthCm} cm`,
            editNode: (
                <div className="flex items-center gap-2">
                    <Input
                        variant="secondary"
                        type="number"
                        value={peltData.lengthCm.toString()}
                        onChange={(e) => setPeltData(prev => ({ ...prev, lengthCm: e.target.value ? Number(e.target.value) : 0 }))}
                        min="0"
                        step="0.5"
                        placeholder="Længde"
                        aria-label="Længde i centimeter"
                    />
                    <span className="text-foreground/50 shrink-0 text-xs">×</span>
                    <Input
                        variant="secondary"
                        type="number"
                        value={peltData.widthCm.toString()}
                        onChange={(e) => setPeltData(prev => ({ ...prev, widthCm: e.target.value ? Number(e.target.value) : 0 }))}
                        min="0"
                        step="0.5"
                        placeholder="Bredde"
                        aria-label="Bredde i centimeter"
                    />
                    <span className="text-foreground/50 text-xs shrink-0">cm</span>
                </div>
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
                title="Skind-specifikke salgsdetaljer"
                items={peltTableItems}
                isEditing={isEditing}
            />
        </SaleWorkspaceBase>
    );
}
