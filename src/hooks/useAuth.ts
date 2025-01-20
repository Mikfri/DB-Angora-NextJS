// src/hooks/useAuth.ts
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/token', {
                method: 'HEAD',
                credentials: 'include'
            });

            const isAuthenticated = response.headers.get('X-Is-Authenticated') === 'true';
            const username = response.headers.get('X-User-Name') || '';

            //console.log('🔒 Auth state:', { isAuthenticated, username });
            setIsLoggedIn(isAuthenticated);
            setUserName(username);
            return isAuthenticated;
        } catch (error) {
            console.error('❌ Auth check failed:', error);
            setIsLoggedIn(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setIsLoggedIn(false);
                router.push('/');
            }
        } catch (error) {
            console.error('❌ Logout failed:', error);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return { isLoggedIn, userName, isLoading, logout, refresh: checkAuth };
}