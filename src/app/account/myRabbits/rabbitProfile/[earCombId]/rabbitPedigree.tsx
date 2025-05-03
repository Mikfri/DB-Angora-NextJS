// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitPedigree.tsx
"use client";

import { useRabbitPedigree } from '@/hooks/rabbits/useRabbitPedigree';
import { useState, useEffect, useCallback, JSX } from 'react';
import { Spinner, Button } from "@heroui/react";
import { Rabbit_PedigreeDTO } from '@/api/types/AngoraDTOs';
import ReactFlowPedigree from '@/components/pedigree/ReactFlowPedigree';
import React from 'react';

// Type til debugging info
interface DebugInfo {
  structure: string;
  father: string;
  mother: string;
  [key: string]: string | number | boolean | string[];
}

export default function RabbitPedigree({ earCombId }: { earCombId: string }) {
    const { pedigree, isLoading, error, refreshPedigree } = useRabbitPedigree(earCombId);
    const [maxGenerations, setMaxGenerations] = useState(3);
    const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
    const [showDebug, setShowDebug] = useState(false);
    const [viewMode, setViewMode] = useState<'flow' | 'table'>('flow');

    // Memoized funktion til at opsamle alle kanin-ID'er
    const collectRabbitIDs = useCallback((rabbit: Rabbit_PedigreeDTO | null, result: string[] = []): string[] => {
        if (!rabbit) return result;
        
        if (rabbit.EarCombId) {
            result.push(rabbit.EarCombId);
        }
        
        if (rabbit.Father) collectRabbitIDs(rabbit.Father, result);
        if (rabbit.Mother) collectRabbitIDs(rabbit.Mother, result);
        
        return result;
    }, []);

    // Debug effekt for at undersøge pedigree data
    useEffect(() => {
        if (pedigree) {
            console.log("Pedigree loaded:", pedigree);
            setDebugInfo({
                structure: `Main rabbit: ${pedigree.NickName || 'Unnamed'} (${pedigree.EarCombId})`,
                father: pedigree.Father ? `Father: ${pedigree.Father.NickName || 'Unnamed'} (${pedigree.Father.EarCombId})` : 'No father',
                mother: pedigree.Mother ? `Mother: ${pedigree.Mother.NickName || 'Unnamed'} (${pedigree.Mother.EarCombId})` : 'No mother',
                cycleCheck: collectRabbitIDs(pedigree)
            });
        }
    }, [pedigree, collectRabbitIDs]);

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

    if (!pedigree) {
        return (
            <div className="text-center py-8">
                <p className="text-zinc-400">Der er ingen stamtavleinformation tilgængelig for denne kanin.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Indavlskoefficient display */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-lg font-medium text-zinc-100">Indavlskoefficient</h3>
                <div className="mt-2">
                    <p className="text-3xl font-bold text-blue-400">
                        {(pedigree.InbreedingCoefficient * 100).toFixed(2)}%
                    </p>
                    <p className="text-zinc-400 text-sm mt-1">
                        {pedigree.InbreedingCoefficient > 0.125
                            ? "Højt niveau af indavl"
                            : pedigree.InbreedingCoefficient > 0
                                ? "Moderat niveau af indavl"
                                : "Ingen registreret indavl"}
                    </p>
                </div>
            </div>

            {/* Indavls-detaljer hvis tilgængelige */}
            {pedigree.InbreedingDetails && pedigree.InbreedingDetails.length > 0 && (
                <div className="overflow-hidden bg-zinc-800/50 border border-zinc-700/30 rounded-lg">
                    <div className="px-4 py-3 border-b border-zinc-700/50">
                        <h3 className="text-sm font-medium text-zinc-200">Indavls-detaljer</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-zinc-400 border-b border-zinc-700/30">
                                    <th className="px-4 py-2">Forfader</th>
                                    <th className="px-4 py-2">Bidrag</th>
                                    <th className="px-4 py-2">Far dybde</th>
                                    <th className="px-4 py-2">Mor dybde</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-700/30">
                                {pedigree.InbreedingDetails.map((detail, idx) => (
                                    <tr key={idx} className="text-xs">
                                        <td className="px-4 py-2 text-zinc-200">{detail.AncestorId}</td>
                                        <td className="px-4 py-2 text-blue-400">
                                            {(detail.Contribution * 100).toFixed(2)}%
                                        </td>
                                        <td className="px-4 py-2 text-zinc-400">{detail.FatherDepth}</td>
                                        <td className="px-4 py-2 text-zinc-400">{detail.MotherDepth}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stamtræ-kontrol */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-700/50">
                <h3 className="text-lg font-medium text-zinc-100">Stamtræ</h3>
                
                <div className="flex flex-wrap gap-2">
                    {/* Visningsmetode */}
                    <div className="flex rounded-lg overflow-hidden border border-zinc-700/50">
                        <button
                            className={`px-3 py-1 text-sm ${viewMode === 'flow' ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                            onClick={() => setViewMode('flow')}
                        >
                            Grafisk
                        </button>
                        <button
                            className={`px-3 py-1 text-sm ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                            onClick={() => setViewMode('table')}
                        >
                            Tabel
                        </button>
                    </div>
                    
                    {/* Generationskontrol */}
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="flat"
                            color="default"
                            isDisabled={maxGenerations <= 1}
                            onPress={() => setMaxGenerations(prev => Math.max(1, prev - 1))}
                        >
                            Vis færre
                        </Button>
                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            isDisabled={maxGenerations >= 4}
                            onPress={() => setMaxGenerations(prev => Math.min(4, prev + 1))}
                        >
                            Vis flere
                        </Button>
                    </div>
                    
                    {/* Debug knap */}
                    <Button 
                        size="sm" 
                        variant="flat" 
                        color="default" 
                        className="text-xs"
                        onPress={() => setShowDebug(!showDebug)}
                    >
                        {showDebug ? "Skjul debug info" : "Vis debug info"}
                    </Button>
                </div>
            </div>
            
            {showDebug && debugInfo && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-medium text-yellow-300">Debug Info</h3>
                    <pre className="text-xs text-yellow-200 overflow-auto mt-2 p-2 bg-black/30 rounded">
                        {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                </div>
            )}

            {/* Stamtræsvisning */}
            <div className="relative border border-zinc-700/50 rounded-lg overflow-auto">
                {viewMode === 'flow' ? (
                    <div className="min-h-[600px] w-full">
                        <ReactFlowPedigree pedigree={pedigree} maxGenerations={maxGenerations} />
                    </div>
                ) : (
                    <PedigreeTableView pedigree={pedigree} maxGenerations={maxGenerations} />
                )}
            </div>
        </div>
    );
}

// Tabel-baseret stamtræ
function PedigreeTableView({ pedigree, maxGenerations }: {
    pedigree: Rabbit_PedigreeDTO,
    maxGenerations: number
}) {
    // Mapper til at holde styr på indavlskaniner
    const [inbreedingRabbits, setInbreedingRabbits] = useState(new Set<string>());
    
    // Find alle indavlskaniner og gem deres ID'er
    useEffect(() => {
        const seen = new Set<string>();
        const foundDuplicates = new Set<string>();
        
        const findDuplicates = (rabbit: Rabbit_PedigreeDTO | null) => {
            if (!rabbit || !rabbit.EarCombId) return;
            
            if (seen.has(rabbit.EarCombId)) {
                foundDuplicates.add(rabbit.EarCombId);
            } else {
                seen.add(rabbit.EarCombId);
                if (rabbit.Father) findDuplicates(rabbit.Father);
                if (rabbit.Mother) findDuplicates(rabbit.Mother);
            }
        };
        
        findDuplicates(pedigree);
        setInbreedingRabbits(foundDuplicates);
    }, [pedigree]);

    // Beregn antal rækker og celler baseret på dybde
    const totalRows = 2 ** maxGenerations - 1;
    
    // Funktion til at rendere en enkelt celle i stamtrætabellen
    function renderRabbitCell(rabbit: Rabbit_PedigreeDTO | null, generation: number, inbreedingHighlight: boolean = false) {
        if (!rabbit) {
            return (
                <td className="border border-zinc-700/30 p-2 bg-zinc-800/20" rowSpan={2 ** (maxGenerations - generation)}>
                    <div className="text-center text-xs text-zinc-500">Ukendt</div>
                </td>
            );
        }

        
        
        const earCombId = rabbit.EarCombId || 'Ukendt ID';
        const isInbreeding = inbreedingRabbits.has(earCombId);
        const bgColorClass = isInbreeding ? "bg-purple-900/20" : inbreedingHighlight ? "bg-blue-900/10" : "bg-zinc-800/40";
        const borderClass = isInbreeding ? "border-purple-700" : "border-zinc-700/30";
        
        return (
            <td 
                className={`border ${borderClass} p-2 ${bgColorClass}`} 
                rowSpan={2 ** (maxGenerations - generation)}
            >
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        {/* Mini profile picture */}
                        <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-zinc-700">
                            {rabbit.ProfilePicture ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                    src={rabbit.ProfilePicture} 
                                    alt={rabbit.NickName || ""} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-xs">
                                    {earCombId.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="font-medium text-sm text-white">
                                {rabbit.NickName || 'Unavngivet'}
                            </div>
                            <div className="text-xs text-zinc-400">
                                {earCombId}
                            </div>
                        </div>
                    </div>
                    <div className="mt-1 text-xs">
                        <div className="flex justify-between text-zinc-400">
                            <span>{rabbit.Race || ''}</span>
                            <span>{rabbit.Color || ''}</span>
                        </div>
                        <div className="text-zinc-500">
                            {rabbit.DateOfBirth ? new Date(rabbit.DateOfBirth).toLocaleDateString('da-DK') : ''}
                        </div>
                    </div>
                    {isInbreeding && (
                        <div className="mt-1 text-xs text-purple-400 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span>Indavlsforekomst</span>
                        </div>
                    )}
                </div>
            </td>
        );
    }
    
    // Bygger stamtrætabellen med rekursive funktioner
    function buildPedigreeTable() {
        // Opret en array af rækker til tabellen
        const rows: JSX.Element[] = [];
        
        // Vi vil kun vise så mange generationer, som der er specificeret
        const visibleGenerations = Math.min(maxGenerations, 4); // Max 4 generationer for overskuelighed
        
        // Hjælpefunktion til at få kaninerne på et bestemt niveau/generation
        function getRabbitsAtGeneration(
            rabbit: Rabbit_PedigreeDTO | null, 
            currentGen: number, 
            targetGen: number,
            result: (Rabbit_PedigreeDTO | null)[] = []
        ): (Rabbit_PedigreeDTO | null)[] {
            if (!rabbit) {
                // Fyld resten med nulls for at holde strukturen
                const nullsToAdd = 2 ** (targetGen - currentGen);
                for (let i = 0; i < nullsToAdd; i++) {
                    result.push(null);
                }
                return result;
            }
            
            if (currentGen === targetGen) {
                result.push(rabbit);
                return result;
            }
            
            // Rekursivt få fædrene
            getRabbitsAtGeneration(rabbit.Father, currentGen + 1, targetGen, result);
            
            // Rekursivt få mødrene
            getRabbitsAtGeneration(rabbit.Mother, currentGen + 1, targetGen, result);
            
            return result;
        }
        
        // Byg en tabel der svarer til traditionelle stamtræer
        // Hver række har dobbelt så mange celler som den forrige
        for (let generation = 1; generation <= visibleGenerations; generation++) {
            const rabbitsInGeneration = getRabbitsAtGeneration(pedigree, 1, generation);
            
            // For hver kanin i denne generation, lav en række
            const rowsForThisGen = 2 ** (generation - 1);
            let startRowIndex = 0;
            
            for (let rabbitIndex = 0; rabbitIndex < rabbitsInGeneration.length; rabbitIndex++) {
                const rabbit = rabbitsInGeneration[rabbitIndex];
                
                // Bestem antal rækker denne kanin skal spænde over
                const rowSpan = totalRows / rowsForThisGen / 2;
                
                // Bestem startpositionen for denne kanin
                if (rabbitIndex % 2 === 0) {
                    startRowIndex = Math.floor(rabbitIndex / 2) * rowSpan * 2;
                } else {
                    startRowIndex = Math.floor(rabbitIndex / 2) * rowSpan * 2 + rowSpan;
                }
                
                // Hvis dette er den første kanin i hver generation, opret en ny række
                if (!rows[startRowIndex]) {
                    rows[startRowIndex] = (
                        <tr key={`gen${generation}-row${startRowIndex}`}>
                            {/* Første kolonne viser generationsnummer */}
                            {rabbitIndex === 0 && (
                                <td 
                                    className="border border-zinc-700/30 p-2 text-center text-xs bg-zinc-800 align-middle" 
                                    rowSpan={rowsForThisGen} 
                                    style={{ width: '30px' }}
                                >
                                    <div className="transform -rotate-90 font-medium text-zinc-300 whitespace-nowrap origin-center translate-y-1/2">
                                        Gen {generation}
                                    </div>
                                </td>
                            )}
                        </tr>
                    );
                }
                
                // Tilføj kanincellen til rækken - med typesikker håndtering
                if (rows[startRowIndex]) {
                    const currentRow = rows[startRowIndex];
                    const currentChildren = React.Children.toArray(currentRow.props.children || []);
                    const updatedChildren = [...currentChildren, renderRabbitCell(rabbit, generation)];
                    
                    rows[startRowIndex] = React.cloneElement(
                        currentRow,
                        { ...currentRow.props },
                        ...updatedChildren
                    );
                }
            }
        }
        
        return rows;
    }
    
    // Manglende data eller fejl?
    if (!pedigree || !pedigree.EarCombId) {
        return (
            <div className="p-8 text-center">
                <p className="text-zinc-400">Der er ikke tilstrækkelige data til at vise stamtræet korrekt.</p>
            </div>
        );
    }
    
    return (
        <div className="overflow-x-auto p-4">
            <h3 className="text-lg font-medium text-white mb-4">
                Stamtræ for {pedigree.NickName || 'Unavngivet kanin'} ({pedigree.EarCombId})
            </h3>
            
            <div className="overflow-auto">
                <table className="w-full border-collapse">
                    <tbody>
                        {buildPedigreeTable()}
                    </tbody>
                </table>
            </div>
            
            {/* Legende for farvekodning */}
            <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                    <span className="text-xs text-zinc-300">Indavlsforekomst (samme kanin optræder flere steder)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-zinc-300">Bidragyder til indavl</span>
                </div>
            </div>
        </div>
    );
}