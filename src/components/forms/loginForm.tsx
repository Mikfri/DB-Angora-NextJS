// src/components/forms/loginForm.tsx
'use client'
import { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
    onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { refresh } = useAuth();

    const isValid = userName.trim().length >= 2 && password.length >= 6;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValid) return;
        
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userName: userName.trim(), 
                    password 
                })
            });

            if (response.ok) {
                await refresh();
                toast.success('Login succesfuld');
                onSuccess?.();
                router.push('/account/myRabbits');
            } else {
                const error = await response.json();
                toast.error(error.error || 'Ugyldigt login');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Der skete en uventet fejl');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label="Brugernavn"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                isDisabled={isLoading}
                required
                minLength={2}
            />
            <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isDisabled={isLoading}
                required
                minLength={6}
            />
            <Button 
                type="submit" 
                color="success"
                isLoading={isLoading}
                isDisabled={!isValid || isLoading}
            >
                {isLoading ? 'Logger ind...' : 'Login'}
            </Button>
        </form>
    );
}