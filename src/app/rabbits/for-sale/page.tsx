// src/app/rabbits/for-sale/page.tsx
import { Suspense } from 'react';
import RabbitsForSale from './rabbitsForSale';
export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RabbitsForSale />
        </Suspense>
    );
}