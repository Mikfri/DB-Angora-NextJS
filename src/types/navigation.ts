// src/types/navigation.ts
import { ReactNode } from "react";
import { UserRole } from "@/types/auth";

/**
 * @typedef {Object} NavLink
 */
export type NavLink = {
    href: string;
    label: string;
    requiresAuth?: boolean;
    requiredRoles?: UserRole[];
    disabled?: boolean;
};

export type NavGroup = {
    title?: string;
    links: NavLink[];
};

export interface NavAction {
    label: ReactNode;
    className?: string;
    onClick: () => void;
    color?: "primary" | "secondary" | "success" | "warning" | "danger";
    disabled?: boolean;
    variant?: 'solid' | 'bordered' | 'flat' | 'light' | 'ghost' | 'shadow' | 'faded';
}

export interface SectionNavProps {
    title: string;
    headerActions?: NavAction[];
    footerActions?: NavAction[];
    children?: React.ReactNode;
}