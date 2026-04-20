// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitPedigree.tsx
/**
 * RabbitPedigree — Side-komponent for stamtavlevisning på en kaninprofil.
 * Ansvar: Henter stamtavledata via useRabbitPedigree og renderer COI-sektion
 * (indavlskoefficient + bidragydere) samt PedigreeTable. Styrer valg af
 * antal generationer via lokalt state.
 */
"use client";

import { useRabbitPedigree } from '@/hooks/rabbits/useRabbitPedigree';
import { useState } from 'react';
import Image from 'next/image';
import { Spinner, Button } from '@/components/ui/heroui';
import PedigreeTable from '@/components/pedigree/pedigreeTable/pedigreeTable';
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { LuRabbit } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { MdOutlineDateRange } from "react-icons/md";

export default function RabbitPedigree({ earCombId }: { earCombId: string }) {
    const [maxGenerations, setMaxGenerations] = useState(4);
    const { pedigreeResult, isLoading, error, refreshPedigree } = useRabbitPedigree(earCombId, maxGenerations);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" color="accent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <p className="text-red-500">{error}</p>
                <Button
                    variant="ghost"
                    className="mt-4"
                    onPress={refreshPedigree}
                >
                    Prøv igen
                </Button>
            </div>
        );
    }

    if (!pedigreeResult) {
        return (
            <div className="text-center py-8">
                <p className="text-foreground/55">Der er ingen stamtavleinformation tilgængelig for denne kanin.</p>
            </div>
        );
    }

    const { CalculatedInbreedingCoefficient, COIContributors, Pedigree: pedigree } = pedigreeResult;

    return (
        <div className="space-y-6">
            {/* Stamtavle-subjekt + COI-bidragydere */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Subjekt-card */}
                <div className="bg-surface border border-border rounded-lg p-4 flex gap-4 items-center">
                    <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-(--surface-muted)">
                        <Image
                            src={pedigree.ProfilePhotoUrl || '/images/default-rabbit.jpg'}
                            alt={pedigree.NickName || pedigree.EarCombId}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground/50 mb-0.5">Stamtavle for</p>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-semibold truncate">{pedigree.NickName || pedigree.EarCombId}</span>
                            {pedigree.Gender?.toLowerCase().includes('han')
                                ? <BsGenderMale className="text-blue-400 shrink-0" size={16} />
                                : <BsGenderFemale className="text-pink-400 shrink-0" size={16} />}
                        </div>
                        <p className="text-xs text-foreground/55 mb-2">{pedigree.EarCombId}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/55">
                            <span className="flex items-center gap-1"><LuRabbit size={12} />{pedigree.Race || '-'}</span>
                            <span className="flex items-center gap-1"><IoColorPaletteOutline size={12} />{pedigree.Color || '-'}</span>
                            {pedigree.DateOfBirth && (
                                <span className="flex items-center gap-1">
                                    <MdOutlineDateRange size={12} />
                                    {new Date(pedigree.DateOfBirth).toLocaleDateString('da-DK')}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="shrink-0 text-right border-l border-border pl-4">
                        <p className="text-xs text-foreground/45 mb-0.5">Indavlskoefficient</p>
                        <p className="text-2xl font-semibold text-blue-400">
                            {(CalculatedInbreedingCoefficient * 100).toFixed(2)}%
                        </p>
                        <p className="text-xs text-foreground/50">
                            {CalculatedInbreedingCoefficient > 0.125
                                ? "Højt niveau af indavl"
                                : CalculatedInbreedingCoefficient > 0
                                    ? "Moderat niveau af indavl"
                                    : "Ingen registreret indavl"}
                        </p>
                    </div>
                </div>

                {/* COI-bidragydere */}
                <div className="overflow-hidden bg-surface border border-border rounded-lg">
                <div className="px-4 py-3 border-b border-border">
                    <h3 className="text-sm font-medium text-foreground/80">COI-bidragydere</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-foreground/55 border-b border-border">
                                <th className="px-4 py-2">Kanin</th>
                                <th className="px-4 py-2">Bidrag</th>
                                <th className="px-4 py-2">Bidrag (%)</th>
                                <th className="px-4 py-2">Stier</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {COIContributors && COIContributors.length > 0 ? (
                                COIContributors.map((contrib, idx) => (
                                    <tr key={contrib.EarCombId ?? idx} className="text-xs">
                                        <td className="px-4 py-2 text-foreground/80">{contrib.NickName || contrib.EarCombId}</td>
                                        <td className="px-4 py-2 text-blue-400">
                                            {(contrib.Contribution * 100).toFixed(2)}%
                                        </td>
                                        <td className="px-4 py-2 text-foreground/55">{contrib.ContributionPercent.toFixed(1)}%</td>
                                        <td className="px-4 py-2 text-foreground/55">{(contrib.AncestorPaths || []).join(', ')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-foreground/40 text-sm">Ingen COI-bidragydere fundet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>{/* end grid */}

            {/* Stamtræsvisning */}
            <div className="relative border border-border rounded-lg overflow-auto">
                <div className="p-4">
                    <label htmlFor="generation-input" className="text-sm text-foreground/70 mr-2">Antal forældre-generationer:</label>
                    <input
                        id="generation-input"
                        type="number"
                        min={1}
                        max={10}
                        value={maxGenerations}
                        onChange={e => setMaxGenerations(Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded bg-surface-secondary text-foreground border border-border"
                    />
                </div>
                <PedigreeTable
                    pedigree={pedigree}
                    generations={maxGenerations}
                    onGenerationsChange={setMaxGenerations}
                />
            </div>
        </div>
    );
}
