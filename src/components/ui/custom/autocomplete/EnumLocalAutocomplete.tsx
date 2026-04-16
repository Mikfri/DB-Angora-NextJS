// src/components/ui/custom/autocomplete/EnumLocalAutocomplete.tsx
"use client"
import { Autocomplete, ListBox, ListBoxItem, SearchField, useFilter } from "@/components/ui/heroui";

export const RaceColorApproval = {
    'Approved': 'Godkendte',
    'NotApproved': 'Ikke-godkendte'
} as const;

interface Props {
    enumType: Record<string, string>;
    value: string | null;
    onChange: (value: string) => void;
    label: string;
    id?: string;
    isDisabled?: boolean;
}

export default function EnumLocalAutocomplete({ enumType, value, onChange, label, id, isDisabled }: Props) {
    const { contains } = useFilter({ sensitivity: 'base' });

    return (
        <Autocomplete
            id={id || `local-enum-select`}
            value={value ?? undefined}
            onChange={(key) => onChange(key as string)}
            aria-label={label}
            placeholder={`Vælg ${label.toLowerCase()}`}
            isDisabled={isDisabled}
        >
            <Autocomplete.Trigger>
                <Autocomplete.Value />
                <Autocomplete.ClearButton />
                <Autocomplete.Indicator />
            </Autocomplete.Trigger>
            <Autocomplete.Popover>
                <Autocomplete.Filter filter={contains}>
                    <SearchField aria-label="Søg">
                        <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input placeholder="Søg..." />
                        </SearchField.Group>
                    </SearchField>
                    <ListBox>
                        {Object.entries(enumType).map(([key, displayLabel]) => (
                            <ListBoxItem
                                key={key}
                                id={key}
                                textValue={displayLabel}
                            >
                                {displayLabel}
                            </ListBoxItem>
                        ))}
                    </ListBox>
                </Autocomplete.Filter>
            </Autocomplete.Popover>
        </Autocomplete>
    );
}
