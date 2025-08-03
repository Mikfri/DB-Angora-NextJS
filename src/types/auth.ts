// src/types/auth.ts
export type UserRole = 
  // Administrative roller
  | 'Admin'
  | 'Moderator'
  | 'RabbitModerator'
  | 'UserModerator'
  | 'ModeratorBreeder'
  
  // Indholdsskaber-roller
  | 'Editor'
  | 'BlogPoster'
  
  // Brugerroller
  | 'BreederPremium'
  | 'BreederBasic'
  | 'UserBasicFree'

export interface UserIdentity {
  id: string;
  username: string;
  roles: UserRole[];
  claims?: {
    rabbitImageCount?: number;
    // Andre relevante claims kan tilføjes her
  };
}

export const roleDisplayNames: Record<UserRole, string> = {
  // Administrative roller
  'Admin': 'Administrator',
  'Moderator': 'Moderator',
  'RabbitModerator': 'Kanin-moderator',
  'UserModerator': 'Bruger-moderator',
  'ModeratorBreeder': 'Opdrætter-moderator',
  
  // Indholdsskaber-roller
  'Editor': 'Redaktør',
  'BlogPoster': 'Blog-skribent',
  
  // Brugerroller
  'BreederPremium': 'Premium-opdrætter',
  'BreederBasic': 'Basis-opdrætter',
  'UserBasicFree': 'Basis-bruger',
};

// Gruppér roller efter type for nem brug i autorisationscheck
export const roleGroups = {
  admins: ['Admin'] as UserRole[],
  moderators: ['Moderator', 'RabbitModerator', 'UserModerator', 'ModeratorBreeder'] as UserRole[],
  contentCreators: ['Editor', 'BlogPoster'] as UserRole[],
  breeders: ['BreederPremium', 'BreederBasic', 'ModeratorBreeder'] as UserRole[],
  premiumUsers: ['BreederPremium', 'ModeratorBreeder'] as UserRole[],
  anyUser: ['Admin', 'Moderator', 'RabbitModerator', 'UserModerator', 'ModeratorBreeder', 
           'Editor', 'BlogPoster', 'BreederPremium', 'BreederBasic', 'UserBasicFree'] as UserRole[]
};

// Utility funktioner relateret til UserIdentity og UserRole
export function formatRoles(roles: UserRole[]): string {
  return roles.map(role => roleDisplayNames[role] || role).join(', ');
}

export function getPrimaryRole(roles: UserRole[]): UserRole {
  // Prioriteret rækkefølge af roller (højest prioritet først)
  const priorityOrder: UserRole[] = [
    // Admin først
    'Admin',
    
    // Så moderatorer
    'Moderator', 
    'ModeratorBreeder',
    'RabbitModerator',
    'UserModerator',
    
    // Så content creators
    'Editor',
    'BlogPoster',
    
    // Så opdrættere
    'BreederPremium',
    'BreederBasic',
    
    // Til sidst almindelige brugere
    'UserBasicFree'
  ];
  
  for (const role of priorityOrder) {
    if (roles.includes(role)) return role;
  }
  
  return roles[0] || 'UserBasicFree'; // Fallback til første rolle eller UserBasicFree
}

export function hasRole(identity: UserIdentity | null, role: UserRole): boolean {
  return identity?.roles.includes(role) || false;
}

export function hasAnyRole(identity: UserIdentity | null, roles: UserRole[]): boolean {
  return identity?.roles.some(role => roles.includes(role)) || false;
}

// Nye utility funktioner for mere avanceret autorisationskontrol

/**
 * Tjekker om brugeren har en moderator-rolle
 */
export function isModerator(identity: UserIdentity | null): boolean {
  return hasAnyRole(identity, roleGroups.moderators) || hasRole(identity, 'Admin');
}

/**
 * Tjekker om brugeren har en content creator rolle
 */
export function isContentCreator(identity: UserIdentity | null): boolean {
  return hasAnyRole(identity, roleGroups.contentCreators) || 
         hasAnyRole(identity, roleGroups.moderators) || 
         hasRole(identity, 'Admin');
}

/**
 * Tjekker om brugeren er en opdrætter (breeder)
 */
export function isBreeder(identity: UserIdentity | null): boolean {
  return hasAnyRole(identity, roleGroups.breeders);
}

/**
 * Tjekker om brugeren er en premium bruger
 */
export function isPremiumUser(identity: UserIdentity | null): boolean {
  return hasAnyRole(identity, roleGroups.premiumUsers);
}

/**
 * Returnerer de brugervenlige navne på alle roller en bruger har
 */
export function getDisplayRoles(identity: UserIdentity | null): string[] {
  if (!identity || !identity.roles.length) return [];
  return identity.roles.map(role => roleDisplayNames[role] || role);
}