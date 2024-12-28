// src/components/sectionNav/base/baseSideNav.tsx
'use client';
import { Button } from "@nextui-org/react";

interface NavAction {
    label: string | JSX.Element;  // Allow both string and JSX
    className?: string;
    onClick: () => void;
    color?: "primary" | "secondary" | "success" | "warning" | "danger";
    disabled?: boolean;
}

interface SectionNavProps {
    title: string;
    actions?: NavAction[];
    children?: React.ReactNode;
}

export default function SectionNav({ title, actions = [], children }: SectionNavProps) {
    return (
        <nav className="fixed left-4 lg:left-[max(1rem,calc(50%-36rem))] top-[200px] min-h-fit 
    max-h-[calc(100vh-220px)] w-64 bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 
    p-4 rounded-xl border border-zinc-700/50 shadow-lg overflow-y-auto">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <div className="flex flex-col gap-2">
                        {actions?.map((action, index) => (
                            <Button
                                key={index}
                                color={action.color || "primary"}
                                onClick={action.onClick}
                                className={`w-full ${action.className || ''}`} // Kombiner classes
                                disabled={action.disabled}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {children}
                </div>
            </div>
        </nav>
    );
}