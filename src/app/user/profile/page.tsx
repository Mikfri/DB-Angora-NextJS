import { GetUserProfile } from "@/Services/AngoraDbService";
import { cookies } from "next/headers";
import UserProfile from "./userProfile";

export default async function UserProfilePage(){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const userProfileId = cookieStore.get("userProfileId");
    const userProfile = await GetUserProfile(String(accessToken?.value), String(userProfileId?.value));

    return <UserProfile userProfile={userProfile} />;
}
