// src/components/nav/base/NavBaseClient.tsx
'use client'
import { Button } from "@heroui/react";
import { NavAction } from "@/types/navigationTypes";

interface NavBaseClientProps {
  actions: NavAction[];
  variant: 'solid' | 'light';
}

export function NavBaseClient({ actions, variant }: NavBaseClientProps) {
  // Early return for edge case
  if (!actions?.length) return null;
  
  return (
    <div className="flex gap-2">
      {actions.map((action, index) => {
        // Destruktuerer props med default values via nullish coalescing
        const { 
          label, 
          color = 'primary', 
          variant: actionVariant, 
          onClick, 
          disabled = false 
        } = action;
        
        return (
          <Button
            key={`action-${index}`}
            size="sm"
            color={color}
            variant={actionVariant ?? variant}
            onPress={onClick}
            isDisabled={disabled}
            className="text-zinc-800 dark:text-zinc-100"
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}