// src/app/account/rabbitsForbreeding/page.tsx
import { GetRabbitsForBreeding } from '@/Services/AngoraDbService';
import { cookies } from 'next/headers';
import RabbitBreedingList from './rabbitBreedingList';

export default async function RabbitsForBreedingPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const breedingRabbits = await GetRabbitsForBreeding(String(accessToken?.value));
    
    if (!breedingRabbits || breedingRabbits.length === 0) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <p>Ingen kaniner fundet</p>
            </div>
        );
    }

    return <RabbitBreedingList rabbits={breedingRabbits} />;
}