// src/app/account/mySales/_shared/saleCreateBase.tsx

/**
 * Genbrugelig base-layout til oprettelse af salgsannoncer.
 * - Ingen billeder (entiteten eksisterer endnu ikke, fotos tilføjes efterfølgende i workspace).
 * - Altid i edit-mode — viser base-felter (titel, pris, levering, beskrivelse) direkte.
 * - Entity-specifikke felter injiceres via children.
 */

'use client';
import { ReactNode } from 'react';
import { Button, Input, TextArea, Switch } from '@/components/ui/heroui';
import { SaleDetailsBasePostPutDTO } from '@/api/types/SaleDetailsDTOs';
import { PropertyTable, PropertyTableItem } from '@/components/ui/custom/tables';

interface SaleCreateBaseProps {
    formData: SaleDetailsBasePostPutDTO;
    setFormData: (data: SaleDetailsBasePostPutDTO) => void;
    isSubmitting: boolean;
    canSubmit: boolean;
    onSubmit: () => void;
    onCancel: () => void;
    children?: ReactNode;
}

export default function SaleCreateBase({
    formData,
    setFormData,
    isSubmitting,
    canSubmit,
    onSubmit,
    onCancel,
    children,
}: SaleCreateBaseProps) {
    const set = <K extends keyof SaleDetailsBasePostPutDTO>(key: K, val: SaleDetailsBasePostPutDTO[K]) =>
        setFormData({ ...formData, [key]: val });

    const baseItems: PropertyTableItem[] = [
        {
            label: 'Titel',
            editNode: (
                <Input
                    variant="secondary"
                    value={formData.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="Salgstitel..."
                    maxLength={200}
                    aria-label="Titel"
                />
            ),
        },
        {
            label: 'Pris (DKK)',
            editNode: (
                <Input
                    variant="secondary"
                    type="number"
                    value={formData.price.toString()}
                    onChange={(e) => set('price', Number(e.target.value))}
                    min="0"
                    aria-label="Pris"
                />
            ),
        },
        {
            label: 'Kan leveres',
            editNode: (
                <Switch
                    size="md"
                    isSelected={formData.canBeShipped}
                    onChange={(v) => set('canBeShipped', v)}
                    aria-label="Kan leveres"
                >
                    <Switch.Control><Switch.Thumb /></Switch.Control>
                    <span className="text-sm">{formData.canBeShipped ? 'Ja' : 'Nej'}</span>
                </Switch>
            ),
        },
    ];

    return (
        <div className="main-content-container">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-divider">
                <h3 className="text-foreground font-medium">Opret salgsannonce</h3>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="text-success-foreground bg-success"
                        onPress={onSubmit}
                        isDisabled={isSubmitting || !canSubmit}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {isSubmitting ? 'Opretter...' : 'Opret'}
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        onPress={onCancel}
                        isDisabled={isSubmitting}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        Annuller
                    </Button>
                </div>
            </div>

            {/* Indhold */}
            <div className="p-4 space-y-4">
                {/* Base-felter */}
                <PropertyTable items={baseItems} useCard={false} isEditing />

                <div className="space-y-1.5 border-t border-divider pt-3">
                    <p className="px-3 text-xs font-medium text-foreground/60">Beskrivelse</p>
                    <TextArea
                        fullWidth
                        variant="secondary"
                        value={formData.description}
                        onChange={(e) => set('description', e.target.value)}
                        placeholder="Beskriv annoncen..."
                        rows={6}
                        aria-label="Beskrivelse"
                    />
                </div>

                {/* Entity-specifikke felter */}
                {children && (
                    <div className="space-y-4 border-t border-divider pt-4">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
}
