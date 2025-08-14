'use server';

import { revalidatePath } from 'next/cache';
import { ROUTES } from '@/constants/navigationConstants';

/**
 * Invaliderer cachen for annoncer-relaterede sider
 */
export async function invalidateForsalePages() {
    // Invaliderer listevisningen
    revalidatePath(ROUTES.SALE.RABBITS);

    // Invaliderer layout for hovedannoncer-siden
    revalidatePath(ROUTES.SALE.BASE, 'layout');

    // Invaliderer dynamiske ruter for detaljeret visning
    revalidatePath(ROUTES.SALE.RABBIT_PROFILE('[entityId]'), 'layout');

    return { success: true };
}