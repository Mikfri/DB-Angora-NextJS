// src/app/account/rabbitsForbreeding/page.tsx
import { GetRabbitsForBreeding } from '@/Services/AngoraDbService';
import { cookies } from 'next/headers';
import RabbitBreedingList from './rabbitBreedingList';

export default async function RabbitsForBreedingPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const breedingRabbits = await GetRabbitsForBreeding(String(accessToken?.value));
    
    if (!breedingRabbits || breedingRabbits.length === 0) {
        return <div>Ingen kaniner fundet</div>;
    }

    return <RabbitBreedingList rabbits={breedingRabbits} />;
}