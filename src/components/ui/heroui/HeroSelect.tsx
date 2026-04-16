// src/components/ui/heroui/HeroSelect.tsx
/**
 * HeroSelect wrapper til HeroUI v3.
 *
 * Formål:
 * - Giver et simpelt value/onChange API for HeroUI Select.
 * - Skjuler den fulde compound API med Select.Trigger/Select.Value/
 *   Select.Indicator og Select.Popover + ListBox.
 * - Når HeroUI opdateres, er det kun denne fil der skal rettes.
 *
 * Bemærk:
 * - `selectedKey` og `onSelectionChange` er deprecated i den underliggende
 *   react-aria API.
 * - Denne wrapper bruger derfor den nyere `value`/`onChange`-stil.
 *
 * Brug:
 * <HeroSelect
 *   value={value}
 *   onChange={(newValue) => setValue(newValue)}
 *   placeholder="Vælg synlighed"
 *   aria-label="Synlighed"
 * >
 *   <HeroSelectItem key="Public" id="Public" textValue="Offentlig">
 *     Offentlig
 *   </HeroSelectItem>
 *   <HeroSelectItem key="PaidContent" id="PaidContent" textValue="Betalt indhold">
 *     Betalt indhold
 *   </HeroSelectItem>
 * </HeroSelect>
 */

'use client';

import { Select, ListBox, ListBoxItem } from '@heroui/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type HeroSelectProps = Omit<ComponentPropsWithoutRef<typeof Select>, 'children'> & {
    /** ListBox items rendered inside the popover. */
    children: ReactNode;
};

export function HeroSelect({
    children,
    className,
    ...props
}: HeroSelectProps) {
    return (
        <Select className={className} {...props}>
            <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
                <ListBox>
                    {children}
                </ListBox>
            </Select.Popover>
        </Select>
    );
}

// Re-export ListBoxItem as HeroSelectItem for colocation convenience
export { ListBoxItem as HeroSelectItem };
