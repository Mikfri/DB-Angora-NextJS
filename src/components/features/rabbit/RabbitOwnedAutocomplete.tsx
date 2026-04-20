// src/components/features/rabbit/RabbitOwnedAutocomplete.tsx

/**
 * Autocomplete til at vælge en af brugerens egne levende kaniner.
 * 
 * - Henter fra rabbitsOwnedStore (Zustand) — ingen ekstra API-kald hvis storen allerede er hydrateret.
 * - Viser kun levende kaniner uden eksisterende salgsannonce.
 * - textValue inkluderer øremærke, navn, race og farve så alle fire felter kan søges på.
 */

'use client';

import { useEffect, memo } from 'react';
import { Autocomplete, Avatar, ListBox, ListBoxItem, SearchField, useFilter } from '@/components/ui/heroui';
import { useRabbitsOwnedStore } from '@/store/rabbitsOwnedStore';

interface Props {
    value: string | null;
    onChange: (earCombId: string | null) => void;
    label?: string;
    id?: string;
    placeholder?: string;
}

export const RabbitOwnedAutocomplete = memo(function RabbitOwnedAutocomplete({
    value,
    onChange,
    label = 'Kanin',
    id = 'rabbit-owned-select',
    placeholder = 'Søg på øremærke, navn eller race...',
}: Props) {
    const { rabbits, isLoading, fetchRabbits } = useRabbitsOwnedStore();
    const { contains } = useFilter({ sensitivity: 'base' });

    useEffect(() => {
        if (rabbits.length === 0 && !isLoading) {
            fetchRabbits();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Only rabbits the user directly owns, are alive, and have no existing sale listing
    const options = rabbits.filter(r => r.isOwnedByTargetedUser && r.dateOfDeath === null && !r.hasSaleDetails);

    return (
        <Autocomplete
            id={id}
            value={value ?? undefined}
            onChange={(key) => onChange(key ? key.toString() : null)}
            isDisabled={isLoading}
            aria-label={label}
            placeholder={isLoading ? 'Henter kaniner...' : placeholder}
            fullWidth
        >
            <Autocomplete.Trigger>
                <Autocomplete.Value>
                    {({ selectedItems, isPlaceholder }) => {
                        if (isPlaceholder || !selectedItems.length) {
                            return <span className="text-foreground/50">{isLoading ? 'Henter kaniner...' : placeholder}</span>;
                        }
                        const rabbit = options.find(r => r.earCombId === (selectedItems[0] as { key?: unknown })?.key?.toString());
                        if (!rabbit) return null;
                        return (
                            <div className="flex items-center gap-2">
                                <Avatar size="sm">
                                    <Avatar.Image src={rabbit.profilePhotoUrl ?? undefined} alt={rabbit.earCombId} />
                                    <Avatar.Fallback>{rabbit.earCombId.charAt(0)}</Avatar.Fallback>
                                </Avatar>
                                <span>{rabbit.nickName ? `${rabbit.earCombId} – ${rabbit.nickName}` : rabbit.earCombId}</span>
                            </div>
                        );
                    }}
                </Autocomplete.Value>
                <Autocomplete.ClearButton />
                <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
                <Autocomplete.Filter filter={contains}>
                    <SearchField aria-label="Søg kanin">
                        <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input placeholder="Søg..." />
                        </SearchField.Group>
                    </SearchField>
                    <div className="max-h-60 overflow-y-auto">
                        <ListBox>
                            {options.map((rabbit) => {
                                const displayId = rabbit.nickName
                                    ? `${rabbit.earCombId} – ${rabbit.nickName}`
                                    : rabbit.earCombId;
                                // textValue drives Autocomplete.Filter search — include all useful fields
                                const searchText = [
                                    rabbit.earCombId,
                                    rabbit.nickName,
                                    rabbit.race,
                                    rabbit.color,
                                ].filter(Boolean).join(' ');

                                return (
                                    <ListBoxItem
                                        key={rabbit.earCombId}
                                        id={rabbit.earCombId}
                                        textValue={searchText}
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        <div className="flex items-center gap-2.5 py-0.5">
                                            <Avatar size="sm">
                                                <Avatar.Image src={rabbit.profilePhotoUrl ?? undefined} alt={rabbit.earCombId} />
                                                <Avatar.Fallback>{rabbit.earCombId.charAt(0)}</Avatar.Fallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-medium truncate">{displayId}</span>
                                                <span className="text-xs text-foreground/50 truncate">
                                                    {rabbit.race} · {rabbit.color}
                                                </span>
                                            </div>
                                        </div>
                                    </ListBoxItem>
                                );
                            })}
                        </ListBox>
                    </div>
                    {options.length === 0 && !isLoading && (
                        <div className="px-3 py-2 text-xs text-foreground/50">
                            Ingen levende kaniner uden aktiv salgsannonce fundet.
                        </div>
                    )}
                </Autocomplete.Filter>
            </Autocomplete.Popover>
        </Autocomplete>
    );
});
