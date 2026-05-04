// src/app/account/mySales/create/rabbitSaleCreateForm.tsx

/**
 * Formular til oprettelse af en ny kaninsalgsannonce.
 * - Kræver earCombId da kaninsalg knyttes til en eksisterende kanin.
 * - Kalder createRabbitSaleDetails og redirecter til det nye workspace ved success.
 */

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { RabbitPostPutSaleDetailsDTO } from '@/api/types/RabbitSaleDTOs';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { createRabbitSaleDetails } from '@/app/actions/sales/salesRabbitActions';
import SaleCreateBase from '../_shared/saleCreateBase';
import { PropertyTable, type PropertyTableItem } from '@/components/ui/custom/tables';
import { Switch } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import { RabbitOwnedAutocomplete } from '@/components/features/rabbit';

export default function RabbitSaleCreateForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [earCombId, setEarCombId] = useState('');

    const [baseData, setBaseData] = useState<SaleDetailsBasePostPutDTO>({
        title: '',
        price: 0,
        description: '',
        canBeShipped: false,
    });

    const [rabbitData, setRabbitData] = useState({
        homeEnvironment: '',
        isLitterTrained: false,
        isNeutered: false,
    });

    const canSubmit =
        earCombId.trim().length > 0 &&
        baseData.title.trim().length > 0 &&
        baseData.price >= 0 &&
        rabbitData.homeEnvironment.length > 0;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const formData: RabbitPostPutSaleDetailsDTO = {
            baseProperties: baseData,
            ...rabbitData,
        };
        const result = await createRabbitSaleDetails(earCombId.trim(), formData);
        if (result.success) {
            toast.success('Kaninsalgsannonce oprettet');
            router.push(`/account/mySales/rabbitsd/${result.data.id}`);
        } else {
            toast.error(result.error);
            setIsSubmitting(false);
        }
    };

    const rabbitTableItems: PropertyTableItem[] = [
        {
            label: 'Kanin (øremærke)',
            required: true,
            editNode: (
                <RabbitOwnedAutocomplete
                    value={earCombId || null}
                    onChange={(val) => setEarCombId(val ?? '')}
                    id="rabbit-sale-earCombId"
                />
            ),
        },
        {
            label: 'Bosted',
            required: true,
            editNode: (
                <EnumAutocomplete
                    enumType="RabbitHomeEnvironment"
                    value={rabbitData.homeEnvironment}
                    onChange={(val) => setRabbitData(prev => ({ ...prev, homeEnvironment: val ?? '' }))}
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
                    onChange={(v) => setRabbitData(prev => ({ ...prev, isLitterTrained: v }))}
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
                    onChange={(v) => setRabbitData(prev => ({ ...prev, isNeutered: v }))}
                    aria-label="Neutraliseret"
                >
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                    <span className="text-sm">{rabbitData.isNeutered ? 'Ja' : 'Nej'}</span>
                </Switch>
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
                title="Kanin-specifikke salgsdetaljer"
                items={rabbitTableItems}
                isEditing
            />
        </SaleCreateBase>
    );
}
