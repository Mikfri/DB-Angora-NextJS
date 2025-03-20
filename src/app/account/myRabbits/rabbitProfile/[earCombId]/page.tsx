// src/app/account/myRabbits/rabbitProfile/[earCombId]/page.tsx
import { getAccessToken } from "@/app/actions/auth/session";
import { GetRabbitProfile } from "@/api/endpoints/rabbitController";
import RabbitProfile from "./rabbitProfile";
import { notFound } from "next/navigation";

type PageProps = {
    params: { earCombId: string };
};

export default async function RabbitProfilePage({ params }: PageProps) {
    const { earCombId } = params;
    
    // Brug Server Action til at hente token
    const accessToken = await getAccessToken();
    
    if (!accessToken) {
        return (
            <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                <p className="text-red-500">Du skal være logget ind for at se denne side.</p>
            </div>
        );
    }
    
    try {
        const rabbitProfile = await GetRabbitProfile(accessToken, earCombId);
        
        if (!rabbitProfile) {
            return notFound();
        }
        
        return <RabbitProfile rabbitProfile={rabbitProfile} />;
    } catch (error) {
        console.error("Failed to load rabbit profile:", error);
        return notFound();
    }
}