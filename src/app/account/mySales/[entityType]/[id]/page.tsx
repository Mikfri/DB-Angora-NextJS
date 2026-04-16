// src/app/account/mySales/[entityType]/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getRabbitSaleDetails } from '@/app/actions/sales/salesRabbitActions';
import { getYarnSaleDetails } from '@/app/actions/sales/salesYarnActions';
import RabbitSaleWorkspace from '../../rabbitSaleWorkspace';
import YarnSaleWorkspace from '../../yarnSaleWorkspace';

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
        default:
            notFound();
    }
}
