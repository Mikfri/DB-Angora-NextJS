// src/components/enumHandlers/enumAutocomplete.tsx
"use client"

import { GetEnumValues, RabbitEnum } from "@/api/endpoints/enumController";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, useState } from 'react';

interface Props {
    enumType: RabbitEnum;
    value: string | null;
    onChange: (value: string) => void;
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const values = await GetEnumValues(enumType);
                setOptions(values);
            } catch (error) {
                console.error(`Failed to load ${enumType} options:`, error);
            } finally {
                setIsLoading(false);
            }
        };
        loadOptions();
    }, [enumType]);

    const uniqueId = id || `${enumType.toLowerCase()}-select`;

    return (
        <div className="relative">
            {/* Hidden label for screen readers */}
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
                defaultSelectedKey={value || undefined}
                onSelectionChange={(key) => onChange(key as string)}
                isLoading={isLoading}
                aria-labelledby={ariaLabelledBy || `${uniqueId}-label`}
                placeholder={placeholder || `Vælg ${label.toLowerCase()}`}
                labelPlacement="outside"
                classNames={{
                    base: "max-w-xs",
                    listbox: "bg-zinc-800/80 text-zinc-100",
                    listboxWrapper: "data-[hover=true]:bg-zinc-700/50",
                    popoverContent: "bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 border border-zinc-700/50",
                    endContentWrapper: "text-zinc-100",
                    clearButton: "text-zinc-400",
                    selectorButton: "text-zinc-400"
                }}
            >
                {options.map((option) => (
                    <AutocompleteItem
                        key={option}
                        textValue={option}
                        className="text-zinc-100 data-[selected=true]:bg-zinc-700/50"
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