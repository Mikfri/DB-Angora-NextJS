// src/app/account/myRabbits/rabbitProfile/[earCombId]/rabbitProfile.tsx
"use client";
import { Rabbit_ProfileDTO, RabbitSaleDetailsEmbeddedDTO } from '@/api/types/AngoraDTOs';
import { useRabbitProfile as useProfileHook } from '@/hooks/rabbits/useRabbitProfile';
import { useRabbitProfile as useProfileContext } from '@/contexts/RabbitProfileContext';
import RabbitDetails from './rabbitDetails';
import RabbitChildren from './rabbitChildren';
import RabbitSaleSection from './rabbitSaleSection';
import RabbitPedigree from './rabbitPedigree';
import { Tabs, Tab } from "@heroui/react";
import { useCallback } from 'react';
import { RiInformationLine } from "react-icons/ri";
import { RiPriceTag3Line, RiPriceTag3Fill } from "react-icons/ri";
import { GiFamilyTree } from 'react-icons/gi';
import { LuNetwork } from 'react-icons/lu';

export default function RabbitProfile({ rabbitProfile: initialRabbitProfile }: { rabbitProfile: Rabbit_ProfileDTO }) {
    const { refreshProfile } = useProfileContext();

    const {
        currentProfile,
        setCurrentProfile,
        isEditing,
        isSaving,
        editedData,
        setEditedData,
        setIsEditing,
        handleSave,
        handleCancelEdit,
    } = useProfileHook(initialRabbitProfile);

    const handleSaveWithRefresh = useCallback(async () => {
        await handleSave();
        await refreshProfile();
    }, [handleSave, refreshProfile]);

    const handleSaleDetailsChange = useCallback((saleDetails: RabbitSaleDetailsEmbeddedDTO | null) => {
        setCurrentProfile(prevProfile => ({
            ...prevProfile,
            saleDetailsEmbedded: saleDetails
        }));
    }, [setCurrentProfile]);

    const displayName = currentProfile.nickName || currentProfile.earCombId;
    const childrenCount = currentProfile.children?.length || 0;
    const countBgColor = "bg-blue-500/20";
    const countTextColor = "text-blue-400";

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6 shadow-lg">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-zinc-100">
                    {displayName}
                </h1>
            </div>

            <Tabs
                aria-label="Kanin information"
                variant="underlined"
                color="primary"
                classNames={{
                    tabList: "gap-6 w-full relative p-0 border-b border-zinc-700/50",
                    cursor: "w-full bg-blue-500",
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-blue-500",
                    panel: "pt-5"
                }}
            >
                <Tab
                    key="details"
                    title={
                        <div className="flex items-center space-x-2">
                            <RiInformationLine className="text-xl" />
                            <span>Detaljer</span>
                        </div>
                    }
                >
                    <RabbitDetails
                        rabbitProfile={currentProfile}
                        isEditing={isEditing}
                        isSaving={isSaving}
                        setIsEditing={setIsEditing}
                        handleSave={handleSaveWithRefresh}
                        handleCancel={handleCancelEdit}
                        editedData={editedData}
                        setEditedData={setEditedData}
                    />
                </Tab>

                <Tab
                    key="children"
                    title={
                        <div className="flex items-center space-x-2">
                            <LuNetwork className="text-xl" />
                            <span>Afkom</span>
                            {childrenCount > 0 && (
                                <span className={`ml-1 px-2 py-0.5 ${countBgColor} ${countTextColor} text-xs font-medium rounded-full`}>
                                    {childrenCount}
                                </span>
                            )}
                        </div>
                    }
                >
                    <RabbitChildren>
                        {currentProfile.children || []}
                    </RabbitChildren>
                </Tab>

                <Tab
                    key="pedigree"
                    title={
                        <div className="flex items-center space-x-2">
                            <GiFamilyTree className="text-xl" />
                            <span>Stamtavle</span>
                        </div>
                    }
                >
                    <RabbitPedigree earCombId={currentProfile.earCombId} />
                </Tab>

                <Tab
                    key="sale"
                    title={
                        <div className="flex items-center space-x-2">
                            {currentProfile.saleDetailsEmbedded ? (
                                <RiPriceTag3Fill className="text-xl text-blue-400" />
                            ) : (
                                <RiPriceTag3Line className="text-xl" />
                            )}
                            <span>Salgsprofil</span>
                        </div>
                    }
                >
                    <RabbitSaleSection
                        rabbitProfile={currentProfile}
                        onSaleDetailsChange={handleSaleDetailsChange}
                    />
                </Tab>
            </Tabs>
        </div>
    );
}