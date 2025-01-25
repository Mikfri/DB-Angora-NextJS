// src/app/account/myRabbits/page.tsx
import { GetOwnRabbits } from '@/Services/AngoraDbService';
import { cookies } from 'next/headers';
import RabbitOwnList from './rabbitOwnList';

export default async function RabbitsPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const ownRabbits = await GetOwnRabbits(String(accessToken?.value));
    
    if (!ownRabbits || ownRabbits.length === 0) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <p>No rabbits found</p>
            </div>
        );
    }

    return <RabbitOwnList rabbits={ownRabbits} />;
}

