// src/components/shared/enumAutocomplete.tsx
"use client"
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { RabbitEnum, GetEnumValues } from '@/Services/AngoraDbService';
interface Props {
    enumType: RabbitEnum;
    value: string | null;
    onChange: (value: string) => void;
    label: string;
    id?: string;
}

export default function EnumAutocomplete({ enumType, value, onChange, label, id }: Props) {
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

    return (
        <Autocomplete
            size="sm"
            id={id || `${enumType.toLowerCase()}-select`}
            label={label}
            labelPlacement="outside"
            defaultSelectedKey={value || undefined}
            onSelectionChange={(key) => onChange(key as string)}
            isLoading={isLoading}
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
    );
}
/*
shared/

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