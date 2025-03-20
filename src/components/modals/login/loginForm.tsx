// src/components/modals/login/loginForm.tsx
'use client'
import { useState } from 'react';
import { Input, Button } from "@heroui/react";
import { toast } from 'react-toastify';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
interface Props {
    onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: Props) {
    const router = useRouter();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Brug authStore direkte
    const { login, isLoading } = useAuthStore();

    const isValid = userName.trim().length >= 2 && password.length >= 6;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!isValid) return;
    
        try {
            // Brug login funktion fra authStore
            const success = await login(userName.trim(), password);
    
            if (success) {
                toast.success('Login successfuldt!');
                onSuccess?.();  // Call onSuccess if provided
                router.push('/account'); // Erstat window.location.href med router.push
            } else {
                toast.error('Ugyldigt brugernavn eller kodeord');
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Der skete en uventet fejl');
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
                        <FaRegEye size={20} />
                    ) : (
                        <FaRegEyeSlash size={20} />
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