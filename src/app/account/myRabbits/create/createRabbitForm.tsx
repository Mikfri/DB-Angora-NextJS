// src/app/account/myRabbits/create/createRabbitForm.tsx
'use client';
import { useCreateRabbit } from '@/hooks/rabbits/useRabbitCreate';
import { Input, Button, Switch } from '@/components/ui/heroui';
import EnumAutocomplete from '@/components/ui/custom/autocomplete/EnumAutocomplete';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { validateParentReference } from '@/app/actions/rabbit/rabbitCrudActions';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

export default function CreateRabbitForm({ targetedUserId }: { targetedUserId?: string }) {
    const router = useRouter();
    const { formData, isSubmitting, setFormData, handleSubmit } = useCreateRabbit(targetedUserId);

    // State til valideringsbeskeder
    const [fatherValidation, setFatherValidation] = useState<string | null>(null);
    const [motherValidation, setMotherValidation] = useState<string | null>(null);

    const [fatherIsValid, setFatherIsValid] = useState<boolean | null>(null);
    const [motherIsValid, setMotherIsValid] = useState<boolean | null>(null);


    // Wrap handleSubmit in a type-safe handler for the Button's onPress
    const handleFormSubmit = useCallback(async () => {
        const form = document.querySelector('form');
        if (form) {
            form.requestSubmit();
        }
    }, []);

    const handleEarIdChange = (field: 'rightEarId' | 'leftEarId', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value.replace(/\s/g, '')
        }));
    };

    // Opdater dine valideringshandlers:
    const handleValidateFather = async () => {
        if (!formData.fatherId_Placeholder) return;
        setFatherValidation('Validerer...');
        setFatherIsValid(null);
        const res = await validateParentReference(formData.fatherId_Placeholder, 'Han');
        if (!res.success) {
            setFatherValidation(res.error || 'Ugyldig far');
            setFatherIsValid(false);
        } else if (res.result) {
            setFatherValidation(res.result.isValidParent ? '✔️ Gyldig far' : '❌ Ugyldig far');
            setFatherIsValid(res.result.isValidParent);
        } else {
            setFatherValidation('Ukendt valideringsfejl');
            setFatherIsValid(false);
        }
    };

    const handleValidateMother = async () => {
        if (!formData.motherId_Placeholder) return;
        setMotherValidation('Validerer...');
        setMotherIsValid(null);
        const res = await validateParentReference(formData.motherId_Placeholder, 'Hun');
        if (!res.success) {
            setMotherValidation(res.error || 'Ugyldig mor');
            setMotherIsValid(false);
        } else if (res.result) {
            setMotherValidation(res.result.isValidParent ? '✔️ Gyldig mor' : '❌ Ugyldig mor');
            setMotherIsValid(res.result.isValidParent);
        } else {
            setMotherValidation('Ukendt valideringsfejl');
            setMotherIsValid(false);
        }
    };

    return (
        <div className="bg-surface-secondary/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-divider/50 p-4">
            <div className="mb-2">
                <h1 className="text-2xl font-bold text-foreground">Opret ny kanin</h1>
            </div>

            <form noValidate onSubmit={handleSubmit}>
                <div className="w-full bg-surface-secondary/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-divider/50">
                    {/* Header */}
                    <div className="p-2 bg-surface/50 text-muted border-b border-divider/50 rounded-t-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <div className="w-1/3 text-sm">FELT</div>
                                <div className="w-2/3 text-sm">VÆRDI</div>
                            </div>
                            <div className="space-x-2">
                                <Button
                                    size="sm"
                                    variant="danger"
                                    onPress={() => router.back()}
                                >
                                    Annuller
                                </Button>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onPress={handleFormSubmit}
                                    isPending={isSubmitting}
                                >
                                    {isSubmitting ? 'Opretter...' : 'Opret'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="divide-y divide-divider/30">
                        <div className="p-2 flex items-center hover:bg-surface/30">
                            <div className="w-1/3 text-sm font-medium text-foreground">Højre øremærke</div>
                            <div className="w-2/3">
                                <Input

                                    value={formData.rightEarId || ''}
                                    onChange={e => setFormData({ ...formData, rightEarId: e.target.value })}
                                    onPaste={e => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData('text').replace(/\s/g, '');
                                        handleEarIdChange('rightEarId', text);
                                    }}
                                    className="bg-surface-secondary/50 text-foreground text-sm py-0 h-7"
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-surface/30">
                            <div className="w-1/3 text-sm font-medium text-foreground">Venstre øremærke</div>
                            <div className="w-2/3">
                                <Input

                                    value={formData.leftEarId || ''}
                                    onChange={e => setFormData({ ...formData, leftEarId: e.target.value })}
                                    onPaste={e => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData('text').replace(/\s/g, '');
                                        handleEarIdChange('leftEarId', text);
                                    }}
                                    className="bg-surface-secondary/50 text-foreground text-sm py-0 h-7"
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-surface/30">
                            <div className="w-1/3 text-sm font-medium text-foreground">Navn</div>
                            <div className="w-2/3">
                                <Input

                                    value={formData.nickName || ''}
                                    onChange={e => {
                                        let value = e.target.value;

                                        // Fjern start-mellemrum
                                        value = value.replace(/^\s+/, '');

                                        // Erstat flere mellemrum med ét (tillad ét mellemrum mellem ord)
                                        value = value.replace(/\s{2,}/g, ' ');

                                        // Fjern afsluttende mellemrum
                                        value = value.replace(/\s+$/, '');

                                        setFormData({ ...formData, nickName: value });
                                    }}
                                    onPaste={e => {
                                        e.preventDefault();
                                        let text = e.clipboardData.getData('text');

                                        // Fjern start-mellemrum
                                        text = text.replace(/^\s+/, '');

                                        // Erstat flere mellemrum med ét
                                        text = text.replace(/\s{2,}/g, ' ');

                                        // Fjern afsluttende mellemrum
                                        text = text.replace(/\s+$/, '');

                                        setFormData({ ...formData, nickName: text });
                                    }}
                                    className="bg-surface-secondary/50 text-foreground text-sm py-0 h-7"
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-surface/30">
                            <div className="w-1/3 text-sm font-medium text-foreground">Race</div>
                            <div className="w-2/3">
                                <EnumAutocomplete
                                    enumType="Race"
                                    value={formData.race ?? null}
                                    onChange={value => setFormData({ ...formData, race: value ?? undefined })}
                                    label=""
                                    placeholder="Vælg race"
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-surface/30">
                            <div className="w-1/3 text-sm font-medium text-foreground">Farve</div>
                            <div className="w-2/3">
                                <EnumAutocomplete
                                    enumType="Color"
                                    value={formData.color ?? null}
                                    onChange={value => setFormData({ ...formData, color: value ?? undefined })}
                                    label=""
                                    placeholder="Vælg farve"
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-surface/30">
                            <div className="w-1/3 text-sm font-medium text-foreground">Køn</div>
                            <div className="w-2/3">
                                <EnumAutocomplete
                                    enumType="Gender"
                                    value={formData.gender ?? null}
                                    onChange={value => setFormData({ ...formData, gender: value ?? undefined })}
                                    label=""
                                    placeholder="Vælg køn"
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-surface/30">
                            <div className="w-1/3 text-sm font-medium text-foreground">Fødselsdato</div>
                            <div className="w-2/3">
                                <Input

                                    type="date"
                                    value={formData.dateOfBirth ?? ''}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value || undefined })}
                                    placeholder="Vælg fødselsdato"
                                    className="bg-surface-secondary/50 text-foreground text-sm py-0 h-7"
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-surface/30">
                            <div className="w-1/3 text-sm font-medium text-foreground">Til avl</div>
                            <div className="w-2/3">
                                <Switch
                                    size="sm"
                                    isSelected={formData.isForBreeding === true}
                                onChange={(value) => setFormData({
                                        ...formData,
                                        isForBreeding: value
                                    })}
                                    aria-label="Til avl switch"
                                    defaultSelected={false}
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-surface/30">
                            <div className="w-1/3 text-sm font-medium text-foreground">Far øremærke (valgfri)</div>
                            <div className="w-2/3 flex gap-2 items-center">
                                <Input

                                    value={formData.fatherId_Placeholder || ''}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            fatherId_Placeholder: e.target.value.replace(/\s/g, '')
                                        })
                                    }
                                    onPaste={e => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData('text').replace(/\s/g, '');
                                        setFormData({
                                            ...formData,
                                            fatherId_Placeholder: text
                                        });
                                    }}
                                    placeholder="Fars øremærke"
                                    className="bg-surface-secondary/50 text-foreground text-sm py-0 h-7"
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    isDisabled={!formData.fatherId_Placeholder}
                                    onPress={handleValidateFather}
                                    type="button"
                                >
                                    Tjek far
                                </Button>
                            </div>
                        </div>
                        {fatherValidation && (
                            <div className="pl-[33%] pb-2 text-xs flex items-center gap-1">
                                {fatherValidation === 'Validerer...' ? (
                                    <FaSpinner className="animate-spin text-blue-400 w-4 h-4" />
                                ) : fatherIsValid ? (
                                    <FaCheckCircle className="text-green-500 w-4 h-4" />
                                ) : (
                                    <FaTimesCircle className="text-red-500 w-4 h-4" />
                                )}
                                <span className={fatherIsValid ? "text-green-400" : "text-red-400"}>
                                    {fatherValidation.replace(/^✔️\s?/, '')}
                                </span>
                            </div>
                        )}

                        <div className="p-2 flex items-center hover:bg-surface/30">
                            <div className="w-1/3 text-sm font-medium text-foreground">Mor øremærke (valgfri)</div>
                            <div className="w-2/3 flex gap-2 items-center">
                                <Input

                                    value={formData.motherId_Placeholder || ''}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            motherId_Placeholder: e.target.value.replace(/\s/g, '')
                                        })
                                    }
                                    onPaste={e => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData('text').replace(/\s/g, '');
                                        setFormData({
                                            ...formData,
                                            motherId_Placeholder: text
                                        });
                                    }}
                                    placeholder="Mors øremærke"
                                    className="bg-surface-secondary/50 text-foreground text-sm py-0 h-7"
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    isDisabled={!formData.motherId_Placeholder}
                                    onPress={handleValidateMother}
                                    type="button"
                                >
                                    Tjek mor
                                </Button>
                            </div>
                        </div>
                        {motherValidation && (
                            <div className="pl-[33%] pb-2 text-xs flex items-center gap-1">
                                {motherValidation === 'Validerer...' ? (
                                    <FaSpinner className="animate-spin text-blue-400 w-4 h-4" />
                                ) : motherIsValid ? (
                                    <FaCheckCircle className="text-green-500 w-4 h-4" />
                                ) : (
                                    <FaTimesCircle className="text-red-500 w-4 h-4" />
                                )}
                                <span className={motherIsValid ? "text-green-400" : "text-red-400"}>
                                    {motherValidation.replace(/^✔️\s?/, '')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <button type="submit" hidden />
            </form>
        </div>
    );
}
