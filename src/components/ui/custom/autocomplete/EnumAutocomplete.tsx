// src/components/ui/custom/autocomplete/EnumAutocomplete.tsx

/**
 * Bemærk at .NET default serialiserer enum værdier som strings.
 * Format messigt vidergives de pr. defualt som camelCase i JSON.
 * 
 * Eksempel: "YarnWeightCategory" bliver til "yarnWeightCategory".
 */

"use client"

import { Autocomplete, ListBox, ListBoxItem, SearchField, useFilter } from "@/components/ui/heroui";
import { useEffect, useState, useRef } from 'react';
import { useEnums } from '@/contexts/EnumContext';
import type { EnumType, EnumOption } from '@/contexts/EnumContext';

interface Props {
    enumType: EnumType;
    value: string | null;
    onChange: (value: string | null) => void;
    label: string;
    id?: string;
    'aria-labelledby'?: string;
    placeholder?: string;
}

export default function EnumAutocomplete({ 
    enumType, 
    value, 
    onChange, 
    label, 
    id,
    'aria-labelledby': ariaLabelledBy,
    placeholder 
}: Props) {
    const [options, setOptions] = useState<EnumOption[]>([]);
    const { getEnumValues, isLoading } = useEnums();
    const isMounted = useRef(true);
    const { contains } = useFilter({ sensitivity: 'base' });

    useEffect(() => {
        isMounted.current = true;
        const loadOptions = async () => {
            try {
                const values = await getEnumValues(enumType);
                if (isMounted.current) {
                    setOptions(values);
                }
            } catch (error) {
                console.error(`Failed to load ${enumType} options:`, error);
            }
        };
        loadOptions();
        return () => {
            isMounted.current = false;
        };
    }, [enumType, getEnumValues]);

    const uniqueId = id || `${enumType.toLowerCase()}-select`;

    return (
        <div className="relative w-full">
            <label
                htmlFor={uniqueId}
                id={`${uniqueId}-label`}
                className="sr-only"
            >
                {label}
            </label>
            <Autocomplete
                id={uniqueId}
                value={value ?? undefined}
                onChange={(key) => onChange(key ? key.toString() : null)}
                isDisabled={isLoading(enumType)}
                aria-labelledby={ariaLabelledBy || `${uniqueId}-label`}
                placeholder={placeholder || `Vælg ${label.toLowerCase()}`}
                fullWidth
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
                            {options.map((option) => (
                                <ListBoxItem
                                    key={option.name}
                                    id={option.name}
                                    textValue={option.name}
                                >
                                    {option.name.replace(/_/g, ' ')}
                                </ListBoxItem>
                            ))}
                        </ListBox>
                    </Autocomplete.Filter>
                </Autocomplete.Popover>
            </Autocomplete>
        </div>
    );
}
