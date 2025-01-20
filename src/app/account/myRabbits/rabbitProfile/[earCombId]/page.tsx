// src/app/account/myRabbis/rabbitProfile/[earCombId]/page.tsx
import { GetRabbitProfile } from "@/Services/AngoraDbService";
import { cookies } from "next/headers";
import RabbitProfile from "./rabbitProfile";

interface PageProps {
    params: Promise<{ earCombId: string }>;
}

export default async function RabbitProfilePage({ params }: PageProps) {
    const { earCombId } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const rabbitProfile = await GetRabbitProfile(String(accessToken?.value), earCombId);

    return <RabbitProfile rabbitProfile={rabbitProfile} />;
}