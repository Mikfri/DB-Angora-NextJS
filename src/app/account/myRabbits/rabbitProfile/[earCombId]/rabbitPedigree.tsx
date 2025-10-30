// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitPedigree.tsx

"use client";

import { useRabbitPedigree } from '@/hooks/rabbits/useRabbitPedigree';
import { useState } from 'react';
import { Spinner, Button } from "@heroui/react";
import PedigreeTable from '@/components/pedigree/pedigreeTable/pedigreeTable';

export default function RabbitPedigree({ earCombId }: { earCombId: string }) {
    const [maxGenerations, setMaxGenerations] = useState(4);
    const { pedigreeResult, isLoading, error, refreshPedigree } = useRabbitPedigree(earCombId, maxGenerations);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                <p className="text-red-500">{error}</p>
                <Button
                    color="primary"
                    variant="light"
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
                <p className="text-zinc-400">Der er ingen stamtavleinformation tilgængelig for denne kanin.</p>
            </div>
        );
    }

    const { CalculatedInbreedingCoefficient, COIContributors, Pedigree: pedigree } = pedigreeResult;

    return (
        <div className="space-y-6">
            {/* Komprimeret COI + Indavlskoefficient sektion */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Indavlskort (små dimensioner) */}
                <div className="md:col-span-1 bg-zinc-800/60 border border-zinc-700/30 rounded-lg p-4 flex flex-col justify-center">
                    <h4 className="text-sm text-zinc-300 mb-1">Indavlskoefficient</h4>
                    <div className="flex items-baseline gap-3">
                        <span className="text-2xl md:text-3xl font-semibold text-blue-400">
                            {(CalculatedInbreedingCoefficient * 100).toFixed(2)}%
                        </span>
                        <span className="text-xs text-zinc-400">
                            {CalculatedInbreedingCoefficient > 0.125
                                ? "Højt niveau af indavl"
                                : CalculatedInbreedingCoefficient > 0
                                    ? "Moderat niveau af indavl"
                                    : "Ingen registreret indavl"}
                        </span>
                    </div>
                </div>

                {/* COI-bidragydere tabel */}
                <div className="md:col-span-2 overflow-hidden bg-zinc-800/50 border border-zinc-700/30 rounded-lg">
                    <div className="px-4 py-3 border-b border-zinc-700/50">
                        <h3 className="text-sm font-medium text-zinc-200">COI-bidragydere</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-zinc-400 border-b border-zinc-700/30">
                                    <th className="px-4 py-2">Kanin</th>
                                    <th className="px-4 py-2">Bidrag</th>
                                    <th className="px-4 py-2">Bidrag (%)</th>
                                    <th className="px-4 py-2">Stier</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-700/30">
                                {COIContributors && COIContributors.length > 0 ? (
                                    COIContributors.map((contrib, idx) => (
                                        <tr key={contrib.EarCombId ?? idx} className="text-xs">
                                            <td className="px-4 py-2 text-zinc-200">{contrib.NickName || contrib.EarCombId}</td>
                                            <td className="px-4 py-2 text-blue-400">
                                                {(contrib.Contribution * 100).toFixed(2)}%
                                            </td>
                                            <td className="px-4 py-2 text-zinc-400">{contrib.ContributionPercent.toFixed(1)}%</td>
                                            <td className="px-4 py-2 text-zinc-400">{(contrib.AncestorPaths || []).join(', ')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-zinc-500 text-sm">Ingen COI-bidragydere fundet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Stamtræsvisning */}
            <div className="relative border border-zinc-700/50 rounded-lg overflow-auto">
                <div className="p-4">
                    <label htmlFor="generation-input" className="text-sm text-zinc-300 mr-2">Antal forældre-generationer:</label>
                    <input
                        id="generation-input"
                        type="number"
                        min={1}
                        max={10}
                        value={maxGenerations}
                        onChange={e => setMaxGenerations(Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded bg-zinc-900 text-zinc-100 border border-zinc-700"
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