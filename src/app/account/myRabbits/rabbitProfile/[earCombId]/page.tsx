// src/app/account/myRabbits/rabbitProfile/[earCombId]/page.tsx
import { cookies } from "next/headers";
import RabbitProfile from "./rabbitProfile";
import { GetRabbitProfile } from "@/api/endpoints/rabbitController";

type PageProps = {
    params: Promise<{ earCombId: string }>;
};

export default async function RabbitProfilePage({ params }: PageProps) {
    const { earCombId } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const rabbitProfile = await GetRabbitProfile(
        String(accessToken?.value), 
        earCombId
    );

    return <RabbitProfile rabbitProfile={rabbitProfile} />;
}