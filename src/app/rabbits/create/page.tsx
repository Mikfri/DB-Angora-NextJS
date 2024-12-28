// src/app/rabbits/create/page.tsx
'use client';
import { useCreateRabbit } from '@/hooks/rabbits/useRabbitCreate';
import { Input, Button } from '@nextui-org/react';
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useRouter } from 'next/navigation';

export default function CreateRabbitPage() {
    const router = useRouter();
    const { formData, isSubmitting, setFormData, handleSubmit } = useCreateRabbit();

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Opret ny kanin</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <Input
                        label="Højre øremærke"
                        value={formData.rightEarId || ''}
                        onChange={(e) => setFormData({...formData, rightEarId: e.target.value})}
                        required
                    />
                    <Input
                        label="Venstre øremærke"
                        value={formData.leftEarId || ''}
                        onChange={(e) => setFormData({...formData, leftEarId: e.target.value})}
                        required
                    />
                </div>
                <Input
                    label="Navn"
                    value={formData.nickName || ''}
                    onChange={(e) => setFormData({...formData, nickName: e.target.value})}
                    required
                />
                <EnumAutocomplete
                    enumType="Race"
                    value={formData.race || null}
                    onChange={(value) => setFormData({...formData, race: value})}
                    label="Race"
                />
                <EnumAutocomplete
                    enumType="Color"
                    value={formData.color || null}
                    onChange={(value) => setFormData({...formData, color: value})}
                    label="Farve"
                />
                <EnumAutocomplete
                    enumType="Gender"
                    value={formData.gender || null}
                    onChange={(value) => setFormData({...formData, gender: value})}
                    label="Køn"
                />
                <Input
                    type="date"
                    label="Fødselsdato"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    required
                />
                <div className="flex justify-end gap-2">
                    <Button 
                        color="danger" 
                        onClick={() => router.back()}
                    >
                        Annuller
                    </Button>
                    <Button 
                        color="primary" 
                        type="submit"
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? 'Opretter...' : 'Opret kanin'}
                    </Button>
                </div>
            </form>
        </div>
    );
}