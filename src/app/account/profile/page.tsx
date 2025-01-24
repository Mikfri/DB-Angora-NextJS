// src/app/account/profile/page.tsx
import { GetUserProfile } from "@/Services/AngoraDbService";
import { cookies } from "next/headers";
import UserProfile from "./userProfile";
import MyNav from '@/components/sectionNav/variants/myNav';

export default async function UserProfilePage(){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const userProfileId = cookieStore.get("userProfileId");
    const userProfile = await GetUserProfile(String(accessToken?.value), String(userProfileId?.value));

    return (
        <>
            <MyNav />
            <UserProfile userProfile={userProfile} />
        </>
    );
}