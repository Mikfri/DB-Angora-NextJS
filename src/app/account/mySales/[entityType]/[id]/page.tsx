// src/app/account/mySales/[entityType]/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getRabbitSaleDetails } from '@/app/actions/sales/salesRabbitActions';
import { getYarnSaleDetails } from '@/app/actions/sales/salesYarnActions';
import { getWoolRawSaleDetails } from '@/app/actions/sales/salesWoolRawActions';
import { getWoolCardedSaleDetails } from '@/app/actions/sales/salesWoolCardedActions';
import { getPeltSaleDetails } from '@/app/actions/sales/salesPeltActions';
import RabbitSaleWorkspace from '../../rabbitSaleWorkspace';
import YarnSaleWorkspace from '../../yarnSaleWorkspace';
import WoolRawSaleWorkspace from '../../woolRawSaleWorkspace';
import WoolCardedSaleWorkspace from '../../woolCardedSaleWorkspace';
import PeltSaleWorkspace from '../../peltSaleWorkspace';

type Props = { params: Promise<{ entityType: string; id: string }> };

export default async function SaleWorkspacePage({ params }: Props) {
    const { entityType, id } = await params;
    const numId = Number(id);

    if (!numId || numId <= 0) notFound();

    switch (entityType) {
        case 'rabbitsd': {
            const result = await getRabbitSaleDetails(numId);
            if (!result.success) notFound();
            return <RabbitSaleWorkspace profile={result.data} />;
        }
        case 'yarnsd': {
            const result = await getYarnSaleDetails(numId);
            if (!result.success) notFound();
            return <YarnSaleWorkspace profile={result.data} />;
        }
        case 'woolrawsd': {
            const result = await getWoolRawSaleDetails(numId);
            if (!result.success) notFound();
            return <WoolRawSaleWorkspace profile={result.data} />;
        }
        case 'woolcardedsd': {
            const result = await getWoolCardedSaleDetails(numId);
            if (!result.success) notFound();
            return <WoolCardedSaleWorkspace profile={result.data} />;
        }
        case 'peltsd': {
            const result = await getPeltSaleDetails(numId);
            if (!result.success) notFound();
            return <PeltSaleWorkspace profile={result.data} />;
        }
        default:
            notFound();
    }
}
