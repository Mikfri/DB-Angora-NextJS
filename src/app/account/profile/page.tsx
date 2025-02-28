// src/app/account/profile/page.tsx
import { cookies } from "next/headers";
import UserProfile from "./userProfile";
import { GetUserProfile } from "@/api/endpoints/accountController";

export default async function UserProfilePage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const userProfileId = cookieStore.get("userProfileId");
    const userProfile = await GetUserProfile(String(accessToken?.value), String(userProfileId?.value));

    return <UserProfile userProfile={userProfile} />;
}