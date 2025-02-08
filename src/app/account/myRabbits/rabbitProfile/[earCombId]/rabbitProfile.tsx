// src/account/myRabbits/rabbitProfile/[earCombId]/rabbitProfile.tsx
"use client";
import { Rabbit_ProfileDTO } from '@/Types/AngoraDTOs';
import { useRabbitProfile } from '@/hooks/rabbits/useRabbitProfile';
import RabbitProfileNav from '@/components/sectionNav/variants/rabbitProfileNav';
import RabbitDetails from './rabbitDetails';
import RabbitChildren from './rabbitChildren';
import { Tabs, Tab } from "@heroui/react";
import { toast } from "react-toastify";

export default function RabbitProfile({ rabbitProfile }: { rabbitProfile: Rabbit_ProfileDTO }) {
    const {
        isEditing,
        isSaving,
        isDeleting,
        editedData,
        setEditedData,
        setIsEditing,
        handleSave,
        handleDelete
    } = useRabbitProfile(rabbitProfile);

    const handleChangeOwner = async () => {
        toast.info('Skift ejer funktionalitet kommer snart');
    };

    return (
        <>
            <RabbitProfileNav
                rabbitName={rabbitProfile.nickName || rabbitProfile.earCombId}
                earCombId={rabbitProfile.earCombId}
                originBreeder={rabbitProfile.originFullName}
                owner={rabbitProfile.ownerFullName}
                approvedRaceColor={rabbitProfile.approvedRaceColorCombination}
                isJuvenile={rabbitProfile.isJuvenile}
                profilePicture={rabbitProfile.profilePicture}
                onDelete={handleDelete}
                onChangeOwner={handleChangeOwner}
                isDeleting={isDeleting}
            />
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-zinc-100">
                        {rabbitProfile.nickName || rabbitProfile.earCombId}
                    </h1>
                </div>

                <Tabs aria-label="Kanin information" variant="solid" color="primary">
                    <Tab key="details" title="Detaljer">
                        <RabbitDetails
                            rabbitProfile={rabbitProfile}
                            isEditing={isEditing}
                            isSaving={isSaving}
                            setIsEditing={setIsEditing}
                            handleSave={handleSave}
                            editedData={editedData}
                            setEditedData={setEditedData}
                        />
                    </Tab>

                    <Tab key="children" title="Afkom">
                        <RabbitChildren>{rabbitProfile.children}</RabbitChildren>
                    </Tab>
                </Tabs>
            </div>
        </>
    );
}