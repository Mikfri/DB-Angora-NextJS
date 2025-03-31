// // src/components/sectionNav/base/baseSideNav.tsx
// 'use client';
// import { Button } from "@heroui/react";
// import { ReactNode } from "react";
// import { UserIdentity, UserRole, hasAnyRole, roleGroups } from "@/types/auth";

// // Brug roleGroups fra auth.ts med eksplicit typeangivelse for at sikre type-sikkerhed
// export const BREEDER_ROLES: UserRole[] = [
//   ...roleGroups.breeders as UserRole[], 
//   'Admin' as UserRole, 
//   'ModeratorBreeder' as UserRole
// ];

// export const MODERATOR_ROLES: UserRole[] = [
//   ...roleGroups.moderators as UserRole[],
//   'Admin' as UserRole
// ];

// export type NavLink = {
//     href: string;
//     label: string;
//     requiresAuth?: boolean;
//     requiredRoles?: UserRole[];
//     disabled?: boolean;
// };

// export type NavGroup = {
//     title?: string;
//     links: NavLink[];
// };

// export const navigationLinks: NavGroup[] = [
//     {
//         title: "Konto",
//         links: [
//             { href: '/account', label: 'Min side', requiresAuth: true },
//             { href: '/account/profile', label: 'Brugerprofil', requiresAuth: true },
//         ]
//     }
// ];

// // Brug konstanter i alle navigation links
// export const breederNavigationLinks: NavGroup[] = [
//     {
//         title: "Avler funktioner",
//         links: [
//             {
//                 href: '/account/myRabbits',
//                 label: 'Mine kaniner',
//                 requiresAuth: true,
//                 requiredRoles: BREEDER_ROLES
//             },
//             {
//                 href: '/account/rabbitsForbreeding',
//                 label: 'Find avlskaniner',
//                 requiresAuth: true,
//                 requiredRoles: BREEDER_ROLES
//             },
//         ]
//     }
// ];

// export const moderatorNavigationLinks: NavGroup[] = [
//     {
//         title: "Moderator funktioner",
//         links: [
//             {
//                 href: '/admin/users',
//                 label: 'Find bruger',
//                 requiresAuth: true,
//                 requiredRoles: MODERATOR_ROLES
//             },
//             {
//                 href: '/admin/posts',
//                 label: 'Opret indlæg',
//                 requiresAuth: true,
//                 requiredRoles: MODERATOR_ROLES
//             },
//         ]
//     }
// ];

// export const homeNavigationLinks: NavGroup[] = [
//     {
//         title: "DenBlå-Angora",
//         links: [
//             { href: '#welcome', label: 'Velkommen til' },
//             { href: '#news', label: 'Nyheder' },
//             // { href: '#events', label: 'Arrangementer' },
//             // { href: '#featured', label: 'Fremhævede' }
//         ]
//     }
// ];

// export const saleNavigationLinks: NavGroup[] = [
//     {
//         title: "Kategorier",
//         links: [
//             { href: '/sale', label: 'Salg' },
//             { href: '/sale/rabbits', label: 'Kaniner', requiresAuth: false },
//             { href: '/sale/wool', label: 'Uld', disabled: true }
//         ]
//     }
// ];

// // Opdateret filterLink til at bruge UserIdentity
// export const filterLink = (link: NavLink, isLoggedIn: boolean, userIdentity: UserIdentity | null) => {
//     // Hvis linket ikke kræver auth, vis det
//     if (!link.requiresAuth) return true;
    
//     // Hvis linket kræver auth, men brugeren ikke er logget ind, skjul det
//     if (link.requiresAuth && !isLoggedIn) return false;
    
//     // Hvis linket kræver bestemte roller, tjek om brugeren har mindst én af dem
//     if (link.requiredRoles && userIdentity) {
//         return hasAnyRole(userIdentity, link.requiredRoles);
//     }
    
//     // Hvis linket kun kræver auth (ingen specifikke roller), og brugeren er logget ind
//     return true;
// };

// // Opdateret NavAction interface med alle nødvendige properties
// interface NavAction {
//     label: ReactNode;
//     className?: string;
//     onClick: () => void;
//     color?: "primary" | "secondary" | "success" | "warning" | "danger";
//     disabled?: boolean;
//     variant?: 'solid' | 'bordered' | 'flat' | 'light' | 'ghost' | 'shadow' | 'faded';
// }

// interface SectionNavProps {
//     title: string;
//     headerActions?: NavAction[];
//     footerActions?: NavAction[];
//     children?: React.ReactNode;
// }

// export default function SectionNav({ title, headerActions = [], footerActions = [], children }: SectionNavProps) {
//     return (
//         <nav className="side-nav">
//             <div className="flex flex-col gap-4">
//                 {/* Title and header row */}
//                 <div className="flex justify-between items-center mb-2 pb-2 border-b border-zinc-700/50">
//                     <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
//                     {headerActions.length > 0 && (
//                         <div className="flex gap-2">
//                             {headerActions.map((action, index) => (
//                                 <Button
//                                     key={`header-action-${index}`}
//                                     size="sm"
//                                     color={action.color}
//                                     variant={action.variant || 'solid'}
//                                     onPress={action.onClick}
//                                     isDisabled={action.disabled}
//                                 >
//                                     {action.label}
//                                 </Button>
//                             ))}
//                         </div>
//                     )}
//                 </div>

//                 {/* Content */}
//                 <div className="w-full">
//                     {children}
//                 </div>

//                 {/* Footer */}
//                 {footerActions.length > 0 && (
//                     <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-zinc-700/50">
//                         {footerActions.map((action, index) => (
//                             <Button
//                                 key={`footer-action-${index}`}
//                                 size="sm"
//                                 color={action.color}
//                                 variant={action.variant || 'light'}
//                                 onPress={action.onClick}
//                                 isDisabled={action.disabled}
//                             >
//                                 {action.label}
//                             </Button>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </nav>
//     );
// }