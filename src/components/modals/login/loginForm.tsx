// src/components/modals/login/loginForm.tsx
'use client'
import { useState } from 'react';
import { Input, Button } from "@heroui/react";
import { toast } from 'react-toastify';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface Props {
    onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                onSuccess?.();  // Call onSuccess if provided
                window.location.href = '/account';
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
            <div className="relative">
                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isDisabled={isLoading}
                    required
                    minLength={6}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute right-2 top-5 text-sm text-gray-600'
                >
                    {showPassword ? (
                        <>
                            <FaRegEye size={20} />
                        </>

                    ) : (
                        <>
                            <FaRegEyeSlash size={20} />
                        </>

                    )}
                </button>
            </div>
            <Button
                type="submit"
                color="success"
                isLoading={isLoading}
                isDisabled={!isValid || isLoading}
            >
                {isLoading ? 'Logger ind...' : 'Log ind'}
            </Button>
        </form>
    );
}