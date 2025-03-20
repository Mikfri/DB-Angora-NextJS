// src/app/account/myRabbits/page.tsx
import RabbitOwnList from './rabbitOwnList';
import { getMyRabbits } from '@/app/actions/rabbit/myRabbits';

export default async function RabbitsPage() {
  // Hent kaniner direkte via Server Action
  const rabbits = await getMyRabbits();
  
  if (!rabbits || rabbits.length === 0) {
    return (
      <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
        <p>Du har endnu ikke registreret nogle kaniner.</p>
      </div>
    );
  }

  return <RabbitOwnList rabbits={rabbits} />;
}