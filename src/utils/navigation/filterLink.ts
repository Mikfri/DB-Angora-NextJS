// src/utils/navigation/filterLink.ts
import { NavLink } from "@/types/navigation";
import { UserIdentity, hasAnyRole } from "@/types/auth";

// Opdateret filterLink til at bruge UserIdentity
export const filterLink = (link: NavLink, isLoggedIn: boolean, userIdentity: UserIdentity | null) => {
    // Hvis linket ikke kræver auth, vis det
    if (!link.requiresAuth) return true;
    
    // Hvis linket kræver auth, men brugeren ikke er logget ind, skjul det
    if (link.requiresAuth && !isLoggedIn) return false;
    
    // Hvis linket kræver bestemte roller, tjek om brugeren har mindst én af dem
    if (link.requiredRoles && userIdentity) {
        return hasAnyRole(userIdentity, link.requiredRoles);
    }
    
    // Hvis linket kun kræver auth (ingen specifikke roller), og brugeren er logget ind
    return true;
};