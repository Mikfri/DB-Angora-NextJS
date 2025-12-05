// src/components/enumHandlers/enumLocalAutocomplete.tsx
"use client"
import { Autocomplete, AutocompleteItem } from "@heroui/react";

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
            labelPlacement="outside-left"
            defaultSelectedKey={value || undefined}
            onSelectionChange={(key) => onChange(key as string)}
            classNames={{
                base: "max-w-xs",
                listbox: "unified-container text-body p-1", // Bruger unified-container + text-body
                listboxWrapper: "data-[hover=true]:bg-content2/50", // Bruger content2 fra tailwind.config
                popoverContent: "unified-container backdrop-blur-md", // Bruger unified-container
                endContentWrapper: "text-body", // Bruger text-body
                clearButton: "text-muted", // Bruger text-muted
                selectorButton: "text-muted" // Bruger text-muted
            }}
        >
            {Object.entries(enumType).map(([key, label]) => (
                <AutocompleteItem 
                    key={key} 
                    textValue={label}
                    className="text-body data-[selected=true]:bg-primary/10 hover:bg-content2/30 data-[hover=true]:bg-primary/100 data-[hover=true]:text-white" // Tilføjet: Hover styling som i MyNavClient (blå baggrund + hvid tekst)
                >
                    {label}
                </AutocompleteItem>
            ))}
        </Autocomplete>
    );
}