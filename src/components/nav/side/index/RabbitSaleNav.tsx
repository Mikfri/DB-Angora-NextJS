// src/components/nav/side/index/RabbitSaleNav.tsx
'use client';
import RabbitSaleNavBase from '../base/RabbitSaleNavBase';
import { RabbitSaleNavClient } from '../client/RabbitSaleNavClient';

/**
 * Integrated RabbitSaleNav component
 * Combines server-side base with client-side content
 */
export default function RabbitSaleNav() {
    return (
        <RabbitSaleNavBase>
            <RabbitSaleNavClient />
        </RabbitSaleNavBase>
    );
}