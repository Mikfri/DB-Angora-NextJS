// src/app/account/myRabbits/rabbitProfile/[earCombId]/page.tsx
import { getRabbitProfile } from "@/app/actions/rabbit/profile";
import RabbitProfile from "./rabbitProfile";
import { notFound } from "next/navigation";

type PageProps = {
    params: { earCombId: string };
};

export default async function RabbitProfilePage({ params }: PageProps) {
    try {
        // Sikre at params er korrekt håndteret - eksplicit await
        const { earCombId } = await params;
        
        // Brug Server Action til at hente kaninprofil
        const result = await getRabbitProfile(earCombId);
        
        if (!result.success) {
            // Håndter forskellige fejlscenarier
            if (result.status === 401) {
                return (
                    <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
                        <p className="text-red-500">Du skal være logget ind for at se denne side.</p>
                    </div>
                );
            }
            
            if (result.status === 404) {
                return notFound();
            }
            
            // Generisk fejlhåndtering
            throw new Error(result.error);
        }
        
        // Returnér komponenten med profilen
        return <RabbitProfile rabbitProfile={result.data} />;
    } catch (error) {
        console.error("Failed to load rabbit profile:", error);
        return notFound();
    }
}