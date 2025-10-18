// src/types/authTypes.ts
export type UserRole =
  | 'Admin'
  | 'Moderator'
  | 'RabbitModerator'
  | 'UserModerator'
  | 'ModeratorBreeder'
  | 'Editor'
  | 'BlogPoster'
  | 'BreederPremium'
  | 'BreederBasic'
  | 'UserBasicFree';

export interface UserIdentity {
  id: string;
  username: string;
  roles: UserRole[];
  claims?: {
    rabbitImageCount?: number;
  };
}

export const roleDisplayNames: Record<UserRole, string> = {
  'Admin': 'Administrator',
  'Moderator': 'Moderator',
  'RabbitModerator': 'Kanin-moderator',
  'UserModerator': 'Bruger-moderator',
  'ModeratorBreeder': 'Opdrætter-moderator',
  'Editor': 'Redaktør',
  'BlogPoster': 'Blog-skribent',
  'BreederPremium': 'Premium-opdrætter',
  'BreederBasic': 'Basis-opdrætter',
  'UserBasicFree': 'Basis-bruger',
};

export const roleGroups = {
  admins: ['Admin'] as UserRole[],
  moderators: ['Moderator', 'RabbitModerator', 'UserModerator', 'ModeratorBreeder'] as UserRole[],
  contentCreators: ['Editor', 'BlogPoster'] as UserRole[],
  breeders: ['Admin', 'BreederPremium', 'BreederBasic', 'ModeratorBreeder'] as UserRole[],
  premiumUsers: ['Admin', 'BreederPremium', 'ModeratorBreeder'] as UserRole[],
  anyUser: [
    'Admin', 'Moderator', 'RabbitModerator', 'UserModerator', 'ModeratorBreeder',
    'Editor', 'BlogPoster', 'BreederPremium', 'BreederBasic', 'UserBasicFree'
  ] as UserRole[]
};

// Utility functions
export function formatRoles(roles: UserRole[]): string {
  return roles.map(role => roleDisplayNames[role] || role).join(', ');
}

export function getPrimaryRole(roles: UserRole[]): UserRole {
  const priorityOrder: UserRole[] = [
    'Admin',
    'Moderator', 'ModeratorBreeder', 'RabbitModerator', 'UserModerator',
    'Editor', 'BlogPoster',
    'BreederPremium', 'BreederBasic',
    'UserBasicFree'
  ];
  for (const role of priorityOrder) {
    if (roles.includes(role)) return role;
  }
  return roles[0] || 'UserBasicFree';
}

export function hasRole(identity: UserIdentity | null, role: UserRole): boolean {
  return identity?.roles.includes(role) || false;
}

export function hasAnyRole(identity: UserIdentity | null, roles: UserRole[]): boolean {
  return identity?.roles.some(role => roles.includes(role)) || false;
}

export function isModerator(identity: UserIdentity | null): boolean {
  return hasAnyRole(identity, roleGroups.moderators) || hasRole(identity, 'Admin');
}

export function isContentCreator(identity: UserIdentity | null): boolean {
  return hasAnyRole(identity, roleGroups.contentCreators) ||
         hasAnyRole(identity, roleGroups.moderators) ||
         hasRole(identity, 'Admin');
}

export function isBreeder(identity: UserIdentity | null): boolean {
  return hasAnyRole(identity, roleGroups.breeders);
}

export function isPremiumUser(identity: UserIdentity | null): boolean {
  return hasAnyRole(identity, roleGroups.premiumUsers);
}

export function getDisplayRoles(identity: UserIdentity | null): string[] {
  if (!identity || !identity.roles.length) return [];
  return identity.roles.map(role => roleDisplayNames[role] || role);
}