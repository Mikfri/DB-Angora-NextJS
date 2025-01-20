// src/app/rabbits/create/page.tsx
'use client';
import { useCreateRabbit } from '@/hooks/rabbits/useRabbitCreate';
import { Input, Button, Switch } from '@nextui-org/react';
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useRouter } from 'next/navigation';

export default function CreateRabbitPage() {
    const router = useRouter();
    const { formData, isSubmitting, setFormData, handleSubmit } = useCreateRabbit();

    const renderInputField = (key: keyof typeof formData, label: string, type: string = 'text') => {
        return (
            <Input
                label={label}
                value={formData[key] || ''}
                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                type={type}
                required
            />
        );
    };

    const renderEnumField = (key: keyof typeof formData, label: string, enumType: string) => {
        return (
            <EnumAutocomplete
                enumType={enumType}
                value={formData[key] || null}
                onChange={(value) => setFormData({ ...formData, [key]: value })}
                label={label}
            />
        );
    };

    const renderBooleanSwitch = (key: keyof typeof formData, label: string) => {
        return (
            <Switch
                isSelected={formData[key] === 'Ja'}
                onValueChange={(checked) =>
                    setFormData({ ...formData, [key]: checked ? 'Ja' : 'Nej' })
                }
                aria-label={label}
            >
                {label}
            </Switch>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Opret ny kanin</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    {renderInputField('rightEarId', 'Højre øremærke')}
                    {renderInputField('leftEarId', 'Venstre øremærke')}
                </div>
                {renderInputField('nickName', 'Navn')}
                {renderEnumField('race', 'Race', 'Race')}
                {renderEnumField('color', 'Farve', 'Color')}
                {renderEnumField('gender', 'Køn', 'Gender')}
                {renderInputField('dateOfBirth', 'Fødselsdato', 'date')}
                {renderBooleanSwitch('forSale', 'Til salg')}
                {renderBooleanSwitch('forBreeding', 'Til avl')}
                
                <div className="flex justify-end gap-2">
                    <Button color="danger" onClick={() => router.back()}>
                        Annuller
                    </Button>
                    <Button color="primary" type="submit" isLoading={isSubmitting}>
                        {isSubmitting ? 'Opretter...' : 'Opret kanin'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
