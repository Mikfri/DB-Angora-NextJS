// src/app/account/mySales/create/woolRawSaleCreateForm.tsx

/**
 * Formular til oprettelse af en ny råuld-salgsannonce.
 * - Kalder createWoolRawSaleDetails og redirecter til det nye workspace ved success.
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { WoolRawPostPutSaleDetailsDTO } from '@/api/types/WoolRawDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { createWoolRawSaleDetails } from '@/app/actions/sales/salesWoolRawActions';
import SaleCreateBase from '../_shared/saleCreateBase';
import { PropertyTable, type PropertyTableItem } from '@/components/ui/custom/tables';
import { Input } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';

export default function WoolRawSaleCreateForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [baseData, setBaseData] = useState<SaleDetailsBasePostPutDTO>({
        title: '',
        price: 0,
        description: '',
        canBeShipped: false,
    });

    const [woolRawData, setWoolRawData] = useState({
        fiberType: '',
        naturalColor: null as string | null,
        fiberLengthInCm: 0,
        weightInGrams: 0,
    });

    const canSubmit =
        baseData.title.trim().length > 0 &&
        baseData.price >= 0 &&
        woolRawData.fiberType.length > 0 &&
        woolRawData.fiberLengthInCm > 0 &&
        woolRawData.weightInGrams > 0;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const formData: WoolRawPostPutSaleDetailsDTO = {
            baseProperties: baseData,
            fiberType: woolRawData.fiberType,
            naturalColor: woolRawData.naturalColor,
            fiberLengthInCm: woolRawData.fiberLengthInCm,
            weightInGrams: woolRawData.weightInGrams,
        };
        const result = await createWoolRawSaleDetails(formData);
        if (result.success) {
            toast.success('Råuld-salgsannonce oprettet');
            router.push(`/account/mySales/woolrawsd/${result.data.id}`);
        } else {
            toast.error(result.error);
            setIsSubmitting(false);
        }
    };

    const woolRawTableItems: PropertyTableItem[] = [
        {
            label: 'Fibertype',
            required: true,
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
            required: true,
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
            required: true,
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
        <SaleCreateBase
            formData={baseData}
            setFormData={setBaseData}
            isSubmitting={isSubmitting}
            canSubmit={canSubmit}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
        >
            <PropertyTable
                title="Råuld-specifikke salgsdetaljer"
                items={woolRawTableItems}
                isEditing
            />
        </SaleCreateBase>
    );
}
