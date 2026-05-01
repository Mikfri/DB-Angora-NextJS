// src/app/account/mySales/yarnSaleCreateForm.tsx

/**
 * Formular til oprettelse af en ny garnsalgsannonce.
 * - Genbruger samme table-item struktur som yarnSaleWorkspace (editNodes).
 * - Kalder createYarnSaleDetails og redirecter til det nye workspace ved success.
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { YarnPostPutSaleDetailsDTO } from '@/api/types/YarnDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { createYarnSaleDetails } from '@/app/actions/sales/salesYarnActions';
import SaleCreateBase from './_shared/saleCreateBase';
import { PropertyTable, type PropertyTableItem } from '@/components/ui/custom/tables';
import { CompactInput } from '@/components/ui/custom/inputs';
import { FiberComponentEditor } from '@/components/features/yarn';
import { Input, Chip } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';

export default function YarnSaleCreateForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [baseData, setBaseData] = useState<SaleDetailsBasePostPutDTO>({
        title: '',
        price: 0,
        description: '',
        canBeShipped: false,
    });

    const [yarnData, setYarnData] = useState({
        weightInGrams: 0,
        lengthInMeters: 0,
        applicationCategory: '',
        plyCount: null as number | null,
        twistAmount: null as string | null,
        needleSizeRange_MinMm: null as number | null,
        needleSizeRange_MaxMm: null as number | null,
        wpiCategory: null as string | null,
        stitchesPer10cm: null as number | null,
        rowsPer10cm: null as number | null,
        naturalColor: null as string | null,
        dyedColor: null as string | null,
        fiberComponents: [] as YarnPostPutSaleDetailsDTO['fiberComponents'],
    });

    const canSubmit =
        baseData.title.trim().length > 0 &&
        baseData.price >= 0 &&
        yarnData.applicationCategory.length > 0 &&
        yarnData.weightInGrams > 0 &&
        yarnData.lengthInMeters > 0;

    const handleSubmit = async () => {
        setIsSubmitting(true);
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
        const result = await createYarnSaleDetails(formData);
        if (result.success) {
            toast.success('Garnsalgsannonce oprettet');
            router.push(`/account/mySales/yarnsd/${result.data.id}`);
        } else {
            toast.error(result.error);
            setIsSubmitting(false);
        }
    };

    const mainTableItems: PropertyTableItem[] = [
        {
            label: 'Farve',
            required: true,
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
    ];

    const strikkeProeveItems: PropertyTableItem[] = [
        {
            label: 'Masker/pinde',
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
        <SaleCreateBase
            formData={baseData}
            setFormData={setBaseData}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
        >
            <div className="grid grid-cols-2 gap-4">
                {/* VENSTRE: Garn-specifikke properties */}
                <PropertyTable
                    title="Garn-specifikke detaljer"
                    items={mainTableItems}
                    isEditing
                />

                {/* HØJRE: Nål + Strikkefasthed stacked */}
                <div className="space-y-4">
                    <PropertyTable
                        title="Anbefalet nålestørrelse"
                        items={needleSizeItems}
                        isEditing
                    />
                    <PropertyTable
                        title="Strikkeprøve"
                        titleBadge={<Chip size="sm" variant="soft">10 × 10 cm</Chip>}
                        items={strikkeProeveItems}
                        isEditing
                    />
                </div>
            </div>

            {/* Kategorisering */}
            <PropertyTable
                title="Kategorisering"
                items={categorizationItems}
                isEditing
            />

            {/* Fiberkomponenter */}
            <FiberComponentEditor
                components={yarnData.fiberComponents}
                onChange={(components) => setYarnData(prev => ({ ...prev, fiberComponents: components }))}
                isEditing
                required
            />
        </SaleCreateBase>
    );
}
