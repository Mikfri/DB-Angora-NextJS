// src/app/account/mySales/rabbitSaleForm.tsx
'use client';
import { Button, Input, TextArea, Switch, Card } from '@heroui/react';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import { RabbitPostPutSaleDetailsDTO } from '@/api/types/RabbitSaleDTOs';

interface RabbitSaleFormProps {
    formData: RabbitPostPutSaleDetailsDTO;
    setFormData: (data: RabbitPostPutSaleDetailsDTO) => void;
    onSave: () => void;
    onCancel: () => void;
    isSaving: boolean;
}

export default function RabbitSaleForm({ formData, setFormData, onSave, onCancel, isSaving }: RabbitSaleFormProps) {
    const handleBaseChange = <K extends keyof RabbitPostPutSaleDetailsDTO['baseProperties']>(
        key: K,
        value: RabbitPostPutSaleDetailsDTO['baseProperties'][K]
    ) => {
        setFormData({ ...formData, baseProperties: { ...formData.baseProperties, [key]: value } });
    };

    const handleChange = <K extends Exclude<keyof RabbitPostPutSaleDetailsDTO, 'baseProperties'>>(
        key: K,
        value: RabbitPostPutSaleDetailsDTO[K]
    ) => {
        setFormData({ ...formData, [key]: value });
    };

    return (
        <Card className="bg-zinc-800/80 border border-zinc-700/50">
            <Card.Content>
                <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
                    <h2 className="text-xl font-semibold">Rediger salgsannonce</h2>

                    <div className="space-y-1">
                        <label className="text-sm text-zinc-300">Titel</label>
                        <Input
                            value={formData.baseProperties.title}
                            onChange={(e) => handleBaseChange('title', e.target.value)}
                            placeholder="Salgstitel..."
                            required
                            maxLength={200}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-zinc-300">Pris (DKK)</label>
                        <Input
                            type="number"
                            value={formData.baseProperties.price.toString()}
                            onChange={(e) => handleBaseChange('price', Number(e.target.value))}
                            min="0"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-zinc-300">Bosted</label>
                        <EnumAutocomplete
                            enumType="RabbitHomeEnvironment"
                            value={formData.homeEnvironment}
                            onChange={(val) => handleChange('homeEnvironment', val ?? '')}
                            placeholder="Vælg boform"
                            label=""
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-zinc-300">Beskrivelse</label>
                        <TextArea
                            value={formData.baseProperties.description}
                            onChange={(e) => handleBaseChange('description', e.target.value)}
                            placeholder="Beskriv kaninen..."
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg">
                            <label className="text-sm text-zinc-300">Kan leveres</label>
                            <Switch
                                isSelected={formData.baseProperties.canBeShipped}
                                onChange={(v) => handleBaseChange('canBeShipped', v)}
                                size="sm"
                            />
                        </div>
                        <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg">
                            <label className="text-sm text-zinc-300">Pottetrænet</label>
                            <Switch
                                isSelected={formData.isLitterTrained}
                                onChange={(v) => handleChange('isLitterTrained', v)}
                                size="sm"
                            />
                        </div>
                        <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg">
                            <label className="text-sm text-zinc-300">Neutraliseret</label>
                            <Switch
                                isSelected={formData.isNeutered}
                                onChange={(v) => handleChange('isNeutered', v)}
                                size="sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onPress={onCancel} isDisabled={isSaving}>Annuller</Button>
                        <Button variant="primary" type="submit" isPending={isSaving}>Gem ændringer</Button>
                    </div>
                </form>
            </Card.Content>
        </Card>
    );
}
