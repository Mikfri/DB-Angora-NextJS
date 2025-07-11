// src/components/nav/side/index/RabbitOwnNav.tsx
'use client';
import RabbitOwnNavBase from '../base/RabbitOwnNavBase';
import { RabbitOwnNavClient } from '../client/RabbitOwnNavClient';

// Ingen props nødvendige længere - alt hentes fra storen
export default function RabbitOwnNav() {
    return (
        <RabbitOwnNavBase>
            <RabbitOwnNavClient />
        </RabbitOwnNavBase>
    );
}