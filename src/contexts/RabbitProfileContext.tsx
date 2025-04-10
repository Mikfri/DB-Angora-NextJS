// src/contexts/RabbitProfileContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Rabbit_ProfileDTO } from '@/api/types/AngoraDTOs';
import { getRabbitProfile } from '@/app/actions/rabbit/profile';

interface RabbitProfileContextType {
  profile: Rabbit_ProfileDTO | null;
  setProfile: (profile: Rabbit_ProfileDTO | null) => void;
  isLoading: boolean;
  error: { status: number; message: string } | null;
  refreshProfile: () => Promise<void>;
}

const RabbitProfileContext = createContext<RabbitProfileContextType | null>(null);

export function RabbitProfileProvider({ 
  children, 
  earCombId 
}: { 
  children: ReactNode;
  earCombId: string;
}) {
  const [profile, setProfile] = useState<Rabbit_ProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getRabbitProfile(earCombId);
      
      if (!result.success) {
        setError({ 
          status: result.status, 
          message: result.error 
        });
        return;
      }
      
      setProfile(result.data);
    } catch (err) {
      console.error("Error loading rabbit profile:", err);
      setError({ 
        status: 500, 
        message: "Der opstod en fejl ved indlæsning af kaninprofilen." 
      });
    } finally {
      setIsLoading(false);
    }
  }, [earCombId]);

  // Initial load
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Memoize the context value
  const contextValue = useMemo(() => ({
    profile, 
    setProfile,
    isLoading, 
    error,
    refreshProfile: loadProfile
  }), [profile, isLoading, error, loadProfile]);

  return (
    <RabbitProfileContext.Provider value={contextValue}>
      {children}
    </RabbitProfileContext.Provider>
  );
}

export function useRabbitProfile() {
  const context = useContext(RabbitProfileContext);
  if (!context) {
    throw new Error('useRabbitProfile must be used within a RabbitProfileProvider');
  }
  return context;
}