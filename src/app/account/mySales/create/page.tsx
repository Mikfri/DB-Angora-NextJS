// src/app/account/mySales/create/page.tsx

/**
 * Opret ny salgsannonce.
 * Brugeren vælger entity-type (Garn / Kanin) og udfylder den tilhørende oprettelsesformular.
 */

'use client';
import { useState } from 'react';
import YarnSaleCreateForm from '../yarnSaleCreateForm';
import RabbitSaleCreateForm from '../rabbitSaleCreateForm';
import WoolRawSaleCreateForm from '../woolRawSaleCreateForm';
import WoolCardedSaleCreateForm from '../woolCardedSaleCreateForm';
import PeltSaleCreateForm from '../peltSaleCreateForm';

type EntityType = 'yarn' | 'rabbit' | 'woolRaw' | 'woolCarded' | 'pelt';

const ENTITY_OPTIONS: { key: EntityType; label: string; description: string }[] = [
    { key: 'yarn', label: 'Garn', description: 'Sælg et nøgle eller parti garn' },
    { key: 'rabbit', label: 'Kanin', description: 'Sælg en angora- eller krydsningskanin' },
    { key: 'woolRaw', label: 'Råuld', description: 'Sælg rå, ubehandlet uld' },
    { key: 'woolCarded', label: 'Kartet uld', description: 'Sælg kartet, behandlet uld' },
    { key: 'pelt', label: 'Skind', description: 'Sælg et kaninskind' },
];

export default function CreateSalePage() {
    const [selected, setSelected] = useState<EntityType>('yarn');

    return (
        <div className="space-y-4">
            {/* Entity-type selector */}
            <div className="main-content-container p-4">
                <p className="text-sm font-medium text-foreground mb-3">Hvad vil du sælge?</p>
                <div className="flex gap-3">
                    {ENTITY_OPTIONS.map(({ key, label, description }) => (
                        <button
                            key={key}
                            onClick={() => setSelected(key)}
                            className={`flex-1 rounded-lg border px-4 py-3 text-left transition-colors ${
                                selected === key
                                    ? 'border-accent bg-accent/10 text-accent'
                                    : 'border-divider bg-surface text-foreground/70 hover:border-accent/40 hover:text-foreground'
                            }`}
                        >
                            <p className="font-medium text-sm">{label}</p>
                            <p className="text-xs opacity-70 mt-0.5">{description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Form baseret på valgt type */}
            {selected === 'yarn' && <YarnSaleCreateForm />}
            {selected === 'rabbit' && <RabbitSaleCreateForm />}
            {selected === 'woolRaw' && <WoolRawSaleCreateForm />}
            {selected === 'woolCarded' && <WoolCardedSaleCreateForm />}
            {selected === 'pelt' && <PeltSaleCreateForm />}
        </div>
    );
}
