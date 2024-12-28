// src/components/shared/enumSelect.tsx
"use client"
import { Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from 'react';
import { RabbitEnum, GetEnumValues } from '@/services/AngoraDbService';

interface Props {
    enumType: RabbitEnum;
    value: string | null;
    onChange: (value: string) => void;
    label: string;
    id?: string;
}

export default function EnumSelect({ enumType, value, onChange, label, id }: Props) {
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

    const selectId = id || `${enumType.toLowerCase()}-select`;

    return (
        <Select
            id={selectId}
            label={label}
            labelPlacement="outside"
            aria-label={`Vælg ${label.toLowerCase()}`}
            selectedKeys={value ? [value] : []}
            onChange={(e) => onChange(e.target.value)}
            isLoading={isLoading}
        >
            {options.map((option) => (
                <SelectItem key={option} value={option}>
                    {option.replace(/_/g, ' ')}
                </SelectItem>
            ))}
        </Select>
    );
}