// src/app/account/myRabbits/create/createRabbitForm.tsx
'use client';
import { useCreateRabbit } from '@/hooks/rabbits/useRabbitCreate';
import { Input, Button, Switch } from '@nextui-org/react';
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useRouter } from 'next/navigation';

export default function CreateRabbitForm() {
    const router = useRouter();
    const { formData, isSubmitting, setFormData, handleSubmit } = useCreateRabbit();

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
                                <Button size="sm" color="danger" onPress={() => router.back()}>
                                    Annuller
                                </Button>
                                <Button size="sm" color="primary" onClick={handleSubmit} isLoading={isSubmitting}>
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
                                    onChange={(e) => setFormData({ ...formData, rightEarId: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, leftEarId: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, nickName: e.target.value })}
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
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Til salg</div>
                            <div className="w-2/3">
                                <Switch
                                    size="sm"
                                    isSelected={formData.forSale === 'Ja'}
                                    onValueChange={(value) => setFormData({
                                        ...formData,
                                        forSale: value ? 'Ja' : 'Nej'
                                    })}
                                    aria-label="Til salg switch"
                                    defaultSelected={false}
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Til avl</div>
                            <div className="w-2/3">
                                <Switch
                                    size="sm"
                                    isSelected={formData.forBreeding === 'Ja'}
                                    onValueChange={(value) => setFormData({
                                        ...formData,
                                        forBreeding: value ? 'Ja' : 'Nej'
                                    })}
                                    aria-label="Til avl switch"
                                    defaultSelected={false}
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Far øremærke (valgfri)</div>
                            <div className="w-2/3">
                                <Input
                                    size="sm"
                                    value={formData.father_EarCombId || ''}
                                    onChange={(e) => setFormData({ ...formData, father_EarCombId: e.target.value })}
                                    placeholder="Fars øremærke"
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100 text-sm py-0",
                                        inputWrapper: "h-7 min-h-unit-7",
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-2 flex items-center hover:bg-zinc-700/30">
                            <div className="w-1/3 text-sm font-medium text-zinc-100">Mor øremærke (valgfri)</div>
                            <div className="w-2/3">
                                <Input
                                    size="sm"
                                    value={formData.mother_EarCombId || ''}
                                    onChange={(e) => setFormData({ ...formData, mother_EarCombId: e.target.value })}
                                    placeholder="Mors øremærke"
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100 text-sm py-0",
                                        inputWrapper: "h-7 min-h-unit-7",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" hidden />
            </form>
        </div>
    );
}