// src/app/account/myRabbits/create/createRabbitForm.tsx
'use client';
import { useCreateRabbit } from '@/hooks/rabbits/useRabbitCreate';
import { Input, Button, Switch } from "@heroui/react";
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { validateParentReference } from '@/app/actions/rabbit/rabbitCrudActions';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

export default function CreateRabbitForm() {
    const router = useRouter();
    const { formData, isSubmitting, setFormData, handleSubmit } = useCreateRabbit();

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
        const res = await validateParentReference(formData.fatherId_Placeholder, 'Buck');
        if (!res.success) {
            setFatherValidation(res.error || 'Ugyldig far');
            setFatherIsValid(false);
        } else if (res.result) {
            setFatherValidation(res.result.message || (res.result.isValid ? '✔️ Gyldig far' : 'Ugyldig far'));
            setFatherIsValid(res.result.isValid);
        } else {
            setFatherValidation('Ukendt valideringsfejl');
            setFatherIsValid(false);
        }
    };

    const handleValidateMother = async () => {
        if (!formData.motherId_Placeholder) return;
        setMotherValidation('Validerer...');
        setMotherIsValid(null);
        const res = await validateParentReference(formData.motherId_Placeholder, 'Doe');
        if (!res.success) {
            setMotherValidation(res.error || 'Ugyldig mor');
            setMotherIsValid(false);
        } else if (res.result) {
            setMotherValidation(res.result.message || (res.result.isValid ? '✔️ Gyldig mor' : 'Ugyldig mor'));
            setMotherIsValid(res.result.isValid);
        } else {
            setMotherValidation('Ukendt valideringsfejl');
            setMotherIsValid(false);
        }
    };

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-4">
            <div className="mb-2">
                <h1 className="text-2xl font-bold text-zinc-100">Opret ny kanin</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="w-full bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border border-zinc-700/50">
                    {/* Header */}
                    <div className="p-2 bg-zinc-900/50 text-zinc-300 border-b border-zinc-700/50 rounded-t-lg">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <div className="w-1/3 text-sm">FELT</div>
                                <div className="w-2/3 text-sm">VÆRDI</div>
                            </div>
                            <div className="space-x-2">
                                <Button
                                    size="sm"
                                    color="danger"
                                    onPress={() => router.back()}
                                >
                                    Annuller
                                </Button>
                                <Button
                                    size="sm"
                                    color="primary"
                                    onPress={handleFormSubmit}
                                    isLoading={isSubmitting}
                                >
                                    {isSubmitting ? 'Opretter...' : 'Opret'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="divide-y divide-zinc-700/30">
                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Højre øremærke</div>
                            <div className="w-2/3">
                                <Input
                                    size="sm"
                                    value={formData.rightEarId || ''}
                                    onChange={e => handleEarIdChange('rightEarId', e.target.value)}
                                    onPaste={e => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData('text').replace(/\s/g, '');
                                        handleEarIdChange('rightEarId', text);
                                    }}
                                    required
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100 text-sm py-0",
                                        inputWrapper: "h-7 min-h-unit-7",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Venstre øremærke</div>
                            <div className="w-2/3">
                                <Input
                                    size="sm"
                                    value={formData.leftEarId || ''}
                                    onChange={e => handleEarIdChange('leftEarId', e.target.value)}
                                    onPaste={e => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData('text').replace(/\s/g, '');
                                        handleEarIdChange('leftEarId', text);
                                    }}
                                    required
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100 text-sm py-0",
                                        inputWrapper: "h-7 min-h-unit-7",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Navn</div>
                            <div className="w-2/3">
                                <Input
                                    size="sm"
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
                                    required
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100 text-sm py-0",
                                        inputWrapper: "h-7 min-h-unit-7",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Race</div>
                            <div className="w-2/3">
                                <EnumAutocomplete
                                    enumType="Race"
                                    value={formData.race || null}
                                    onChange={(value) => setFormData({ ...formData, race: value })}
                                    label=""
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Farve</div>
                            <div className="w-2/3">
                                <EnumAutocomplete
                                    enumType="Color"
                                    value={formData.color || null}
                                    onChange={(value) => setFormData({ ...formData, color: value })}
                                    label=""
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Køn</div>
                            <div className="w-2/3">
                                <EnumAutocomplete
                                    enumType="Gender"
                                    value={formData.gender || null}
                                    onChange={(value) => setFormData({ ...formData, gender: value })}
                                    label=""
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Fødselsdato</div>
                            <div className="w-2/3">
                                <Input
                                    size="sm"
                                    type="date"
                                    value={formData.dateOfBirth || ''}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    required
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100 text-sm py-0",
                                        inputWrapper: "h-7 min-h-unit-7",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Til avl</div>
                            <div className="w-2/3">
                                <Switch
                                    size="sm"
                                    isSelected={formData.isForBreeding === true}
                                    onValueChange={(value) => setFormData({
                                        ...formData,
                                        isForBreeding: value
                                    })}
                                    aria-label="Til avl switch"
                                    defaultSelected={false}
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Far øremærke (valgfri)</div>
                            <div className="w-2/3 flex gap-2 items-center">
                                <Input
                                    size="sm"
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
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100 text-sm py-0",
                                        inputWrapper: "h-7 min-h-unit-7",
                                    }}
                                />
                                <Button
                                    size="sm"
                                    color="secondary"
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

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Mor øremærke (valgfri)</div>
                            <div className="w-2/3 flex gap-2 items-center">
                                <Input
                                    size="sm"
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
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100 text-sm py-0",
                                        inputWrapper: "h-7 min-h-unit-7",
                                    }}
                                />
                                <Button
                                    size="sm"
                                    color="secondary"
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