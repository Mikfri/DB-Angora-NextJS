// src/app/account/mySales/create/peltSaleCreateForm.tsx

/**
 * Formular til oprettelse af en ny skind-salgsannonce.
 * - Kalder createPeltSaleDetails og redirecter til det nye workspace ved success.
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { PeltPostPutSaleDetailsDTO } from '@/api/types/PeltDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { createPeltSaleDetails } from '@/app/actions/sales/salesPeltActions';
import SaleCreateBase from '../_shared/saleCreateBase';
import { PropertyTable, type PropertyTableItem } from '@/components/ui/custom/tables';
import { Input } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';

export default function PeltSaleCreateForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [baseData, setBaseData] = useState<SaleDetailsBasePostPutDTO>({
        title: '',
        price: 0,
        description: '',
        canBeShipped: false,
    });

    const [peltData, setPeltData] = useState({
        color: '',
        race: '',
        tanningMethod: '',
        condition: '',
        lengthCm: 0,
        widthCm: 0,
    });

    const canSubmit =
        baseData.title.trim().length > 0 &&
        baseData.price >= 0 &&
        peltData.color.length > 0 &&
        peltData.race.length > 0 &&
        peltData.tanningMethod.length > 0 &&
        peltData.condition.length > 0 &&
        peltData.lengthCm > 0 &&
        peltData.widthCm > 0;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const formData: PeltPostPutSaleDetailsDTO = {
            baseProperties: baseData,
            color: peltData.color,
            race: peltData.race,
            tanningMethod: peltData.tanningMethod,
            condition: peltData.condition,
            lengthCm: peltData.lengthCm,
            widthCm: peltData.widthCm,
        };
        const result = await createPeltSaleDetails(formData);
        if (result.success) {
            toast.success('Skind-salgsannonce oprettet');
            router.push(`/account/mySales/peltsd/${result.data.id}`);
        } else {
            toast.error(result.error);
            setIsSubmitting(false);
        }
    };

    const peltTableItems: PropertyTableItem[] = [
        {
            label: 'Farve',
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
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
            required: true,
            editNode: (
                <div className="flex items-center gap-2">
                    <Input
                        variant="secondary"
                        type="number"
                        value={peltData.lengthCm > 0 ? peltData.lengthCm.toString() : ''}
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
                        value={peltData.widthCm > 0 ? peltData.widthCm.toString() : ''}
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
        <SaleCreateBase
            formData={baseData}
            setFormData={setBaseData}
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
        >
            <PropertyTable
                title="Skind-specifikke salgsdetaljer"
                items={peltTableItems}
                isEditing
            />
        </SaleCreateBase>
    );
}
