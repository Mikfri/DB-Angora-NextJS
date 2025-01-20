// src/app/sale/rabbits/page.tsx
import { Suspense } from 'react';
import RabbitsForSale from './rabbitSaleList';
import Head from 'next/head';

export default function Page() {
    return (
        <>
            <Head>
                <title>Kaniner til salg | DenBlå-Angora</title>
                <meta name="description" content="Find kaniner til salg hos DenBlå-Angora. Se vores udvalg af kaniner til avl og kæledyr." />
                <meta name="keywords" content="kaniner, til salg, avl, DenBlå-Angora, kaninregister" />
                <meta property="og:title" content="Kaniner til salg | DenBlå-Angora" />
                <meta property="og:description" content="Find kaniner til salg hos DenBlå-Angora. Se vores udvalg af kaniner til avl og kæledyr." />
                {/* <meta property="og:image" content="/images/kaniner-til-salg.jpg" /> */}
                <meta property="og:url" content="https://www.db-angora.dk/sale/rabbits" />
                <link rel="canonical" href="https://www.db-angora.dk/sale/rabbits" />
            </Head>
            <Suspense fallback={<div>Loading...</div>}>
                <RabbitsForSale />
            </Suspense>
        </>
    );
}