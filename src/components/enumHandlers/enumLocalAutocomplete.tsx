"use client"
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

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
}

export default function EnumLocalAutocomplete({ enumType, value, onChange, label, id }: Props) {
    return (
        <Autocomplete
            size="sm"
            id={id || `local-enum-select`}
            label={label}
            labelPlacement="outside"
            defaultSelectedKey={value || undefined}
            onSelectionChange={(key) => onChange(key as string)}
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
            {Object.entries(enumType).map(([key, label]) => (
                <AutocompleteItem 
                    key={key} 
                    textValue={label}
                    className="text-zinc-100 data-[selected=true]:bg-zinc-700/50"
                >
                    {label}
                </AutocompleteItem>
            ))}
        </Autocomplete>
    );
}