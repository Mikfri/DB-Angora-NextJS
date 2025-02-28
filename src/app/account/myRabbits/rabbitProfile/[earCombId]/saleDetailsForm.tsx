// src/app/account/myRabbits/rabbitProfile/[earCombId]/saleDetailsForm.tsx
import { Button, Input, Textarea, Switch } from "@heroui/react";
import EnumAutocomplete from "@/components/enumHandlers/enumAutocomplete";
import { Rabbit_CreateSaleDetailsDTO, Rabbit_UpdateSaleDetailsDTO } from "@/api/types/AngoraDTOs";

// Lav en union type for at håndtere begge typer af form data
type SaleDetailsFormData = 
    | (Rabbit_CreateSaleDetailsDTO)
    | (Omit<Rabbit_UpdateSaleDetailsDTO, 'rabbitId'>);

interface SaleDetailsFormProps {
    formData: SaleDetailsFormData;
    setFormData: (data: SaleDetailsFormData) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isSaving: boolean;
    isEditing: boolean;
}

export default function SaleDetailsForm({
    formData,
    setFormData,
    onSubmit,
    onCancel,
    isSaving,
    isEditing
}: SaleDetailsFormProps) {
    const handleChange = <K extends keyof SaleDetailsFormData>(key: K, value: SaleDetailsFormData[K]) => {
        setFormData({ ...formData, [key]: value });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            <div className="space-y-4">
                {/* Pris */}
                <div className="space-y-1">
                    <label htmlFor="price" className="text-sm text-zinc-300">Pris (DKK)</label>
                    <Input
                        id="price"
                        type="number"
                        value={formData.price.toString()}
                        onChange={(e) => handleChange('price', Number(e.target.value))}
                        placeholder="Pris i DKK"
                        min="0"
                        required
                    />
                </div>

                {/* Boform */}
                <div className="space-y-1">
                    <label htmlFor="homeEnvironment" className="text-sm text-zinc-300">Bosted</label>
                    <EnumAutocomplete
                        id="homeEnvironment"
                        enumType="RabbitHomeEnvironment"
                        value={formData.homeEnvironment}
                        onChange={(val) => handleChange('homeEnvironment', val)}
                        placeholder="Vælg boform" 
                        label={""}
                    />
                </div>

                {/* Beskrivelse */}
                <div className="space-y-1">
                    <label htmlFor="saleDescription" className="text-sm text-zinc-300">Beskrivelse</label>
                    <Textarea
                        id="saleDescription"
                        value={formData.saleDescription}
                        onChange={(e) => handleChange('saleDescription', e.target.value)}
                        placeholder="Beskriv kaninen..."
                        minRows={4}
                    />
                </div>

                {/* Switch toggles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg">
                        <label htmlFor="canBeShipped" className="text-sm text-zinc-300">Kan leveres</label>
                        <Switch
                            id="canBeShipped"
                            isSelected={formData.canBeShipped}
                            onValueChange={(checked) => handleChange('canBeShipped', checked)}
                            size="sm"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg">
                        <label htmlFor="isLitterTrained" className="text-sm text-zinc-300">Pottetrænet</label>
                        <Switch
                            id="isLitterTrained"
                            isSelected={formData.isLitterTrained}
                            onValueChange={(checked) => handleChange('isLitterTrained', checked)}
                            size="sm"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-lg">
                        <label htmlFor="isNeutered" className="text-sm text-zinc-300">Neutraliseret</label>
                        <Switch
                            id="isNeutered"
                            isSelected={formData.isNeutered}
                            onValueChange={(checked) => handleChange('isNeutered', checked)}
                            size="sm"
                        />
                    </div>
                </div>
            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-2">
                <Button
                    color="secondary"
                    onPress={onCancel}
                    isDisabled={isSaving}
                >
                    Annuller
                </Button>
                <Button
                    color="primary"
                    type="submit"
                    isLoading={isSaving}
                >
                    {isSaving ? 'Gemmer...' : isEditing ? 'Gem ændringer' : 'Opret salgsprofil'}
                </Button>
            </div>
        </form>
    );
}