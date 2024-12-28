// app/rabbits/page.tsx (server component)
import { GetOwnRabbits } from '@/services/AngoraDbService';
import { cookies } from 'next/headers';
import RabbitOwnList from './rabbitOwnList';

export default async function RabbitsPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const ownRabbits = await GetOwnRabbits(String(accessToken?.value));
    
    if (!ownRabbits || ownRabbits.length === 0) {
        return <div>No rabbits found</div>;
    }

    return <RabbitOwnList rabbits={ownRabbits} />; // Send array direkte
}