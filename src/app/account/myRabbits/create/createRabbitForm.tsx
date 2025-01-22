// src/app/account/myRabbits/create/createRabbitForm.tsx
'use client';
import { useCreateRabbit } from '@/hooks/rabbits/useRabbitCreate';
import { Input, Button, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Switch } from '@nextui-org/react';
import EnumAutocomplete from '@/components/enumHandlers/enumAutocomplete';
import { useRouter } from 'next/navigation';

export default function CreateRabbitForm() {
    const router = useRouter();
    const { formData, isSubmitting, setFormData, handleSubmit } = useCreateRabbit();

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-100">Opret ny kanin</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Table
                    aria-label="Opret kanin form"
                    removeWrapper
                    className="p-0"
                    classNames={{
                        table: "w-full bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border-zinc-700/50",
                        th: "bg-zinc-900/50 text-zinc-300 border-zinc-700/50",
                        td: "text-zinc-100",
                        tr: "hover:bg-zinc-700/30 border-b border-zinc-700/30 last:border-0",
                    }}
                >
                    <TableHeader>
                        <TableColumn className="w-1/3">FELT</TableColumn>
                        <TableColumn className="w-2/3">
                            <div className="flex justify-between items-center">
                                <span>VÆRDI</span>
                                <div className="space-x-2">
                                    <Button size="sm" color="danger" onPress={() => router.back()}>
                                        Annuller
                                    </Button>
                                    <Button size="sm" color="primary" onClick={handleSubmit} isLoading={isSubmitting}>
                                        {isSubmitting ? 'Opretter...' : 'Opret'}
                                    </Button>
                                </div>
                            </div>
                        </TableColumn>
                    </TableHeader>
                    <TableBody>
                        {/* Existing fields */}
                        <TableRow>
                            <TableCell className="font-medium">Højre øremærke</TableCell>
                            <TableCell>
                                <Input
                                    size="sm"
                                    value={formData.rightEarId || ''}
                                    onChange={(e) => setFormData({ ...formData, rightEarId: e.target.value })}
                                    required
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100",
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Venstre øremærke</TableCell>
                            <TableCell>
                                <Input
                                    size="sm"
                                    value={formData.leftEarId || ''}
                                    onChange={(e) => setFormData({ ...formData, leftEarId: e.target.value })}
                                    required
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100",
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Navn</TableCell>
                            <TableCell>
                                <Input
                                    size="sm"
                                    value={formData.nickName || ''}
                                    onChange={(e) => setFormData({ ...formData, nickName: e.target.value })}
                                    required
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100",
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Race</TableCell>
                            <TableCell>
                                <EnumAutocomplete
                                    enumType="Race"
                                    value={formData.race || null}
                                    onChange={(value) => setFormData({ ...formData, race: value })}
                                    label=""
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Farve</TableCell>
                            <TableCell>
                                <EnumAutocomplete
                                    enumType="Color"
                                    value={formData.color || null}
                                    onChange={(value) => setFormData({ ...formData, color: value })}
                                    label=""
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Køn</TableCell>
                            <TableCell>
                                <EnumAutocomplete
                                    enumType="Gender"
                                    value={formData.gender || null}
                                    onChange={(value) => setFormData({ ...formData, gender: value })}
                                    label=""
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Fødselsdato</TableCell>
                            <TableCell>
                                <Input
                                    size="sm"
                                    type="date"
                                    value={formData.dateOfBirth || ''}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    required
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100",
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Til salg</TableCell>
                            <TableCell>
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
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Til avl</TableCell>
                            <TableCell>
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
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Far øremærke (valgfri)</TableCell>
                            <TableCell>
                                <Input
                                    size="sm"
                                    value={formData.father_EarCombId || ''}
                                    onChange={(e) => setFormData({ ...formData, father_EarCombId: e.target.value })}
                                    placeholder="Fars øremærke"
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100",
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Mor øremærke (valgfri)</TableCell>
                            <TableCell>
                                <Input
                                    size="sm"
                                    value={formData.mother_EarCombId || ''}
                                    onChange={(e) => setFormData({ ...formData, mother_EarCombId: e.target.value })}
                                    placeholder="Mors øremærke"
                                    classNames={{
                                        input: "bg-zinc-800/50 text-zinc-100",
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </form>
        </div>
    );
}