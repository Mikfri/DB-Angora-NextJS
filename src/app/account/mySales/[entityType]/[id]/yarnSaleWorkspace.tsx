'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { YarnPostPutSaleDetailsDTO, YarnSaleProfilePrivateDTO } from '@/api/types/YarnDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { updateYarnSaleDetails } from '@/app/actions/sales/salesYarnActions';
import { useSaleWorkspace } from '@/contexts/SaleWorkspaceContext';
import SaleWorkspaceBase from '../../_shared/saleWorkspaceBase';
import { PropertyTable, type PropertyTableItem } from '@/components/ui/custom/tables';
import { CompactInput } from '@/components/ui/custom/inputs';
import { FiberComponentEditor } from '@/components/features/yarn';
import { Input, Chip } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';

interface Props {
    profile: YarnSaleProfilePrivateDTO;
}

export default function YarnSaleWorkspace({ profile }: Props) {
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

    const [yarnData, setYarnData] = useState({
        weightInGrams: profile.weightInGrams,
        lengthInMeters: profile.lengthInMeters,
        applicationCategory: profile.applicationCategory,
        plyCount: profile.plyCount ?? null,
        twistAmount: profile.twistAmount ?? null,
        needleSizeRange_MinMm: profile.gauge?.recommendedNeedleSizeRange?.minMm ?? null,
        needleSizeRange_MaxMm: profile.gauge?.recommendedNeedleSizeRange?.maxMm ?? null,
        wpiCategory: null as string | null,
        stitchesPer10cm: profile.gauge?.stitchesPer10Cm ?? null,
        rowsPer10cm: profile.gauge?.rowsPer10Cm ?? null,
        naturalColor: profile.color?.naturalColor ?? null,
        dyedColor: profile.color?.dyedColor ?? null,
        fiberComponents: profile.fiberComponents,
    });

    const hasChanges =
        baseData.title !== profile.title ||
        baseData.price !== profile.price ||
        baseData.description !== profile.description ||
        baseData.canBeShipped !== profile.canBeShipped ||
        yarnData.weightInGrams !== profile.weightInGrams ||
        yarnData.lengthInMeters !== profile.lengthInMeters ||
        yarnData.applicationCategory !== profile.applicationCategory ||
        (yarnData.plyCount ?? null) !== (profile.plyCount ?? null) ||
        (yarnData.twistAmount ?? null) !== (profile.twistAmount ?? null) ||
        (yarnData.needleSizeRange_MinMm ?? null) !== (profile.gauge?.recommendedNeedleSizeRange?.minMm ?? null) ||
        (yarnData.needleSizeRange_MaxMm ?? null) !== (profile.gauge?.recommendedNeedleSizeRange?.maxMm ?? null) ||
        (yarnData.stitchesPer10cm ?? null) !== (profile.gauge?.stitchesPer10Cm ?? null) ||
        (yarnData.rowsPer10cm ?? null) !== (profile.gauge?.rowsPer10Cm ?? null) ||
        (yarnData.naturalColor ?? null) !== (profile.color?.naturalColor ?? null) ||
        (yarnData.dyedColor ?? null) !== (profile.color?.dyedColor ?? null) ||
        JSON.stringify(yarnData.fiberComponents) !== JSON.stringify(profile.fiberComponents);

    const handleSave = async () => {
        setIsSaving(true);
        const formData: YarnPostPutSaleDetailsDTO = {
            baseProperties: baseData,
            weightInGrams: yarnData.weightInGrams,
            lengthInMeters: yarnData.lengthInMeters,
            applicationCategory: yarnData.applicationCategory,
            plyCount: yarnData.plyCount,
            twistAmount: yarnData.twistAmount,
            needleSizeRange_MinMm: yarnData.needleSizeRange_MinMm,
            needleSizeRange_MaxMm: yarnData.needleSizeRange_MaxMm,
            wpiCategory: yarnData.wpiCategory,
            stitchesPer10cm: yarnData.stitchesPer10cm,
            rowsPer10cm: yarnData.rowsPer10cm,
            naturalColor: yarnData.naturalColor,
            dyedColor: yarnData.dyedColor,
            fiberComponents: yarnData.fiberComponents,
        };
        const result = await updateYarnSaleDetails(profile.id, formData);
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
        setYarnData(prev => ({
            ...prev,
            weightInGrams: profile.weightInGrams,
            lengthInMeters: profile.lengthInMeters,
            applicationCategory: profile.applicationCategory,
            plyCount: profile.plyCount ?? null,
            twistAmount: profile.twistAmount ?? null,
            needleSizeRange_MinMm: profile.gauge?.recommendedNeedleSizeRange?.minMm ?? null,
            needleSizeRange_MaxMm: profile.gauge?.recommendedNeedleSizeRange?.maxMm ?? null,
            stitchesPer10cm: profile.gauge?.stitchesPer10Cm ?? null,
            rowsPer10cm: profile.gauge?.rowsPer10Cm ?? null,
            naturalColor: profile.color?.naturalColor ?? null,
            dyedColor: profile.color?.dyedColor ?? null,
        }));
        setIsEditing(false);
    };

    const mainTableItems: PropertyTableItem[] = [
        {
            label: 'Farve',
            required: true,
            value: (() => {
                const nat = profile.color?.naturalColor;
                const dyed = profile.color?.dyedColor;
                if (nat) return nat;
                if (dyed) return dyed;
                return 'Ingen';
            })(),
            editNode: (
                <div className="flex items-center gap-2 min-w-0">
                    <EnumAutocomplete
                        enumType="WoolNaturalColor"
                        value={yarnData.naturalColor ?? ''}
                        onChange={(val) => setYarnData(prev => ({ ...prev, naturalColor: val ?? null, dyedColor: null }))}
                        label="Naturlig farve"
                        placeholder="Naturlig"
                        compact
                    />
                    <span className="text-foreground/40 text-xs shrink-0">eller</span>
                    <EnumAutocomplete
                        enumType="WoolDyedColor"
                        value={yarnData.dyedColor ?? ''}
                        onChange={(val) => setYarnData(prev => ({ ...prev, dyedColor: val ?? null, naturalColor: null }))}
                        label="Farvet farve"
                        placeholder="Farvet"
                        compact
                    />
                </div>
            ),
        },
        {
            label: 'Vægt (g)',
            required: true,
            value: profile.weightInGrams,
            editNode: (
                <Input
                    variant="secondary"
                    type="number"
                    value={yarnData.weightInGrams.toString()}
                    onChange={(e) => setYarnData(prev => ({ ...prev, weightInGrams: Number(e.target.value) }))}
                    min="0"
                    aria-label="Vægt i gram"
                />
            ),
        },
        {
            label: 'Længde (m)',
            required: true,
            value: profile.lengthInMeters,
            editNode: (
                <Input
                    variant="secondary"
                    type="number"
                    value={yarnData.lengthInMeters.toString()}
                    onChange={(e) => setYarnData(prev => ({ ...prev, lengthInMeters: Number(e.target.value) }))}
                    min="0"
                    aria-label="Længde i meter"
                />
            ),
        },
        {
            label: 'Ply count',
            value: profile.plyCount ?? 'N/A',
            editNode: (
                <Input
                    variant="secondary"
                    type="number"
                    value={yarnData.plyCount?.toString() ?? ''}
                    onChange={(e) => setYarnData(prev => ({ ...prev, plyCount: e.target.value ? Number(e.target.value) : null }))}
                    min="1"
                    placeholder="Antal tråde"
                    aria-label="Ply count"
                />
            ),
        },
        {
            label: 'Twist',
            value: profile.twistAmount ?? 'Ikke angivet',
            editNode: (
                <EnumAutocomplete
                    enumType="YarnTwistAmount"
                    value={yarnData.twistAmount ?? ''}
                    onChange={(val) => setYarnData(prev => ({ ...prev, twistAmount: val ?? null }))}
                    label="Twist"
                    placeholder="Vælg twist"
                    compact
                />
            ),
        },
    ];

    const needleSizeItems: PropertyTableItem[] = [
        {
            label: 'Pindestørrelse',
            required: true,
            value: (() => {
                const min = profile.gauge?.recommendedNeedleSizeRange?.minMm;
                const max = profile.gauge?.recommendedNeedleSizeRange?.maxMm;
                if (min == null && max == null) return 'N/A';
                if (min === max || max == null) return `${min} mm`;
                if (min == null) return `${max} mm`;
                return `${min} – ${max} mm`;
            })(),
            editNode: (
                <div className="flex items-center gap-1">
                    <CompactInput
                        type="number"
                        value={yarnData.needleSizeRange_MinMm?.toString() ?? ''}
                        onChange={(e) => setYarnData(prev => ({ ...prev, needleSizeRange_MinMm: e.target.value ? Number(e.target.value) : null }))}
                        min="0" step="0.5"
                        placeholder="Min"
                        aria-label="Min pindestørrelse"
                    />
                    <span className="text-foreground/50 shrink-0 text-xs">–</span>
                    <CompactInput
                        type="number"
                        value={yarnData.needleSizeRange_MaxMm?.toString() ?? ''}
                        onChange={(e) => setYarnData(prev => ({ ...prev, needleSizeRange_MaxMm: e.target.value ? Number(e.target.value) : null }))}
                        min="0" step="0.5"
                        placeholder="Max"
                        aria-label="Max pindestørrelse"
                    />
                    <span className="text-foreground/50 text-xs shrink-0">mm</span>
                </div>
            ),
        },
        {
            label: 'Vægtkategori',
            value: profile.weightCategory,
            type: 'badge',
        },
    ];

    const strikkeProeveItems: PropertyTableItem[] = [
        {
            label: 'Masker/pinde',
            value: (() => {
                const sts = profile.gauge?.stitchesPer10Cm;
                const rows = profile.gauge?.rowsPer10Cm;
                if (sts == null && rows == null) return 'N/A';
                return `${sts ?? '?'} × ${rows ?? '?'} / 10 cm`;
            })(),
            editNode: (
                <div className="flex items-center gap-1">
                    <CompactInput
                        type="number"
                        value={yarnData.stitchesPer10cm?.toString() ?? ''}
                        onChange={(e) => setYarnData(prev => ({ ...prev, stitchesPer10cm: e.target.value ? Number(e.target.value) : null }))}
                        min="0"
                        placeholder="Masker"
                        aria-label="Masker per 10 cm"
                    />
                    <span className="text-foreground/50 shrink-0 text-xs">×</span>
                    <CompactInput
                        type="number"
                        value={yarnData.rowsPer10cm?.toString() ?? ''}
                        onChange={(e) => setYarnData(prev => ({ ...prev, rowsPer10cm: e.target.value ? Number(e.target.value) : null }))}
                        min="0"
                        placeholder="Pinde"
                        aria-label="Pinde per 10 cm"
                    />
                </div>
            ),
        },
    ];

    const categorizationItems: PropertyTableItem[] = [
        {
            label: 'Anvendelseskategori',
            required: true,
            value: profile.applicationCategory,
            editNode: (
                <EnumAutocomplete
                    enumType="YarnMainCategory"
                    value={yarnData.applicationCategory}
                    onChange={(val) => setYarnData(prev => ({ ...prev, applicationCategory: val ?? '' }))}
                    label="Anvendelseskategori"
                    placeholder="Vælg kategori"
                    compact
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
                title="Kategorisering"
                items={categorizationItems}
                isEditing={isEditing}
            />

            {/* Garn-specifikke + strikkefasthed tabeller side om side */}
            <div className="grid grid-cols-2 gap-4 items-start">
                <PropertyTable
                    title="Garn-specifikke salgsdetaljer"
                    titleBadge={profile.gristDescription ? <Chip size="sm" variant="soft">{profile.gristDescription}</Chip> : undefined}
                    items={mainTableItems}
                    isEditing={isEditing}
                />
                <div className="flex flex-col gap-4">
                    <PropertyTable
                        title="Anbefalet nålestørrelse"
                        titleBadge={<Chip size="sm" variant="soft">{profile.weightCategory}</Chip>}
                        items={needleSizeItems.filter(i => i.label !== 'Vægtkategori')}
                        isEditing={isEditing}
                    />
                    <PropertyTable
                        title="Strikkeprøve"
                        titleBadge={<Chip size="sm" variant="soft">10 × 10 cm</Chip>}
                        items={strikkeProeveItems}
                        isEditing={isEditing}
                    />
                </div>
            </div>

            {/* Fiberkomponenter */}
            <FiberComponentEditor
                components={yarnData.fiberComponents}
                onChange={(components) => setYarnData(prev => ({ ...prev, fiberComponents: components }))}
                isEditing={isEditing}
                required
            />
        </SaleWorkspaceBase>
    );
}

