// src/components/enumHandlers/enumAutocomplete.tsx
"use client"

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState, useRef } from 'react';
import { useEnums } from '@/contexts/EnumContext';
import type { EnumType } from '@/api/endpoints/enumController';

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
    const [options, setOptions] = useState<string[]>([]);
    const { getEnumValues, isLoading } = useEnums();
    const isMounted = useRef(true);

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
                size="sm"
                id={uniqueId}
                selectedKey={value || ""}
                onSelectionChange={(key) => onChange(key ? key.toString() : null)}
                isLoading={isLoading(enumType)}
                aria-labelledby={ariaLabelledBy || `${uniqueId}-label`}
                placeholder={placeholder || `Vælg ${label.toLowerCase()}`}
                labelPlacement="outside"
                classNames={{
                    base: "w-full",
                    listbox: "unified-container text-body p-1", // Bruger unified-container + text-body
                    listboxWrapper: "data-[hover=true]:bg-content2/50", // Bruger content2 fra tailwind.config
                    popoverContent: "unified-container backdrop-blur-md", // Bruger unified-container
                    endContentWrapper: "text-body", // Bruger text-body
                    selectorButton: "text-muted" // Bruger text-muted
                }}
            >
                {options.map((option) => (
                    <AutocompleteItem
                        key={option}
                        textValue={option}
                        className="text-body data-[selected=true]:bg-primary/10 hover:bg-content2/30 data-[hover=true]:bg-primary/100 data-[hover=true]:text-white" // Tilføjet: Hover styling som i MyNavClient (blå baggrund + hvid tekst)
                    >
                        {option.replace(/_/g, ' ')}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}
/*
Genbrugelige utility komponenter
• Domain-agnostiske
• Højt abstraktionsniveau
• Cross-cutting concerns

Hvorfor Shared?
EnumSelect/EnumAutocomplete er:
• Generiske input komponenter
• Genbruges på tværs af features
• Uafhængige af forretningslogik
• Potentielt brugbare i andre projekter
• Dette følger SOLID principperne, særligt Single Responsibility og Interface Segregation.
*/