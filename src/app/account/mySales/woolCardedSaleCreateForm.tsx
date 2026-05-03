// src/app/account/mySales/woolCardedSaleCreateForm.tsx

/**
 * Formular til oprettelse af en ny kartet-uld-salgsannonce.
 * - Kalder createWoolCardedSaleDetails og redirecter til det nye workspace ved success.
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { WoolCardedPostPutSaleDetailsDTO, WoolCardedFiberComponentDTO } from '@/api/types/WoolCardedDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { createWoolCardedSaleDetails } from '@/app/actions/sales/salesWoolCardedActions';
import SaleCreateBase from './_shared/saleCreateBase';
import { PropertyTable, type PropertyTableItem } from '@/components/ui/custom/tables';
import { Input } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import { WoolCardedFiberEditor } from '@/components/features/woolCarded';

export default function WoolCardedSaleCreateForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [baseData, setBaseData] = useState<SaleDetailsBasePostPutDTO>({
        title: '',
        price: 0,
        description: '',
        canBeShipped: false,
    });

    const [woolCardedData, setWoolCardedData] = useState({
        averageFiberLengthInCm: 0,
        naturalColor: null as string | null,
        dyedColor: null as string | null,
        fiberComponents: [] as WoolCardedFiberComponentDTO[],
    });

    const canSubmit =
        baseData.title.trim().length > 0 &&
        baseData.price >= 0 &&
        woolCardedData.averageFiberLengthInCm > 0 &&
        woolCardedData.fiberComponents.length > 0;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const formData: WoolCardedPostPutSaleDetailsDTO = {
            baseProperties: baseData,
            averageFiberLengthInCm: woolCardedData.averageFiberLengthInCm,
            naturalColor: woolCardedData.naturalColor,
            dyedColor: woolCardedData.dyedColor,
            fiberComponents: woolCardedData.fiberComponents,
        };
        const result = await createWoolCardedSaleDetails(formData);
        if (result.success) {
            toast.success('Kartet-uld-salgsannonce oprettet');
            router.push(`/account/mySales/woolcardedsd/${result.data.id}`);
        } else {
            toast.error(result.error);
            setIsSubmitting(false);
        }
    };

    const woolCardedTableItems: PropertyTableItem[] = [
        {
            label: 'Gns. fiberlængde (cm)',
            required: true,
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
            label: 'Farve',
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
            label: 'Fiberkomponenter',
            required: true,
            editNode: (
                <WoolCardedFiberEditor
                    components={woolCardedData.fiberComponents}
                    onChange={(components) => setWoolCardedData(prev => ({ ...prev, fiberComponents: components }))}
                    isEditing
                    required
                />
            ),
        },
    ];

    return (
        <SaleCreateBase
            formData={baseData}
            setFormData={setBaseData}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
        >
            <PropertyTable
                title="Kartet-uld-specifikke salgsdetaljer"
                items={woolCardedTableItems}
                isEditing
            />
        </SaleCreateBase>
    );
}
