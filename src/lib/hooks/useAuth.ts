// src/lib/hooks/useAuth.ts
'use client'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Event emitter type
type AuthEventListener = () => void;
type AuthEventType = 'logout' | 'login' | 'sessionExpired';

// Static event handlers (shared across hook instances)
const listeners: { [key in AuthEventType]?: Set<AuthEventListener> } = {
    logout: new Set(),
    login: new Set(),
    sessionExpired: new Set()
};

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Event emission helper
    const emitAuthEvent = useCallback((event: AuthEventType) => {
        listeners[event]?.forEach(listener => listener());
    }, []);

    // Wrap checkAuth in useCallback
    const checkAuth = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/token', {
                method: 'HEAD',
                credentials: 'include'
            });

            const isAuthenticated = response.headers.get('X-Is-Authenticated') === 'true';
            const username = response.headers.get('X-User-Name') || '';
            const role = response.headers.get('X-User-Role') || '';

            setIsLoggedIn(isAuthenticated);
            setUserName(username);
            setUserRole(role);

            if (isAuthenticated) {
                emitAuthEvent('login');
            }

            return isAuthenticated;
        } catch (error) {
            console.error('❌ Auth check failed:', error);
            setIsLoggedIn(false);
            emitAuthEvent('sessionExpired');
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [emitAuthEvent]); // Add emitAuthEvent as dependency

    const logout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setIsLoggedIn(false);
                setUserName('');
                setUserRole('');
                emitAuthEvent('logout');
                router.push('/');
            }
        } catch (error) {
            console.error('❌ Logout failed:', error);
        }
    };

    // Subscribe to auth events
    const subscribe = useCallback((event: AuthEventType, callback: AuthEventListener) => {
        listeners[event]?.add(callback);
        return () => listeners[event]?.delete(callback);
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return {
        isLoggedIn,
        userName,
        userRole,
        isLoading,
        logout,
        refresh: checkAuth,
        subscribe
    };
}