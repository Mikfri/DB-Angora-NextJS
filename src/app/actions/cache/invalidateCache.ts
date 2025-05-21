// src/app/actions/cache/invalidateCache.ts
'use server';

import { revalidatePath } from 'next/cache';

/**
 * Invaliderer cachen for forsale-relaterede sider
 */
export async function invalidateForsalePages() {
    // Invaliderer listevisningen
    revalidatePath('/sale/rabbits');
    
    // Invaliderer dynamiske ruter for detaljeret visning
    // Den dybere invalidering sikrer at alle undersider også opdateres
    revalidatePath('/sale', 'layout');
    
    // Hvis du også har en root forsale side
    revalidatePath('/sale/rabbits/profile/[entityId]', 'layout');
    
    return { success: true };
}