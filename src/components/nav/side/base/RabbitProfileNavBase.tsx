import { RabbitProfileNavClient } from '../client/RabbitProfileNavClient';

interface RabbitProfileNavBaseProps {
    rabbitName: string;
    earCombId: string;
    originBreeder: string | null;
    owner: string | null;
    approvedRaceColor: boolean | null;
    isJuvenile: boolean | null;
    profilePicture: string | null;
    onDeleteClick: () => void;
    onChangeOwner: () => void;
    isDeleting: boolean;
}

// Server komponent wrapper
export default async function RabbitProfileNavBase({
    rabbitName,
    earCombId,
    originBreeder,
    owner,
    approvedRaceColor,
    isJuvenile,
    profilePicture,
    onDeleteClick,
    onChangeOwner,
    isDeleting = false,
}: RabbitProfileNavBaseProps) {
    // Her kan du tilføje server-side logik hvis nødvendigt
    
    return (
        <RabbitProfileNavClient
            rabbitName={rabbitName}
            earCombId={earCombId}
            originBreeder={originBreeder}
            owner={owner}
            approvedRaceColor={approvedRaceColor}
            isJuvenile={isJuvenile}
            profilePicture={profilePicture}
            onDeleteClick={onDeleteClick}
            onChangeOwner={onChangeOwner}
            isDeleting={isDeleting}
        />
    );
}