// src/utils/navigation/filterLink.ts
import { NavLink } from "@/types/navigation";
import { UserIdentity, hasAnyRole } from "@/types/auth";

/**
 * Filter function to determine if a navigation link should be displayed based on user authentication and roles.
 * @param {NavLink} link - The navigation link to filter.
 * @param {boolean} isLoggedIn - Indicates if the user is logged in.
 * @param {UserIdentity | null} userIdentity - The user's identity object, or null if not logged in.
 * @returns {boolean} - Returns true if the link should be displayed, false otherwise.
 */
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